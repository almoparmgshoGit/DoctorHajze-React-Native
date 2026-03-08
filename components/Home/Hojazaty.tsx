import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Header from '../Custom/Header';

interface HojazatyProps {
    text?: string;
}

const Hojazaty: React.FC<HojazatyProps> = ({ text = " الحجوزات" }) => {
    return (
        <View className="flex-1  bg-background">
            <Header title={text} />
            <View className="flex-1" style={{ flex: 1 }} >

                <ScrollView contentContainerStyle={{ flexGrow: 4 }}>
                    <View className="w-full px-4 items-center mt-7 pb-10">
                        <View style={{ direction: 'rtl' }} className="w-full  px-4 py-2 text-text-main mt-4 bg-primary border border-border rounded-lg">
                            <Text className="text-white  font-bold text-xl">امس</Text>
                            <Text className="text-white  font-bold text-xl">بتاريخ : 2022-01-01</Text>
                            <Text className="text-white  font-bold text-xl">12:00 AM</Text>
                            <Text className="text-white  font-bold text-xl">عيادة الدكتور احمد</Text>
                            <Text className="text-white  bg-green-500 rounded-full px-2 py-1 text-center mt-4 w-20 font-bold text-sm">منتهي</Text>
                        </View>
                        <View style={{ direction: 'rtl' }} className="w-full  px-4 py-2 text-text-main mt-4 bg-primary border border-border rounded-lg">
                            <Text className="text-white  font-bold text-xl">امس</Text>
                            <Text className="text-white  font-bold text-xl">بتاريخ : 2022-01-01</Text>
                            <Text className="text-white  font-bold text-xl">10:00 AM</Text>
                            <Text className="text-white  font-bold text-xl">عيادة الدكتور احمد</Text>
                            <Text className="text-white  bg-green-500 rounded-full px-2 py-1 text-center mt-4 w-20 font-bold text-sm">منتهي</Text>
                        </View>
                        <View style={{ direction: 'rtl' }} className="w-full  px-4 py-2 text-text-main mt-4 bg-primary border border-border rounded-lg">
                            <Text className="text-white  font-bold text-xl">اليوم</Text>
                            <Text className="text-white  font-bold text-xl">بتاريخ : 2022-01-01</Text>
                            <Text className="text-white  font-bold text-xl">09:00 AM</Text>
                            <Text className="text-white  font-bold text-xl">عيادة الدكتور احمد</Text>
                            <Text className="text-white  bg-red-600 rounded-full px-2 py-1 text-center mt-4 w-20 font-bold text-sm">ملغي</Text>
                        </View>
                        <View style={{ direction: 'rtl' }} className="w-full  px-4 py-2 text-text-main mt-4 bg-primary border border-border rounded-lg">
                            <Text className="text-white  font-bold text-xl">من يومين</Text>
                            <Text className="text-white  font-bold text-xl">بتاريخ : 2022-01-01</Text>
                            <Text className="text-white  font-bold text-xl">04:00 AM</Text>
                            <Text className="text-white  font-bold text-xl">عيادة الدكتور احمد</Text>
                            <Text className="text-white  bg-yellow-600 rounded-full px-2 py-1 text-center mt-4 w-20 font-bold text-sm">تاخرت</Text>
                        </View>
                        <View style={{ direction: 'rtl' }} className="w-full  px-4 py-2 text-text-main mt-4 bg-primary border border-border rounded-lg">
                            <Text className="text-white  font-bold text-xl">امس</Text>
                            <Text className="text-white  font-bold text-xl">بتاريخ : 2022-01-02</Text>
                            <Text className="text-white  font-bold text-xl">05:00 AM</Text>
                            <Text className="text-white  font-bold text-xl">عيادة الدكتور احمد</Text>
                            <Text className="text-white  bg-red-500 rounded-full px-2 py-1 text-center mt-4 w-20 font-bold text-sm">منتهي</Text>
                        </View>
                    </View>


                </ScrollView>
            </View>
            <View className=' relative z-1 flex-row gap-5 items-center ml-[220px] bg-blue-500 rounded-full  p-4'>
                <FontAwesome name="plus" size={25} color={"#fff"} />
                <Text className='text-xl text-center font-bold text-white'>حجز جديد </Text>
            </View>
        </View>
    );
};



export default Hojazaty;