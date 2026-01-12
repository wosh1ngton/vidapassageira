import Lara   from '@primeng/themes/lara';

export const CustomTheme = {
  ...Lara,
  semantic: {
    ...Lara.semantic, 
    primary: {
      50: '#f3f6f0',
      100: '#e1e8d8',
      200: '#c7d3b4',
      300: '#aebf91',
      400: '#97ad73',
      500: '#819d6a',
      600: '#6f8a5b',
      700: '#5c734b',
      800: '#495c3b',
      900: '#37462c'
    }
  }
};
