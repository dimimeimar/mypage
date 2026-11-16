import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firestore';

// Collections
const CALENDAR_EVENTS = 'calendar_events';
const BOOKING_REQUESTS = 'booking_requests';
const AUTHORIZED_EMAILS = 'whitelist';

// ==================== AUTHORIZED EMAILS ====================

/**
 * Check if email is in authorized list
 */
export const isEmailAuthorized = async (email) => {
  try {
    const q = query(
      collection(db, AUTHORIZED_EMAILS),
      where('email', '==', email.toLowerCase())
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking authorized email:', error);
    return false;
  }
};

/**
 * Add email to authorized list (admin only - για μελλοντική χρήση)
 */
export const addAuthorizedEmail = async (email, studentName = '') => {
  try {
    await addDoc(collection(db, AUTHORIZED_EMAILS), {
      email: email.toLowerCase(),
      studentName,
      role: 'verified_student',
      addedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding authorized email:', error);
    return { success: false, error };
  }
};

// ==================== CALENDAR EVENTS ====================

/**
 * Get all calendar events
 */
export const getAllEvents = async () => {
  try {
    const events = [];

    // Fetch confirmed events
    const eventsSnapshot = await getDocs(collection(db, CALENDAR_EVENTS));
    eventsSnapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        id: doc.id,
        ...data,
        start: data.start?.toDate(),
        end: data.end?.toDate(),
        createdAt: data.createdAt?.toDate(),
        canCancelUntil: data.canCancelUntil?.toDate()
      });
    });


    return events;
  } catch (error) {
    console.error('Error getting events:', error.code, error.message);
return [];
  }
};

/**
 * Όπως το getAllEvents, αλλά επιστρέφει { ok, events } ώστε η αποτυχία να μη μοιάζει με "άδειο ημερολόγιο"
 */
export const fetchAllEvents = async () => {
  try {
    const snapshot = await getDocs(collection(db, CALENDAR_EVENTS));
    const events = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        start: data.start?.toDate(),
        end: data.end?.toDate(),
        createdAt: data.createdAt?.toDate(),
        canCancelUntil: data.canCancelUntil?.toDate()
      };
    });
    return { ok: true, events };
  } catch (error) {
    console.error('Error getting events:', error.code, error.message);
    return { ok: false, events: [] };
  }
};

/**
 * Create new calendar event
 */
export const createEvent = async (eventData) => {
  try {
    const { startTime, endTime, studentEmail, notes, bookedBy, status } = eventData;

    // Calculate cancellation deadline (24h before)
    const canCancelUntil = new Date(startTime);
    canCancelUntil.setHours(canCancelUntil.getHours() - 24);

    const eventDoc = {
      title: studentEmail.split('@')[0], // Username from email
      start: Timestamp.fromDate(startTime),
      end: Timestamp.fromDate(endTime),
      status: status || 'booked',
      bookedBy: bookedBy || 'pending_request',
      studentEmail: studentEmail.toLowerCase(),
      notes: notes || '',
      googleCalendarEventId: null, // TODO: Add after Google Calendar sync
      createdAt: serverTimestamp(),
      canCancelUntil: Timestamp.fromDate(canCancelUntil),
      cancelledAt: null
    };

    const docRef = await addDoc(collection(db, CALENDAR_EVENTS), eventDoc);

    return {
      success: true,
      id: docRef.id,
      event: {
        id: docRef.id,
        ...eventDoc,
        start: startTime,
        end: endTime,
        canCancelUntil
      }
    };
  } catch (error) {
    console.error('Error creating event:', error);
    return { success: false, error };
  }
};

/**
 * Update existing event
 */
export const updateEvent = async (eventId, updates) => {
  try {
    const eventRef = doc(db, CALENDAR_EVENTS, eventId);

    // Convert dates to Timestamps if present
    const firestoreUpdates = { ...updates };
    if (updates.start) firestoreUpdates.start = Timestamp.fromDate(updates.start);
    if (updates.end) firestoreUpdates.end = Timestamp.fromDate(updates.end);
    if (updates.canCancelUntil) firestoreUpdates.canCancelUntil = Timestamp.fromDate(updates.canCancelUntil);

    await updateDoc(eventRef, firestoreUpdates);

    return { success: true };
  } catch (error) {
    console.error('Error updating event:', error);
    return { success: false, error };
  }
};

/**
 * Delete event
 */
export const deleteEvent = async (eventId) => {
  try {
    await deleteDoc(doc(db, CALENDAR_EVENTS, eventId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting event:', error);
    return { success: false, error };
  }
};

/**
 * Cancel event (24h rule check)
 */
export const cancelEvent = async (eventId, userEmail) => {
  try {
    // Get event first to check canCancelUntil
    const eventRef = doc(db, CALENDAR_EVENTS, eventId);
    const eventSnap = await getDoc(eventRef);

    if (!eventSnap.exists()) {
      return { success: false, error: 'Event not found' };
    }

    const eventData = eventSnap.data();

    // Check if user owns this event
    if (eventData.studentEmail.toLowerCase() !== userEmail.toLowerCase()) {
      return { success: false, error: 'Not authorized' };
    }

    // Check 24h rule
    const now = new Date();
    const canCancelUntil = eventData.canCancelUntil?.toDate();

    if (canCancelUntil && now > canCancelUntil) {
      return {
        success: false,
        error: 'Cannot cancel - less than 24 hours before event',
        tooLate: true
      };
    }

    // Mark as cancelled
    await updateDoc(eventRef, {
      status: 'cancelled',
      cancelledAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error cancelling event:', error);
    return { success: false, error };
  }
};

// ==================== BOOKING REQUESTS ====================

/**
 * Create booking request (for non-verified users)
 */
export const createBookingRequest = async (requestData) => {
  try {
    const { startTime, endTime, studentEmail, title, notes, bookedBy, status } = requestData;

    // 1. Γράψε στο booking_requests (private - με email)
    const requestDoc = {
      studentEmail: studentEmail.toLowerCase(),
      title: title || '',
      requestedSlot: {
        start: Timestamp.fromDate(startTime),
        end: Timestamp.fromDate(endTime)
      },
      notes: notes || '',
      status: status || 'pending',
      bookedBy: bookedBy || 'unverified',
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, BOOKING_REQUESTS), requestDoc);

    // 2. Γράψε στο calendar_events (public - χωρίς email)
    const calendarDoc = {
      title: title || 'Αίτημα Κράτησης',
      start: Timestamp.fromDate(startTime),
      end: Timestamp.fromDate(endTime),
      status: status || 'pending',
      bookedBy: bookedBy || 'pending_request',
      notes: notes || '',
      bookingRequestId: docRef.id,   // link προς το booking_request
      createdAt: serverTimestamp()
    };
    await addDoc(collection(db, CALENDAR_EVENTS), calendarDoc);

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating booking request:', error);
    return { success: false, error };
  }
};

/**
 * Get all pending booking requests (admin only - για μελλοντική χρήση)
 */
export const getPendingRequests = async () => {
  try {
    const q = query(
      collection(db, BOOKING_REQUESTS),
      where('status', '==', 'pending')
    );
    const snapshot = await getDocs(q);
    const requests = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      requests.push({
        id: doc.id,
        ...data,
        requestedSlot: {
          start: data.requestedSlot.start?.toDate(),
          end: data.requestedSlot.end?.toDate()
        },
        createdAt: data.createdAt?.toDate()
      });
    });

    return requests;
  } catch (error) {
    console.error('Error getting pending requests:', error);
    return [];
  }
};

/**
 * Approve booking request (admin only - για μελλοντική χρήση)
 */
export const approveBookingRequest = async (requestId) => {
  try {
    // Get request
    const requestRef = doc(db, BOOKING_REQUESTS, requestId);
    const requestSnap = await getDoc(requestRef);

    if (!requestSnap.exists()) {
      return { success: false, error: 'Request not found' };
    }

    const requestData = requestSnap.data();

    // Create event
    const eventResult = await createEvent({
      startTime: requestData.requestedSlot.start.toDate(),
      endTime: requestData.requestedSlot.end.toDate(),
      studentEmail: requestData.studentEmail,
      notes: requestData.notes,
      bookedBy: 'admin',
      status: 'booked'
    });

    if (!eventResult.success) {
      return eventResult;
    }

    // Mark request as approved
    await updateDoc(requestRef, {
      status: 'approved',
      eventId: eventResult.id
    });

    return { success: true, eventId: eventResult.id };
  } catch (error) {
    console.error('Error approving request:', error);
    return { success: false, error };
  }
};