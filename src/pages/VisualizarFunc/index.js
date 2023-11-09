import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Button } from 'react-native';
import firebase from 'firebase';
import { TextInputMask } from 'react-native-masked-text';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function VisualizarFunc({ route, navigation }) {
  const { funcionarioId } = route.params;
  const [funcionario, setFuncionario] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const funcionarioRef = firebase.database().ref(`funcionarios/${funcionarioId}`);

    const handleData = (snapshot) => {
      const funcionarioData = snapshot.val();

      if (funcionarioData) {
        const funcionarioArray = Object.keys(funcionarioData).map((index) => ({
          campo: funcionarioData[index].campo,
          valor: funcionarioData[index].valor,
        }));
        setFuncionario(funcionarioArray);
      } else {
        console.log('Nenhum dado de funcionário encontrado para edição.');
      }

      setIsLoading(false);
    };

    funcionarioRef.on('value', handleData, (error) => {
      console.error('Erro ao obter dados do Firebase:', error.message);
    });

    return () => funcionarioRef.off('value', handleData);
  }, [funcionarioId]);

  const handleAtualizar = () => {
    const isAnyFieldEmpty = funcionario.some((campo) => !campo.valor);

    if (isAnyFieldEmpty) {
      setErrorModalVisible(true);
      return;
    }

    const atualizacaoFuncionario = {};
    funcionario.forEach(({ campo, valor }, index) => {
      atualizacaoFuncionario[index] = { campo, valor };
    });

    firebase.database().ref(`funcionarios/${funcionarioId}`).update(atualizacaoFuncionario)
      .then(() => {
        console.log('Funcionário atualizado com sucesso');
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('EdicaoFuncionario');
        }, 2400);
      })
      .catch((error) => console.error('Erro ao atualizar funcionário:', error));
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.buttonIcon}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Atualização de Cadastro</Text>

        {funcionario.map(({ campo, valor }, index) => (
          <View key={index} style={styles.camposContainer}>
            <Text style={styles.label}>{campo}</Text>
            {campo === 'Cpf' ? (
              <TextInputMask
                style={styles.maskedInput}
                type={'cpf'}
                options={{
                  mask: '999.999.999-99',
                }}
                value={valor}
                onChangeText={(novoValor) => {
                  const novoFuncionario = funcionario.map((c, i) =>
                    i === index ? { ...c, valor: novoValor } : c
                  );
                  setFuncionario(novoFuncionario);
                }}
              />
            ) : campo.includes('Celular') ? (
              <TextInputMask
                style={styles.maskedInput}
                type={'custom'}
                options={{
                  mask: '(99) 99999-9999',
                }}
                value={valor}
                onChangeText={(novoValor) => {
                  const novoFuncionario = funcionario.map((c, i) =>
                    i === index ? { ...c, valor: novoValor } : c
                  );
                  setFuncionario(novoFuncionario);
                }}
                keyboardType='numeric'
              />
            ) : campo.includes('Telefone') ? (
              <TextInputMask
                style={styles.maskedInput}
                type={'custom'}
                options={{
                  mask: '(99) 9999-9999',
                }}
                value={valor}
                onChangeText={(novoValor) => {
                  const novoFuncionario = funcionario.map((c, i) =>
                    i === index ? { ...c, valor: novoValor } : c
                  );
                  setFuncionario(novoFuncionario);
                }}
                keyboardType='numeric'
              />
            ) : campo === 'Data de Nascimento' ? (
              <TextInputMask
                style={styles.maskedInput}
                type={'datetime'}
                options={{
                  format: 'DD/MM/YYYY',
                }}
                value={valor}
                onChangeText={(novoValor) => {
                  const novoFuncionario = funcionario.map((c, i) =>
                    i === index ? { ...c, valor: novoValor } : c
                  );
                  setFuncionario(novoFuncionario);
                }}
              />
            ) : campo === 'Email' ? (
              <TextInput
                style={styles.input}
                value={valor}
                onChangeText={(novoValor) => {
                  const novoFuncionario = funcionario.map((c, i) =>
                    i === index ? { ...c, valor: novoValor } : c
                  );
                  setFuncionario(novoFuncionario);
                }}
                keyboardType='email-address'
                autoCapitalize='none'
              />
            ) : (
              <TextInput
                style={styles.input}
                value={valor}
                onChangeText={(novoValor) => {
                  const novoFuncionario = funcionario.map((c, i) =>
                    i === index ? { ...c, valor: novoValor } : c
                  );
                  setFuncionario(novoFuncionario);
                }}
                keyboardType='default'
              />
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleAtualizar}>
          <Text style={styles.buttonText}>Atualizar</Text>
        </TouchableOpacity>

        {/* Modal de Confirmação */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Atualização feita com sucesso!</Text>
            </View>
          </View>
        </Modal>

        {/* Modal de Erro (Campos em branco) */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={errorModalVisible}
          onRequestClose={() => {
            setErrorModalVisible(false);
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Por favor, preencha todos os campos</Text>
              <TouchableOpacity
                style={styles.buttonOK} // Defina a largura e altura desejadas
                onPress={() => setErrorModalVisible(false)}
                >
                 <Text style={styles.buttonTextOK}>OK</Text>
              </TouchableOpacity>
              
            </View>
         
            </View>
        </Modal>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  container: {
    padding: 16,
  },

  buttonIcon: {
    backgroundColor: '#238dd1',
    borderWidth: 1,
    borderColor: "#e3e3e3",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    padding: 2,
    marginTop: 2,
    position: "absolute",
    top: 30,
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 55,
    marginBottom: 10,
    textAlign: 'center',
  },

  camposContainer: {
    marginBottom: 16,
  },

  label: {
    fontSize: 18,
    marginBottom: 8,
  },

  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 10,
  },

  maskedInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#238dd1',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },

  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  buttonOK: {
    backgroundColor: '#238dd1',
    padding: 10,
    borderRadius: 5,
    marginTop: -10,
    width: 50, // Defina a largura desejada
    marginLeft:130
  },

  buttonTextOK: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});