import { BlurView } from 'expo-blur';
import React from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Divider, Portal, Text } from 'react-native-paper';
import { Wine } from '../../models/Wine';

type SuggestionModalProps = {
  visible: boolean;
  suggestedWine: Wine | null;
  name: string;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  scaleAnim: Animated.Value;
  onDismiss: () => void;
  onUseSuggestion: () => void;
};

export const SuggestionModal = ({
  visible,
  suggestedWine,
  name,
  fadeAnim,
  slideAnim,
  scaleAnim,
  onDismiss,
  onUseSuggestion,
}: SuggestionModalProps) => {
  if (!visible || !suggestedWine) {
    return null;
  }

  return (
    <Portal>
      {/* Fond (Backdrop) avec flou et assombrissement */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        <Pressable style={styles.backdropPressable} onPress={onDismiss} />
      </Animated.View>

      {/* Contenu du modal */}
      <View style={styles.modalPositioner} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <ScrollView contentContainerStyle={styles.modalContent}>
            {/* ... Collez ici tout le JSX de vos Cards ... */}
            <Card style={styles.infoCard}>
                {/* ... Card du nom ... */}
            </Card>
            {/* ... etc ... */}
            <View style={styles.modalButtonContainer} >
              <Button mode="outlined" onPress={onDismiss}>Annuler</Button>
              <Button mode="contained" onPress={onUseSuggestion}>Utiliser</Button>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Portal>
  );
};

// Mettez ici TOUS les styles liés au modal (backdrop, modalContainer, cards, etc.)
const styles = StyleSheet.create({
    backdropPressable: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      },
      modalPositioner: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContainer: {
        backgroundColor: '#d9d7d7ff',
        borderRadius: 16,
        maxHeight: '95%',
        width: '90%',
        overflow: 'hidden',
        elevation: 10,
      },
      // ... et tous les autres styles du modal
});