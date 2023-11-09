import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, ScrollView } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { Picker } from '@react-native-picker/picker';
import { TextInputMask } from 'react-native-masked-text';
import Firebase from 'firebase';
import { StatusBar } from 'expo-status-bar';

export default function EntregaEpis({ route }) {
  const [funcionarios, setFuncionarios] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dataEntrega, setDataEntrega] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [epis, setEpis] = useState([]); // Array para armazenar os EPIs adicionados
  const [codigoEPI, setCodigoEPI] = useState('');
  const [nomeEPI, setNomeEPI] = useState('');
  const [validadeCA, setValidadeCA] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [motivo, setMotivo] = useState('');
  const [previsaoSubstituicao, setPrevisaoSubstituicao] = useState('');
  const [showFormInfo, setShowFormInfo] = useState(false);
  const [showEmptyFieldsModal, setShowEmptyFieldsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [redirectToEPI, setRedirectToEPI] = useState(false);
  const [showEPISelectWarning, setShowEPISelectWarning] = useState(false);
  const [showInfoMissingWarning, setShowInfoMissingWarning] = useState(false);

  const handleSalvar = () => {
    if (epis.length === 0) {
      setShowEPISelectWarning(true);
      return;
    }

    if (!funcionarios || !dataEntrega) {
      setShowInfoMissingWarning(true);
      return;
    }

    const database = Firebase.database();
    const episRef = database.ref('Cadastro de Epis');

    const novoEPI = {
      funcionarios: funcionarios,
      dataEntrega: dataEntrega,
      epis: epis,
    };

    episRef.push(novoEPI).then(() => {
      setShowSuccessModal(true);

      setTimeout(() => {
        setRedirectToEPI(true);
      }, 3000);
    });

    setEpis([]);
    setCodigoEPI('');
    setNomeEPI('');
    setValidadeCA('');
    setQuantidade('');
    setMotivo('');
    setPrevisaoSubstituicao('');

    setFuncionarios('');
    setDataEntrega('');
  };

  const handleCadastro = () => {
    if (
      !codigoEPI ||
      !nomeEPI ||
      !validadeCA ||
      !quantidade ||
      !motivo ||
      !previsaoSubstituicao
    ) {
      setShowEmptyFieldsModal(true);
    } else {
      const novoEPI = {
        codigoEPI,
        nomeEPI,
        validadeCA,
        quantidade,
        motivo,
        previsaoSubstituicao,
      };
      setEpis([...epis, novoEPI]);
      setCodigoEPI('');
      setNomeEPI('');
      setValidadeCA('');
      setQuantidade('');
      setMotivo('');
      setPrevisaoSubstituicao('');
      setShowFormInfo(false);
    }
  }

  const navigation = useNavigation();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    const formattedDate = format(date, 'dd/MM/yyyy');
    setDataEntrega(formattedDate);
  };

  useEffect(() => {
    if (route.params && route.params.funcionarios) {
      setFuncionarios(route.params.funcionarios);
    }
  }, [route.params]);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const navigateToDesiredScreen = () => {
    navigation.navigate('Lista');
  };

  const motivoOptions = ['Entrega', 'Dano', 'Substituição', 'Perda'];

  useEffect(() => {
    if (redirectToEPI) {
      navigation.navigate('EPI');
    }
  }, [redirectToEPI, navigation]);

  return (
    <View style={styles.container}>
      <Modal
        visible={showEmptyFieldsModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer1}>
          <View style={styles.modalContent1}>
            <Text style={styles.text}>Preencha todos os campos</Text>
            <TouchableOpacity
              style={styles.buttonok1}
              onPress={() => setShowEmptyFieldsModal(false)}
            >
              <Text style={styles.buttonText1}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSuccessModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer1}>
          <View style={styles.modalContent1}>
            <Text style={styles.textEPI}>E.P.I CADASTRADO COM SUCESSO !</Text>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showEPISelectWarning}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer1}>
          <View style={styles.modalContent1}>
          <Text style={styles.text}>Selecione pelo menos 1 E.P.I</Text>
            <TouchableOpacity
              style={styles.buttonok1}
              onPress={() => setShowEPISelectWarning(false)}
            >
              <Text style={styles.buttonText1}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

  
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack('EntregaEpis')}
        >
          <Icon name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.buttonCad} onPress={handleSalvar}>
        <Text style={styles.buttonTextCad}>FINALIZAR CADASTRO</Text>
      </TouchableOpacity>

      <Text style={styles.labelText1}>Funcionário</Text>

      <View style={styles.inputField}>
        <TouchableOpacity onPress={navigateToDesiredScreen}>
          <TextInput
            value={funcionarios}
            onChangeText={(text) => setFuncionarios(text)}
            placeholder="Clique para selecionar funcionário"
            editable={false}
            style={styles.textInput}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.labelText2}>Data de Entrega</Text>
      <TextInput
        value={dataEntrega}
        placeholder="Clique para selecionar a data"
        onFocus={showDatePicker}
        style={styles.inputField}
      />

      {funcionarios && (
        <TouchableOpacity onPress={showModal}>
          <Text style={styles.buttonText}>Adicionar EPI</Text>
        </TouchableOpacity>
      )}

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={false}
      >
        <ScrollView style={styles.modalContainer}>
          <Text style={styles.text}>Código do EPI</Text>
          <TextInput
            style={styles.inputField}
            value={codigoEPI}
            onChangeText={(text) => setCodigoEPI(text)}
            keyboardType="numeric"
            placeholder="Digite o código do EPI"
          />

          <Text style={styles.text}>Nome do EPI</Text>
          <TextInput
            style={styles.inputField}
            value={nomeEPI}
            onChangeText={(text) => setNomeEPI(text)}
            placeholder="Digite o nome do EPI"
          />

          <Text style={styles.text}>Validade CA</Text>
          <TextInputMask
            style={styles.inputField}
            type={'datetime'}
            options={{
              format: 'DD/MM/YYYY', // Máscara de dia/mês/ano
            }}
            value={validadeCA}
            onChangeText={(text) => setValidadeCA(text)}
            keyboardType="numeric"
            placeholder="Digite a validade"
          />

          <Text style={styles.text}>Quantidade</Text>
          <TextInput
            style={styles.inputField}
            value={quantidade}
            onChangeText={(text) => setQuantidade(text)}
            keyboardType="numeric"
            placeholder="Digite a quantidade"
          />

          <Text style={styles.text}>Motivo</Text>
          <Picker
            selectedValue={motivo}
            style={styles.picker}
            onValueChange={(itemValue) => setMotivo(itemValue)}
          >
            <Picker.Item label="Escolha uma opção" value="" />
            {motivoOptions.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>

          <Text style={styles.text}>Previsão de Substituição</Text>
          <TextInputMask
            style={styles.inputField}
            type={'datetime'}
            options={{
              format: 'DD/MM/YYYY', // Máscara de dia/mês/ano
            }}
            value={previsaoSubstituicao}
            onChangeText={(text) => setPrevisaoSubstituicao(text)}
            keyboardType="numeric"
            placeholder="Digite a previsão"
          />

          <View style={styles.buttonContainerModal}>
            <TouchableOpacity style={styles.buttoncancelar} onPress={hideModal}>
              <Text style={styles.buttonText1}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonok} onPress={handleCadastro}>
              <Text style={styles.buttonText1}>OK</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      {showFormInfo && (
        <View style={styles.formInfoContainer}>
          <Text style={styles.text}>Código do EPI: {codigoEPI}</Text>
          <Text style={styles.text}>Nome do EPI: {nomeEPI}</Text>
          <Text style={styles.text}>Validade CA: {validadeCA}</Text>
          <Text style={styles.text}>Quantidade: {quantidade}</Text>
          <Text style={styles.text}>Motivo: {motivo}</Text>
          <Text style={styles.text}>Previsão de Substituição: {previsaoSubstituicao}</Text>
        </View>
      )}

      <Text style={styles.textepi}>E.P.I´s adicionados</Text>
      <FlatList
        data={epis}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.epiItem}>
            <Text style={styles.texttop}>EPI {index + 1}</Text>
            <Text style={styles.text1}>Código do EPI: {item.codigoEPI}</Text>
            <Text style={styles.text1}>Nome do EPI: {item.nomeEPI}</Text>
            <Text style={styles.text1}>Validade CA: {item.validadeCA}</Text>
            <Text style={styles.text1}>Quantidade: {item.quantidade}</Text>
            <Text style={styles.text1}>Motivo: {item.motivo}</Text>
            <Text style={styles.text1}>Previsão de Substituição: {item.previsaoSubstituicao}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'flex-start',
    padding: 20,
    maxWidth: 500, // Limita a largura máxima do conteúdo
    marginHorizontal: 'auto', // Centraliza o conteúdo horizontalmente
  },
  
  labelText1: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },

  labelText2: {
    fontSize: 20,
    marginBottom: 10,
    marginTop: 10,
  },

  inputField: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    width: 300,
    marginBottom: 20,
  },

  buttonContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
  },

  button: {
    backgroundColor: '#238dd1',
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    padding: 2,
    marginTop: 6,
  },
  
  buttonText1: {
    color: 'white',
    fontWeight: 'bold',
  },

  buttonText: {
    fontSize: 16,
    color: '#238dd1',
    marginTop: 5,
    marginLeft: 110,
  },

  textInput: {
    color: 'black',
    fontSize: 15,
  },

  modalContainer: {
    flex: 1,
    padding: 16,
  },

  text: {
    fontSize: 18,
    marginBottom: 10,
  },

  text1: {
    fontSize: 15,
    marginBottom: 10,
  },

  textepi: {
    fontSize: 20,
    marginLeft: 70,
    marginBottom: 10,
    marginTop: 20,
    fontWeight: 'bold',
  },

  texttop: {
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  picker: {
    width: 250,
    marginBottom: 10,
    marginTop: -5,
  },

  formInfoContainer: {
    marginTop: 20,
  },

  epiItem: {
    marginTop: 10,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 20,
  },

  buttonContainerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },

  buttonok: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },

  buttoncancelar: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },

  modalContainer1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent1: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonok1:{
    backgroundColor: '#238dd1',
    borderRadius: 5,
    padding: 10,
  },

  buttonCad:{
    backgroundColor:'#238dd1', // Cor do botão
    borderWidth:1,
    borderColor:"#e3e3e3",
    padding:8,
    marginLeft: 180,
    marginTop:-3
  },

  buttonTextCad:{ //Para botão cadastro
    color:"white",
    fontSize:12,
  },

  textEPI:{
    fontWeight: 'bold',
    fontSize:17
  }
};



