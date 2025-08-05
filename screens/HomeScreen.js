import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { supabase } from '../lib/supabase';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [activities, setActivities] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    async function fetchUserName() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('name')
          .eq('id', user.id)
          .single();
        if (!error) setUserName(data.name);
      }
    }
    fetchUserName();
  }, []);

  const fetchActivities = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userData.user.id)
      .eq('done', false)
      .order('due_date', { ascending: true });
    if (!error) setActivities(data);
  };

  useEffect(() => { fetchActivities(); }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => { fetchActivities(); });
    return unsubscribe;
  }, [navigation]);

  const handleDeleteTask = async (id) => {
    await supabase.from('activities').delete().eq('id', id);
    setOpenMenuId(null);
    fetchActivities();
  };

  const handleCompleteTask = async (id) => {
    await supabase.from('activities').update({ done: true }).eq('id', id);
    setOpenMenuId(null);
    fetchActivities();
  };

  const handleEditTask = (item) => {
    Alert.alert('Editar tarefa', `Você clicou para editar: "${item.title}"`);
    setOpenMenuId(null);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.activityCard, { backgroundColor: item.color || '#F2F2F2' }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.activityText}>{item.title}</Text>
        <TouchableOpacity
          onPress={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
          style={styles.menuButton}
        >
          <Icon name="more-vertical" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subjectText}>{item.subject}</Text>
      <Text style={styles.subText}>Professor: {item.teacher}</Text>

      <View style={styles.cardFooterRow}>
        <Text style={styles.subText}>Entrega: {item.due_date}</Text>
        <Text style={styles.roomText}>Sala {item.room}</Text>
      </View>
      {openMenuId === item.id && (
        <View style={styles.floatingMenu}>
          <TouchableOpacity onPress={() => handleEditTask(item)} style={styles.menuOption}>
            <Text style={styles.menuOptionText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteTask(item.id)} style={styles.menuOption}>
            <Text style={[styles.menuOptionText, { color: 'red' }]}>Excluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

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
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  logo: { width: 60, height: 60, resizeMode: 'contain' },
  greeting: { fontSize: 22, color: '#FA774C', fontFamily: 'Poppins-Bold', marginBottom: 20 },
  activityCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    position: 'relative',
  },
  activityText: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#333' },
  subjectText: { fontSize: 14, fontFamily: 'Poppins-Bold', color: '#333', marginBottom: 5 },
  subText: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#555' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  cardFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  roomText: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#555' },

  checkButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 3,
    padding: 6,
  },
  menuButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 3,
    padding: 6,
  },
  floatingMenu: {
    position: 'absolute',
    top: 40,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 5,
    paddingVertical: 4,
  },
  menuOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  menuOptionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#333',
  },
});
