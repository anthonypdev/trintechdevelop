// SpectroButton component

window.SpectroButton = () => {
  return (
    <>
      <div className="grain-overlay" />
      <button className="spectro-button" />
      <style>{`
        :root {
          --m: 4rem;
          --red: #FF6565;
          --pink: #FF64F9;
          --purple: #6B5FFF;
          --blue: #4D8AFF;
          --green: #5BFF89;
          --yellow: #FFEE55;
          --orange: #FF6D1B;
        }

        .spectro-button {
          border: 1px solid rgba(255, 255, 255, 0.15);
          position: relative;
          color: transparent;
          font-family: 'Space Grotesk', sans-serif;
          font-size: var(--m);
          border-radius: calc(0.7 * var(--m));
          padding: calc(0.5 * var(--m)) calc(1 * var(--m));
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          background:
            linear-gradient(to top, rgba(255,255,255,0.06) 0%, transparent 35%),
            linear-gradient(#121213, #121213),
            linear-gradient(#121213 50%, rgba(18, 18, 19, 0.6) 80%, rgba(18, 18, 19, 0)),
            linear-gradient(90deg, var(--orange), var(--yellow), var(--green), var(--blue), var(--purple), var(--pink), var(--red));
          background-origin: border-box;
          background-clip: padding-box, border-box, border-box, border-box;
          background-size: 200%;
          animation: animate 2s infinite linear;
          box-shadow:
            inset 0 1px 2px rgba(255, 255, 255, 0.1),
            0 0 12px rgba(255, 255, 255, 0.05);
        }

        .spectro-button::before {
          content: '';
          background: linear-gradient(90deg, var(--orange), var(--yellow), var(--green), var(--blue), var(--purple), var(--pink), var(--red));
          position: absolute;
          top: -0.15rem;
          left: -0.15rem;
          right: -0.15rem;
          bottom: -0.15rem;
          border-radius: calc(0.7 * var(--m) + 0.15rem);
          z-index: -1;
          background-size: 200%;
          animation: animate 2s infinite linear;
          filter: blur(4px);
          opacity: 0.8;
        }

        .spectro-button:hover,
        .spectro-button:hover::before {
          animation: animate 0.5s infinite linear;
        }

        .grain-overlay {
          pointer-events: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          background-repeat: repeat;
          z-index: 999;
          mix-blend-mode: soft-light;
          opacity: 0.15;
        }

        @keyframes animate {
          0% {
            background-position: 0;
          }
          100% {
            background-position: 200%;
          }
        }

        @media screen and (max-width: 1000px) {
          :root {
            --m: 2rem;
          }
        }
      `}</style>
    </>
  );
};

