import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { registerAndLogin } from '../../functions/Firebase';

const Login = () => {

    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isAccount, setIsAccount] = useState(null);
    const [isLogin, setIsLogin] = useState(null);
    const handleRegister = async () => {
        if (email === '' || password === '' || (isAccount !== 'True' && (confirmPassword === '' || name === ''))) {
            Alert.alert("الرجاء ملء جميع الحقول");
            return;
        }
        else if (isAccount !== 'True' && password !== confirmPassword) {
            Alert.alert("كلمة المرور غير متطابقة");
            return;
        }
        const user = await registerAndLogin(email, password, name);
        if (user) {
            navigation.navigate("MainTabs");
            setEmail('');
            setName('');
            setPassword('');
            setConfirmPassword('');
        }
    }
    const getAccount = async () => {

        const value = await AsyncStorage.getItem('Account');
        const isLogin = await AsyncStorage.getItem('isLogin');
        const user = await AsyncStorage.getItem('user');
        setIsAccount(value);
        setIsLogin(isLogin);
    };

    useEffect(() => {

        getAccount();
    }, []);

    useEffect(() => {
        if (isLogin === 'True') {
            navigation.navigate('MainTabs');
        }
    }, [isLogin, navigation]);

    return (
        <View className="flex-1 items-center justify-center bg-background">
            <Text className="text-primary text-2xl font-bold mb-10">تسجيل دخول جديد</Text>
            <View className="w-full px-4 items-center mt-7">
                {isAccount !== 'True' && (
                    <TextInput
                        placeholder="الاسم الكامل"
                        placeholderTextColor="#94a3b8"
                        className="w-[80%] h-12 px-4 py-2 text-text-main bg-background border border-border rounded-lg mb-4"
                        value={name}
                        onChangeText={setName}
                    />
                )}
                <TextInput
                    placeholder="البريد الالكتروني"
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    className="w-[80%] h-12 px-4 py-2 text-text-main bg-background border border-border rounded-lg"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    placeholder="كلمة المرور"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={true}
                    className="w-[80%] h-12 px-4 py-2 text-text-main mt-4 bg-background border border-border rounded-lg"
                    value={password}
                    onChangeText={setPassword}
                />

                {isAccount !== 'True' && (
                    <TextInput
                        placeholder="تأكيد كلمة المرور"
                        placeholderTextColor="#94a3b8"
                        secureTextEntry={false}
                        className="w-[80%] h-12 px-4 py-2 text-text-main mt-4 bg-background border border-border rounded-lg"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                )}

                <TouchableOpacity
                    className="w-[80%] h-12 px-4 py-2 justify-center text-text-main mt-4 bg-primary border border-border rounded-lg"
                    onPress={handleRegister}
                >
                    <Text className="text-white text-center font-bold">تسجيل الدخول / انشاء حساب جديد </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
};


export default Login;