import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { supabase } from '../lib/supabase';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

export default function CalendarScreen() {
  const isFocused = useIsFocused();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const fetchTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .eq('done', false)
        .order('due_date', { ascending: true });

      if (!error) {
        setTasks(data || []);
      }
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchTasks();
    }
  }, [isFocused]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Adicionar dias vazios no início
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Adicionar dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getTasksForDate = (day) => {
    if (!day) return [];
    
    // Formato da data no formato YYYY-MM-DD
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Também verificar formato DD/MM/YYYY que pode estar sendo usado
    const dateStrAlt = `${String(day).padStart(2, '0')}/${String(currentMonth.getMonth() + 1).padStart(2, '0')}/${currentMonth.getFullYear()}`;
    
    return tasks.filter(task => {
      // Verificar ambos os formatos
      return task.due_date === dateStr || task.due_date === dateStrAlt;
    });
  };

  const getDateColor = (day) => {
    const tasksForDate = getTasksForDate(day);
    if (tasksForDate.length === 0) return null;
    
    // Se há apenas uma tarefa, retorna a cor dela
    if (tasksForDate.length === 1) {
      return tasksForDate[0].color || '#F2F2F2';
    }
    
    // Se há múltiplas tarefas, retorna um array de cores
    return tasksForDate.map(task => task.color || '#F2F2F2');
  };

  const changeMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'next') {
        newMonth.setMonth(prev.getMonth() + 1);
      } else {
        newMonth.setMonth(prev.getMonth() - 1);
      }
      return newMonth;
    });
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Calendário <Text style={styles.yearText}>{currentMonth.getFullYear()}</Text>
        </Text>
      </View>

      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={() => changeMonth('prev')} style={styles.monthButton}>
          <Icon name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.monthText}>{months[currentMonth.getMonth()]}</Text>
        
        <TouchableOpacity onPress={() => changeMonth('next')} style={styles.monthButton}>
          <Icon name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.calendarContainer}>
        {/* Dias da semana */}
        <View style={styles.weekDaysRow}>
          {daysOfWeek.map((day, index) => (
            <View key={index} style={styles.weekDayCell}>
              <Text style={styles.weekDayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Dias do mês */}
        <View style={styles.daysGrid}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dayCell}
              onPress={() => day && setSelectedDate(day)}
              disabled={!day}
            >
              {day && (
                <>
                  <Text style={styles.dayText}>{day}</Text>
                  {getDateColor(day) && (
                    <View style={styles.taskIndicator}>
                      {Array.isArray(getDateColor(day)) ? (
                        // Múltiplas tarefas - cores empilhadas
                        getDateColor(day).slice(0, 3).map((color, colorIndex) => (
                          <View
                            key={colorIndex}
                            style={[
                              styles.multipleTaskColor,
                              { backgroundColor: color },
                              { marginBottom: colorIndex < 2 ? 2 : 0 }
                            ]}
                          />
                        ))
                      ) : (
                        // Uma tarefa - cor única
                        <View style={[styles.singleTaskColor, { backgroundColor: getDateColor(day) }]} />
                      )}
                    </View>
                  )}
                </>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Detalhes da data selecionada */}
      {selectedDate && (
        <View style={styles.selectedDateInfo}>
          <Text style={styles.selectedDateTitle}>
            {selectedDate} de {months[currentMonth.getMonth()]}
          </Text>
          {getTasksForDate(selectedDate).map((task, index) => (
            <View key={index} style={[styles.taskItem, { backgroundColor: task.color || '#F2F2F2' }]}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskSubject}>{task.subject}</Text>
              <Text style={styles.taskTeacher}>Professor: {task.teacher}</Text>
              <Text style={styles.taskRoom}>Sala {task.room}</Text>
            </View>
          ))}
        </View>
      )}
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
  yearText: {
    color: '#FA774C',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  monthButton: {
    padding: 10,
  },
  monthText: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  calendarContainer: {
    flex: 1,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  weekDayText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#666',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: (width - 60) / 7,
    height: (width - 60) / 7,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    position: 'relative',
  },
  dayText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    marginBottom: 4,
  },
  taskIndicator: {
    position: 'absolute',
    bottom: 8,
    alignItems: 'center',
  },
  singleTaskColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  multipleTaskColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  selectedDateInfo: {
    backgroundColor: '#F8F8F8',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 15,
  },
  taskItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 5,
  },
  taskSubject: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 3,
  },
  taskTeacher: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#555',
    marginBottom: 2,
  },
  taskRoom: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#555',
  },
});
