import React, { useState } from 'react';
import { Image, ImageBackground, StyleSheet, View, Pressable, Text, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Link } from 'expo-router';


const { width } = Dimensions.get('window');
const logoSize = width * 0.7;
export default function HomeScreen() {
  return (
    <ImageBackground
      source={require('@/assets/images/home.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
        />
      </View>
      <View style={styles.container}>
        <ThemedText type="title" style={styles.heading}>
          Naimat
        </ThemedText>
        <View style={styles.buttonContainer}>
          <HoverableButton>
            <Link href="/" style={styles.link}>
              Request
            </Link>
          </HoverableButton>
          <HoverableButton>
            <Text style={styles.buttonText}>Donate</Text>
          </HoverableButton>
          <HoverableButton>
          <Link href="/login" style={styles.link}>
            Login/Register
            </Link>
          </HoverableButton>
        </View>
      </View>
    </ImageBackground>
  );
}


type HoverableButtonProps = {
  text: string;
  onPress: () => void;
};

function HoverableButton({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      style={[styles.button, hovered && styles.buttonHovered]}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
    flex: 1, // Take up available space to center the logo
    top: 50
  },
  logo: {
    width: logoSize,
    height: logoSize,
},
  container: {
    flex: 2, // Allow more space for content below the logo
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  heading: {
    fontSize: 32,
    fontFamily: 'Adelia',
    color: '#FFFFFF',
    marginBottom: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    flexGrow: 1,
    maxWidth: 300, // Limit the maximum size
    minWidth: 200, // Set a minimum size
    backgroundColor: 'rgba(245, 173, 7, 0.75)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
},
link: {
  textDecorationLine: 'none', // Removes underline
  color: 'rgba(0, 0, 0, 0.75)', // Matches button text
  fontSize: 18,
  fontFamily: 'Poppins',
  textAlign: 'center',
},
  buttonHovered: {
    backgroundColor: 'rgba(245, 173, 7, 1)', 
  },
  buttonText: {
    color: 'rgba(0, 0, 0, 0.75)',
    fontSize: 18,
    fontFamily: 'Poppins',
  },
  buttonTextHovered: {
    color: '#000000', 
  },
});
