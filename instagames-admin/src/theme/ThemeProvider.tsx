import { ThemeProvider } from '@mui/material';
import StyledEngineProvider from '@mui/material/StyledEngineProvider';
import { createContext, FC, useEffect, useState } from 'react';

import { themeCreator } from './base';

export const ThemeContext = createContext((_themeName: string): void => {
  return;
});

interface Props {
  children: React.ReactNode;
}

const ThemeProviderWrapper: FC<Props> = ({ children }) => {
  const [themeName, _setThemeName] = useState('GreenFieldsTheme');

  useEffect(() => {
    const curThemeName =
      window.localStorage.getItem('appTheme') || 'GreenFieldsTheme';
    _setThemeName(curThemeName);
  }, []);

  const theme = themeCreator(themeName);
  const setThemeName = (themeName: string): void => {
    window.localStorage.setItem('appTheme', themeName);
    _setThemeName(themeName);
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeContext.Provider value={setThemeName}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ThemeContext.Provider>
    </StyledEngineProvider>
  );
};

export default ThemeProviderWrapper;
