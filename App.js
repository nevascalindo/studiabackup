import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { supabase } from './lib/supabase';
import { ThemeProvider } from './theme/ThemeContext';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainTabNavigator from './screens/MainTabNavigator';
import AddTaskScreen from './screens/AddTaskScreen';
import EditTask from './screens/EditTask';
import EditProfileScreen from './screens/EditProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [initialRoute, setInitialRoute] = React.useState('Welcome');

  React.useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  React.useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setInitialRoute('Main');
      } else {
        setInitialRoute('Welcome');
      }
    }
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setInitialRoute(session ? 'Main' : 'Welcome');
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ headerShown: false }} />
            <Stack.Screen name="EditTask" component={EditTask} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
