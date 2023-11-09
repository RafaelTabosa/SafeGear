import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const firebaseConfig = {
  apiKey: "AIzaSyAUlLzng_p2B_TTsxoFwGQPfZfWvf41Ui0",
  authDomain: "safegear-7e6ac.firebaseapp.com",
  databaseURL: "https://safegear-7e6ac-default-rtdb.firebaseio.com/",
  projectId: "safegear-7e6ac",
  storageBucket: "safegear-7e6ac.appspot.com",
  messagingSenderId: "998569861476",
  appId: "1:998569861476:web:40533585da70e0fc755a71"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function Perfil() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [avatarSource, setAvatarSource] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      const { displayName, email } = user;
      if (displayName) {
        setName(displayName);
      }
      if (email) {
        setEmail(email);
      }

      // Verifique se há uma imagem de perfil no Firebase Storage associada a este usuário
      const storageRef = firebase.storage().ref(`profileImages/${user.uid}`);
      storageRef.getDownloadURL()
        .then((url) => {
          // A imagem existe, então atualize o estado com a URL
          setAvatarSource(url);
          setImageLoaded(true);
        })
        .catch((error) => {
          // Se não houver imagem de perfil, não faça nada
          setImageLoaded(true);
        });
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut();
      navigation.navigate('Welcome');
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProfile = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      user
        .updateProfile({
          displayName: name,
        })
        .then(() => {
          console.log('Nome atualizado com sucesso');
        })
        .catch((error) => {
          console.error('Erro ao atualizar o nome:', error);
        });

      setIsEditingName(false);
    }
  };

  const handleDeleteAccount = () => {
    const user = firebase.auth().currentUser;

    if (user) {
      user.delete().then(() => {
        console.log('Conta Excluída');
        navigation.navigate('Welcome');
      }).catch(error => {
        console.error(error);
      });
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permissão para acessar a câmera negada');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setAvatarSource(selectedImage.uri);

      // Salvar a imagem na galeria
      try {
        const asset = await MediaLibrary.createAssetAsync(selectedImage.uri);
        console.log('Imagem salva na galeria com ID:', asset.id);
      } catch (error) {
        console.error('Erro ao salvar a imagem na galeria:', error);
      }

      // Salvar a imagem no Firebase Storage
      const user = firebase.auth().currentUser;
      const storageRef = firebase.storage().ref(`profileImages/${user.uid}`);
      const response = await fetch(selectedImage.uri);
      const blob = await response.blob();

      try {
        await storageRef.put(blob);
        console.log('Imagem salva no Firebase Storage com sucesso');

        // Obter a URL da imagem após o upload bem-sucedido
        storageRef.getDownloadURL()
          .then((url) => {
            // Atualize a URL da imagem no Firestore associada ao usuário
            firebase.firestore().collection('users').doc(user.uid).set({
              profileImageURL: url,
            }, { merge: true });
          })
          .catch((error) => {
            console.error('Erro ao obter a URL da imagem:', error);
          });
      } catch (error) {
        console.error('Erro ao salvar a imagem no Firebase Storage:', error);
      }
    }
  };

  const handleRemoveProfilePhoto = () => {
    // Remova a foto do Firebase Storage
    const user = firebase.auth().currentUser;
    const storageRef = firebase.storage().ref(`profileImages/${user.uid}`);

    storageRef
      .delete()
      .then(() => {
        // Limpe a foto de perfil no estado
        setAvatarSource(null);
        console.log('Foto de perfil removida com sucesso');

        // Remova a URL da imagem do Firestore associada ao usuário
        firebase.firestore().collection('users').doc(user.uid).update({
          profileImageURL: firebase.firestore.FieldValue.delete(),
        });
      })
      .catch((error) => {
        console.error('Erro ao remover a foto de perfil:', error);
      });
  };

  const handleSelectProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permissão para acessar a galeria negada');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setAvatarSource(selectedImage.uri);

      // Salvar a imagem no Firebase Storage
      const user = firebase.auth().currentUser;
      const storageRef = firebase.storage().ref(`profileImages/${user.uid}`);
      const response = await fetch(selectedImage.uri);
      const blob = await response.blob();

      try {
        await storageRef.put(blob);
        console.log('Imagem salva no Firebase Storage com sucesso');

        // Obter a URL da imagem após o upload bem-sucedido
        storageRef.getDownloadURL()
          .then((url) => {
            // Atualize a URL da imagem no Firestore associada ao usuário
            firebase.firestore().collection('users').doc(user.uid).set({
              profileImageURL: url,
            }, { merge: true });
          })
          .catch((error) => {
            console.error('Erro ao obter a URL da imagem:', error);
          });
      } catch (error) {
        console.error('Erro ao salvar a imagem no Firebase Storage:', error);
      }
    }
  };
  // Função para exibir um alerta com as opções
  const showImagePickerOptions = () => {
    Alert.alert(
      'Escolha uma opção',
      'Deseja tirar uma nova foto ou escolher da galeria?',
      [
        {
          text: 'Tirar foto',
          onPress: handleTakePhoto,
        },
        {
          text: 'Escolher da galeria',
          onPress: handleSelectProfileImage,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      {imageLoaded && avatarSource ? (
        <TouchableOpacity onPress={showImagePickerOptions}>
          <Image source={{ uri: avatarSource }} style={styles.avatar} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={showImagePickerOptions}>
          <View style={styles.cameraIconContainer}>
            <Icon name="camera" size={30} color="#238dd1" style={styles.cameraIcon} />
          </View>
        </TouchableOpacity>
      )}
      {avatarSource && (
        <TouchableOpacity onPress={handleRemoveProfilePhoto} style={styles.buttonremover}>
          <Text style={styles.buttonText}>Remover Foto de Perfil</Text>
        </TouchableOpacity>
      )}
      <View>
        <View style={{ borderBottomWidth: 1, borderBottomColor: 'black', marginBottom: 30, marginTop: 20 }}></View>
        <Text style={styles.labelnome}>Nome</Text>
        {isEditingName ? (
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        ) : (
          <Text style={styles.text}> {name}</Text>
        )}
      </View>
      <View>
        <Text style={styles.labelemail}>Email</Text>
        {isEditingName ? (
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            editable={false}
          />
        ) : (
          <Text style={styles.text}>{email}</Text>
        )}
      </View>
      {isEditingName && (
        <TouchableOpacity onPress={handleUpdateProfile} style={styles.button}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      )}
      {!isEditingName && (
        <TouchableOpacity onPress={() => setIsEditingName(true)} style={styles.button}>
          <Text style={styles.buttonText}>Editar Informações</Text>
        </TouchableOpacity>
      )}
      <View style={{ borderBottomWidth: 1, borderBottomColor: 'black', marginBottom: 20, marginTop: 30 }}></View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={{ flexDirection: 'row' }}>
          <Icon name="trash" size={20} color="red" style={styles.icone} />
          <Text style={styles.botaoexcluir}>Excluir Conta Definitivamente</Text>
        </View>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Tem certeza de que deseja excluir permanentemente sua conta?</Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonSim]} onPress={() => {
                handleDeleteAccount();
                setModalVisible(false);
              }}>
                <Text style={styles.modalButtonText}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancelar]} onPress={() => setModalVisible(false)}>
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
    backgroundColor: '#FFF',
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  labelnome: {
    fontSize: 18,
    marginBottom: 4,
    marginTop: -20
  },

  labelemail: {
    fontSize: 18,
    marginBottom: 4,
    marginTop: 1
  },

  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },

  text: {
    fontSize: 18,
    marginBottom: 12,
  },

  button: {
    backgroundColor: '#238dd1',
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
    marginBottom: 10,
    textAlign: 'center',
  },

  modalButton: {
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },

  modalButtonSim: {
    backgroundColor: 'green',
    padding: 15,
  },

  modalButtonCancelar: {
    backgroundColor: 'red',
    padding: 15,
  },

  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  botaoexcluir: {
    fontSize: 18,
    marginTop: 20,
  },

  icone: {
    marginRight: 10,
    marginTop: 22,
    marginLeft: 70,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 75,
    marginBottom: 20,
    marginLeft: 100,
    marginTop: 10
  },

  cameraIconContainer: {
    position: 'relative',
  },

  cameraIcon: {
    marginTop: 20,
    marginLeft: 170
  },

  buttonremover: {
  backgroundColor: '#238dd1',
  borderRadius: 4,
  padding: 5,
  alignItems: 'center',
  marginLeft:60,
  marginRight:60
  },

});