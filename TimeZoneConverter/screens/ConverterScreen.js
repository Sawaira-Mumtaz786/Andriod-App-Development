import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { DateTime } from 'luxon';

const timeZones = [
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
];

export default function ConverterScreen() {
  const [fromZone, setFromZone] = useState('America/New_York');
  const [toZone, setToZone] = useState('Europe/London');
  const [inputTime, setInputTime] = useState('');
  const [convertedTime, setConvertedTime] = useState('');

  useEffect(() => {
    const now = DateTime.now().setZone(fromZone).toFormat('HH:mm');
    setInputTime(now);
  }, [fromZone]);

  const handleConvert = () => {
    if (!inputTime) {
      Alert.alert('Error', 'Please enter a time.');
      return;
    }
    try {
      const fromTime = DateTime.fromFormat(inputTime, 'HH:mm', { zone: fromZone });
      if (!fromTime.isValid) {
        Alert.alert('Error', 'Invalid time format. Use HH:mm (e.g., 14:30).');
        return;
      }
      const toTime = fromTime.setZone(toZone);
      setConvertedTime(toTime.toFormat('HH:mm'));
    } catch (e) {
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⏰ Time Zone Converter</Text>

      <Text style={styles.label}>From Zone:</Text>
      <Picker selectedValue={fromZone} onValueChange={setFromZone} style={styles.picker}>
        {timeZones.map((zone) => (
          <Picker.Item key={zone} label={zone} value={zone} />
        ))}
      </Picker>

      <Text style={styles.label}>Enter Time (HH:mm):</Text>
      <TextInput
        style={styles.input}
        value={inputTime}
        onChangeText={setInputTime}
        placeholder="e.g., 14:30"
        keyboardType="numbers-and-punctuation"
      />

      <Text style={styles.label}>To Zone:</Text>
      <Picker selectedValue={toZone} onValueChange={setToZone} style={styles.picker}>
        {timeZones.map((zone) => (
          <Picker.Item key={zone} label={zone} value={zone} />
        ))}
      </Picker>

      <Button title="Convert Time" onPress={handleConvert} color="#007AFF" />

      {convertedTime !== '' && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Converted Time:</Text>
          <Text style={styles.resultTime}>{convertedTime}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 10 },
  picker: { height: 50, width: '100%' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16, marginVertical: 5 },
  resultContainer: { marginTop: 30, alignItems: 'center', backgroundColor: '#f0f0f0', padding: 20, borderRadius: 10 },
  resultLabel: { fontSize: 18, fontWeight: '600' },
  resultTime: { fontSize: 36, fontWeight: 'bold', color: '#007AFF' },
});