import { logout } from '@/functions/Firebase';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Header = ({ title }) => {
    const navigation = useNavigation();
    return (
        <View className="p-4 bg-primary border-b border-gray-200 w-full h-20 mt-10 rounded-b-3xl justify-center items-center  ">
            <View className="flex-row justify-between items-center w-full">
                <Text className="text-2xl font-bold text-white  text-center">{title}</Text>
                <TouchableOpacity
                    className="w-10 h-10 bg-white rounded-full justify-center items-center shadow-sm"
                >
                    <Ionicons name="notifications" size={24} color="#2563eb" />
                </TouchableOpacity>
                <TouchableOpacity
                    className='bg-red-500 px-4 py-2 rounded-xl shadow-sm'
                    onPress={() => logout(navigation)}
                >
                    <Text className='text-white font-bold'>Logout</Text>
                </TouchableOpacity>
            </View>
        </View >
    );
};



export default Header;