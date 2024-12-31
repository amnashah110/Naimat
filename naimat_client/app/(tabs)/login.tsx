import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import axios from 'axios';
import Animated, { FadeIn } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Link } from 'expo-router'; // Correct routing library for Expo Router

const HoverableButton = ({ children, style }: { children: React.ReactNode; style?: object }) => {
    return (
        <TouchableOpacity style={style}>
            {children}
        </TouchableOpacity>
    );
};

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8080/login', { email, password });
            if (response.data.token) {
                console.log('Login successful:', response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ImageBackground source={require('@/assets/images/login.jpg')} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.title}>Login</Text>

                <Animated.View entering={FadeIn.duration(1000)}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                        value={email}
                        onChangeText={setEmail}
                    />
                </Animated.View>

                <Animated.View entering={FadeIn.duration(1200)}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </Animated.View>

                <Animated.View entering={FadeIn.duration(1600)} style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleLogin} style={styles.button}>
                        <Icon name="sign-in" size={20} color="white" style={styles.icon} />
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </Animated.View>

                <HoverableButton style={styles.linkButton}>
                    <Link href="/register" style={styles.link}>
                        Not registered yet? Sign up here
                    </Link>
                </HoverableButton>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    container: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 10,
        padding: 30,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        color: 'white',
        marginBottom: 20,
        fontFamily: 'Poppins',
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: 'rgba(50, 50, 50, 0.7)',
        width: '100%',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        color: 'white',
        fontFamily: 'Poppins',
    },
    buttonContainer: {
        backgroundColor: 'rgba(245, 173, 7, 0.75)',
        paddingVertical: 12,
        borderRadius: 16,
        alignItems: 'center',
        width: '100%',
        maxWidth: 300,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Poppins',
        marginLeft: 10,
    },
    icon: {
        marginRight: 10,
    },
    linkButton: {
        marginTop: 20,
    },
    link: {
        color: 'rgba(245, 173, 7, 0.85)',
        fontSize: 16,
        fontFamily: 'Poppins',
        textDecorationLine: 'underline',
    },
    hoveredButton: {
        backgroundColor: 'rgba(245, 173, 7, 0.5)',
    },
});

export default LoginScreen;
