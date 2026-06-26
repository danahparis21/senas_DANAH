// app/modal.tsx
import { Link, router } from 'expo-router';
import { StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  const handleExit = () => {
    // This properly dismisses the modal
    router.dismiss();
  };

  const handleStay = () => {
    // Just dismiss the modal without any action
    router.dismiss();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Exit Assessment?</ThemedText>
      <ThemedText style={styles.subtitle}>
        Are you sure you want to exit? Your progress will be saved.
      </ThemedText>

      <ThemedView style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.stayButton]}
          onPress={handleStay}
        >
          <ThemedText style={styles.stayButtonText}>Stay</ThemedText>
        </Pressable>

        <Pressable
          style={[styles.button, styles.exitButton]}
          onPress={handleExit}
        >
          <ThemedText style={styles.exitButtonText}>Exit</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  stayButton: {
    backgroundColor: '#E5E7EB',
  },
  stayButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
  exitButton: {
    backgroundColor: '#EF4444',
  },
  exitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});