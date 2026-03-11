import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { registerAndLogin } from '../../functions/Firebase';

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isNewAccount, setIsNewAccount] = useState(true);

    const handleSubmit = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("الرجاء ملء جميع الحقول");
            return;
        }
        if (isNewAccount && (!name.trim() || !confirmPassword.trim())) {
            Alert.alert("الرجاء ملء جميع الحقول");
            return;
        }
        if (isNewAccount && password !== confirmPassword) {
            Alert.alert("كلمة المرور غير متطابقة");
            return;
        }

        const user = await registerAndLogin(email, password, isNewAccount ? name : undefined);
        if (user) {
            // Firebase auth state change will auto-navigate via StackNavigator
            setEmail('');
            setName('');
            setPassword('');
            setConfirmPassword('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>🩺</Text>
            <Text style={styles.appName}>دكتور حجزي</Text>
            <Text style={styles.subtitle}>
                {isNewAccount ? 'إنشاء حساب جديد' : 'تسجيل دخول'}
            </Text>

            <View style={styles.form}>
                {isNewAccount && (
                    <TextInput
                        placeholder="الاسم الكامل"
                        placeholderTextColor="#CBD5E0"
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        textAlign="right"
                    />
                )}
                <TextInput
                    placeholder="البريد الالكتروني"
                    placeholderTextColor="#CBD5E0"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    textAlign="right"
                />
                <TextInput
                    placeholder="كلمة المرور"
                    placeholderTextColor="#CBD5E0"
                    secureTextEntry
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    textAlign="right"
                />
                {isNewAccount && (
                    <TextInput
                        placeholder="تأكيد كلمة المرور"
                        placeholderTextColor="#CBD5E0"
                        secureTextEntry
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        textAlign="right"
                    />
                )}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>
                        {isNewAccount ? 'إنشاء حساب' : 'تسجيل دخول'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setIsNewAccount(!isNewAccount)}
                    style={styles.switchBtn}
                >
                    <Text style={styles.switchText}>
                        {isNewAccount ? 'لديك حساب؟ سجل دخول' : 'ليس لديك حساب؟ أنشئ حساب'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 24,
    },
    logo: {
        fontSize: 44,
        marginBottom: 6,
    },
    appName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#5B8FB9',
    },
    subtitle: {
        fontSize: 14,
        color: '#A0AEC0',
        marginTop: 4,
        marginBottom: 30,
    },
    form: {
        width: '100%',
        alignItems: 'center',
    },
    input: {
        width: '85%',
        height: 48,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#EDF2F7',
        borderRadius: 12,
        marginBottom: 12,
        fontSize: 14,
        color: '#4A5568',
    },
    button: {
        width: '85%',
        height: 48,
        backgroundColor: '#5B8FB9',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    switchBtn: {
        marginTop: 16,
    },
    switchText: {
        color: '#5B8FB9',
        fontSize: 13,
        fontWeight: '500',
    },
});

export default Login;