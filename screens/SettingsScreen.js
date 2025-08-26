import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { supabase } from '../lib/supabase';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

export default function SettingsScreen() {
  const isFocused = useIsFocused();
  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState('');

  const fetchUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();
      if (!error) {
        setUser(data);
      }
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchUser();
    }
  }, [isFocused]);

  const settingsOptions = [
    { icon: 'user', title: 'Conta', onPress: () => {} },
    { icon: 'shield', title: 'Privacidade', onPress: () => {} },
    { icon: 'bell', title: 'Notificações', onPress: () => {} },
    { icon: 'help-circle', title: 'Ajuda', onPress: () => {} },
    { icon: 'refresh-cw', title: 'Armazenamento e dados', onPress: () => {} },
    { icon: 'user-check', title: 'Acessibilidade', onPress: () => {} },
    { icon: 'heart', title: 'Convidar amigos', onPress: () => {} },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      {/* Barra de pesquisa */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar"
          placeholderTextColor="#666"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Perfil do usuário */}
      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <View style={styles.nicknameRow}>
              <Text style={styles.nickname}>{user?.nickname || 'nevasca 👋'}</Text>
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>2 INFO</Text>
              </View>
            </View>
            <Text style={styles.fullName}>{user?.name || 'Lucas Merini Flores'}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.editProfileButton}>
          <Icon name="edit-3" size={16} color="#FA774C" />
          <Text style={styles.editProfileText}>Editar Perfil</Text>
          <Icon name="chevron-right" size={16} color="#FA774C" />
        </TouchableOpacity>
      </View>

      {/* Opções de configuração */}
      <ScrollView style={styles.settingsList} showsVerticalScrollIndicator={false}>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.settingOption}
            onPress={option.onPress}
          >
            <View style={styles.settingLeft}>
              <View style={styles.settingIconContainer}>
                <Icon name={option.icon} size={20} color="#333" />
              </View>
              <Text style={styles.settingTitle}>{option.title}</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Botão de logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out" size={20} color="#FFF" />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 30,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  profileSection: {
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  nickname: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#FA774C',
    marginRight: 10,
  },
  infoBadge: {
    backgroundColor: '#FA774C',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  infoBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
  },
  fullName: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FA774C',
  },
  editProfileText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#FA774C',
    marginHorizontal: 8,
  },
  settingsList: {
    flex: 1,
  },
  settingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4757',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
    marginLeft: 8,
  },
});
