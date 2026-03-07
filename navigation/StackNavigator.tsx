import { createStackNavigator } from "@react-navigation/stack";
import React from 'react';
import Login from "../components/Auth/Login";
import BottomTabNavigator from "./BottomTabNavigator";
import { RootStackParamList } from "./types";


const Stack = createStackNavigator<RootStackParamList>();

export default function StackNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                headerStyle: { backgroundColor: '#ffffff' },
                headerTintColor: '#0f172a',
                headerTitleStyle: { fontWeight: 'bold' }
            }}
            initialRouteName="Login"
        >
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen name="Login" component={Login} />

        </Stack.Navigator>
    );
}
