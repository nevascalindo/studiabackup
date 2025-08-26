import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import HomeScreen from './HomeScreen';
import CalendarScreen from './CalendarScreen';
import SettingsScreen from './SettingsScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Atividades') {
            iconName = 'list';
          } else if (route.name === 'Calendário') {
            iconName = 'calendar';
          } else if (route.name === 'Configurações') {
            iconName = 'settings';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FA774C',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          paddingBottom: 10,
          paddingTop: 10,
          height: 80,
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Regular',
          fontSize: 12,
          marginTop: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Atividades" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Atividades',
        }}
      />
      <Tab.Screen 
        name="Calendário" 
        component={CalendarScreen}
        options={{
          tabBarLabel: 'Calendário',
        }}
      />
      <Tab.Screen 
        name="Configurações" 
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Configurações',
        }}
      />
    </Tab.Navigator>
  );
}
