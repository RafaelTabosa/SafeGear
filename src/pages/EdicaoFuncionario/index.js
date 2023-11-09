import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/Ionicons';

export default function EdicaoFuncionario({ route, navigation }) {
  // Obtenha o ID do funcionário da rota
  const [funcionario, setFuncionario] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { funcionarioId } = route.params || {};


  useEffect(() => {
    const funcionariosRef = firebase.database().ref('funcionarios');

    const handleData = (snapshot) => {
      const funcionariosData = snapshot.val();

      if (funcionariosData) {
        const funcionarioEncontrado = funcionariosData[funcionarioId];

        if (funcionarioEncontrado) {
          setFuncionario({
            id: funcionarioId,
            nome: funcionarioEncontrado['1'].valor,
            registro: funcionarioEncontrado['0'].valor,
            // Continue para outros campos conforme necessário
          });
      
        }
      } else {
        setFuncionario(null);
      }
    };

    funcionariosRef.on('value', handleData, (error) => {
      console.error('Erro ao obter dados do Firebase:', error.message);
    });

    return () => funcionariosRef.off('value', handleData);
  }, [funcionarioId]);

  const navigateToEdicao = (id) => {
    navigation.navigate('VisualizarFunc', { funcionarioId: id });
  };

  const handleRemover = () => {
    if (funcionario) {
      setModalVisible(true);
    }
  };

  const confirmarRemocao = () => {
    if (funcionario) {
      // Crie uma referência para o nó 'funcionarios' no seu banco de dados Firebase
      const funcionariosRef = firebase.database().ref('funcionarios');
  
      // Use o funcionarioId para remover o registro do funcionário
      funcionariosRef.child(funcionario.id).remove()
        .then(() => {
          console.log('Funcionário removido com sucesso');
          setModalVisible(false);
          navigation.goBack(); // Volte para a tela anterior após a remoção
        })
        .catch((error) => console.error('Erro ao remover funcionário:', error));
    }
  };

  const cancelarRemocao = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.buttonIcon}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.text}>Funcionário</Text>

      {funcionario ? (
        <View style={styles.funcionarioItem}>
          <Text style={styles.funcionarioRegistro}>{funcionario.registro}</Text>
          <Text style={styles.funcionarioNome}>{funcionario.nome}</Text>

          {/* Botões de Editar e Remover */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigateToEdicao(funcionario.id)}>
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonRemover]} onPress={handleRemover}>
              <Text style={styles.buttonText}>Remover</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={styles.errorText}>Funcionário não encontrado.</Text>
      )}

      {/* Modal de Confirmação */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Deseja realmente remover o funcionário?</Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonSim]} onPress={confirmarRemocao}>
                <Text style={styles.modalButtonText}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancelar]} onPress={cancelarRemocao}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
    position: 'absolute',
    left: 0,
  },

  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 10,
    textAlign: 'center',
  },

  funcionarioItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },

  funcionarioNome: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  funcionarioRegistro: {
    fontSize: 14,
    color: '#666',
  },

  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },

  button: {
    flex: 1,
    backgroundColor: '#238dd1',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },

  buttonRemover: {
    backgroundColor: 'red',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  buttonIcon: {
    backgroundColor: '#238dd1',
    borderWidth: 1,
    borderColor: "#e3e3e3",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    padding: 2,
    position: "absolute",
    top: 10,
    left: 0,
    marginTop: 6,
  },

  // Estilos do Modal
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
  },

  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
  },

  modalButtonSim: {
    backgroundColor: 'green',
  },

  modalButtonCancelar: {
    backgroundColor: 'red',
  },

  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
