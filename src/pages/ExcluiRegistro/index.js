import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Button, StyleSheet } from 'react-native';
import Firebase from 'firebase';

export default function ExcluiRegistro({ navigation }) {
  const [epis, setEpis] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const database = Firebase.database();
    const episRef = database.ref('Cadastro de Epis');

    episRef.on('value', (snapshot) => {
      if (snapshot.exists()) {
        const episData = snapshot.val();
        const episArray = Object.keys(episData).map((key) => ({
          id: key,
          data: episData[key],
        }));
        setEpis(episArray);

        if (episArray.length > 0) {
          setSelectedItem(episArray[0]);
          setShowConfirmation(true);
        }
      }
    });
  }, []);

  const excluirRegistro = (registroId) => {
    const database = Firebase.database();
    const episRef = database.ref('Cadastro de Epis');

    episRef.child(registroId).remove()
      .then(() => {
        console.log('Registro excluído com sucesso');
        setShowConfirmation(false);
      })
      .catch((error) => {
        console.error('Erro ao excluir registro:', error);
      });
  };

  return (
    <View>
      <FlatList
        data={epis}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedItem(item);
              setShowConfirmation(true);
            }}
            style={styles.listItem}
          >
            <Text>{item.data.funcionarios}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={showConfirmation}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <Text style={styles.texttop}>Deseja Realmente Excluir este registro?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                excluirRegistro(selectedItem.id);
                navigation.navigate('EPI');
              }}
              style={[styles.button, styles.simButton]}
            >
              <Text style={styles.buttonText}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowConfirmation(false);
                navigation.navigate('EPI', { itemDeleted: true });
              }}
              style={[styles.button, styles.naoButton]}
            >
              <Text style={styles.buttonText}>Não</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  texttop: {
    fontSize: 18,
    marginTop: 50,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Espaçamento igual entre os botões
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  simButton: {
    backgroundColor: 'green', // Estilo para o botão "Sim"
  },
  naoButton: {
    backgroundColor: 'red',
    marginLeft:35 // Estilo para o botão "Não"
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
