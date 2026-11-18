import { supabase } from '../supabase';

/**
 * Κατειλημμένες ώρες (μόνο ώρες, χωρίς ονόματα) από τη βάση.
 * Περιλαμβάνει μαθήματα, αιτήματα σε αναμονή και τα events του Google Calendar μου.
 * Επιστρέφει { ok, events } ώστε η αποτυχία να μη μοιάζει με "άδειο ημερολόγιο".
 */
export const fetchBusy = async (from, to) => {
  const { data, error } = await supabase.rpc('public_busy', {
    from_ts: from.toISOString(),
    to_ts: to.toISOString(),
  });
  if (error || !Array.isArray(data)) {
    console.error('fetchBusy failed:', error?.message);
    return { ok: false, events: [] };
  }
  return {
    ok: true,
    events: data.map((r, i) => ({
      id: `busy-${i}-${r.starts_at}`,
      start: new Date(r.starts_at),
      end: new Date(r.ends_at),
      bookedBy: r.status === 'pending' ? 'pending_request' : 'admin',
    })),
  };
};

/** Αίτημα κράτησης από επισκέπτη (δεν χρειάζεται login). Μένει "pending" μέχρι να το εγκρίνω. */
export const createBookingRequest = async ({ title, studentEmail, startTime, endTime, notes }) => {
  const { error } = await supabase.from('lessons').insert({
    kind: 'lesson',
    status: 'pending',
    student_name: title,
    student_email: studentEmail.toLowerCase(),
    notes: notes || null,
    starts_at: startTime.toISOString(),
    ends_at: endTime.toISOString(),
  });
  if (error) {
    console.error('createBookingRequest failed:', error.message);
    return { success: false, error };
  }
  return { success: true };
};
