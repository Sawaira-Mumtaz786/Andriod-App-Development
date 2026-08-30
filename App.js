import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import * as Notifications from 'expo-notifications';

// ---------- SAMPLE EVENTS ----------
const initialEvents = [
  {
    id: '1',
    name: 'Tech Fest 2026',
    date: 'March 15, 2026',
    time: '10:00 AM',
    location: 'Main Auditorium',
  },
  {
    id: '2',
    name: 'Career Fair',
    date: 'March 20, 2026',
    time: '9:00 AM',
    location: 'Student Center',
  },
  {
    id: '3',
    name: 'Sports Day',
    date: 'March 25, 2026',
    time: '8:00 AM',
    location: 'Sports Ground',
  },
  {
    id: '4',
    name: 'Hackathon 2026',
    date: 'April 5, 2026',
    time: '9:00 AM',
    location: 'Computer Science Lab',
  },
];

// ---------- NOTIFICATION HANDLER ----------
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ---------- MAIN APP ----------
export default function App() {
  // State for events list
  const [events, setEvents] = useState(initialEvents);

  // State for adding new event
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLocation, setNewLocation] = useState('');

  // Request notification permission when app loads
  useEffect(() => {
    async function requestPermission() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow notifications to receive event alerts.'
        );
      }
    }
    requestPermission();
  }, []);

  // ---------- SCHEDULE REMINDER (10 seconds from now for demo) ----------
  const scheduleReminder = async (eventName) => {
    const triggerDate = new Date();
   triggerDate.setSeconds(triggerDate.getSeconds() + 5); // 5 seconds later
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Event Reminder!',
        body: `Reminder: "${eventName}" is starting soon!`,
        sound: 'default',
      },
      trigger: {
        date: triggerDate,
      },
    });

    Alert.alert(
      '✅ Reminder Set!',
      `You will receive a reminder for "${eventName}" in 10 seconds.`
    );
  };

  // ---------- ADD NEW EVENT ----------
  const addEvent = () => {
    if (!newName || !newDate || !newTime || !newLocation) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const newEvent = {
      id: String(Date.now()), // unique ID
      name: newName,
      date: newDate,
      time: newTime,
      location: newLocation,
    };

    setEvents([...events, newEvent]);

    // Clear form
    setNewName('');
    setNewDate('');
    setNewTime('');
    setNewLocation('');

    Alert.alert('✅ Event Added!', `"${newName}" has been added to the list.`);
  };

  // ---------- DELETE EVENT ----------
  const deleteEvent = (id) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedEvents = events.filter((event) => event.id !== id);
            setEvents(updatedEvents);
            Alert.alert('🗑️ Deleted', 'Event has been removed.');
          },
        },
      ]
    );
  };

  // ---------- RENDER EACH EVENT CARD ----------
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.eventName}>{item.name}</Text>
      <Text style={styles.detail}>📅 {item.date} at {item.time}</Text>
      <Text style={styles.detail}>📍 {item.location}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.alertButton]}
          onPress={() => scheduleReminder(item.name)}
        >
          <Text style={styles.buttonText}>🔔 Alert Me</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => deleteEvent(item.id)}
        >
          <Text style={styles.buttonText}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ---------- UI RENDER ----------
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🏫 Campus Events</Text>

      {/* ADD EVENT FORM */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>➕ Add New Event</Text>
        <TextInput
          style={styles.input}
          placeholder="Event Name"
          value={newName}
          onChangeText={setNewName}
        />
        <TextInput
          style={styles.input}
          placeholder="Date (e.g., April 10, 2026)"
          value={newDate}
          onChangeText={setNewDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Time (e.g., 10:00 AM)"
          value={newTime}
          onChangeText={setNewTime}
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={newLocation}
          onChangeText={setNewLocation}
        />
        <TouchableOpacity style={styles.addButton} onPress={addEvent}>
          <Text style={styles.addButtonText}>➕ Add Event</Text>
        </TouchableOpacity>
      </View>

      {/* EVENT LIST */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        scrollEnabled={false} // because we are inside ScrollView
      />

      <Text style={styles.footer}>Total Events: {events.length}</Text>
    </ScrollView>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2980b9',
  },
  detail: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  alertButton: {
    backgroundColor: '#3498db',
    marginRight: 6,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    marginLeft: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  footer: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: 14,
    marginBottom: 30,
  },
});