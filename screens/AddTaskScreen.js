import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

export default function AddTaskScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [teacher, setTeacher] = useState('');
  const [room, setRoom] = useState('');
  const [color, setColor] = useState('');

  const handleAddTask = async () => {
    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('activities')
      .insert([
        {
          user_id: userData.user.id,
          title,
          due_date: dueDate,
          teacher,
          room,
          color,
        },
      ]);

    if (error) {
      console.error(error);
      alert('Erro ao adicionar tarefa!');
    } else {
      alert('Tarefa adicionada!');
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Atividade</Text>

      <TextInput
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Data de Entrega"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
      />
      <TextInput
        placeholder="Professor"
        value={teacher}
        onChangeText={setTeacher}
        style={styles.input}
      />
      <TextInput
        placeholder="Sala"
        value={room}
        onChangeText={setRoom}
        style={styles.input}
      />
      <TextInput
        placeholder="Cor"
        value={color}
        onChangeText={setColor}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddTask}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 20 },
  title: { fontSize: 24, color: '#FA774C', fontFamily: 'Poppins-Bold', marginBottom: 20 },
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
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
});
