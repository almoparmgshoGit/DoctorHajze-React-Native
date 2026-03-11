import { logout } from '@/functions/Firebase';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NotificationsModal from '../Custom/notificationsModal';

const Header = ({ title }) => {
    const [visible, setVisible] = useState(false);

    return (
        <View style={styles.header}>
            <View style={styles.row}>
                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => logout()}
                >
                    <Ionicons name="log-out-outline" size={20} color="#A0AEC0" />
                </TouchableOpacity>

                <Text style={styles.title}>{title}</Text>

                <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => setVisible(true)}
                >
                    <Ionicons name="notifications-outline" size={20} color="#A0AEC0" />
                </TouchableOpacity>
            </View>

            <NotificationsModal
                visible={visible}
                onClose={() => setVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingTop: 54,
        paddingBottom: 14,
        backgroundColor: '#FAFAFA',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        color: '#4A5568',
        letterSpacing: 0.3,
    },
    iconBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Header;