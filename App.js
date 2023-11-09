import { StatusBar } from 'react-native';
import React, { useState, useMemo } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import Routes from './src/routes/auth.routes';
import dark from './src/pages/theme/dark';
import light from './src/pages/theme/light';
import { AppContext } from './src/pages/context/AppContext';

export default function App() {

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const appContext = useMemo(() => {
    return {
      isDarkTheme,
      setIsDarkTheme
    }
  }

  );
  return (
    <NavigationContainer theme={isDarkTheme ? dark : light}>
      <AppContext.Provider value={appContext}>
      <StatusBar backgroundColor='#238dd1' barStyle="light-content"/>
      <Routes />
      </AppContext.Provider>
    </NavigationContainer>
  );
}

