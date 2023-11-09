import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import firebase from '../../services/firebaseConnection';

export default function SignIn() {
  const [aviso, setAviso] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [senhaInvalida, setSenhaInvalida] = useState(false); // Estado para controlar a exibição da mensagem de erro da senha
  const [emailVazio, setEmailVazio] = useState(false); // Estado para controlar a exibição da mensagem de campo vazio do email
  const [nomeVazio, setNomeVazio] = useState(false); // Estado para controlar a exibição da mensagem de campo vazio do nome

  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [hidePass, setHidePass] = useState(true); // Estado para ocultar/mostrar a senha

  const MENSAGEM_CADASTRO_SUCESSO = 'Cadastro feito com sucesso';

  const setMensagemModal = (msg) => {
    setModalVisible(true);
    setMensagem(msg);
  };

  const setAvisoModal = (aviso) => {
    setModalVisible(true);
    setAviso(aviso);
  };

  const resetMensagens = () => {
    setAviso('');
    setMensagem('');
  };

  function handleSignIn() {
    // Verifica se o campo de nome e email estão vazios
    if (name.trim() === '' && email.trim() === '') {
      setNomeVazio(true);
      setEmailVazio(true);
      return;
    } else if (name.trim() === '') {
      setNomeVazio(true);
      return;
    } else if (email.trim() === '') {
      setEmailVazio(true);
      return;
    }

    // Verifica se a senha atende aos critérios
    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      setSenhaInvalida(true);
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Atualize o nome do usuário no Firebase
        userCredential.user.updateProfile({
          displayName: name,
        });

        setMensagemModal('Cadastro feito com sucesso');
        setEmail('');
        setPassword('');
        setName('');

        setTimeout(() => {
          setModalVisible(true);
          navigation.navigate('Login');
        }, 2000);
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('email já existe');
          setAvisoModal('Este email já está sendo usado');
          setModalVisible(true);
        }

        if (error.code === 'auth/invalid-email') {
          console.log('Email inválido');
          setAvisoModal('Digite um email válido');
          setModalVisible(true);
        }
      });
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {aviso ? (
                <>
                  <Text style={styles.modalText}>{aviso}</Text>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      setModalVisible(false);
                    }}
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

        <Animatable.View animation="fadeInLeft" delay={900} style={styles.containerHeader}>
          <Text style={styles.message}>Faça seu cadastro</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" style={styles.containerForm}>
          <Text style={styles.title}>Nome</Text>
          <TextInput
            placeholder="Digite seu nome..."
            value={name}
            onChangeText={(text) => {
              setName(text);
              setNomeVazio(false); // Limpa a mensagem de campo vazio ao digitar
            }}
            style={styles.input}
          />

          {nomeVazio && (
            <Text style={styles.aviso}>
              Campo vazio. Digite o nome.
            </Text>
          )}

          <Text style={styles.title}>Email</Text>
          <TextInput
            placeholder="Digite um email..."
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailVazio(false); // Limpa a mensagem de campo vazio ao digitar
            }}
            style={styles.input}
          />

          {emailVazio && (
            <Text style={styles.aviso}>
              Campo vazio. Digite um email válido.
            </Text>
          )}

          <Text style={styles.title}>Senha</Text>
          <View style={styles.inputArea}>
            <TextInput
              placeholder="Informe sua senha..."
              style={styles.input}
              secureTextEntry={hidePass} // Use o estado para ocultar/mostrar a senha
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
              style={styles.icon}
              onPress={() => setHidePass(!hidePass)} // Alternar a visibilidade da senha
            >
              {hidePass ? (
                <Ionicons name="eye" color="#121212" size={25} />
              ) : (
                <Ionicons name="eye-off" color="#121212" size={25} />
              )}
            </TouchableOpacity>
          </View>

          {senhaInvalida && (
            <Text style={styles.aviso}>
              A senha deve ter no mínimo 8 caracteres, incluindo letras e números.
            </Text>
          )}

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonRegister} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.registerText}>Já tenho uma conta</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#238dd1',
    },
    
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    
    inputArea:{
        flexDirection: 'row',
        width: '90%',
    },

    icon:{
        width: '100%',
        justifyContent: 'center',
        height: 60
    },

    containerHeader:{
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%',
    },

    message:{
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
    },

    containerForm:{
        backgroundColor: '#FFF',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    },

    input:{
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16,
        width: '100%',
    },

    title:{
        fontSize: 20,
        marginTop: 28, 
    },

    button:{
        backgroundColor: '#238dd1',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText:{
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },

    buttonRegister:{
        margin: 14,
        alignSelf: 'center',
    },

    registerText:{
        color: '#a1a1a1',
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