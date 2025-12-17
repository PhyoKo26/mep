const twFiles = '/**/*.{ts,tsx,mdx}';
/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    `./src/${twFiles}`,
    `./lib/${twFiles}`, // Adjusted to include the src folder
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#02107D',
        secondary: '#3847BB',
        purpule: '#B57EDC',
      },
      fontFamily: {
        en: {
          light: ['Poppins-Light', 'sans-serif'],
          normal: ['Poppins-Regular', 'sans-serif'],
          semibold: ['Poppins-SemiBold', 'sans-serif'],
          bold: ['Poppins-Bold', 'sans-serif'],
          italic: ['Poppins-Italic', 'sans-serif'],
        },
        mm: {
          normal: ['Pyidaungsu-Regular', 'sans-serif'],
          bold: ['Pyidaungsu-Bold', 'sans-serif'],
        },
      },
      fontSize: {
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        md: ['16px', '24px'],
        lg: ['18px', '28px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '36px'],
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        black: 900,
      },
    },
    fontSize: {
      base: ['16px', '24px'], // Default font size
    },
  },
  plugins: [],
};
