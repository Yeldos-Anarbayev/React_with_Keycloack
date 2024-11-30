module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      'white': 'var(--white)',
      'gray': 'var(--gray)',
      'success': 'var(--success)',
      'primary': 'var(--primary)',
      'lightBlue': 'var(--lightBlue)',
      'success2': 'var(--success2)',
      'danger': 'var(--danger)',
      'lightGray': 'var(--lightGray)',
      'warning': 'var(--warning)',
      'darkWarning': 'var(--darkWarning)',
      'black': 'var(--black)',
      'appBackground': 'var(--appBackground)',
      'red': 'var(--red)',
      'darkInputText': 'var(--darkInputText)',
      'iconColor': 'var(--iconColor)',
      'grayInputBackground': 'var(--grayInputBackground)'
    },
    extend: {
      keyframes: {
        wave: {
          "0%": { transform: "rotate(0.0deg)" },
          "10%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "30%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10.0deg)" },
          "60%": { transform: "rotate(0.0deg)" },
          "100%": { transform: "rotate(0.0deg)" },
        },
      },
      animation: {
        "waving-hand": "wave 2s linear infinite",
      },
    },
  },
  plugins: [],
};
