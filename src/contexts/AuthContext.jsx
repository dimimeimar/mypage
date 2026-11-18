import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

/* Σύνδεση χρήστη (Supabase Auth, Google).
   Το supabase-js ΔΕΝ φορτώνεται για τους περισσότερους επισκέπτες: κατεβαίνει μόνο όταν υπάρχει
   αποθηκευμένη σύνδεση, όταν επιστρέφουμε από το Google, ή όταν πατηθεί "Σύνδεση". */

const AuthContext = createContext(null);

const hasStoredSession = () => {
  try {
    return Object.keys(localStorage).some((k) => k.startsWith('sb-') && k.endsWith('-auth-token'));
  } catch {
    return false;
  }
};
const hasAuthRedirect = () => /[?&]code=|access_token=/.test(window.location.search + window.location.hash);

const ANON = { ready: true, user: null, profile: null };

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({ ready: false, user: null, profile: null });
  const clientRef = useRef(null);

  const loadSession = useCallback(async (supabase, session) => {
    if (!session?.user) {
      setState(ANON);
      return;
    }
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
    setState({ ready: true, user: session.user, profile: data });
  }, []);

  const init = useCallback(async () => {
    if (clientRef.current) return clientRef.current;
    const { supabase } = await import('../supabase');
    clientRef.current = supabase;
    // Το INITIAL_SESSION έρχεται αμέσως μετά την εγγραφή. Η φόρτωση του προφίλ γίνεται εκτός του callback (αποφυγή deadlock).
    supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => loadSession(supabase, session), 0);
    });
    return supabase;
  }, [loadSession]);

  useEffect(() => {
    if (hasStoredSession() || hasAuthRedirect()) init().catch(() => setState(ANON));
    else setState(ANON);
  }, [init]);

  const signIn = useCallback(async () => {
    const supabase = await init();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/login` },
    });
  }, [init]);

  const signOut = useCallback(async () => {
    const supabase = await init();
    await supabase.auth.signOut();
    setState(ANON);
  }, [init]);

  const value = useMemo(
    () => ({
      ...state,
      isAdmin: state.profile?.role === 'admin',
      canBookDirect: !!state.profile?.can_book_direct,
      signIn,
      signOut,
    }),
    [state, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () =>
  useContext(AuthContext) || { ready: true, user: null, profile: null, isAdmin: false, canBookDirect: false, signIn: async () => {}, signOut: async () => {} };
