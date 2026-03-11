import { auth, getBookings } from '@/functions/Firebase';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../Custom/Header';
import AddBooking from '../Model/AddBooking';

const statusConfig: any = {
    confirmed: { label: "مؤكد", color: "#FFFFFF", bg: "#48BB78" },
    pending: { label: "قيد الانتظار", color: "#FFFFFF", bg: "#ECC94B" },
    cancelled: { label: "ملغي", color: "#FFFFFF", bg: "#F56565" },
};

const Hojazaty: React.FC<{ text?: string }> = ({ text = "حجوزاتي" }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [bookings, setBookings] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    const fetchBookings = async (uid?: string) => {
        if (!uid) return;
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
        <View style={styles.container}>
            <Header title={text} />

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={() => fetchBookings(auth.currentUser?.uid)} />
                }
            >
                {loading && bookings.length === 0 ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="small" color="#A0AEC0" />
                    </View>
                ) : bookings.length === 0 ? (
                    <View style={styles.centered}>
                        <Ionicons name="calendar-outline" size={48} color="#E2E8F0" />
                        <Text style={styles.emptyText}>لا توجد حجوزات حالياً</Text>
                    </View>
                ) : (
                    bookings.map((booking: any) => {
                        const cfg = statusConfig[booking.status] || statusConfig.pending;
                        return (
                            <View key={booking.id} style={styles.card}>
                                <View style={styles.cardBody}>
                                    <View style={styles.cardRow}>
                                        <Text style={styles.cardInfoText}>{booking.date}</Text>
                                        <Text style={styles.cardInfoText}>{booking.time}</Text>
                                    </View>
                                    <Text style={styles.cardTitle}>{booking.clinicName}</Text>
                                    {booking.userName && <Text style={styles.cardUser}>{booking.userName}</Text>}
                                    <View style={[styles.statusTag, { backgroundColor: cfg.bg }]}>
                                        <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
            >
                <Text style={styles.fabText}>حجز جديد</Text>
                <FontAwesome name="plus" size={16} color={"#fff"} />
            </TouchableOpacity>

            <AddBooking modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: '#A0AEC0',
        fontSize: 14,
        marginTop: 12,
    },
    card: {
        backgroundColor: '#5B8FB9', // The "Primary" blue color from tailwind.config
        borderRadius: 14,
        marginBottom: 12,
        padding: 16,
        // No shadow/elevation as requested previously ("smooth/flat")
    },
    cardBody: {
        gap: 6,
    },
    cardRow: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardInfoText: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
        fontWeight: '600',
        textAlign: 'right',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'right',
    },
    cardUser: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.8,
        textAlign: 'right',
    },
    statusTag: {
        alignSelf: 'flex-end',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 4,
        marginTop: 10,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '800',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: '#5B8FB9',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 25,
    },
    fabText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
});

export default Hojazaty;