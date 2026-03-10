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
    confirmed: { label: "مؤكد", color: "#fff", bg: "green" },
    pending: { label: "قيد الانتظار", color: "#fff", bg: "#f1c232" },
    cancelled: { label: "ملغي", color: "#fff", bg: "red" },
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
                    {/* Handle */}
                    <View style={styles.handle} />

                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={20} color="#6B7280" />
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

                    {/* Content */}
                    {loading ? (
                        <View style={styles.centered}>
                            <ActivityIndicator size="large" color="#2563EB" />
                            <Text style={styles.loadingText}>جارٍ التحميل...</Text>
                        </View>
                    ) : notifications.length === 0 ? (
                        <View style={styles.centered}>
                            <Ionicons name="notifications-off-outline" size={48} color="#D1D5DB" />
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
                                        {/* Right accent strip */}
                                        <View style={[styles.strip, { backgroundColor: cfg.bg }]} />

                                        <View style={styles.cardBody}>
                                            {/* Top row */}
                                            <View style={styles.cardTop}>
                                                <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
                                                <Text style={styles.cardTitle}>{item.titel}</Text>
                                            </View>

                                            {/* Body */}
                                            <Text style={styles.cardText} numberOfLines={2}>
                                                {item.body}
                                            </Text>

                                            {/* Status badge */}
                                            <View style={styles.cardBottom}>
                                                <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                                                    <Text style={styles.statusText}>{cfg.label}</Text>
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
        backgroundColor: "rgba(0,0,0,0.45)",
    },
    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: "80%",
        paddingBottom: 30,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#E5E7EB",
        alignSelf: "center",
        marginTop: 12,
    },
    header: {
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerRight: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
    },
    badge: {
        backgroundColor: "#EF4444",
        borderRadius: 12,
        minWidth: 22,
        height: 22,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 6,
    },
    badgeText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "700",
    },
    closeBtn: {
        backgroundColor: "#F3F4F6",
        borderRadius: 20,
        padding: 8,
    },
    divider: {
        height: 1,
        backgroundColor: "#F3F4F6",
        marginHorizontal: 20,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    loadingText: {
        color: "#9CA3AF",
        fontSize: 14,
        marginTop: 8,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#374151",
        marginTop: 12,
    },
    emptySubtitle: {
        fontSize: 13,
        color: "#9CA3AF",
    },
    list: {
        padding: 16,
        gap: 10,
    },

    // Card — matches app style (bg-primary / border-border / rounded-lg)
    card: {
        flexDirection: "row-reverse",
        backgroundColor: "#1e3a5f",   // primary color من هوية التطبيق
        borderRadius: 10,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#2a4a72",
    },
    cardUnread: {
        borderColor: "#3b82f6",
    },
    strip: {
        width: 5,
    },
    cardBody: {
        flex: 1,
        padding: 12,
        gap: 6,
    },
    cardTop: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#fff",
        textAlign: "right",
    },
    cardDate: {
        fontSize: 11,
        color: "#93C5FD",
    },
    cardText: {
        fontSize: 13,
        color: "#CBD5E1",
        textAlign: "right",
        lineHeight: 20,
    },
    cardBottom: {
        flexDirection: "row-reverse",
        marginTop: 4,
    },
    statusBadge: {
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    statusText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "700",
    },
});

export default NotificationsModal;