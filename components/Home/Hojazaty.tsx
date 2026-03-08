import { auth, getBookings } from '@/functions/Firebase';
import { FontAwesome } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Header from '../Custom/Header';
import AddBooking from '../Model/AddBooking';

interface HojazatyProps {
    text?: string;
}

const Hojazaty: React.FC<HojazatyProps> = ({ text = " الحجوزات" }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [bookings, setBookings] = useState<any>([]);
    const [clinics, setClinics] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    const fetchBookings = async (uid?: string) => {
        setLoading(true);
        try {
            const data = await getBookings(uid);
            setBookings(data);
        } catch (error) {
            console.error("Error in fetchBookings:", error);
        } finally {
            setLoading(false);
        }
    }



    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchBookings(user.uid);

            }
        });
        return unsubscribe;
    }, []);
    return (
        <View className="flex-1  bg-background">
            <Header title={text} />
            <View className="flex-1"  >

                <ScrollView
                    contentContainerStyle={{ flexGrow: 4 }}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={() => fetchBookings(auth.currentUser?.uid)} />
                    }
                >
                    <View className="w-full px-4 items-center mt-7 pb-10">
                        {bookings.map((booking: any) => (
                            <View key={booking.id} style={{ direction: 'rtl' }} className="w-full  px-4 py-2 text-text-main mt-4 bg-primary border border-border rounded-lg">
                                <Text className="text-white  font-bold text-xl">{booking.date}</Text>
                                <Text className="text-white  font-bold text-xl">{booking.time}</Text>
                                <Text className="text-white  font-bold text-xl">{booking.clinicName}</Text>
                                <Text style={{ backgroundColor: booking.status === "confirmed" ? "green" : booking.status === "pending" ? "#f1c232" : "red" }} className="text-white   rounded-full px-2 py-1 text-center mt-4 w-40  justify-center items-center font-bold text-sm">{booking.status}</Text>
                            </View>
                        ))}

                    </View>


                </ScrollView>
            </View>
            <TouchableOpacity
                className='absolute bottom-6 right-6 z-10 flex-row gap-3 items-center bg-blue-500 rounded-full px-5 py-4'
                onPress={() => setModalVisible(true)}
            >
                <Text className='text-base font-bold text-white'>حجز جديد</Text>
                <FontAwesome name="plus" size={20} color={"#fff"} />
            </TouchableOpacity>

            <AddBooking modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </View>
    );
};



export default Hojazaty;