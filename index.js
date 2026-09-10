import React, { useState, useEffect } from 'react';
import { AppRegistry, View, Text, TouchableOpacity, StyleSheet, Alert, Animated, Vibration } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getDatabase, ref, push, onValue } from 'firebase/database';

// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

function HeartBeatApp() {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    signInAnonymously(auth)
      .then((result) => {
        setUserId(result.user.uid);
        listenForHeartbeats(result.user.uid);
      })
      .catch((error) => {
        Alert.alert('Hata', error.message);
      });
  }, []);

  const listenForHeartbeats = (uid) => {
    const heartbeatsRef = ref(db, `users/${uid}/heartbeats`);
    onValue(heartbeatsRef, (snapshot) => {
      if (snapshot.exists()) {
        playHeartbeatAnimation();
        Vibration.vibrate([0, 100, 100, 100]);
      }
    });
  };

  const playHeartbeatAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const sendHeartbeat = async () => {
    if (!userId) {
      Alert.alert('Hata', 'Kullanıcı ID bulunamadı');
      return;
    }
    try {
      const heartbeatRef = ref(db, `users/${userId}/heartbeats`);
      await push(heartbeatRef, {
        timestamp: new Date().getTime(),
        message: 'Seni özledim! 💓'
      });
      playHeartbeatAnimation();
      Vibration.vibrate([0, 100, 100, 100]);
      Alert.alert('Başarılı', 'Kalp atışını gönderdim! 💓');
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HeartBeat 💓</Text>
      <Animated.View style={[styles.heartContainer, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity style={styles.heartButton} onPress={sendHeartbeat}>
          <Text style={styles.heartText}>❤️</Text>
        </TouchableOpacity>
      </Animated.View>
      <Text style={styles.instruction}>Özledimi Butonu</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5f7'
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 30
  },
  heartContainer: {
    marginBottom: 50
  },
  heartButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center'
  },
  heartText: {
    fontSize: 80
  },
  instruction: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600'
  }
});

AppRegistry.registerComponent('heartbeat', () => HeartBeatApp);
export default HeartBeatApp;
