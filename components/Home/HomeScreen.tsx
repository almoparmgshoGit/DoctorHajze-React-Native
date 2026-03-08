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
                setUser(parsedUser.displayName || '');
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
            console.log("Auth State Changed:", currentUser ? currentUser.displayName : "No User");
            if (currentUser) {
                // Prioritize displayName, fallback to email
                setUser(currentUser.displayName || '');
            } else {
                setUser('');
            }
        });

        return () => unsubscribe();
    }, []);
    return (
        <View className="">
            <Header title="الرئيسية" />

            <View>
                <Text className="text-2xl font-bold text-text-muted ml-6  mt-6">الحجز القادم</Text>
                <View className="w-full px-4 items-center mt-7">
                    <View style={{ direction: 'rtl' }} className="w-full  px-4 py-2 justify-center text-text-main mt-4 bg-primary border border-border rounded-lg">
                        <Text className="text-white  font-bold text-xl">غدا</Text>
                        <Text className="text-white  font-bold text-xl">10:00 AM</Text>
                        <Text className="text-white  font-bold text-xl">عيادة الدكتور احمد</Text>
                        <Text className="text-white  font-bold text-xl">100 جنيه</Text>
                    </View>

                </View>
            </View>

        </View>
    );
};



export default HomeScreen;
