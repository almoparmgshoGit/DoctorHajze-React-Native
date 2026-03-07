import { auth } from "@/config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Header from '../Custom/Header';

const HomeScreen = () => {
    const [user, setUser] = useState('');

    const getUserFromStorage = async () => {
        try {
            const storedUser = await AsyncStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser.displayName || parsedUser.email || '');
            }
        } catch (e) {
            console.error("Failed to load user from storage", e);
        }
    };

    useEffect(() => {
        // 1. Check local storage first (Fastest)
        getUserFromStorage();

        // 2. Keep listening for Firebase changes (Sync)
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Auth State Changed:", currentUser ? currentUser.email : "No User");
            if (currentUser) {
                setUser(currentUser.displayName || currentUser.email || '');
            } else {
                setUser('');
            }
        });

        return () => unsubscribe();
    }, []);
    return (
        <View className="">
            <Header title="الرئيسية" />
            <Text className="text-xl font-medium text-text-muted text-center mt-4">
                مرحباً بك، {user ? user : 'أيها المستخدم'}
            </Text>

        </View>
    );
};



export default HomeScreen;
