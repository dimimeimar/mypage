import { useRef } from 'react';

/* Κάρτα που γέρνει ελαφρά σε 3D προς το ποντίκι.
   Τα styles είναι στο global.css (.tilt). Σε οθόνες αφής μένει επίπεδη. */
const TiltCard = ({ children, className = '', max = 4, ...rest }) => {
  const ref = useRef(null);

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.classList.add('is-tilting');
    el.style.setProperty('--ry', `${(px - 0.5) * 2 * max}deg`);
    el.style.setProperty('--rx', `${(0.5 - py) * 2 * max}deg`);
  };
  const onLeave = () => {
    const el = ref.current;
    el.classList.remove('is-tilting');
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <div ref={ref} className={`tilt ${className}`} onPointerMove={onMove} onPointerLeave={onLeave} {...rest}>
      {children}
    </div>
  );
};

export default TiltCard;
