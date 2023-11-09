import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { AppContext } from '../pages/context/AppContext'; 

export default function Configuracoes() {
  const { colors } = useTheme();
  const { isDarkTheme, setIsDarkTheme } = useContext(AppContext);

  const toggleTheme = () => {
    setIsDarkTheme(current => !current);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>Configurações</Text>
      <View style={styles.switchContainer}>
        <Text style={{ color: colors.text }}>Tema Escuro</Text>
        <Switch value={isDarkTheme} onValueChange={toggleTheme} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
});