import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Enterprise <Text style={styles.titleHighlight}>Workforce</Text> Hub
          </Text>
          <Text style={styles.subtitle}>
            Internal portal for employee management, analytics, and operational tracking. Please select your designated access level.
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {/* Employee Card */}
          <TouchableOpacity style={styles.card} activeOpacity={0.8}>
            <View style={styles.cardTopIndicatorEmployee} />
            <View style={[styles.iconContainer, styles.iconContainerEmployee]}>
              <Feather name="users" size={32} color="#007bff" />
            </View>
            <Text style={styles.cardTitle}>Employee Portal</Text>
            <Text style={styles.cardDescription}>
              Access your personal dashboard to view schedules, submit leave requests, and track your performance metrics securely.
            </Text>
            <View style={styles.cardFooter}>
              <Text style={[styles.cardFooterText, { color: '#007bff' }]}>Continue to Login</Text>
              <Feather name="arrow-right" size={20} color="#007bff" />
            </View>
          </TouchableOpacity>

          {/* Management Card */}
          <TouchableOpacity style={[styles.card, { marginTop: 24 }]} activeOpacity={0.8}>
            <View style={styles.cardTopIndicatorManagement} />
            <View style={[styles.iconContainer, styles.iconContainerManagement]}>
              <Feather name="shield" size={32} color="#4f46e5" />
            </View>
            <Text style={styles.cardTitle}>Management Portal</Text>
            <Text style={styles.cardDescription}>
              Management login is strictly for the company management team to oversee operations, approve requests, and manage personnel.
            </Text>
            <View style={styles.cardFooter}>
              <Text style={[styles.cardFooterText, { color: '#4f46e5' }]}>Continue to Login</Text>
              <Feather name="arrow-right" size={20} color="#4f46e5" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} COMPANY INTERNAL PROJECT.{"\n"}SECURE CONNECTION ESTABLISHED.
          </Text>
        </View>
        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
    maxWidth: 400,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 16,
  },
  titleHighlight: {
    color: '#007bff',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  cardsContainer: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  cardTopIndicatorEmployee: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#007bff',
  },
  cardTopIndicatorManagement: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#4f46e5',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainerEmployee: {
    backgroundColor: '#eff6ff',
  },
  iconContainerManagement: {
    backgroundColor: '#eef2ff',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 24,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardFooterText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  footer: {
    marginTop: 40,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 18,
  }
});
