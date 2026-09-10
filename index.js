import React, { useState, useEffect } from 'react';
import { AppRegistry, View, Text, TouchableOpacity, StyleSheet, Alert, Animated, Vibration } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getDatabase, ref, push, onChildAdded, query, limitToLast } from 'firebase/database';

// google-services.json dosyasından alınan güncel Firebase konfigürasyonun
const firebaseConfig = {
  apiKey: "AIzaSyBK6spcarYy3VKA5wglur4p8QxgBAlFgVY",
  authDomain: "heartbeatecrn.firebaseapp.com",
  databaseURL: "https://heartbeatecrn-default-rtdb.firebaseio.com",
  projectId: "heartbeatecrn",
  storageBucket: "heartbeatecrn.firebasestorage.app",
  messagingSenderId: "113461843211",
  appId: "1:113461843211:android:dd73b49508afe904987e0e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// İkinizin telefonunun bağlanacağı ortak oda ID'si
const PAIR_ROOM_ID = "ridvan_kalp_odasi_2026";

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
        Alert.alert('Firebase Bağlantı Hatası', error.message);
      });
  }, []);

  const listenForHeartbeats = (myUid) => {
    const heartbeatsRef = ref(db, `rooms/${PAIR_ROOM_ID}/heartbeats`);
    const latestQuery = query(heartbeatsRef, limitToLast(1));

    onChildAdded(latestQuery, (snapshot) => {
      const data = snapshot.val();
      // Kalp atışı senin dışındaki diğer kullanıcıdan geldiğinde tetikle
      if (data && data.senderId !== myUid) {
        triggerHeartbeatEffects();
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

  const triggerHeartbeatEffects = () => {
    playHeartbeatAnimation();
    Vibration.vibrate([0, 150, 100, 150]);
  };

  const sendHeartbeat = async () => {
    if (!userId) {
      Alert.alert('Uyarı', 'Sunucuya bağlanılıyor, lütfen 2 saniye sonra tekrar basın.');
      return;
    }
    try {
      const heartbeatRef = ref(db, `rooms/${PAIR_ROOM_ID}/heartbeats`);
      await push(heartbeatRef, {
        senderId: userId,
        timestamp: Date.now()
      });
      triggerHeartbeatEffects();
    } catch (error) {
      Alert.alert('Gönderim Hatası', error.message);
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
      <Text style={styles.instruction}>Seni Özledim Kalbi</Text>
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
