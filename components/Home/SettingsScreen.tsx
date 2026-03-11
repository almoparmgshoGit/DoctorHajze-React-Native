import { logout } from '@/functions/Firebase';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../Custom/Header';

const SettingsScreen = () => {

    return (
        <View style={styles.container}>
            <Header title="الإعدادات" />

            <View style={styles.content}>
                <View style={styles.card}>
                    <TouchableOpacity style={styles.item}>
                        <Ionicons name="chevron-back" size={18} color="#CBD5E0" />
                        <View style={styles.itemRight}>
                            <Text style={styles.itemText}>الملف الشخصي</Text>
                            <View style={styles.iconBox}>
                                <Ionicons name="person-outline" size={18} color="#5B8FB9" />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.sep} />

                    <TouchableOpacity style={styles.item}>
                        <Ionicons name="chevron-back" size={18} color="#CBD5E0" />
                        <View style={styles.itemRight}>
                            <Text style={styles.itemText}>الإشعارات</Text>
                            <View style={styles.iconBox}>
                                <Ionicons name="notifications-outline" size={18} color="#5B8FB9" />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.sep} />

                    <TouchableOpacity style={styles.item}>
                        <Ionicons name="chevron-back" size={18} color="#CBD5E0" />
                        <View style={styles.itemRight}>
                            <Text style={styles.itemText}>حول التطبيق</Text>
                            <View style={styles.iconBox}>
                                <Ionicons name="information-circle-outline" size={18} color="#5B8FB9" />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={() => logout()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="log-out-outline" size={18} color="#FC8181" />
                    <Text style={styles.logoutText}>تسجيل الخروج</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconBox: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: '#F0F7FC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4A5568',
    },
    sep: {
        height: 1,
        backgroundColor: '#F7FAFC',
        marginHorizontal: 16,
    },
    logoutBtn: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#FFF5F5',
        borderRadius: 12,
        paddingVertical: 13,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    logoutText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FC8181',
    },
});

export default SettingsScreen;
