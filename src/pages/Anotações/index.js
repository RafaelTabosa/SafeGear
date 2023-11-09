import React, { useState, useEffect, useContext } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { AppContext } from '../context/AppContext'; 
import firebase from 'firebase/app';
import 'firebase/database';

const App = () => {
  const { colors } = useTheme();
  const { isDarkTheme, setIsDarkTheme } = useContext(AppContext);
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const db = firebase.database();

  const saveNotes = (updatedNotes) => {
    setNotes(updatedNotes);
  };

  const addOrUpdateNote = () => {
    if (text.trim() !== '') {
      if (selectedNoteIndex !== null) {
        const updatedNotes = [...notes];
        const now = new Date();
        const editedText = text + `\n\nEditado em: ${now.toLocaleString()}`;
        updatedNotes[selectedNoteIndex] = editedText;
        // Atualize o Firebase com a nota editada
        const noteKey = notesKeys[selectedNoteIndex];
        db.ref('notes/' + noteKey).set(editedText);
        saveNotes(updatedNotes);
        setSelectedNoteIndex(null);
      } else {
        const now = new Date();
        const noteText = text + `\n\nCriado em: ${now.toLocaleString()}`;
        const newNoteRef = db.ref('notes').push();
        newNoteRef.set(noteText);
        saveNotes([...notes, noteText]);
      }
      setText('');
      setIsModalVisible(false);
    }
  };

  const editNote = (index) => {
    setSelectedNoteIndex(index);
    setText(notes[index].split('\n\n')[0]);
    setIsModalVisible(true);
  };

  const confirmDeleteNote = (index) => {
    Alert.alert(
      'Excluir Nota',
      'Tem certeza de que deseja excluir esta nota?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: () => deleteNote(index),
        },
      ]
    );
  };

  const deleteNote = (index) => {
    const noteKey = notesKeys[index];
    // Remova a nota do Firebase
    db.ref('notes/' + noteKey).remove();
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    saveNotes(updatedNotes);
  };

  useEffect(() => {
    const notesRef = db.ref('notes');
    notesRef.on('value', (snapshot) => {
      if (snapshot.exists()) {
        const notesData = snapshot.val();
        const notesArray = Object.values(notesData);
        const keys = Object.keys(notesData);
        setNotes(notesArray);
        setNotesKeys(keys);
      }
    });
  }, []);

  const [notesKeys, setNotesKeys] = useState([]);

  return (
    <View style={[styles.container, {backgroundColor: colors.background }]}>
      <ScrollView style={styles.notesContainer}>
        {notes.map((note, index) => (
          <TouchableOpacity
            key={index}
            onLongPress={() => confirmDeleteNote(index)}
            onPress={() => editNote(index)}
            style={styles.noteContainer}
          >
            <View style={styles.note}>
              <Text>{note.split('\n\n')[0]}</Text>
              <Text style={styles.noteTimestamp}>
                {note.split('\n\n')[1]}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOuterContainer}>
          <View style={styles.modalInnerContainer}>
            <TextInput
              style={styles.input}
              placeholder="Digite sua anotação"
              onChangeText={(text) => setText(text)}
              value={text}
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Adicionar/Editar" onPress={addOrUpdateNote} />
              <Button title="Cancelar" onPress={() => setIsModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  notesContainer: {
    flex: 1,
    marginTop: 10,
  },
  noteContainer: {
    margin: 10,
    backgroundColor: 'white',
    elevation: 15,
    borderRadius: 8,
  },
  note: {
    padding: 10,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#238dd1',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
  },
  modalOuterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalInnerContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  noteTimestamp: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'right',
  },
});

export default App;

