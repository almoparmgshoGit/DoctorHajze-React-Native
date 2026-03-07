import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Alert } from "react-native";
import { auth } from "../config/firebase";
// ✅ Register + Auto Login
export const registerAndLogin = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert("Success", "تم إنشاء الحساب وتسجيل الدخول بنجاح");
        AsyncStorage.setItem("isLogin", 'True');
        AsyncStorage.setItem("Account", 'True');

        return userCredential.user;
    } catch (error: any) {
        // لو الحساب موجود، اعمل Login تلقائي
        if (error.code === "auth/email-already-in-use") {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                Alert.alert("Success", "تم تسجيل الدخول بنجاح");
                AsyncStorage.setItem("isLogin", 'True');
                AsyncStorage.setItem("Account", 'True');
                return userCredential.user;
            } catch (loginError: any) {
                Alert.alert("Error", loginError.message);
            }
        } else {
            Alert.alert("Error", error.message);
        }
    }
};