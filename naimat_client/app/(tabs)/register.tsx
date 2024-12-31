import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeIn } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome';

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Dashboard: undefined;
};

type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/register', { name, email, password });
            if (response.status === 201) {
                // Navigate to login on successful registration
                navigation.navigate('Login');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ImageBackground source={require('@/assets/images/register.jpg')} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.title}>Register</Text>

                <Animated.View entering={FadeIn.duration(1000)}>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                        value={name}
                        onChangeText={setName}
                    />
                </Animated.View>

                <Animated.View entering={FadeIn.duration(1200)}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                        value={email}
                        onChangeText={setEmail}
                    />
                </Animated.View>

                <Animated.View entering={FadeIn.duration(1400)}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </Animated.View>

                <Animated.View entering={FadeIn.duration(1600)}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </Animated.View>

                <Animated.View entering={FadeIn.duration(1800)} style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleRegister} style={styles.button}>
                        <Icon name="user-plus" size={20} color="white" style={styles.icon} />
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>Already registered? Login here</Text>
                </TouchableOpacity>
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
    loginLink: {
        marginTop: 20,
        color: 'rgba(245, 173, 7, 0.85)',
        fontSize: 16,
        fontFamily: 'Poppins',
        textDecorationLine: 'underline',
    },
});

export default RegisterScreen;
