import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Calendar,
  Clock,
  Mail,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { calendarData } from '../../data/calendar_data';

const BookingModal = ({
  isOpen,
  onClose,
  selectedSlot,
  onSubmit,
  directBooking = false,
  prefill = null
}) => {
  const { language } = useTranslation();
  const t = (calendarData[language] || calendarData.el).booking;

  const [formData, setFormData] = useState({
    studentEmail: '',
    title: '',
    startTime: null,
    endTime: null,
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Άμεση κράτηση: μόνο για συνδεδεμένο μαθητή με δικαίωμα, και τουλάχιστον 48 ώρες νωρίτερα
  const isVerifiedUser = !!directBooking && !!formData.startTime && formData.startTime.getTime() >= Date.now() + 48 * 3600 * 1000;

  const debounceRef = useRef(null);

  // Καθαρισμός του debounce timer όταν το component γίνεται unmount
  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  // Scroll-lock: κλειδώνει το scroll ολόκληρης της σελίδας όσο το modal είναι ανοιχτό.
  // useLayoutEffect (όχι useEffect) ώστε να τρέξει ΠΡΙΝ το πρώτο paint - καμία στιγμιαία "αναλαμπή".
  // Αποθηκεύουμε τις ΑΡΧΙΚΕΣ τιμές (αντί να τις μηδενίζουμε σε '') ώστε να μην πειράξουμε
  // τυχόν άλλο κώδικα που έχει ήδη ορίσει κάτι στο html/body.
  // Αντισταθμίζουμε και το πλάτος του scrollbar με padding-right, ώστε η σελίδα να μη "χοροπηδάει"
  // πλευρικά τη στιγμή που ο browser αφαιρεί/επαναφέρει το scrollbar.
  useLayoutEffect(() => {
    if (!isOpen) return;

    const html = document.documentElement;
    const body = document.body;
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPaddingRight = body.style.paddingRight;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.paddingRight = prevBodyPaddingRight;
    };
  }, [isOpen]);

  // Initialize times from selected slot
  useEffect(() => {
    if (selectedSlot) {
      setFormData(prev => ({
        ...prev,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        studentEmail: prev.studentEmail || prefill?.email || '',
        title: prev.title || prefill?.name || ''
      }));
    }
  }, [selectedSlot, prefill]);

  if (!isOpen || !selectedSlot) return null;

  // Format time for input (HH:MM)
  const formatTimeForInput = (date) => {
    if (!date) return '';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Parse time input and update date
  const updateTimeFromInput = (dateToUpdate, timeString, isStart) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(dateToUpdate);
    newDate.setHours(hours, minutes, 0, 0);

    if (isStart) {
      setFormData(prev => ({ ...prev, startTime: newDate }));
    } else {
      setFormData(prev => ({ ...prev, endTime: newDate }));
    }
  };

  // Ημερομηνία (YYYY-MM-DD, τοπική ώρα) για το <input type="date">
  const toDateInput = (d) => {
    if (!d) return '';
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const todayInput = toDateInput(new Date());

  // Αλλαγή ημέρας: οι ώρες μένουν ίδιες, αλλάζει μόνο η ημερομηνία σε έναρξη και λήξη
  const updateDateFromInput = (value) => {
    if (!value) return;
    const [y, m, d] = value.split('-').map(Number);
    const apply = (date) => {
      const n = new Date(date);
      n.setFullYear(y, m - 1, d);
      return n;
    };
    setFormData(prev => ({ ...prev, startTime: apply(prev.startTime), endTime: apply(prev.endTime) }));
    if (errors.time) setErrors(prev => ({ ...prev, time: null }));
  };

  // Calculate duration in minutes
  const getDuration = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    return Math.round((formData.endTime - formData.startTime) / (1000 * 60));
  };

  // Αλλαγή email (η άμεση κράτηση για whitelisted γίνεται με login, όχι με email)
  const handleEmailChange = (email) => {
    setFormData(prev => ({ ...prev, studentEmail: email }));

    if (errors.studentEmail) {
      setErrors(prev => ({ ...prev, studentEmail: null }));
    }

  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.studentEmail.trim()) {
      newErrors.studentEmail = t.validation.emailRequired;
    } else if (!emailRegex.test(formData.studentEmail)) {
      newErrors.studentEmail = t.validation.emailInvalid;
    }

    if (!formData.title.trim()) {
      newErrors.title = t.validation.titleRequired;
    }

    if (!formData.startTime || !formData.endTime) {
      newErrors.time = t.validation.timeRequired;
    } else if (formData.endTime <= formData.startTime) {
      newErrors.time = t.validation.timeOrder;
    } else if (formData.startTime.getTime() <= Date.now()) {
      newErrors.time = t.validation.pastTime;
    }

    const duration = getDuration();
    if (duration < 30) {
      newErrors.time = t.validation.minDuration;
    } else if (duration > 240) {
      newErrors.time = t.validation.maxDuration;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const bookingData = {
        title: formData.title,
        studentEmail: formData.studentEmail,
        startTime: formData.startTime,
        endTime: formData.endTime,
        notes: formData.notes,
        isVerified: isVerifiedUser,
        status: isVerifiedUser ? 'approved' : 'pending',
        bookedBy: isVerifiedUser ? 'verified_user' : 'pending_request'
      };

      await onSubmit(bookingData);

      // Reset form
      setFormData({
        studentEmail: '',
        title: '',
        startTime: null,
        endTime: null,
        notes: ''
      });

      onClose();
    } catch (error) {
      console.error('Booking error:', error);
      setErrors({ submit: t.validation.submitError });
    } finally {
      setIsSubmitting(false);
    }
  };

  const duration = getDuration();

  const durationText = duration >= 60
    ? `${Math.floor(duration / 60)}${duration % 60 !== 0 ? `.${(duration % 60) === 30 ? '5' : ''}` : ''} ${Math.floor(duration / 60) !== 1 ? t.hoursUnit : t.hourUnit}`
    : `${duration} ${t.minutesUnit}`;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm p-4" style={{ zIndex: 200 }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in" style={{ maxHeight: '90vh' }}>
        <div className="overflow-y-auto scrollbar-thin" style={{ maxHeight: '90vh' }}>

          {/* Header */}
          <div className="sticky top-0 px-6 py-4 flex items-center justify-between rounded-t-2xl" style={{ backgroundColor: 'var(--color-teal)' }}>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{t.title}</h2>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {formData.startTime?.toLocaleDateString(t.dateLocale, {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Verified User Badge */}
          {isVerifiedUser && (
            <div className="bg-green-50 border-b border-green-200 px-6 py-3">
              <div className="flex items-center justify-center text-green-800">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-semibold">
                  {t.verifiedBadge}
                </span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-2" />
                {t.titleLabel}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder={t.titlePlaceholder}
                autoFocus
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.title}
                </p>
              )}
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                {t.emailLabel}
              </label>
              <input
                type="email"
                value={formData.studentEmail}
                onChange={(e) => handleEmailChange(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${errors.studentEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="email@example.com"
              />
              {errors.studentEmail && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.studentEmail}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {t.emailHint}
              </p>
            </div>

            {/* Time Selection */}
            <div className="rounded-lg p-5 border-2" style={{ backgroundColor: 'var(--color-teal-pale)', borderColor: 'var(--color-teal-light)' }}>
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 mr-2" style={{ color: 'var(--color-teal)' }} />
                <h3 className="font-semibold text-gray-900">{t.timeSectionTitle}</h3>
              </div>

              {/* Date */}
              <div className="mb-4">
                <label htmlFor="booking-date" className="block text-xs font-medium text-gray-600 mb-2">
                  {t.dateLabel}
                </label>
                <input
                  id="booking-date"
                  type="date"
                  min={todayInput}
                  value={toDateInput(formData.startTime)}
                  onChange={(e) => updateDateFromInput(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white font-semibold text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Start Time */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    {t.startLabel}
                  </label>
                  <input
                    type="time"
                    value={formatTimeForInput(formData.startTime)}
                    onChange={(e) => updateTimeFromInput(formData.startTime, e.target.value, true)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white font-semibold text-gray-900"
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    {t.endLabel}
                  </label>
                  <input
                    type="time"
                    value={formatTimeForInput(formData.endTime)}
                    onChange={(e) => updateTimeFromInput(formData.endTime, e.target.value, false)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white font-semibold text-gray-900"
                  />
                </div>
              </div>

              {/* Duration Display */}
              {duration > 0 && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                    <Clock className="h-4 w-4 mr-2" style={{ color: 'var(--color-teal)' }} />
                    <span className="text-sm font-semibold text-gray-700">
                      {t.durationLabel} {durationText}
                    </span>
                  </div>
                </div>
              )}

              {errors.time && (
                <p className="text-red-600 text-sm mt-3 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.time}
                </p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-2" />
                {t.notesLabel}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors resize-none"
                placeholder={t.notesPlaceholder}
              />
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700 text-sm flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                {t.cancelButton}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--color-teal)' }}
                onMouseEnter={e => !isSubmitting && (e.currentTarget.style.backgroundColor = 'var(--color-teal-light)')}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-teal)'}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t.submittingButton}
                  </span>
                ) : (
                  isVerifiedUser ? t.submitButton : t.submitPendingButton
                )}
              </button>
            </div>

            {directBooking && !isVerifiedUser && !!formData.startTime && (
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                {t.directTooSoon}
              </p>
            )}

            {/* Info Note */}
            {!isVerifiedUser && (
              <p className="text-sm text-gray-600 text-center pt-2">
                {t.infoNote}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );

  // Portal: το modal ζωγραφίζεται απευθείας μέσα στο <body>, εκτός του React tree
  // της CalendarPage - έτσι αποφεύγουμε οποιαδήποτε παράξενη αλληλεπίδραση με
  // γονικά elements (overflow, transform, stacking context κ.λπ.)
  return createPortal(modalContent, document.body);
};

export default BookingModal;