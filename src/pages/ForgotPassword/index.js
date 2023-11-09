import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import firebase from '../../services/firebaseConnection';

export default function ForgotPassword() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const [aviso, setAviso] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [modalVisible, setModalVisible] = useState(false);


  const setAvisoModal = (aviso) => {
    setModalVisible(true);
    setAviso(aviso);
  };


  function handleResetPassword() {
    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
      setResetSent(true);
      setEmail('')
      
      setTimeout(() => {
        setModalVisible(true);
        navigation.navigate('Login'); 
      }, 5000);
    })
    
    .catch(error => {
      setAvisoModal('Digite um email válido');
      setModalVisible(true);
    });
    return;
  }

  return (
    <View style={styles.container}>
      <Modal   
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => { setModalVisible(false) }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
             {aviso ? (
              <>
              <Text style={styles.modalText}>{aviso}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => { setModalVisible(false) }}
                >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
              </>
              ) : null}
              {mensagem ? (
              <Text style={styles.modalTextmsg}>{mensagem}</Text>
              ) : null}
            </View>
          </View>
      </Modal>
      <Text style={styles.message}>Redefina sua senha</Text>

      <View style={styles.box}>
        <Text style={styles.headerText}>Digite seu e-mail para redefinir a senha:</Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
       
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetPassword}
          >
          <Text style={styles.resetButtonText}>ENVIAR E-MAIL DE REDEFINIÇÃO DE SENHA</Text>
        </TouchableOpacity>

        {resetSent && <Text style={styles.successText}>E-mail de redefinição de senha enviado com sucesso! Verifique sua caixa de Email.</Text>} 

      </View>
      
      <TouchableOpacity 
        style={styles.buttonRegister}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.registerText}>Lembrei minha senha</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    
  },

  box: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 20,
    backgroundColor: 'white',
    width: '80%',
  },

  headerText: {
    fontSize: 18,
    marginBottom: 10,
  },

  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    padding: 10,
  },
  
  resetButton: {
    backgroundColor: '#238dd1',
    padding: 10,
    borderRadius: 5,
   
  },

  resetButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    
  },

  successText: {
    color: 'green',
    marginTop: 10,
  },

  buttonRegister: {
    marginTop: 20,
  },

  registerText: {
    fontSize: 16,
    color: '#a1a1a1',
  },

  message:{
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: '10%',
    paddingStart: '1%',
  },

  containerAviso: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10, // Ajuste a posição conforme necessário
  },

  aviso: {
    color: 'red', // Cor do aviso
    fontSize: 16,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    marginBottom: 20,
  },

  modalTextmsg: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  modalButton: {
    backgroundColor: '#238dd1',
    borderRadius: 5,
    padding: 10,
  },

  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },

})
