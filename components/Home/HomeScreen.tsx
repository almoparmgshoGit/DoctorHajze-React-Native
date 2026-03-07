import { auth } from "@/config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Header from "../Custom/Header";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
    const [user, setUser] = useState("");

    const getUserFromStorage = async () => {
        try {
            const storedUser = await AsyncStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser.displayName || "");
            }
        } catch (e) {
            console.error("Failed to load user from storage", e);
        }
    };

    useEffect(() => {
        getUserFromStorage();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser.displayName || "");
            } else {
                setUser("");
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <Header title="الرئيسية" />

            {/* Greeting Section */}
            {user ? (
                <View style={styles.greetingContainer}>
                    <Text style={styles.greetingSubtitle}>مرحباً بعودتك 👋</Text>
                    <Text style={styles.greetingName}>{user}</Text>
                </View>
            ) : null}

            {/* Section Title */}
            <View style={styles.sectionHeader}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionTitle}>الحجز القادم</Text>
            </View>

            {/* Appointment Card */}
            <View style={styles.cardWrapper}>
                <View style={styles.card}>
                    {/* Card Header */}
                    <View style={styles.cardHeader}>
                        <View style={styles.badgeContainer}>
                            <View style={styles.pulseDot} />
                            <Text style={styles.badgeText}>مؤكد</Text>
                        </View>
                        <Text style={styles.cardTitle}>موعدك القادم</Text>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Info Rows */}
                    <View style={styles.infoGrid}>
                        <InfoRow icon="📅" label="الوقت" value="غداً — 10:00 ص" />
                        <InfoRow icon="🏥" label="العيادة" value="عيادة الدكتور أحمد" />
                        <InfoRow icon="💰" label="الرسوم" value="100 جنيه" />
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.btnSecondary}>
                            <Text style={styles.btnSecondaryText}>إلغاء</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnPrimary}>
                            <Text style={styles.btnPrimaryText}>تأكيد الحضور</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Decorative shadow card */}
                <View style={styles.cardShadow} />
            </View>

            {/* Quick Actions */}
            <View style={styles.sectionHeader}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
            </View>

            <View style={styles.quickActions}>
                <QuickAction icon="➕" label="حجز جديد" color="#4F46E5" />
                <QuickAction icon="📋" label="سجل الحجوزات" color="#0891B2" />
                <QuickAction icon="👤" label="الملف الشخصي" color="#7C3AED" />
                <QuickAction icon="⚙️" label="الإعدادات" color="#059669" />
            </View>
        </ScrollView>
    );
};

/* ─── Sub-components ─────────────────────────────────── */

const InfoRow = ({
    icon,
    label,
    value,
}: {
    icon: string;
    label: string;
    value: string;
}) => (
    <View style={styles.infoRow}>
        <View style={styles.infoTextGroup}>
            <Text style={styles.infoValue}>{value}</Text>
            <Text style={styles.infoLabel}>{label}</Text>
        </View>
        <View style={styles.infoIconBox}>
            <Text style={styles.infoIcon}>{icon}</Text>
        </View>
    </View>
);

const QuickAction = ({
    icon,
    label,
    color,
}: {
    icon: string;
    label: string;
    color: string;
}) => (
    <TouchableOpacity style={styles.quickActionItem} activeOpacity={0.75}>
        <View style={[styles.quickActionIcon, { backgroundColor: color + "18" }]}>
            <Text style={styles.quickActionEmoji}>{icon}</Text>
        </View>
        <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
);

/* ─── Styles ─────────────────────────────────────────── */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F7FC",
    },
    scrollContent: {
        paddingBottom: 40,
    },

    // Greeting
    greetingContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 4,
        alignItems: "flex-end",
    },
    greetingSubtitle: {
        fontSize: 13,
        color: "#9CA3AF",
        fontFamily: "System",
        textAlign: "right",
    },
    greetingName: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1F1B3A",
        textAlign: "right",
    },

    // Section Header
    sectionHeader: {
        flexDirection: "row-reverse",
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 28,
        marginBottom: 14,
        gap: 8,
    },
    sectionAccent: {
        width: 4,
        height: 20,
        borderRadius: 2,
        backgroundColor: "#4F46E5",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1F1B3A",
        textAlign: "right",
    },

    // Card
    cardWrapper: {
        paddingHorizontal: 20,
        position: "relative",
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#4F46E5",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 8,
        zIndex: 1,
    },
    cardShadow: {
        position: "absolute",
        bottom: -6,
        left: 30,
        right: 30,
        height: 20,
        backgroundColor: "#4F46E5",
        borderRadius: 20,
        opacity: 0.08,
        zIndex: 0,
    },
    cardHeader: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#6B7280",
        textAlign: "right",
    },
    badgeContainer: {
        flexDirection: "row-reverse",
        alignItems: "center",
        backgroundColor: "#D1FAE5",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 5,
    },
    pulseDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: "#10B981",
    },
    badgeText: {
        fontSize: 12,
        color: "#065F46",
        fontWeight: "600",
    },
    divider: {
        height: 1,
        backgroundColor: "#F3F4F6",
        marginBottom: 16,
    },

    // Info Rows
    infoGrid: {
        gap: 12,
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 12,
    },
    infoIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#EEF2FF",
        justifyContent: "center",
        alignItems: "center",
    },
    infoIcon: {
        fontSize: 18,
    },
    infoTextGroup: {
        flex: 1,
        alignItems: "flex-end",
    },
    infoLabel: {
        fontSize: 11,
        color: "#9CA3AF",
        textAlign: "right",
    },
    infoValue: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1F1B3A",
        textAlign: "right",
    },

    // Action Buttons
    actionRow: {
        flexDirection: "row-reverse",
        gap: 10,
    },
    btnPrimary: {
        flex: 1,
        backgroundColor: "#4F46E5",
        paddingVertical: 13,
        borderRadius: 14,
        alignItems: "center",
    },
    btnPrimaryText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 14,
    },
    btnSecondary: {
        flex: 0.45,
        backgroundColor: "#FEE2E2",
        paddingVertical: 13,
        borderRadius: 14,
        alignItems: "center",
    },
    btnSecondaryText: {
        color: "#EF4444",
        fontWeight: "700",
        fontSize: 14,
    },

    // Quick Actions
    quickActions: {
        flexDirection: "row-reverse",
        flexWrap: "wrap",
        paddingHorizontal: 16,
        gap: 12,
        justifyContent: "center",
    },
    quickActionItem: {
        width: (width - 56) / 2,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 16,
        alignItems: "center",
        gap: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    quickActionIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    quickActionEmoji: {
        fontSize: 22,
    },
    quickActionLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#374151",
        textAlign: "center",
    },
});

export default HomeScreen;