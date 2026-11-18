import { useState, useEffect, useMemo, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
// Το 'moment/dist/locale/el' (και όχι 'moment/locale/el') ώστε τα ελληνικά να φορτώνουν στο ίδιο
// αντίγραφο του moment που χρησιμοποιεί το Vite - αλλιώς μέρες και μήνες βγαίνουν στα αγγλικά.
import 'moment/dist/locale/el';
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
    User,
    ChevronLeft,
    ChevronRight,
    Plus,
    RefreshCw
} from 'lucide-react';
import BookingModal from '../common/BookingModal';
import { fetchBusy, createBookingRequest } from '../../services/bookingService';
import { useTranslation } from '../../hooks/useTranslation';
import { calendarData, STATUS_COLORS } from '../../data/calendar_data';
import PageHero from '../common/PageHero';

moment.updateLocale('el', { week: { dow: 1 } }); // Δευτέρα πρώτη
const localizer = momentLocalizer(moment);

const LEGEND_ICONS = { admin: User, verified_user: Users, pending_request: AlertCircle, available: CheckCircle };

const MOBILE_QUERY = '(max-width: 767px)';
const DAY_START = 8;   // πρώτη ώρα που δείχνει το ημερολόγιο
const DAY_END = 22;    // τελευταία

/* ── Προσωρινή αποθήκευση του προγράμματος ──
   Κρατάμε το τελευταίο επιτυχημένο φόρτωμα στον browser. Έτσι το ημερολόγιο γεμίζει
   αμέσως στην επόμενη επίσκεψη, ενώ στο παρασκήνιο φορτώνει η φρέσκια εκδοχή. */
const CACHE_KEY = 'busy-v1';
const CACHE_MAX_AGE = 12 * 60 * 60 * 1000; // 12 ώρες
const readCache = () => {
    try {
        const raw = JSON.parse(localStorage.getItem(CACHE_KEY));
        if (raw && Date.now() - raw.t < CACHE_MAX_AGE && Array.isArray(raw.events)) {
            return raw.events.map((e) => ({ ...e, start: new Date(e.start), end: new Date(e.end) }));
        }
    } catch { /* άδειο ή μη διαθέσιμο localStorage */ }
    return null;
};
const writeCache = (events) => {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), events })); } catch { /* αγνοείται */ }
};

// Πόσο περιμένουμε πριν από κάθε νέα προσπάθεια. Μετά την τελευταία τιμή συνεχίζει ανά 15s, χωρίς όριο.
const RETRY_DELAYS = [1000, 2000, 4000, 8000, 15000];
const RESYNC_AFTER = 3 * 60 * 1000; // όταν ο χρήστης επιστρέψει στην καρτέλα μετά από 3'

/* ── Toolbar ημερολογίου (αντικαθιστά το προεπιλεγμένο του react-big-calendar) ── */
const CalToolbar = ({ label, onNavigate, onView, view, views, localizer: { messages } }) => (
    <div className="cal-toolbar">
        <div className="cal-toolbar__nav">
            <button type="button" onClick={() => onNavigate('PREV')} aria-label={messages.previous}><ChevronLeft size={18} /></button>
            <button type="button" className="cal-toolbar__today" onClick={() => onNavigate('TODAY')}>{messages.today}</button>
            <button type="button" onClick={() => onNavigate('NEXT')} aria-label={messages.next}><ChevronRight size={18} /></button>
        </div>
        <div className="cal-toolbar__label">{label}</div>
        <div className="cal-toolbar__views" role="tablist">
            {views.map((v) => (
                <button key={v} type="button" role="tab" aria-selected={view === v} className={view === v ? 'is-active' : ''} onClick={() => onView(v)}>
                    {messages[v]}
                </button>
            ))}
        </div>
    </div>
);

const CalendarPage = () => {
    const { language } = useTranslation();
    const t = calendarData[language] || calendarData.el;

    // Μία πηγή: η βάση (Supabase). Δείχνει μόνο ώρες, όχι ονόματα.
    const [events, setEvents] = useState(() => readCache() || []);
    // loading: πρώτη προσπάθεια, retrying: απέτυχε και ξαναδοκιμάζει, ok: όλα φορτώθηκαν
    const [sync, setSync] = useState('loading');
    // Γίνεται true στο πρώτο πλήρες φόρτωμα. Μέχρι τότε το πλέγμα καλύπτεται, ώστε κανείς
    // να μη δει ένα "άδειο" ημερολόγιο και νομίσει ότι όλες οι ώρες είναι ελεύθερες.
    const [hasSynced, setHasSynced] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
    // Σε κινητό ξεκινάμε σε προβολή Ημέρας - πιο ευανάγνωστο σε στενή οθόνη
    const [currentView, setCurrentView] = useState(() => (window.matchMedia(MOBILE_QUERY).matches ? 'day' : 'week'));

    useEffect(() => {
        const mq = window.matchMedia(MOBILE_QUERY);
        const onChange = (e) => setIsMobile(e.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    useEffect(() => {
        moment.locale(language);
        moment.updateLocale(language, { week: { dow: 1 } });
    }, [language]);

    /* ── Φόρτωση με δικλείδα ασφαλείας ──
       Αν η βάση δεν απαντήσει, ΔΕΝ δείχνουμε μισό ημερολόγιο σαν να είναι σωστό:
       ξαναδοκιμάζουμε αυτόματα μέχρι να φορτώσει. */
    useEffect(() => {
        let cancelled = false;
        let timer = 0;
        let attempt = 0;
        let lastOk = 0;

        const run = async () => {
            const from = new Date(); from.setHours(0, 0, 0, 0); from.setDate(from.getDate() - 14);
            const to = new Date(from); to.setDate(to.getDate() + 14 + 270);
            const res = await fetchBusy(from, to);
            if (cancelled) return;

            if (res.ok) {
                setEvents(res.events);
                writeCache(res.events);
                lastOk = Date.now();
                attempt = 0;
                setSync('ok');
                setHasSynced(true);
                return;
            }
            setSync('retrying');
            const delay = RETRY_DELAYS[Math.min(attempt, RETRY_DELAYS.length - 1)];
            attempt += 1;
            timer = setTimeout(run, delay);
        };

        // Όταν ο χρήστης γυρίσει στην καρτέλα μετά από ώρα, φέρνουμε ξανά το πρόγραμμα
        const onVisible = () => {
            if (document.hidden || !lastOk || Date.now() - lastOk < RESYNC_AFTER) return;
            lastOk = 0;
            run();
        };

        setSync('loading');
        run();
        document.addEventListener('visibilitychange', onVisible);
        return () => {
            cancelled = true;
            clearTimeout(timer);
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, [reloadKey]);

    const addLocalEvent = (ev) => setEvents((prev) => [...prev, ev]);

    // Ο επισκέπτης βλέπει μόνο "Κλεισμένο" / "Σε αναμονή", ποτέ ονόματα
    const displayEvents = useMemo(
        () => events.map((e) => ({ ...e, title: e.bookedBy === 'pending_request' ? t.eventLabels.pending : t.eventLabels.busy })),
        [events, t]
    );

    const hasOverlap = (start, end) => events.some((event) => {
        if (!event.start || !event.end || event.bookedBy === 'pending_request') return false;
        return start < event.end && end > event.start;
    });

    const eventStyleGetter = (event) => ({
        style: {
            backgroundColor: STATUS_COLORS[event.bookedBy] || STATUS_COLORS.available,
            borderRadius: '6px',
            opacity: 0.92,
            color: 'white',
            border: '0px',
            display: 'block',
            padding: isMobile ? '2px 4px' : '4px 8px',
            fontSize: isMobile ? '11px' : '13px',
            fontWeight: '500'
        }
    });

    const openBooking = (slot) => {
        // Όσο το πρόγραμμα δεν έχει φορτώσει πλήρως, μια "κενή" ώρα μπορεί στην πραγματικότητα να είναι πιασμένη
        if (sync !== 'ok') {
            alert(t.sync.blocked);
            return;
        }
        if (slot.start <= new Date()) {
            alert(t.alerts.pastTime);
            return;
        }
        if (hasOverlap(slot.start, slot.end)) {
            alert(t.alerts.overlapSelect);
            return;
        }
        setSelectedSlot(slot);
        setShowBookingModal(true);
    };

    const handleSelectSlot = (slotInfo) => {
        // Στην προβολή Μήνα, το πάτημα σε μια μέρα ανοίγει εκείνη τη μέρα (όπως στο Google Calendar)
        if (currentView === 'month') {
            setCurrentDate(slotInfo.start);
            setCurrentView('day');
            return;
        }
        openBooking(slotInfo);
    };

    // Κουμπί "Νέα κράτηση": ανοίγει τη φόρμα με την επόμενη ακέραια ώρα της μέρας που φαίνεται
    const handleNewBooking = () => {
        const start = new Date(currentDate);
        const now = new Date();
        const isToday = start.toDateString() === now.toDateString();
        // Σήμερα: η επόμενη ώρα. Αν η μέρα τελείωσε (ή η ημερομηνία είναι παρελθοντική), πάμε στην επόμενη μέρα στις 17:00
        let hour = Math.min(Math.max(isToday ? now.getHours() + 1 : 17, DAY_START), DAY_END - 1);
        start.setHours(hour, 0, 0, 0);
        if (start <= now) {
            start.setTime(now.getTime());
            start.setDate(start.getDate() + 1);
            hour = 17;
            start.setHours(hour, 0, 0, 0);
        }
        const end = new Date(start);
        end.setHours(hour + 1);
        if (sync !== 'ok') { alert(t.sync.blocked); return; }
        setSelectedSlot({ start, end });
        setShowBookingModal(true);
    };

    const handleSelectEvent = useCallback(() => {
        // TODO: Show event details modal
    }, []);

    const formats = useMemo(() => {
        const range = ({ start, end }, culture, loc) => `${loc.format(start, 'HH:mm', culture)} - ${loc.format(end, 'HH:mm', culture)}`;
        // 24ωρη μορφή ώρας παντού
        const base = { timeGutterFormat: 'HH:mm', eventTimeRangeFormat: range, selectRangeFormat: range, agendaTimeRangeFormat: range };
        if (!isMobile) return base;
        return {
            ...base,
            // στενές στήλες: "Δε 16" αντί για "Δευτέρα 16/11"
            dayFormat: (date, culture, loc) => loc.format(date, 'dd D', culture),
            dayHeaderFormat: (date, culture, loc) => loc.format(date, 'ddd D MMM', culture),
            dayRangeHeaderFormat: ({ start, end }, culture, loc) => `${loc.format(start, 'D', culture)} - ${loc.format(end, 'D MMM', culture)}`,
        };
    }, [isMobile]);

    // Handle booking submission
    const handleBookingSubmit = async (bookingData) => {

        if (bookingData.startTime <= new Date()) {
            alert(t.alerts.pastTime);
            return;
        }
        if (hasOverlap(bookingData.startTime, bookingData.endTime)) {
            alert(t.alerts.overlapSubmit);
            return;
        }
        try {
            const result = await createBookingRequest(bookingData);
            if (!result.success) throw new Error('Failed to create booking request');

            // Ειδοποίηση με email (προσωρινά, μέχρι να έρθουν οι ειδοποιήσεις από το admin)
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

            addLocalEvent({
                id: `pending-${Date.now()}`,
                start: bookingData.startTime,
                end: bookingData.endTime,
                bookedBy: 'pending_request'
            });
        } catch (error) {
            console.error('Booking error:', error);
            alert(t.alerts.genericError);
        }
    };

    return (
        <div className="min-h-screen">

            {/* ── HERO ── */}
            <PageHero seo="calendar" compact title={t.hero.title} subtitle={t.hero.subtitle} />

            {/* Calendar Section */}
            <section className="cal-section">
                <div className="cal-card">
                    <div className="cal-card__head">
                        <h2><CalendarIcon size={20} /> {t.cardHeader.title}</h2>
                        <span className="cal-card__tz"><Clock size={14} /> {t.cardHeader.timezone}</span>
                        <button type="button" className="cal-card__book" onClick={handleNewBooking}>
                            <Plus size={16} /> {t.bookButton}
                        </button>
                    </div>

                    {/* Μπάρα κατάστασης: όταν μια προσπάθεια αποτύχει, ή σε ανανέωση μετά το πρώτο φόρτωμα */}
                    {sync !== 'ok' && (hasSynced || sync === 'retrying') && (
                        <div className={`cal-sync cal-sync--${sync}`} role="status">
                            <RefreshCw size={15} className="cal-sync__spin" />
                            <span>{sync === 'loading' ? t.sync.loading : t.sync.retrying}</span>
                            {sync === 'retrying' && (
                                <button type="button" onClick={() => setReloadKey((k) => k + 1)}>{t.sync.retryButton}</button>
                            )}
                        </div>
                    )}

                    <div className="cal-card__body" aria-busy={!hasSynced}>
                        {!hasSynced && (
                            <div className="cal-loading" role="status">
                                <RefreshCw size={26} className="cal-sync__spin" />
                                <p>{t.sync.loading}</p>
                            </div>
                        )}
                        <Calendar
                            localizer={localizer}
                            culture={language === 'en' ? 'en' : 'el'}
                            events={displayEvents}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: isMobile ? 'max(520px, calc(100svh - 210px))' : 750 }}
                            view={currentView}
                            onView={setCurrentView}
                            views={['month', 'week', 'day']}
                            components={{ toolbar: CalToolbar }}
                            formats={formats}
                            step={60}
                            timeslots={1}
                            showMultiDayTimes
                            date={currentDate}
                            onNavigate={setCurrentDate}
                            onSelectSlot={handleSelectSlot}
                            onSelectEvent={handleSelectEvent}
                            selectable
                            longPressThreshold={120}
                            eventPropGetter={eventStyleGetter}
                            messages={t.calendarMessages}
                            min={new Date(2025, 1, 1, DAY_START, 0, 0)}
                            max={new Date(2025, 1, 1, DAY_END, 0, 0)}
                            startOfWeek={1}
                        />
                    </div>
                </div>
            </section>


            {/* Legend Section */}
            <section style={{ padding: '3rem 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem', maxWidth: '900px', margin: '0 auto' }}>
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
