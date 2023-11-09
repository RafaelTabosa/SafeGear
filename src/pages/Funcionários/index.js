import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import firebase from 'firebase';

export default function Funcionarios({ navigation }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [originalFuncionarios, setOriginalFuncionarios] = useState([]);
  const [noFuncionariosMessage, setNoFuncionariosMessage] = useState('');

  const loadData = useCallback(() => {
    const funcionariosRef = firebase.database().ref('funcionarios');

    const handleData = (snapshot) => {
      const funcionariosData = snapshot.val();

      if (funcionariosData) {
        const funcionariosArray = Object.entries(funcionariosData).map(([id, funcionario]) => ({
          id,
          registro: funcionario['0'].valor,
          nome: funcionario['1'].valor,
          // Continue para outros campos conforme necessário
        }));
        console.log('Funcionarios do Firebase:', funcionariosArray);
        setFuncionarios(funcionariosArray);
        setOriginalFuncionarios(funcionariosArray); // Armazenar uma cópia original para a pesquisa
        setNoFuncionariosMessage('');
      } else {
        console.log('Nenhum dado de funcionário encontrado no Firebase.');
        setFuncionarios([]);
        setOriginalFuncionarios([]);
        setNoFuncionariosMessage('Nenhum funcionário encontrado');
      }
    };

    funcionariosRef.on('value', handleData, (error) => {
      console.error('Erro ao obter dados do Firebase:', error.message);
    });

    return () => funcionariosRef.off('value', handleData);
  }, []);

  useEffect(() => {
    // Carregar dados ao montar a tela
    loadData();
  }, [loadData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Carregar dados ao focar na tela
      loadData();
    });

    return unsubscribe;
  }, [navigation, loadData]);

  useEffect(() => {
    // Atualizar opções de navegação para adicionar os ícones de lupa e recarregar
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerIcons}>

          <TouchableOpacity onPress={() => setSearchVisible(!searchVisible)}>
            <Icon name={searchVisible ? 'close' : 'search'} size={24}  style={styles.iconsearch} />
          </TouchableOpacity>

          <TouchableOpacity onPress={loadData}>
            <Icon name="refresh" size={24}  style={styles.iconrefresh} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, loadData, searchVisible]);

  const navigateToCadastro = () => {
    navigation.navigate('CadastroFuncionario');
  };

  const navigateToEdicao = (id) => {
    navigation.navigate('EdicaoFuncionario', { funcionarioId: id });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    // Filtrar funcionários com base nas primeiras letras da consulta
    const filteredFuncionarios = originalFuncionarios.filter((funcionario) =>
      funcionario.nome.toLowerCase().startsWith(query.toLowerCase())
    );

    setFuncionarios(filteredFuncionarios);
  };

  return (
    <View style={styles.container}>
      {/* Barra de pesquisa */}
      {searchVisible && (
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      )}

      <Text style={styles.text}>Lista de Funcionários</Text>

      {noFuncionariosMessage ? (
        <Text style={styles.noFuncionariosMessage}>{noFuncionariosMessage}</Text>
      ) : (
        <FlatList
          data={funcionarios}
          keyExtractor={(item) => item.registro.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.epiItem} onPress={() => navigateToEdicao(item.id)}>
              <View key={item.registro.toString()}>
                <Text style={styles.funcionarioRegistro}>{item.registro}</Text>
                <Text style={styles.funcionarioNome}>{item.nome}</Text>
                {/* Add other fields as needed */}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    
      {/* Botão de adicionar funcionário */}
      <TouchableOpacity style={styles.addButton} onPress={navigateToCadastro}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 10,
    textAlign: 'center',
  },

  
  funcionarioNome: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  funcionarioRegistro: {
    fontSize: 14,
    color: '#666',
  },

  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#238dd1',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },

  headerIcons: {
    flexDirection: 'row',
    marginRight: 16,
  },

  iconsearch: {
    marginRight: 16,
    color: 'black',
    marginRight: 25
  },

  iconrefresh:{
    marginRight: 16,
    color: 'black',
    marginRight:-2
  },

  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },

  epiItem: {
    backgroundColor: 'white',
    margin: 8,
    padding: 16,
    borderRadius: 8,
  },

  noFuncionariosMessage: {

    fontSize: 10,
    marginStart: -10,
    textAlign: 'center',
    marginTop: 200,
  },
});
