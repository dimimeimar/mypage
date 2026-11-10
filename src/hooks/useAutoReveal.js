import { useEffect } from 'react';

/* Αυτόματο scroll-reveal για ΟΛΕΣ τις σελίδες, χωρίς να χρειάζεται κάθε σελίδα
   να τυλίγει τα κομμάτια της σε ειδικό component.
   Βρίσκει τα "μπλοκ" περιεχομένου μέσα σε κάθε <section> του <main>, τους βάζει
   την κλάση .rv (κρυμμένο) και, όταν μπουν στην οθόνη, την .rv-in (ορατό).
   Με data-rv="off" σε ένα section το εξαιρείς. */
const BLOCKS = ':scope > .container > *, :scope > .container > .split-grid > *, :scope > .container > [data-rv-group] > *';

export const useAutoReveal = (rootRef, routeKey) => {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('rv-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    const tag = () => {
      root.querySelectorAll('section:not([data-rv="off"])').forEach((section) => {
        let targets = section.querySelectorAll(BLOCKS);
        if (!targets.length) targets = section.classList.contains('container') ? section.children : [];
        Array.from(targets).forEach((el, i) => {
          if (el.dataset.rvSeen) return;
          if (el.matches('.split-grid, [data-rv-group]')) return; // τα παιδιά τους εμφανίζονται ξεχωριστά
          el.dataset.rvSeen = '1';
          // Ό,τι φαίνεται ήδη στην πρώτη οθόνη δεν το κρύβουμε (θα "αναβόσβηνε")
          if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
          el.style.setProperty('--rv-i', String(Math.min(i, 5)));
          el.classList.add('rv');
          io.observe(el);
        });
      });
    };

    tag();
    // Σελίδες που φορτώνουν δεδομένα (π.χ. ημερολόγιο) προσθέτουν sections αργότερα
    let timer = 0;
    const mo = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(tag, 200);
    });
    mo.observe(root, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); clearTimeout(timer); };
  }, [rootRef, routeKey]);
};
