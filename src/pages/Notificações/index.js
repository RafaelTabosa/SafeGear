import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Firebase from 'firebase';
import { useTheme } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);

  const { colors } = useTheme();
  const { isDarkTheme, setIsDarkTheme } = useContext(AppContext);
  
  useEffect(() => {
    // Função para formatar a data no formato dd/mm/yyyy
    const formatarData = (dataString) => {
      const [day, month, year] = dataString.split('/');
      return `${day}/${month}/${year}`;
    };

    // Função para verificar se uma data está dentro das próximas 24 horas
    const dentroDasProximas24Horas = (dataString) => {
      const dataPrevisao = new Date(formatarData(dataString));
      const hoje = new Date();
      const amanhã = new Date();
      amanhã.setDate(hoje.getDate() + 1);

      return dataPrevisao >= hoje && dataPrevisao <= amanhã;
    };

    // Apontando para o nó 'Cadastro de Epis'
    const ref = Firebase.database().ref('Cadastro de Epis');

    ref.on('value', (snapshot) => {
      const data = snapshot.val();
      console.log('Dados do Firebase:', data);

      if (data) {
        const notificacoes = [];

        for (const key in data) {
          const epi = data[key];
          console.log('EPI:', epi);

          if (epi && epi.previsaoSubstituicao) {
            const previsaoSubstituicao = epi.previsaoSubstituicao;

            if (dentroDasPróximas24Horas(previsaoSubstituicao)) {
              notificacoes.push({
                funcionario: epi.funcionarios,
                dataPrevisao: previsaoSubstituicao,
              });
            }
          }
        }
        setNotificacoes(notificacoes);
      }
    });

    return () => ref.off('value');
  }, []);

  console.log('Notificações:', notificacoes);

  return (
    <View style={[styles.container, {backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Notificações</Text>
      <FlatList
        data={notificacoes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.notificationContainer, {backgroundColor: colors.background }]}>
            <Text style={[styles.text, { color: colors.text }]}>Funcionário: {item.funcionario}</Text>
            <Text style={[styles.text, { color: colors.text }]}>Data de Previsão: {item.dataPrevisao}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    margin: 10,
  },
  notificationContainer: {
    margin: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
