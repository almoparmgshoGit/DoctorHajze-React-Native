import { auth } from "@/config/firebase";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Login from "../components/Auth/Login";
import BottomTabNavigator from "./BottomTabNavigator";
import { RootStackParamList } from "./types";


const Stack = createStackNavigator<RootStackParamList>();

export default function StackNavigator() {
    const [user, setUser] = useState<any>(undefined); // undefined = loading

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return unsubscribe;
    }, []);

    // Show loading while Firebase checks auth state
    if (user === undefined) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#5B8FB9" />
            </View>
        );
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName={user ? "MainTabs" : "Login"}
        >
            {user ? (
                <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            ) : (
                <Stack.Screen name="Login" component={Login} />
            )}
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
    },
});
