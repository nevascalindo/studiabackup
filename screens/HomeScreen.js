import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function HomeScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  const fetchUserName = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('id', user.id)
        .single();
      if (!error) setUserName(data.name);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', (await supabase.auth.getUser()).data.user.id)
      .eq('done', false)
      .order('due_date', { ascending: true });

    if (error) {
      console.error(error);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserName();
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchTasks();
    }
  }, [isFocused]);

  const handleDeleteTask = async (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Deseja realmente excluir essa tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await supabase.from('activities').delete().eq('id', id);
            setOpenMenuId(null);
            fetchTasks();
          },
        },
      ]
    );
  };

  const handleCompleteTask = async (id) => {
    await supabase.from('activities').update({ done: true }).eq('id', id);
    setOpenMenuId(null);
    fetchTasks();
  };

  const handleEditTask = (task) => {
    setOpenMenuId(null);
    navigation.navigate('EditTask', { task });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../assets/loading.json')}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        <Text style={styles.loadingText}>Carregando suas tarefas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerMenuButton}>
          <Icon name="menu" size={24} color="#333" />
        </TouchableOpacity>
        
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        
        <TouchableOpacity 
          style={styles.addTaskButton}
          onPress={() => navigation.navigate('AddTask')}
        >
          <Icon name="plus" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <Text style={styles.greeting}>Olá, {userName}</Text>

      <View style={{ flex: 1 }}>
        {tasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <LottieView
              source={require('../assets/empty.json')}
              autoPlay
              loop
              style={{ width: 150, height: 150 }}
            />
            <Text style={styles.emptyText}>Nenhuma tarefa encontrada!</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('AddTask')}
            >
              <Text style={styles.addButtonText}>Adicionar nova tarefa</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
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
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 20 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20,
    position: 'relative',
    paddingTop: 20,
    height: 50
  },
  logo: { 
    width: 60, 
    height: 60, 
    resizeMode: 'contain',
    position: 'absolute',
    left: '50%',
    marginLeft: -30
  },
  greeting: { fontSize: 22, color: '#FA774C', fontFamily: 'Poppins-Bold', marginBottom: 20 },

  activityCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    position: 'relative',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  activityText: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#333' },
  subjectText: { fontSize: 14, fontFamily: 'Poppins-Bold', color: '#333', marginBottom: 5 },
  subText: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#555' },
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
  headerMenuButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 3,
    padding: 10,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 3,
    padding: 10,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTaskButton: {
    backgroundColor: '#FA774C',
    borderRadius: 20,
    elevation: 3,
    padding: 10,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingMenu: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 5,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  menuOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  menuOptionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#333',
  },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  loadingText: { fontSize: 16, fontFamily: 'Poppins-Regular', marginTop: 10, color: '#FA774C' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, fontFamily: 'Poppins-Regular', color: '#999', marginTop: 10, marginBottom: 20 },

  addButton: {
    backgroundColor: '#FA774C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
});
