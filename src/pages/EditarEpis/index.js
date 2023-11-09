import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextInputMask } from 'react-native-masked-text';

const EditarEpis = ({ route, navigation }) => {
  const [editedData, setEditedData] = useState(route.params.selectedItem);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const database = Firebase.database();
  const episRef = database.ref('Cadastro de Epis');

  const validateForm = () => {
    const { funcionarios, dataEntrega, epis } = editedData;

    if (!funcionarios || !dataEntrega || !epis[0].codigoEPI || !epis[0].nomeEPI || !epis[0].validadeCA || !epis[0].quantidade || !epis[0].motivo || !epis[0].previsaoSubstituicao) {
      setErrorModalVisible(true);
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      const valoresAntigos = route.params.selectedItem;
      const novosValores = editedData;

      episRef.orderByChild('funcionarios').equalTo(valoresAntigos.funcionarios).once('value', (snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const key = childSnapshot.key;
            const dataToUpdate = { ...novosValores };
            delete dataToUpdate.key;

            episRef.child(key).update(dataToUpdate, (error) => {
              if (error) {
                console.error('Erro ao salvar os dados no Firebase:', error);
              } else {
                console.log('Dados salvos com sucesso no Firebase');
                setSuccessModalVisible(true);

                setTimeout(() => {
                  setSuccessModalVisible(false);
                  navigation.goBack();
                }, 3000);
              }
            });
          });
        } else {
          console.error('Registro não encontrado com o nome do funcionário:', valoresAntigos.funcionarios);
        }
      });
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>

        <TouchableOpacity
          style={styles.buttonIcon}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="white" />
        </TouchableOpacity>

        <Text style={styles.titulo}>Atualização de Cadastro</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Funcionário</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do Funcionário"
            value={editedData.funcionarios}
            onChangeText={(text) => setEditedData({ ...editedData, funcionarios: text })}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Data de Entrega</Text>
          <TextInputMask
            style={styles.input}
            type={'datetime'}
            options={{
              format: 'DD/MM/YYYY',
            }}
            value={editedData.dataEntrega}
            onChangeText={(text) => setEditedData({ ...editedData, dataEntrega: text })}
            keyboardType="numeric"
            placeholder="Data de Entrega"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Código do EPI</Text>
          <TextInput
            style={styles.input}
            placeholder="Código do EPI"
            value={editedData.epis[0].codigoEPI}
            onChangeText={(text) => setEditedData({ ...editedData, epis: [{ ...editedData.epis[0], codigoEPI: text }] })}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Nome do EPI</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do EPI"
            value={editedData.epis[0].nomeEPI}
            onChangeText={(text) => setEditedData({ ...editedData, epis: [{ ...editedData.epis[0], nomeEPI: text }] })}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Validade CA</Text>
          <TextInputMask
            style={styles.input}
            type={'datetime'}
            options={{
              format: 'DD/MM/YYYY',
            }}
            value={editedData.epis[0].validadeCA}
            onChangeText={(text) => setEditedData({ ...editedData, epis: [{ ...editedData.epis[0], validadeCA: text }] })}
            keyboardType="numeric"
            placeholder="Validade CA "
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Quantidade</Text>
          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            value={editedData.epis[0].quantidade}
            onChangeText={(text) => setEditedData({ ...editedData, epis: [{ ...editedData.epis[0], quantidade: text }] })}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Motivo</Text>
          <TextInput
            style={styles.input}
            placeholder="Motivo"
            value={editedData.epis[0].motivo}
            onChangeText={(text) => setEditedData({ ...editedData, epis: [{ ...editedData.epis[0], motivo: text }] })}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Previsão de Substituição:</Text>
          <TextInputMask
            style={styles.input}
            type={'datetime'}
            options={{
              format: 'DD/MM/YYYY',
            }}
            value={editedData.epis[0].previsaoSubstituicao}
            onChangeText={(text) => setEditedData({ ...editedData, epis: [{ ...editedData.epis[0], previsaoSubstituicao: text }] })}
            keyboardType="numeric"
            placeholder="Previsão de Substituição "
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Atualizar</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={errorModalVisible}
          onRequestClose={() => {
            setErrorModalVisible(false);
          }}
        >
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={successModalVisible}
          onRequestClose={() => {
            setSuccessModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Atualização feita com sucesso</Text>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  container: {
    padding: 16,
  },

  row: {
    marginBottom: 20,
  },

  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },

  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 55,
    marginBottom: 10,
    textAlign: 'center',
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

  label: {
    fontSize: 17,
    marginBottom: 8,
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

  buttonOK: {
    backgroundColor: '#238dd1',
    padding: 10,
    borderRadius: 5,
    marginTop: -10,
    width: 50, // Defina a largura desejada
    
  },

  buttonTextOK: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default EditarEpis;