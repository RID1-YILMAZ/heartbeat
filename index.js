import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [pulseCount, setPulseCount] = useState(72);

  useEffect(() => {
    // Uygulamanın çökmesini önlemek için güvenli başlatma bloğu
    try {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Başlatma hatası:", error);
      setLoading(false);
    }
  }, []);

  const handlePulse = () => {
    setPulseCount((prev) => prev + 1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0B0813" />
        <ActivityIndicator size="large" color="#A855F7" />
        <Text style={styles.loadingText}>HeartBeat Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0813" />
      
      {/* Üst Bar / Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HeartBeat</Text>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Canlı</Text>
        </View>
      </View>

      {/* Ana Kart / Gösterge Area */}
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>ANLIK NABIZ</Text>
          <View style={styles.bpmRow}>
            <Text style={styles.bpmNumber}>{pulseCount}</Text>
            <Text style={styles.bpmUnit}>BPM</Text>
          </View>
          <Text style={styles.cardSubtext}>Durum: Normal ve Stabil</Text>
        </View>

        {/* Etkileşim Butonu */}
        <TouchableOpacity 
          style={styles.primaryButton} 
          activeOpacity={0.8}
          onPress={handlePulse}
        >
          <Text style={styles.buttonText}>Nabız Simüle Et</Text>
        </TouchableOpacity>
      </View>

      {/* Alt Bilgi */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Instagram Dark Style • Mor & Siyah Tema</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0813', // Derin Instagram Siyahı
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0B0813',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#A855F7',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1F192F',
  },
  headerTitle: {
    color: '#F3E8FF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F192F',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  statusText: {
    color: '#E9D5FF',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#140E26', // Mor tonlu koyu kart
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E1A47',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  cardLabel: {
    color: '#9333EA',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  bpmRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 10,
  },
  bpmNumber: {
    color: '#FFFFFF',
    fontSize: 64,
    fontWeight: '800',
  },
  bpmUnit: {
    color: '#A855F7',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  cardSubtext: {
    color: '#A1A1AA',
    fontSize: 13,
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: '#7E22CE', // Instagram Mor Vurgusu
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#581C87',
    fontSize: 12,
  },
});
