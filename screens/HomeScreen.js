import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { supabase } from '../lib/supabase';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [activities, setActivities] = useState([]);

  // Busca nome do usuário
  useEffect(() => {
    async function fetchUserName() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('name')
          .eq('id', user.id)
          .single();

        if (error) {
          Alert.alert('Erro', error.message);
          return;
        }
        setUserName(data.name);
      }
    }
    fetchUserName();
  }, []);

  // Busca atividades do usuário
  const fetchActivities = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('due_date', { ascending: true });

    if (error) {
      Alert.alert('Erro', error.message);
      return;
    }
    setActivities(data);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Deletar tarefa
  async function handleDeleteTask(id) {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      Alert.alert('Tarefa removida!');
      fetchActivities();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.navigate('AddTask')}>
            <Icon name="plus-circle" size={28} color="#FA774C" style={{ marginRight: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Icon name="menu" size={28} color="#FA774C" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.greeting}>Olá, {userName}</Text>

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => handleDeleteTask(item.id)}
            style={[styles.activityCard, { backgroundColor: item.color || '#F2F2F2' }]}
          >
            <Text style={styles.activityText}>{item.title}</Text>
            <Text style={styles.subText}>Professor: {item.teacher}</Text>
            <Text style={styles.subText}>Entrega: {item.due_date}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  logo: { width: 60, height: 60, resizeMode: 'contain' },
  greeting: { fontSize: 22, color: '#FA774C', fontFamily: 'Poppins-Bold', marginBottom: 20 },
  activityCard: { padding: 20, borderRadius: 20, marginBottom: 15 },
  activityText: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#333' },
  subText: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#555' },
});
