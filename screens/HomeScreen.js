import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { supabase } from '../lib/supabase';
import { Swipeable } from 'react-native-gesture-handler';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [activities, setActivities] = useState([]);

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

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchActivities();
    });
    return unsubscribe;
  }, [navigation]);

  const handleDeleteTask = async (id) => {
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (!error) fetchActivities();
  };

  const handleCompleteTask = async (id) => {
    const { error } = await supabase.from('activities').update({ done: true }).eq('id', id);
    if (!error) fetchActivities();
  };

  const renderItem = ({ item }) => {
    const renderLeftActions = () => (
      <TouchableOpacity style={styles.leftAction} onPress={() => handleDeleteTask(item.id)}>
        <Text style={styles.actionText}>Excluir</Text>
      </TouchableOpacity>
    );

    const renderRightActions = () => (
      <TouchableOpacity style={styles.rightAction} onPress={() => handleCompleteTask(item.id)}>
        <Text style={styles.actionText}>Concluir</Text>
      </TouchableOpacity>
    );

    return (
      <Swipeable
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
      >
        <View style={[styles.activityCard, { backgroundColor: item.color || '#F2F2F2' }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.activityText}>{item.title}</Text>
            <Text style={styles.subjectText}>{item.subject}</Text>
          </View>
          <Text style={styles.subText}>Professor: {item.teacher}</Text>
          <View style={styles.cardFooterRow}>
            <Text style={styles.subText}>Entrega: {item.due_date}</Text>
            <Text style={styles.roomText}>Sala {item.room}</Text>
          </View>
        </View>
      </Swipeable>
    );
  };

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
  },
  activityText: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#333' },
  subText: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#555', marginTop: 5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  subjectText: { fontSize: 14, fontFamily: 'Poppins-Bold', color: '#333' },
  cardFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  roomText: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#555' },
  leftAction: { backgroundColor: '#FA774C', justifyContent: 'center', flex: 1, paddingLeft: 20 },
  rightAction: { backgroundColor: '#4CAF50', justifyContent: 'center', flex: 1, paddingRight: 20, alignItems: 'flex-end' },
  actionText: { color: '#FFF', fontSize: 16, fontFamily: 'Poppins-Bold' },
});
