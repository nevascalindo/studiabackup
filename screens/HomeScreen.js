import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const activities = [
  { id: '1', title: 'Estudar Matemática' },
  { id: '2', title: 'Ler capítulo de História' },
  { id: '3', title: 'Revisar Inglês' },
];

function HomeScreen() {
  const navigation = useNavigation();
  const userName = 'sora claudinha'; 

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
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

function CalendarScreen() {
  return (
    <View style={styles.center}>
      <Text>📅 Calendário</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.center}>
      <Text>👤 Perfil</Text>
    </View>
  );
}

export default function MainScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FA774C',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { backgroundColor: '#fff' },
      }}
    >
      <Tab.Screen
        name="Calendário"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="calendar" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="user" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  greeting: {
    fontSize: 22,
    color: '#FA774C',
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
  },
  activityCard: {
    backgroundColor: '#F2F2F2',
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
  },
  activityText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
