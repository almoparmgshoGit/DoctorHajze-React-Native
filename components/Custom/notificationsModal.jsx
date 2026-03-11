import { getNotification } from "@/functions/Firebase";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const statusConfig = {
    confirmed: { label: "مؤكد", color: "#48BB78", bg: "#F0FFF4" },
    pending: { label: "قيد الانتظار", color: "#ECC94B", bg: "#FFFFF0" },
    cancelled: { label: "ملغي", color: "#F56565", bg: "#FFF5F5" },
};

const getStatusCfg = (status) =>
    statusConfig[status] ?? statusConfig["pending"];

const formatDate = (timestamp) => {
    if (!timestamp) return "";
    try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000 / 60);
        if (diff < 1) return "الآن";
        if (diff < 60) return `منذ ${diff} دقيقة`;
        if (diff < 1440) return `منذ ${Math.floor(diff / 60)} ساعة`;
        return `منذ ${Math.floor(diff / 1440)} يوم`;
    } catch {
        return "";
    }
};

function NotificationsModal({ visible, onClose }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const snapshot = await getNotification();
            if (snapshot && snapshot.docs) {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setNotifications(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (visible) fetchNotifications();
    }, [visible]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

                <View style={styles.sheet}>
                    <View style={styles.handle} />

                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={18} color="#A0AEC0" />
                        </TouchableOpacity>

                        <View style={styles.headerRight}>
                            <Text style={styles.title}>الإشعارات</Text>
                            {unreadCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{unreadCount}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {loading ? (
                        <View style={styles.centered}>
                            <ActivityIndicator size="large" color="#A0AEC0" />
                            <Text style={styles.loadingText}>جارٍ التحميل...</Text>
                        </View>
                    ) : notifications.length === 0 ? (
                        <View style={styles.centered}>
                            <Ionicons name="notifications-off-outline" size={40} color="#E2E8F0" />
                            <Text style={styles.emptyTitle}>لا توجد إشعارات</Text>
                            <Text style={styles.emptySubtitle}>ستظهر إشعاراتك هنا</Text>
                        </View>
                    ) : (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.list}
                        >
                            {notifications.map((item) => {
                                const cfg = getStatusCfg(item.status);
                                return (
                                    <View
                                        key={item.id}
                                        style={[styles.card, !item.read && styles.cardUnread]}
                                    >
                                        <View style={styles.cardBody}>
                                            <View style={styles.cardTop}>
                                                <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
                                                <Text style={styles.cardTitle}>{item.titel}</Text>
                                            </View>
                                            <Text style={styles.cardText} numberOfLines={2}>
                                                {item.body}
                                            </Text>
                                            <View style={styles.cardBottom}>
                                                <View style={[styles.statusTag, { backgroundColor: cfg.bg }]}>
                                                    <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.2)",
    },
    sheet: {
        backgroundColor: "#FAFAFA",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: "80%",
        paddingBottom: 30,
    },
    handle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#E2E8F0",
        alignSelf: "center",
        marginTop: 10,
    },
    header: {
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    headerRight: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 8,
    },
    title: {
        fontSize: 17,
        fontWeight: "600",
        color: "#4A5568",
    },
    badge: {
        backgroundColor: "#FC8181",
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 5,
    },
    badgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "700",
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: "#F0F0F0",
        justifyContent: "center",
        alignItems: "center",
    },
    divider: {
        height: 1,
        backgroundColor: "#F0F0F0",
        marginHorizontal: 20,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    loadingText: {
        color: "#A0AEC0",
        fontSize: 13,
        marginTop: 6,
    },
    emptyTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#718096",
        marginTop: 10,
    },
    emptySubtitle: {
        fontSize: 12,
        color: "#A0AEC0",
    },
    list: {
        padding: 16,
        gap: 8,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#F0F0F0",
    },
    cardUnread: {
        backgroundColor: "#FCFDFE",
        borderColor: "#E8F0FE",
    },
    cardBody: {
        padding: 12,
        gap: 4,
    },
    cardTop: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#4A5568",
        textAlign: "right",
    },
    cardDate: {
        fontSize: 10,
        color: "#A0AEC0",
    },
    cardText: {
        fontSize: 12,
        color: "#718096",
        textAlign: "right",
        lineHeight: 18,
    },
    cardBottom: {
        flexDirection: "row-reverse",
        marginTop: 2,
    },
    statusTag: {
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    statusText: {
        fontSize: 10,
        fontWeight: "600",
    },
});

export default NotificationsModal;