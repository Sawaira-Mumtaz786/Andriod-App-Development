import React from 'react';
import { View, Image, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { artworks } from '../data/artworks';

export default function DetailScreen({ route, navigation }) {
  const { artwork } = route.params;

  // Get other artworks by the same artist (excluding current)
  const similarArtworks = artworks.filter(
    (item) => item.artist === artwork.artist && item.id !== artwork.id
  );

  const renderSimilar = ({ item }) => (
    <TouchableOpacity
      style={styles.similarCard}
      onPress={() => navigation.push('Detail', { artwork: item })}
    >
      <Image source={item.image} style={styles.similarImage} />
      <Text style={styles.similarTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image source={artwork.image} style={styles.image} />
      <Text style={styles.title}>{artwork.title}</Text>
      <Text style={styles.artist}>By {artwork.artist}</Text>
      <Text style={styles.description}>{artwork.description}</Text>

      {similarArtworks.length > 0 && (
        <View style={styles.similarSection}>
          <Text style={styles.similarLabel}>✨ More by {artwork.artist}:</Text>
          <FlatList
            data={similarArtworks}
            renderItem={renderSimilar}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.similarList}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  image: { width: '100%', height: 300, borderRadius: 20, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  artist: { fontSize: 18, color: '#555', marginBottom: 10 },
  description: { fontSize: 16, textAlign: 'center', color: '#333' },
  similarSection: { marginTop: 30 },
  similarLabel: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  similarList: { paddingVertical: 10 },
  similarCard: { marginRight: 15, width: 120, alignItems: 'center' },
  similarImage: { width: 100, height: 100, borderRadius: 10 },
  similarTitle: { fontSize: 12, textAlign: 'center', marginTop: 5 },
});