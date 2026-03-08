import { db } from "@/config/firebase"; // ✅ جيب db من الكونفيج
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Alert } from "react-native";
import { auth } from "../config/firebase";

interface Booking {
    clinicName: string;
    date: string;
    time: string;
    notes?: string;
    userId: string;
}

// ✅ Register + Auto Login
export const registerAndLogin = async (email: string, password: string, name?: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update display name if provided
        if (name) {
            await updateProfile(userCredential.user, { displayName: name });
            await userCredential.user.reload();
        }

        const user = auth.currentUser;
        const userData = {
            uid: user?.uid,
            email: user?.email,
            displayName: user?.displayName,
        };

        Alert.alert("Success", "تم إنشاء الحساب وتسجيل الدخول بنجاح");
        await AsyncStorage.setItem("isLogin", 'True');
        await AsyncStorage.setItem("Account", 'True');
        await AsyncStorage.setItem("user", JSON.stringify(userData));

        return user;
    } catch (error: any) {
        // لو الحساب موجود، اعمل Login تلقائي
        if (error.code === "auth/email-already-in-use") {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const userData = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                };
                Alert.alert("Success", "تم تسجيل الدخول بنجاح");
                await AsyncStorage.setItem("isLogin", 'True');
                await AsyncStorage.setItem("Account", 'True');
                await AsyncStorage.setItem("user", JSON.stringify(userData));
                return user;
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

// Logec 

// Add Booking

export const addBooking = async (booking: Booking) => {
    try {
        // ✅ ID تلقائي للكولكشن + userId محفوظ جوّا الداتا
        const colRef = collection(db, "bookings");

        await addDoc(colRef, {
            ...booking,
            status: "pending",
            createdAt: serverTimestamp(),
        });

        Alert.alert("✅ نجاح", "تم إضافة الحجز بنجاح");
        return true;

    } catch (error: any) {
        Alert.alert("❌ خطأ", error.message);
        return false;
    }
};