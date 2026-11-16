const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

// JSONP - μόνο για GET (λύνει το CORS με redirect)
const callAppsScriptJSONP = (action, params = {}) => {
  return new Promise((resolve) => {
    // Unique callback name
    const callbackName = `jsonp_cb_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    
    const queryParams = new URLSearchParams({ 
      action, 
      ...params,
      callback: callbackName 
    });

    const script = document.createElement('script');
    script.src = `${APPS_SCRIPT_URL}?${queryParams}`;
    script.id = callbackName;

    // Το Apps Script μερικές φορές "ξυπνάει" αργά (cold start) - του δίνουμε 20s
    const timeout = setTimeout(() => {
      cleanup();
      // Αν η απάντηση έρθει μετά το timeout, να μη σκάσει σφάλμα "is not a function"
      window[callbackName] = () => { delete window[callbackName]; };
      resolve({ success: false, error: 'timeout' });
    }, 20000);

    const cleanup = () => {
      clearTimeout(timeout);
      delete window[callbackName];
      const el = document.getElementById(callbackName);
      if (el) el.remove();
    };

    // Αν υπάρχει ήδη το callback (StrictMode double-invoke), cleanup πρώτα
    if (window[callbackName]) {
      delete window[callbackName];
    }

    window[callbackName] = (data) => {
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      resolve({ success: false, error: 'script error' });
    };

    document.head.appendChild(script);
  });
};

// POST - για write operations (createEvent, updateEvent, deleteEvent)
const callAppsScriptPOST = async (action, payload = {}) => {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action, payload })
    });
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return { success: false, error: 'Invalid response' };
    }
  } catch (error) {
    console.warn('Apps Script POST failed:', error.message);
    return { success: false, error: error.toString() };
  }
};

// ==================== CALENDAR OPERATIONS ====================

// Επιστρέφει { ok, events }. Σε αντίθεση με το getGoogleCalendarEvents, ΔΕΝ κρύβει την αποτυχία:
// ο καλών ξέρει αν το πρόγραμμα φορτώθηκε πραγματικά ή αν πρέπει να ξαναδοκιμάσει.
export const fetchGoogleCalendarEvents = async () => {
  if (!APPS_SCRIPT_URL) return { ok: false, events: [], error: 'missing VITE_APPS_SCRIPT_URL' };
  try {
    const result = await callAppsScriptJSONP('getEvents');
    if (!result || !result.success || !Array.isArray(result.events)) {
      return { ok: false, events: [], error: result?.error || 'bad response' };
    }
    return { ok: true, events: result.events };
  } catch (error) {
    return { ok: false, events: [], error: String(error) };
  }
};

export const getGoogleCalendarEvents = async () => {
  try {
    const result = await callAppsScriptJSONP('getEvents');
    if (!result.success) {
      console.warn('Google Calendar fetch failed:', result.error);
      return [];
    }
    return result.events || [];
  } catch (error) {
    console.error('Error fetching Google events:', error);
    return [];
  }
};

export const createGoogleCalendarEvent = async (eventData) => {
  return await callAppsScriptPOST('createEvent', {
    title: eventData.title,
    startTime: eventData.startTime instanceof Date 
      ? eventData.startTime.toISOString() 
      : eventData.startTime,
    endTime: eventData.endTime instanceof Date 
      ? eventData.endTime.toISOString() 
      : eventData.endTime,
    notes: eventData.notes || ''
  });
};

export const updateGoogleCalendarEvent = async (googleEventId, updates) => {
  return await callAppsScriptPOST('updateEvent', {
    googleEventId,
    ...updates,
    startTime: updates.startTime instanceof Date 
      ? updates.startTime.toISOString() 
      : updates.startTime,
    endTime: updates.endTime instanceof Date 
      ? updates.endTime.toISOString() 
      : updates.endTime,
  });
};

export const deleteGoogleCalendarEvent = async (googleEventId) => {
  return await callAppsScriptPOST('deleteEvent', { googleEventId });
};

export const convertGoogleEventToAppEvent = (googleEvent) => {
  return {
    id: `google-${googleEvent.googleEventId}`,
    googleEventId: googleEvent.googleEventId,
    title: googleEvent.title || 'Μάθημα',
    start: new Date(googleEvent.start),
    end: new Date(googleEvent.end),
    bookedBy: 'admin',
    status: 'booked',
    notes: googleEvent.notes || '',
    isGoogleEvent: true
  };
};