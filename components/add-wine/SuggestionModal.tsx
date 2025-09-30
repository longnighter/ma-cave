import React from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
			<GestureHandlerRootView 
			style={StyleSheet.absoluteFill} pointerEvents="box-none"
			>
				<Animated.View style={[styles.animatedBackdrop, { opacity: fadeAnim }]}>
					{/* On utilise un Pressable pour pouvoir fermer le modal en cliquant sur le fond */}
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
									<Card.Content>
											<Text variant="titleLarge" style={styles.modalSubTitle}>
													{suggestedWine.name || name}
											</Text>
									</Card.Content>
							</Card>
							<Divider style={styles.divider} />
							
							<Card style={styles.infoCard}>
							<Card.Content>
									{suggestedWine.appellation && (
									<View style={styles.detailRow}>
											<Text variant="titleMedium" style={styles.detailLabel}>Appellation</Text>
											<Text variant="bodyLarge" >{suggestedWine.appellation}</Text>
									</View>
									)}
									{suggestedWine.region && (
									<View style={styles.detailRow}>
											<Text variant="titleMedium" style={styles.detailLabel}>Région</Text>
											<Text variant="bodyLarge">{suggestedWine.region}</Text>
									</View>
									)}
									{suggestedWine.year && (
									<View style={styles.detailRow}>
											<Text variant="titleMedium" style={styles.detailLabel}>Millésime</Text>
											<Text variant="bodyLarge">{suggestedWine.year}</Text>
									</View>
									)}
									{suggestedWine.grape && suggestedWine.grape.length > 0 && (
									<View style={styles.detailRow}>
											<Text variant="titleMedium" style={styles.detailLabel}>Cépage(s)</Text>
											<Text variant="bodyLarge">{suggestedWine.grape.join(', ')}</Text>
									</View>
									)}
									{suggestedWine.domain && (
									<View style={styles.detailRow}>
											<Text variant="titleMedium" style={styles.detailLabel}>Domaine</Text>
											<Text variant="bodyLarge">{suggestedWine.domain}</Text>
									</View>
									)}

									{suggestedWine.bestToDrink && suggestedWine.bestToDrink.length === 2 && (
									<View style={styles.detailRow}>
											<Text variant="titleMedium" style={styles.detailLabel}>Apogée</Text>
											<Text variant="bodyLarge">{suggestedWine.bestToDrink[0]} - {suggestedWine.bestToDrink[1]}</Text>
									</View>
									)}
							</Card.Content>
							</Card>

							<Divider style={styles.divider} />

							<Card style={styles.infoCard}>
							<Card.Content>
									{suggestedWine.tastingNotes && suggestedWine.tastingNotes.length > 0 && (
									<View style={styles.tastingNotesContainer}>
											<Text variant="titleMedium" >Notes de dégustation :</Text>
											<View style={styles.chipsContainer}>
											{suggestedWine.tastingNotes.map((note, index) => (
													<Chip key={index} style={styles.chip} textStyle={styles.chipText}>
													{note}
													</Chip>
											))}
											</View>
									</View>
									)}
							</Card.Content>
							</Card>
							<Card style={styles.infoCard}>
							<Card.Content>
									{suggestedWine.winePairing && suggestedWine.winePairing.length > 0 && (
									<View style={styles.tastingNotesContainer}>
											<Text variant="titleMedium" >Accords Mets & Vins :</Text>
											<View style={styles.chipsContainer}>
											{suggestedWine.winePairing.map((note, index) => (
													<Chip key={index} style={styles.chip} textStyle={styles.chipText}>
													{note}
													</Chip>
											))}
											</View>
									</View>
									)}
							</Card.Content>
							</Card>
							{/* ... etc ... */}
							<View style={styles.modalButtonContainer} >
									<Button                         
											style={[styles.modalButton]}
											mode="contained"
											contentStyle={styles.buttonContent}
											buttonColor='#6e0909ff'
											textColor='white'
											labelStyle={styles.modalButtonLabel}
											onPress={onDismiss}
									>
											Annuler
									</Button>
								<Button 
								mode="outlined"
								style={[styles.modalButton, styles.annulerModalButton]} 
								textColor="darkred" 
								contentStyle={styles.buttonContent}
								buttonColor='#d9d7d7ff'
								labelStyle={styles.modalButtonLabel}
								onPress={onUseSuggestion}
								>
									Utiliser
								</Button>
							</View>
						</ScrollView>
					</Animated.View>
				</View>
			</GestureHandlerRootView>						
		</Portal>			
  );
};

// Mettez ici TOUS les styles liés au modal (backdrop, modalContainer, cards, etc.)
const styles = StyleSheet.create({
	animatedBackdrop: {
    	...StyleSheet.absoluteFillObject,
    	backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark overlay
	},
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
			width: '90%', // On utilise une largeur en pourcentage pour s'adapter à tous les écrans
			overflow: 'hidden',
			elevation: 10, // Ombre sur Android
			shadowColor: '#000', // Ombre sur iOS
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.25,
			shadowRadius: 4,
	},
	modalContent: {
			paddingHorizontal: 24,
			paddingVertical: 20,
	},
	infoCard: {
			marginBottom: 5, // Espace entre les cartes
			marginTop:5,
			borderRadius: 12,
			elevation: 3, // Ombre légère pour effet de bulle
			paddingTop:0,
			paddingBottom:0
	},
	modalButtonContainer: {
			flexDirection: "row",
			justifyContent: "space-around", // Distribue l'espace entre les boutons
			marginTop: 15,
			paddingTop: 20,
			borderTopWidth: 1, // Une petite bordure pour séparer les boutons du contenu
			borderTopColor: '#eee',
	},
	modalSubTitle: {
			textAlign: 'center',
			color: '#555',
			marginBottom: 10,
			marginTop: 10,
			fontWeight: "bold",
			verticalAlign:"middle"
	},
	modalButtonLabel:{
			fontSize:20
	}, 
	modalButton:{
			borderRadius:15,
			flex:1,
			marginHorizontal: 10,
			padding:0
	},
	buttonContent:{
			paddingVertical: 5
	},
		tastingNotesContainer: {
	marginTop: 0,
	paddingTop:0
	},
	chipsContainer: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			marginTop: 8,
	},
	chip: {
			marginRight: 6,
			marginBottom: 6,
			backgroundColor: '#6e09092a', // Couleur de fond du chip
	},
	chipText: {
			fontSize: 13,
	},
	divider: {
			marginVertical: 10,
			height: 1.5,
	},
	detailRow: {
			flexDirection: 'row',
			alignItems: 'baseline', // Aligne les labels et les valeurs
			marginBottom: 10,
			borderBottomWidth: 2, // Une fine ligne de séparation pour chaque attribut
			borderBottomColor: '#eee',
	},
	detailLabel: {
			fontWeight: 'bold',
			marginRight: 8,
			color: '#111',
			width: 100
	},
	detailValue: {
			fontSize: 16,
			color: '#444',
			//flex: 2
	},
	annulerModalButton: {
			marginHorizontal: 5,
			borderColor: '#6e0909ff',
			borderWidth: 2.5,
	},
    // ... et tous les autres styles du modal
});