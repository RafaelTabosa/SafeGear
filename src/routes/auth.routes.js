import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome'; // Certifique-se de instalar esta biblioteca
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import firebase from 'firebase'; 
import { StatusBar } from 'expo-status-bar';

import Welcome from '../pages/Welcome';
import Login from '../pages/Login';
import SignIn from '../pages/Sign in';
import ForgotPassword from '../pages/ForgotPassword';
import Início from '../pages/Início';
import Funcionários from '../pages/Funcionários';
import EPI from '../pages/EPI´s';
import Normas from '../pages/Normas';
import Logout from '../pages/Logout';
import CadastroFuncionario from '../pages/CadastroFuncionario';
import EdicaoFuncionario from '../pages/EdicaoFuncionario';
import VisualizarFunc from '../pages/VisualizarFunc';
import Perfil from '../pages/Perfil'; 
import EntregaEpis from '../pages/EntregaEpis';
import Lista from '../pages/Lista';
import ExcluiRegistro from '../pages/ExcluiRegistro';
import EditarEpis from '../pages/EditarEpis';
import Anotações from '../pages/Anotações';
import Notificações from '../pages/Notificações';
import Configurações from '../Configurações';



const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerItem = ({ label, onPress, icon }) => {
  // Mapeamento de estilos para itens específicos
  const itemStyles = {
    'Início': styles.drawerItemInicio,
    'Funcionários': styles.drawerItemFuncionarios,
    'E.P.I´s': styles.drawerItemEPI,
    'Normas': styles.drawerItemNormas,
    'Sair': styles.drawerItemSair,
  };

  return (
    
    <DrawerItem
      label={label}
      onPress={onPress}
      icon={({ color, size }) => (
        <Icon name={icon} color={color} size={size} />
      )}
      style={[styles.drawerItem, itemStyles[label]]}
      labelStyle={styles.drawerItemText}
    />
  );
};

const CustomDrawerContent = (props) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Lógica para obter as informações do usuário ao carregar o Drawer
    const user = firebase.auth().currentUser;
    if (user) {
      setUserName(user.displayName || 'Nome do Usuário');
      setUserEmail(user.email);
    }
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        {/* Ícone de usuário */}
        <Icon name="user" color="white" size={30} style={styles.drawerUserIcon} />
        <TouchableOpacity>
          <View style={styles.userInfo}>
            <Text
              style={[styles.drawerHeaderText, styles.linkText]}
              onPress={() => props.navigation.navigate('Perfil')}
              >
                
              {userName}
            </Text>
            <Text style={[styles.drawerSubHeaderText, styles.linkText]}>
              {userEmail}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('Perfil')}>
          <Icon name="chevron-down" color="white" size={13} style={styles.drawerDownIcon} />
        </TouchableOpacity>
      </View>
      <CustomDrawerItem
        label="Início"
        onPress={() => props.navigation.navigate('Início')}
        icon="home"
      />
      <CustomDrawerItem
        label="Funcionários"
        onPress={() => props.navigation.navigate('Funcionários')}
        icon="users"
      />
      <CustomDrawerItem
        label="E.P.I´s"
        onPress={() => props.navigation.navigate('EPI')}
        icon="shield"
      />
      <CustomDrawerItem
        label="Normas"
        onPress={() => props.navigation.navigate('Normas')}
        icon="book"
      />
      <CustomDrawerItem
        label="Sair"
        onPress={() => props.navigation.navigate('Logout')}
        icon="sign-out"
      />
    </DrawerContentScrollView>
  );
};

function HomeStack() {
  return (
    <Drawer.Navigator
      initialRouteName="Início"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Início" component={Início} />
      <Drawer.Screen name="Funcionários" component={Funcionários} />
      <Drawer.Screen name="EPI" component={EPI} />
      <Drawer.Screen name="Normas" component={Normas} />
      <Drawer.Screen name="Logout" component={Logout} />
       <Drawer.Screen name="Perfil">
        {props => <Perfil {...props} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CadastroFuncionario"
        component={CadastroFuncionario}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EdicaoFuncionario"
        component={EdicaoFuncionario}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VisualizarFunc"
        component={VisualizarFunc}
        options={{ headerShown: false }}
        
      />
      <Stack.Screen
        name="EntregaEpis"
        component={EntregaEpis}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Lista"
        component={Lista}
        options={{ headerShown: true}}
      />
      <Stack.Screen
        name="ExcluiRegistro"
        component={ExcluiRegistro}
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="EditarEpis"
        component={EditarEpis}
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="Anotações"
        component={Anotações}
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="Configurações"
        component={Configurações}
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="Notificações"
        component={Notificações}
        options={{ headerShown: false}}
      />
    </Stack.Navigator>
  );

}
const updateUserName = (newName) => {
  setUserName(newName);
};

const styles = StyleSheet.create({
  drawerHeader: {
    backgroundColor: '#238dd1',
    padding: 25,
    flexDirection: 'row', 
    alignItems: 'center', 
  },

  drawerHeaderText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 12,
  },

  drawerSubHeaderText: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 4,
    marginLeft: 12, // Espaço entre o ícone e o texto
    flexDirection: 'row', // Para alinhar o ícone de e-mail ao lado do texto
    alignItems: 'center', // Para centralizar verticalmente o ícone de e-mail
  },

  drawerItem: {
    marginVertical: 12,
  },

  drawerItemText: {
    marginLeft: 12,
  },

  drawerItemInicio: {
    marginLeft: 8,
  },

  drawerItemFuncionarios: {
    marginLeft: 6,
  },
  drawerItemEPI: {
    marginLeft: 15,
  },

  drawerItemNormas: {
    marginLeft: 10,
  },

  drawerItemSair: {
    marginLeft: 10,
  },

  drawerUserIcon: {
    marginLeft: - 10,
    marginRight: 15,
  },

  drawerDownIcon: {
    marginLeft: 13,
    marginTop: 25
  },

});