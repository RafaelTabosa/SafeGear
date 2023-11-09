import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import firebase from 'firebase';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAUlLzng_p2B_TTsxoFwGQPfZfWvf41Ui0",
  authDomain: "safegear-7e6ac.firebaseapp.com",
  databaseURL: "https://safegear-7e6ac-default-rtdb.firebaseio.com",
  projectId: "safegear-7e6ac",
  storageBucket: "safegear-7e6ac.appspot.com",
  messagingSenderId: "998569861476",
  appId: "1:998569861476:web:40533585da70e0fc755a71"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const MENSAGEM_CADASTRO_SUCESSO = 'Cadastro feito com sucesso';
const AVISO_CAMPOS_OBRIGATORIOS = 'Por favor, preencha todos os campos obrigatórios.';

export default function CadastroFuncionario() {
  const navigation = useNavigation();

  const [aviso, setAviso] = useState('');
  const [mensagem, setMensagem] = useState('');

  const [registro, setRegistro] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [celular, setCelular] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  const [setor, setSetor] = useState('');
  const [cargo, setCargo] = useState('');

  const [nomeContato, setNomeContato] = useState('');
  const [celularEmergencia, setCelularEmergencia] = useState('');
  const [telefoneEmergencia, setTelefoneEmergencia] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [camposComErro, setCamposComErro] = useState([]);

  const camposObrigatorios = [
    { campo: 'registro', valor: registro },
    { campo: 'nome', valor: nome },
    { campo: 'cpf', valor: cpf },
    { campo: 'dataNascimento', valor: dataNascimento },
    { campo: 'celular', valor: celular },

    { campo: 'setor', valor: setor },
    { campo: 'cargo', valor: cargo },

    { campo: 'nomeContato', valor: nomeContato },
    { campo: 'celularEmergencia', valor: celularEmergencia },
  ];

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

  const handleCadastro = async () => {
    const camposComErro = camposObrigatorios
      .filter((campo) => !campo.valor)
      .map((campo) => campo.campo);

    if (camposComErro.length > 0) {
      resetMensagens();
      setAvisoModal(AVISO_CAMPOS_OBRIGATORIOS);
      setModalVisible(true);
      setCamposComErro(camposComErro);
    } else {
      const registroEmUso = await verificarRegistroEmUso(registro);

      if (registroEmUso) {
        setAvisoModal('Número de registro já está sendo usado.');
        setModalVisible(true);
      } else {
        const funcionarioData = [
          { campo: 'Registro', valor: registro },
          { campo: 'Nome', valor: nome },
          { campo: 'Cpf', valor: cpf },
          { campo: 'Data Nascimento', valor: dataNascimento },
          { campo: 'Celular', valor: celular },
          { campo: 'Telefone', valor: telefone },
          { campo: 'Email', valor: email },

          { campo: 'Setor', valor: setor },
          { campo: 'Cargo', valor: cargo },

          { campo: 'Nome Contato', valor: nomeContato },
          { campo: 'Celular Emergência', valor: celularEmergencia },
          { campo: 'Telefone Emergência', valor: telefoneEmergencia },
        ];

        firebase
          .database()
          .ref('funcionarios')
          .push(funcionarioData)
          .then((snapshot) => {
            console.log('Cadastro realizado com sucesso!');

            // Fechar o modal
            setMensagemModal(MENSAGEM_CADASTRO_SUCESSO);

            // Limpar campos após o cadastro
            setRegistro('');
            setNome('');
            setCpf('');
            setDataNascimento('');
            setCelular('');
            setTelefone('');
            setEmail('');
            setSetor('');
            setCargo('');
            setNomeContato('');
            setCelularEmergencia('');
            setTelefoneEmergencia('');

            setTimeout(() => {
              setModalVisible(false);
              navigation.navigate('Funcionários');
            }, 1800);
          })
          .catch((error) => {
            console.error('Erro ao cadastrar:', error.message);
          });
      }
    }
  };

  const verificarRegistroEmUso = async (registro) => {
    const snapshot = await firebase.database().ref('funcionarios').orderByChild('Registro').equalTo(registro).once('value');
    return snapshot.exists();
  };

  return (
    <ScrollView style={styles.ScrollView}>
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack('CadastroFuncionario')}
          >
            <Icon name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.titulo}>Cadastro de Funcionário</Text>
      </View>
      <View style={styles.containerMeio}>
        <View style={styles.containerInterno}>

          <Text style={styles.subTitulosDivisao}>Informações Pessoais:</Text>
          <TextInput keyboardType="numeric" placeholder="Número de Registro." style={[styles.textInput, registro === '' && aviso !== '' && styles.requiredInput]} onChangeText={(text) => setRegistro(text)} value={registro} />
          <TextInput placeholder="Nome completo." style={[styles.textInput, registro === '' && aviso !== '' && styles.requiredInput]} autoCorrect={false} onChangeText={(text) => setNome(text)} value={nome} />

          <TextInputMask
            placeholder="CPF."
            keyboardType='numeric'
            type={'cpf'}
            options={{
              format: '999.999.999-99'
            }}
            style={[styles.textInput, registro === '' && aviso !== '' && styles.requiredInput]}
            onChangeText={(text) => setCpf(text)} value={cpf}

          />

          <TextInputMask
            type={'datetime'}
            options={{
              format: 'DD/MM/YYYY',
            }}
            placeholder="Data de nascimento."
            style={[styles.textInput, registro === '' && aviso !== '' && styles.requiredInput]}
            onChangeText={(text) => setDataNascimento(text)}
            value={dataNascimento}
          />

          <TextInputMask
            keyboardType='numeric'
            type={'custom'}
            options={{
              mask: '(99) 99999-9999',
            }}
            placeholder="Celular com DDD."
            style={[styles.textInput, registro === '' && aviso !== '' && styles.requiredInput]}
            onChangeText={(text) => setCelular(text)}
            value={celular}
          />

          <TextInputMask
            keyboardType='numeric'
            type={'custom'}
            options={{
              mask: '(99) 9999-9999',
            }}
            placeholder="Telefone fixo com DDD."
            style={styles.textInput}
            onChangeText={(text) => setTelefone(text)}
            value={telefone}
          />

          <TextInput
            keyboardType="email-address"
            placeholder="E-mail."
            style={styles.textInput}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(text) => setEmail(text)}
            value={email}
          />

          <Text style={styles.subTitulosDivisao}>Informação de Ocupação:</Text>
          <TextInput placeholder="Setor." style={[styles.textInput, registro === '' && aviso !== '' && styles.requiredInput]} autoCorrect={false} onChangeText={(text) => setSetor(text)} value={setor} />
          <TextInput placeholder="Cargo." style={[styles.textInput, registro === '' && aviso !== '' && styles.requiredInput]} autoCorrect={false} onChangeText={(text) => setCargo(text)} value={cargo} />

          <Text style={styles.subTitulosDivisaoEmergencia}>Contato de Emergência:</Text>

          <TextInput
            placeholder="Nome completo."
            style={[styles.textInput, registro === '' && aviso !== '' && styles.requiredInput]}
            autoCorrect={false}
            onChangeText={(text) => setNomeContato(text)}
            value={nomeContato}
          />

          <TextInputMask
            keyboardType='numeric'
            type={'custom'}
            options={{
              mask: '(99) 99999-9999',
            }}
            placeholder="Celular com DDD."
            style={[styles.textInput, registro === '' && aviso !== '' && styles.requiredInput]}
            onChangeText={(text) => setCelularEmergencia(text)}
            value={celularEmergencia}
          />

          <TextInputMask
            keyboardType='numeric'
            type={'custom'}
            options={{
              mask: '(99) 9999-9999',
            }}
            placeholder="Telefone fixo com DDD."
            style={styles.textInput}
            onChangeText={(text) => setTelefoneEmergencia(text)}
            value={telefoneEmergencia}
          />

        </View>
      </View>
      <View style={styles.container}>

        <View style={styles.buttonContainerEnviar}>

          <TouchableOpacity style={styles.buttonCad} onPress={handleCadastro}>
            <Text style={styles.buttonTextCad}>FINALIZAR CADASTRO</Text>
          </TouchableOpacity>

        </View>
      </View>
    </ScrollView>
  );
}

//Estilos

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 10,
  },

  containerMeio: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginLeft: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 2,  // Define a largura da borda para todas as bordas
    borderRadius: 5, // Define o raio para todas as bordas
    borderColor: "gray",
  },
  
  containerInterno:{
    width:"100%",
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:5,
    paddingRight:5,
  },

  textInput:{
    height:35,
    marginBottom:5,
    borderBottomWidth:1,
    fontSize:18,
    color:"#000000",
  },

  subTitulosDivisao:{
    backgroundColor:"#e3e3e3",
    paddingLeft:5,
    borderRadius:10,
    fontSize:20,
    color:"#5498ff",
    fontWeight:"bold",
  },
  
  subTitulosDivisaoEmergencia:{
    backgroundColor:"#e3e3e3",
    paddingLeft:5,
    borderRadius:10,
    fontSize:20,
    color:"#ff3333",
    fontWeight:"bold",
  },

  buttonContainer:{
    position: "absolute",
    top:10, // Ajuste a posição vertical do botão conforme necessário
    left:0, // Ajuste a posição horizontal do botão conforme necessário
  },

  button:{
    backgroundColor:'#238dd1', // Cor do botão
    borderWidth:1,
    borderColor:"#e3e3e3",
    borderTopRightRadius:5,
    borderBottomRightRadius:5,
    padding:2,
    marginTop: 6,
  },

  buttonCad:{
    backgroundColor:'#238dd1', // Cor do botão
    borderWidth:1,
    borderColor:"#e3e3e3",
    borderRadius:5,
    padding:2,
  },

  buttonText:{ //Para botão voltar
    color:"white",
    fontSize:15,
  },

  buttonContainerEnviar:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding:10,
  },

  buttonTextCad:{ //Para botão cadastro
    color:"white",
    fontSize:20,
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

  requiredInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
});