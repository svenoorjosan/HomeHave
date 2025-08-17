/* public/js/Starfield.jsx */
/* React + Tailwind starfield (twinkles + shooting stars) */

const Starfield = () => {
  const shootingStars = React.useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        top: `${(i * 37) % 100}%`,
        left: `${(i * 53) % 100}%`,
        delay: `${(i * 0.9) % 9}s`,
        duration: `${6 + (i % 5)}s`,
        scale: 0.8 + ((i % 4) * 0.12),
      })),
    []
  );

  const twinkles = React.useMemo(
    () =>
      Array.from({ length: 120 }).map((_, i) => ({
        top: `${(i * 17) % 100}%`,
        left: `${(i * 29) % 100}%`,
        delay: `${(i * 0.27) % 5}s`,
        size: 1 + (i % 3),
      })),
    []
  );

  return (
    <>
      <style>{`
        @keyframes twinkle {
          0%,100% { opacity:.18; transform:scale(1) }
          50%     { opacity:.9;  transform:scale(1.25) }
        }

        /* Use --scale so keyframes keep your per-star scale */
        @keyframes shoot {
          0%   { opacity:0; transform:translate3d(0,0,0) rotate(35deg) scale(var(--scale,1)) }
          8%   { opacity:1; transform:translate3d(0,0,0) rotate(35deg) scale(var(--scale,1)) }
          90%  { opacity:1; transform:translate3d(900px,240px,0) rotate(35deg) scale(var(--scale,1)) }
          100% { opacity:0; transform:translate3d(900px,240px,0) rotate(35deg) scale(var(--scale,1)) }
        }

        .twinkle {
          animation: twinkle 2.2s ease-in-out infinite;
        }

        .shooter {
          position:absolute; width:2px; height:2px;
          background:linear-gradient(90deg,#fff,rgba(255,255,255,0));
          border-radius:9999px;
          filter:drop-shadow(0 0 6px rgba(255,255,255,.9));
          box-shadow:0 0 8px 2px rgba(255,255,255,.55);
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .twinkle, .shooter { animation:none !important }
        }
      `}</style>

      {/* Fill the screen behind your UI */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* subtle vignette so the card pops */}
        <div className="absolute inset-0 bg-[radial-gradient(65%_55%_at_50%_38%,rgba(2,6,23,0)_0%,rgba(2,6,23,.25)_60%,rgba(2,6,23,.55)_100%)]" />

        {/* twinkles */}
        <div aria-hidden className="absolute inset-0">
          {twinkles.map((s, i) => (
            <span
              key={`tw-${i}`}
              className="twinkle absolute rounded-full bg-white/80"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                animationDelay: s.delay
              }}
            />
          ))}
        </div>

        {/* shooting stars */}
        <div aria-hidden className="absolute inset-0">
          {shootingStars.map((s, i) => (
            <span
              key={`ss-${i}`}
              className="shooter"
              style={{
                top: s.top,
                left: s.left,
                animation: `shoot ${s.duration} linear ${s.delay} infinite`,
                '--scale': s.scale, // keep per-star scale through the keyframes
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

// Mount into the fixed background container
(function mount() {
  const el = document.getElementById('fx-root');
  if (!el) return;
  el.innerHTML = ''; // clear any previous background script
  ReactDOM.createRoot(el).render(<Starfield />);
})();
