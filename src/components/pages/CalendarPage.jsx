import { useState, useCallback, useEffect, useRef } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/el';
import {
    createGoogleCalendarEvent,
    getGoogleCalendarEvents,
    convertGoogleEventToAppEvent
} from '../../services/googleCalendarService';
import emailjs from '@emailjs/browser';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/calendar.css';
import {
    Calendar as CalendarIcon,
    Info,
    Clock,
    CheckCircle,
    AlertCircle,
    Users,
    User
} from 'lucide-react';
import BookingModal from '../common/BookingModal';
import {
    getAllEvents,
    createEvent,
    createBookingRequest,
    isEmailAuthorized
} from '../../services/calendarService';
import { useTranslation } from '../../hooks/useTranslation';
import { calendarData, STATUS_COLORS } from '../../data/calendar_data';

moment.updateLocale('el', { week: { dow: 1 } }); // Δευτέρα πρώτη
const localizer = momentLocalizer(moment);

const LEGEND_ICONS = { admin: User, verified_user: Users, pending_request: AlertCircle, available: CheckCircle };


const CalendarPage = () => {
    const { language } = useTranslation();
    const t = calendarData[language] || calendarData.el;

    const [events, setEvents] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    // Σε κινητό (στενή οθόνη) ξεκινάμε σε προβολή Ημέρας - πιο ευανάγνωστο από Εβδομάδα/Μήνα σε μικρή οθόνη
    const [currentView, setCurrentView] = useState(
        () => (typeof window !== 'undefined' && window.innerWidth < 768) ? 'day' : 'week'
    );

    useEffect(() => {
        moment.locale(language);
        moment.updateLocale(language, { week: { dow: 1 } });
    }, [language]);

    // Μέσα στο component - έχει πρόσβαση στο events state
    const hasOverlap = (start, end) => {
        return events.some(event => {
            if (!event.start || !event.end) return false;
            return start < event.end && end > event.start;
        });
    };

    // Μετά τα useState, πρόσθεσε:
    const hasLoadedRef = useRef(false);

    // Αντικατέστησε το useEffect:
    useEffect(() => {
        if (hasLoadedRef.current) return; // StrictMode guard
        hasLoadedRef.current = true;
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setIsLoading(true);
        try {
            const [firestoreEvents, rawGoogleEvents] = await Promise.all([
                getAllEvents(),
                getGoogleCalendarEvents()
            ]);
            const googleEvents = rawGoogleEvents.map(convertGoogleEventToAppEvent);

            const firestoreGoogleIds = firestoreEvents
                .filter(e => e.googleCalendarEventId)
                .map(e => e.googleCalendarEventId);

            const uniqueGoogleEvents = googleEvents.filter(
                ge => !firestoreGoogleIds.includes(ge.googleEventId)
            );

            setEvents([...firestoreEvents, ...uniqueGoogleEvents]);
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Event styling based on bookedBy
    const eventStyleGetter = (event) => {
        const backgroundColor = STATUS_COLORS[event.bookedBy] || STATUS_COLORS.available;

        return {
            style: {
                backgroundColor,
                borderRadius: '8px',
                opacity: 0.9,
                color: 'white',
                border: '0px',
                display: 'block',
                padding: '4px 8px',
                fontSize: '13px',
                fontWeight: '500',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
        };
    };

    const handleSelectSlot = useCallback((slotInfo) => {
        // Check for overlap
        if (hasOverlap(slotInfo.start, slotInfo.end)) {
            alert(t.alerts.overlapSelect);
            return;
        }

        setSelectedSlot(slotInfo);
        setShowBookingModal(true);
    }, [events]); // προσθέτουμε events στο dependency array

    // Handle event selection (click on existing event)
    const handleSelectEvent = useCallback((event) => {
        console.log('Selected event:', event);
        // TODO: Show event details modal
    }, []);

    // Handle booking submission
    const handleBookingSubmit = async (bookingData) => {

        if (hasOverlap(bookingData.startTime, bookingData.endTime)) {
            alert(t.alerts.overlapSubmit);
            return;
        }
        try {
            const isAuthorized = await isEmailAuthorized(bookingData.studentEmail);

            if (isAuthorized) {
                // Γράψε στο booking_requests με status approved
                const result = await createBookingRequest({
                    ...bookingData,
                    bookedBy: 'verified_user',
                    status: 'approved'
                });

                if (!result.success) throw new Error('Failed to create booking');

                // Δημιούργησε event στο Google Calendar μέσω Apps Script
                const googleResult = await createGoogleCalendarEvent({
                    title: bookingData.title,
                    startTime: bookingData.startTime,
                    endTime: bookingData.endTime,
                    notes: bookingData.notes
                });

                // Πρόσθεσε στο UI άμεσα
                const newEvent = {
                    id: `approved-${result.id}`,
                    title: bookingData.title,
                    start: bookingData.startTime,
                    end: bookingData.endTime,
                    bookedBy: 'verified_user',
                    studentEmail: bookingData.studentEmail,
                    notes: bookingData.notes,
                    status: 'approved'
                };
                setEvents(prev => [...prev, newEvent]);
            } else {
                // Non-verified user - only booking request (no Google Calendar)
                const result = await createBookingRequest(bookingData);
                if (!result.success) throw new Error('Failed to create booking request');

                // Στείλε email ειδοποίηση
                emailjs.send(
                    import.meta.env.VITE_EMAILJS_SERVICE_ID,
                    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                    {
                        title: bookingData.title,
                        student_email: bookingData.studentEmail,
                        date: bookingData.startTime.toLocaleDateString(t.booking.dateLocale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
                        time: `${bookingData.startTime.toLocaleTimeString(t.booking.dateLocale, { hour: '2-digit', minute: '2-digit' })} - ${bookingData.endTime.toLocaleTimeString(t.booking.dateLocale, { hour: '2-digit', minute: '2-digit' })}`,
                        notes: bookingData.notes || t.emailNotesFallback
                    },
                    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
                );


                const pendingEvent = {
                    id: `pending-${result.id}`,
                    title: bookingData.title,
                    start: bookingData.startTime,
                    end: bookingData.endTime,
                    bookedBy: 'pending_request',
                    studentEmail: bookingData.studentEmail,
                    notes: bookingData.notes,
                    status: 'pending'
                };

                setEvents(prev => [...prev, pendingEvent]);
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert(t.alerts.genericError);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f0f0f' }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: 'var(--color-teal)' }}></div>
                    <p className="font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{t.loading}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>

            {/* ── HERO ── */}
            <section style={{ backgroundColor: '#0f0f0f', paddingTop: '6.5rem', paddingBottom: '1.5rem' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#ffffff', marginTop: 0, marginBottom: '0.5rem' }}>
                        {t.hero.title}
                    </h1>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', maxWidth: '480px', margin: '0 auto' }}>
                        {t.hero.subtitle}
                    </p>
                </div>
            </section>

            {/* Calendar Section */}
            <section className="container pb-12" style={{ paddingTop: '2.5rem' }}>
                <div className="max-w-full mx-auto px-2">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="px-6 py-4" style={{ backgroundColor: 'var(--color-teal)' }}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <CalendarIcon className="h-6 w-6 text-white mr-3" />
                                    <h2 className="text-xl font-bold text-white">
                                        {t.cardHeader.title}
                                    </h2>
                                </div>
                                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                                    <Clock className="h-4 w-4 inline mr-1" />
                                    {t.cardHeader.timezone}
                                </div>

                            </div>
                        </div>

                        <div className="p-6">
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: 750 }}
                                view={currentView}
                                onView={setCurrentView}
                                views={['month', 'week', 'day']}
                                step={60}
                                timeslots={1}
                                showMultiDayTimes
                                date={currentDate}
                                onNavigate={setCurrentDate}
                                onSelectSlot={handleSelectSlot}
                                onSelectEvent={handleSelectEvent}
                                selectable
                                eventPropGetter={eventStyleGetter}
                                messages={t.calendarMessages}
                                min={new Date(2025, 1, 1, 8, 0, 0)}
                                max={new Date(2025, 1, 1, 22, 0, 0)}
                                startOfWeek={1}
                            />
                        </div>
                    </div>
                </div>
            </section>


            {/* Legend Section */}
            <section style={{ padding: '3rem 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1px', backgroundColor: 'var(--color-border)', maxWidth: '900px', margin: '0 auto' }}>
                        {t.legend.map((item) => {
                            const Icon = LEGEND_ICONS[item.key];
                            return (
                                <div key={item.key} style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', textAlign: 'center' }}>
                                    <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', backgroundColor: STATUS_COLORS[item.key], display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                                        <Icon className="h-4 w-4" style={{ color: '#ffffff' }} />
                                    </div>
                                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', margin: 0 }}>
                                        {item.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Info Box */}
            <section className="container" style={{ marginBottom: '3rem' }}>
                <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: 'var(--color-teal-pale)', borderLeft: '3px solid var(--color-teal)', borderRadius: '4px', padding: '1.5rem 1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <Info className="h-5 w-5" style={{ color: 'var(--color-teal)', flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)', margin: '0 0 0.75rem' }}>
                                {t.infoBox.title}
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {t.infoBox.items.map((text, i) => (
                                    <li key={i} style={{ display: 'flex', gap: '0.6rem', fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                                        <span style={{ color: 'var(--color-teal)', flexShrink: 0 }}>-</span>
                                        {text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Booking Modal */}
            <BookingModal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                selectedSlot={selectedSlot}
                onSubmit={handleBookingSubmit}
            />
        </div>

    );
};

export default CalendarPage;