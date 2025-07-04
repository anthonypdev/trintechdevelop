// SpectroButton component

window.SpectroButton = () => {
  return (
    <>
      <a href="#contact" className="spectro-button" style={{textDecoration: 'none', display: 'inline-flex'}}>Get Started</a>
      <style>{`
        :root {
          /*  change this for scaling  */
          --m: 1rem;

          --red: #FF6565;
          --pink: #FF64F9;
          --purple: #6B5FFF;
          --blue: #4D8AFF;
          --green: #5BFF89;
          --yellow: #FFEE55;
          --orange: #FF6D1B;
        }

        .spectro-button {
          border: calc(0.08 * var(--m)) solid transparent;
          position: relative;
          color: #F3F3F3;
          font-family: 'Space Grotesk', sans-serif;
          font-size: var(--m);
          border-radius: calc(0.7 * var(--m));
          padding: calc(0.5 * var(--m)) calc(1 * var(--m));
          display: flex;
          justify-content: center;
          cursor: pointer;

          background:
            linear-gradient(#121213, #121213),
            linear-gradient(#121213 50%, rgba(18, 18, 19, 0.6) 80%, rgba(18, 18, 19, 0)),
            linear-gradient(90deg, var(--orange), var(--yellow), var(--green), var(--blue), var(--purple), var(--pink), var(--red));
          background-origin: border-box;
          background-clip: padding-box, border-box, border-box;
          background-size: 200%;
          animation: animate 2s infinite linear;
        }

        .spectro-button::before {
          content: '';
          background: linear-gradient(90deg, var(--orange), var(--yellow), var(--green), var(--blue), var(--purple), var(--pink), var(--red));
          height: 30%;
          width: 60%;
          position: absolute;
          bottom: -20%;
          z-index: -5;
          background-size: 200%;
          animation: animate 2s infinite linear;
          filter: blur(calc(0.8 * var(--m)));
        }

        .spectro-button:hover,
        .spectro-button:hover::before {
          animation: animate 0.5s infinite linear;
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
            --m: 0.8rem;
          }
        }
      `}</style>
    </>
  );
};

