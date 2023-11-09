import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useNavigation, useIsFocused } from '@react-navigation/native'; // Importe useIsFocused
import firebase from '../../services/firebaseConnection';

export default function Login() {
    const navigation = useNavigation();
    const isFocused = useIsFocused(); // Use useIsFocused para verificar se a tela está em foco

    const [input, setInput] = useState('');
    const [hidePass, setHidePass] = useState(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [aviso, setAviso] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    function handleLogin() {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log('Usuário logado com sucesso !');
                setEmail('');
                setPassword('');
                navigation.navigate('Home');
            })
            .catch(error => {
                console.log('Usuário e senha não identificados');
                setAviso('Usuário e senha não identificados');
                setModalVisible(true);
                
            });
    }

    // Use useEffect para limpar os campos quando a tela estiver em foco
    useEffect(() => {
        if (isFocused) {
            setEmail('');
            setPassword('');
        }
    }, [isFocused]);


    return (
        <KeyboardAvoidingView
            style={styles.container}
            >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                >
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                    setModalVisible(!modalVisible);
                    }}
                    >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>{aviso}</Text>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                setModalVisible(!modalVisible);
                                }}
                                >
                                <Text style={styles.modalButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Animatable.View animation="fadeInLeft" delay={900} style={styles.containerHeader}>
                    <Text style={styles.message}>Bem-vindo(a)</Text>
                </Animatable.View>

                <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                    <Text style={styles.title}>Email</Text>
                    <TextInput
                    placeholder="Digite um email..."
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    value={email}
                    onChangeText={ (text) => setEmail(text) }
                    style={styles.input}
                    
                    />

                
                    <Text style={styles.title}>Senha</Text>
                    <View style={styles.inputArea}>
                        <TextInput
                        placeholder="Informe sua senha..."
                        style={styles.input}
                       // value={input}
                      //onChangeText={ ( texto) => setInput(texto) }
                        secureTextEntry={hidePass}
                        value={password}
                        onChangeText={ ( texto) => setPassword(texto) }
                        />
                
                        <TouchableOpacity style={styles.icon} onPress={ () => setHidePass(!hidePass)}>
                        {hidePass ?
                            <Ionicons name="eye" color="#121212" size={25} />
                            :
                            <Ionicons name="eye-off" color="#121212" size={25} />
                        }
                        </TouchableOpacity>

                    </View>

                    <TouchableOpacity 
                        style={styles.button}
                        onPress={handleLogin}
                        >
                        <Text style={styles.buttonText}>Entrar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.buttonRegister}
                        onPress={ () => navigation.navigate('SignIn')}
                        >

                        <Text style={styles.registerText}>Não possui uma conta? Cadastre-se</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.buttonRegister}
                        onPress={ () => navigation.navigate('ForgotPassword')}
                        >
                        <Text style={styles.registerText}>Esqueci a senha</Text>
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
        width: '100%'
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