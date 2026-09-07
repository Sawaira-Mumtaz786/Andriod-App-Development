import React from 'react';
import { View, FlatList, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { artworks } from '../data/artworks';

export default function HomeScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detail', { artwork: item })}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.artist}>{item.artist}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={artworks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { padding: 10 },
  card: { flex: 1, margin: 8, backgroundColor: '#fff', borderRadius: 10, padding: 10, alignItems: 'center', elevation: 3 },
  image: { width: 130, height: 130, borderRadius: 10 },
  title: { fontSize: 14, fontWeight: 'bold', marginTop: 8 },
  artist: { fontSize: 12, color: '#666' },
});