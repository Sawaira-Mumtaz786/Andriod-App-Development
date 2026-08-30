import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

const initialProducts = [
  { id: '1', title: 'Wireless Earbuds', price: '2500', seller: 'Demo Store', description: 'Bluetooth 5.0, 20hr battery' },
  { id: '2', title: 'Desk Lamp', price: '1200', seller: 'Demo Store', description: 'Adjustable LED lamp' },
  { id: '3', title: 'Backpack', price: '1800', seller: 'Demo Store', description: 'Waterproof, laptop compartment' },
];

export default function App() {
  const [screen, setScreen] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Please enter an email and password.');
      return;
    }
    setUser({ email });
    setScreen('home');
  };

  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPassword('');
    setScreen('login');
  };

  const handleAddProduct = () => {
    if (!newTitle || !newPrice) {
      Alert.alert('Missing info', 'Please enter at least a title and price.');
      return;
    }
    const product = {
      id: Date.now().toString(),
      title: newTitle,
      price: newPrice,
      description: newDesc,
      seller: user.email,
    };
    setProducts([product, ...products]);
    setNewTitle('');
    setNewPrice('');
    setNewDesc('');
    Alert.alert('Success', 'Your product is now listed for sale.');
    setScreen('home');
  };

  const handleBuy = (product) => {
    setCart([...cart, product]);
    Alert.alert('Added to cart', `${product.title} added to your cart.`);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Cart empty', 'Add a product before checking out.');
      return;
    }
    setScreen('success');
  };

  const total = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);

  if (screen === 'login') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.logo}>🛍️ MarketPlace</Text>
          <Text style={styles.subtitle}>Buy and sell products securely</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
          <Text style={styles.note}>Demo login — any email and password will work.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'add') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.centered}>
          <Text style={styles.header}>Sell a Product</Text>
          <TextInput style={styles.input} placeholder="Product title" value={newTitle} onChangeText={setNewTitle} />
          <TextInput style={styles.input} placeholder="Price (Rs.)" value={newPrice} onChangeText={setNewPrice} keyboardType="numeric" />
          <TextInput style={[styles.input, { height: 80 }]} placeholder="Description" value={newDesc} onChangeText={setNewDesc} multiline />
          <TouchableOpacity style={styles.primaryButton} onPress={handleAddProduct}>
            <Text style={styles.buttonText}>List Product</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setScreen('home')}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'cart') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.header}>Your Cart</Text>
          <TouchableOpacity onPress={() => setScreen('home')}>
            <Text style={styles.link}>← Back</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={cart}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productPrice}>Rs. {item.price}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.note}>Your cart is empty.</Text>}
        />
        <Text style={styles.totalText}>Total: Rs. {total}</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={handleCheckout}>
          <Text style={styles.buttonText}>Checkout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (screen === 'success') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.logo}>✅</Text>
          <Text style={styles.header}>Payment Successful</Text>
          <Text style={styles.note}>(Simulated for this demo) Rs. {total} paid for {cart.length} item(s).</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => { setCart([]); setScreen('home'); }}>
            <Text style={styles.buttonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.header}>MarketPlace</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={() => setScreen('cart')}>
            <Text style={styles.link}>Cart ({cart.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.link}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.primaryButton} onPress={() => setScreen('add')}>
        <Text style={styles.buttonText}>+ Sell a Product</Text>
      </TouchableOpacity>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.productPrice}>Rs. {item.price}</Text>
            <Text style={styles.productDesc}>{item.description}</Text>
            <Text style={styles.productSeller}>Seller: {item.seller}</Text>
            <TouchableOpacity style={styles.buyButton} onPress={() => handleBuy(item)}>
              <Text style={styles.buttonText}>Buy</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA', paddingHorizontal: 16, paddingTop: 40 },
  centered: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  logo: { fontSize: 40, marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 12 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  link: { color: '#4C6EF5', fontWeight: '600' },
  input: { width: '100%', backgroundColor: '#fff', borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, marginBottom: 12 },
  primaryButton: { backgroundColor: '#4C6EF5', paddingVertical: 12, borderRadius: 8, alignItems: 'center', width: '100%', marginBottom: 12 },
  secondaryButton: { paddingVertical: 12, alignItems: 'center', width: '100%' },
  secondaryButtonText: { color: '#666' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  note: { fontSize: 12, color: '#888', marginTop: 8, textAlign: 'center' },
  productCard: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#EEE' },
  productTitle: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  productPrice: { fontSize: 15, color: '#4C6EF5', fontWeight: '600', marginTop: 2 },
  productDesc: { fontSize: 13, color: '#666', marginTop: 4 },
  productSeller: { fontSize: 12, color: '#999', marginTop: 4, marginBottom: 8 },
  buyButton: { backgroundColor: '#40C057', paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  totalText: { fontSize: 16, fontWeight: 'bold', marginVertical: 12, textAlign: 'right' },
});