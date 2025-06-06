import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase'; // caminho do seu arquivo supabase.js

export default function RegisterScreen() {
  const navigation = useNavigation();

  // estados para pegar os dados do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignUp() {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha email e senha');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    }, {
      data: { name } // opcional, dados extras do usuário
    });

    if (error) {
      Alert.alert('Erro ao cadastrar', error.message);
    } else {
      Alert.alert('Sucesso', 'Conta criada! Por favor, confirme seu email.');
      navigation.goBack();
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <Text style={styles.title}>Criar Conta</Text>

      <TextInput 
        placeholder="Nome"
        placeholderTextColor="#999"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput 
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput 
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 24,
    color: '#FA774C',
    marginBottom: 20,
    fontFamily: 'Poppins-Bold',
  },
  input: {
    backgroundColor: '#F2F2F2',
    padding: 15,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FA774C',
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  button: {
    backgroundColor: '#FA774C',
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  backText: {
    color: '#FA774C',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});
