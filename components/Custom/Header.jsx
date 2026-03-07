import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
const Header = ({ title }) => {
    return (
        <View className="p-4 bg-primary border-b border-gray-200 w-full h-20 mt-10 rounded-b-3xl justify-center items-center  ">
            <View className="flex-row justify-between items-center w-full">
                <Text className="text-2xl font-bold text-white  text-center">{title}</Text>
                <TouchableOpacity className="w-10 h-10 bg-white rounded-full  justify-center items-center"> <Ionicons name="notifications" size={24} color="#000000" /></TouchableOpacity>
            </View>

        </View>
    );
};



export default Header;