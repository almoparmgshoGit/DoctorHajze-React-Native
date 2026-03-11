import SettingsScreen from "@/components/Home/SettingsScreen";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Hojazaty from "../components/Home/Hojazaty";
import HomeScreen from "../components/Home/HomeScreen";
const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: "#FAFAFA",
                    borderTopWidth: 1,
                    borderTopColor: "#F0F0F0",
                    height: 62,
                    paddingBottom: 8,
                    elevation: 0,
                },
                tabBarActiveTintColor: "#5B8FB9",
                tabBarInactiveTintColor: "#CBD5E0",
                headerShown: false,
            }}
        >
            <Tab.Screen name="الرئيسية" options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} component={HomeScreen} />
            <Tab.Screen name="الحجوزاتي" options={{ tabBarIcon: ({ color, size }) => <FontAwesome6 name="user-doctor" size={size} color={color} /> }} component={Hojazaty} />
            <Tab.Screen name="الملف الشخصي" options={{ tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }} component={SettingsScreen} />
        </Tab.Navigator>
    );
}