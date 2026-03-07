import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Alert } from "react-native";
import { auth } from "../config/firebase";




// ✅ Register + Auto Login
export const registerAndLogin = async (email: string, password: string, name?: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update display name if provided
        if (name) {
            await updateProfile(userCredential.user, { displayName: name });
        }

        Alert.alert("Success", "تم إنشاء الحساب وتسجيل الدخول بنجاح");
        await AsyncStorage.setItem("isLogin", 'True');
        await AsyncStorage.setItem("Account", 'True');
        await AsyncStorage.setItem("user", JSON.stringify(userCredential.user));

        return userCredential.user;
    } catch (error: any) {
        // لو الحساب موجود، اعمل Login تلقائي
        if (error.code === "auth/email-already-in-use") {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                Alert.alert("Success", "تم تسجيل الدخول بنجاح");
                await AsyncStorage.setItem("isLogin", 'True');
                await AsyncStorage.setItem("Account", 'True');
                await AsyncStorage.setItem("user", JSON.stringify(userCredential.user));
                return userCredential.user;
            } catch (loginError: any) {
                Alert.alert("Error", loginError.message);
            }
        } else {
            Alert.alert("Error", error.message);
        }
    }
};

export const logout = async (navigation: any) => {

    try {
        await AsyncStorage.clear();
        await auth.signOut();
        Alert.alert("Success", "تم تسجيل الخروج بنجاح");
        navigation.navigate("Login");
    } catch (error: any) {
        Alert.alert("Error", error.message);
    }
};
