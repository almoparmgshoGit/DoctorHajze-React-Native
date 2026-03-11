import { auth, getBookings } from "@/functions/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import Header from '../Custom/Header';

const statusConfig: any = {
    confirmed: { label: "مؤكد", color: "#FFFFFF", bg: "#48BB78" },
    pending: { label: "قيد الانتظار", color: "#FFFFFF", bg: "#ECC94B" },
    cancelled: { label: "ملغي", color: "#FFFFFF", bg: "#F56565" },
};

const HomeScreen = () => {
    const [user, setUser] = useState('');
    const [bookings, setBookings] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    const fetchBookings = async (uid?: string) => {
        if (!uid) return;
        setLoading(true);
        try {
            const data = await getBookings(uid);
            setBookings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser.displayName || '');
                fetchBookings(currentUser.uid);
            } else {
                setUser('');
                setBookings([]);
            }
        });
        return () => unsubscribe();
    }, []);

    const nextBooking = bookings[0];
    const recentBookings = bookings.slice(1, 4); // Show only top 3 recent to keep it clean

    return (
        <View style={styles.container}>
            <Header title="الرئيسية" />

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                {user ? (
                    <View style={styles.welcomeCard}>
                        <Text style={styles.welcomeText}>أهلاً، {user} 👋</Text>
                    </View>
                ) : null}

                {/* Next Booking Section */}
                <Text style={styles.sectionTitle}>الحجز القادم</Text>
                {loading ? (
                    <ActivityIndicator size="small" color="#A0AEC0" style={{ marginTop: 20 }} />
                ) : nextBooking ? (
                    <View style={styles.primaryCard}>
                        <View style={styles.cardBody}>
                            <View style={styles.cardRow}>
                                <Text style={styles.cardInfoText}>{nextBooking.date}</Text>
                                <Text style={styles.cardInfoText}>{nextBooking.time}</Text>
                            </View>
                            <Text style={styles.cardTitle}>{nextBooking.clinicName}</Text>
                            <View style={[styles.statusTag, { backgroundColor: (statusConfig[nextBooking.status] || statusConfig.pending).bg }]}>
                                <Text style={[styles.statusText, { color: (statusConfig[nextBooking.status] || statusConfig.pending).color }]}>
                                    {(statusConfig[nextBooking.status] || statusConfig.pending).label}
                                </Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <Text style={styles.emptyText}>لا توجد حجوزات قادمة</Text>
                )}

                {/* Recent Bookings Section */}
                <Text style={styles.sectionTitle}>آخر الحجوزات</Text>
                {recentBookings.length > 0 ? (
                    recentBookings.map((item: any) => {
                        const cfg = statusConfig[item.status] || statusConfig.pending;
                        return (
                            <View key={item.id} style={styles.primaryCard}>
                                <View style={styles.cardBody}>
                                    <View style={styles.cardRow}>
                                        <Text style={styles.cardInfoText}>{item.date}</Text>
                                        <Text style={styles.cardInfoText}>{item.time}</Text>
                                    </View>
                                    <Text style={styles.cardTitle}>{item.clinicName}</Text>
                                    <View style={[styles.statusTag, { backgroundColor: cfg.bg }]}>
                                        <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })
                ) : (
                    !loading && <Text style={styles.emptyText}>لا توجد حجوزات سابقة</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    welcomeCard: {
        marginHorizontal: 16,
        marginTop: 14,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    welcomeText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#4A5568',
        textAlign: 'right',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#A0AEC0',
        marginRight: 22,
        marginTop: 18,
        marginBottom: 8,
        textAlign: 'right',
    },
    primaryCard: {
        backgroundColor: '#5B8FB9',
        borderRadius: 14,
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
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
    emptyText: {
        textAlign: 'center',
        color: '#CBD5E0',
        fontSize: 13,
        marginTop: 10,
    }
});

export default HomeScreen;
