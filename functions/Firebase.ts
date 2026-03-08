import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Alert } from "react-native";
import { auth, db } from "../config/firebase";
interface Booking {
    clinicName: string;
    date: string;
    time: string;
    notes?: string;

}


// ✅ Register + Auto Login
export const registerAndLogin = async (email: string, password: string, name?: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        let user = userCredential.user;

        // Update display name if provided
        if (name) {
            await updateProfile(user, { displayName: name });
            await user.reload();
            user = auth.currentUser || user;
        }

        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
        };

        // Ensure user document exists in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: user.displayName || name || "",
            email: user.email,
            rol: "user",
            createdAt: serverTimestamp(),
        }, { merge: true });

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

                // Even on login fallback, ensure the document exists
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    name: user.displayName || "",
                    email: user.email,
                    rol: "user",
                    // Use serverTimestamp if it's new, but merge:true prevents overwriting existing createdAt if we handle it carefully
                    // However, setDoc with merge:true is safe.
                }, { merge: true });

                Alert.alert("Success", "تم تسجيل الدخول بنجاح");
                await AsyncStorage.setItem("isLogin", 'True');
                await AsyncStorage.setItem("Account", 'True');
                await AsyncStorage.setItem("user", JSON.stringify(userData));
                return user;
            } catch (loginError: any) {
                Alert.alert("Error", loginError.message);
            }
        } else {
            console.error("Registration error:", error);
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
    const user = auth.currentUser;

    if (!user) {
        Alert.alert("Error", "يجب تسجيل الدخول أولاً");
        return;
    }

    try {
        const colRef = collection(db, "bookings");
        await addDoc(colRef, {
            ...booking,
            userId: user.uid,
            userName: user.displayName || user.email,
            createdAt: serverTimestamp(),
            status: "pending",
        });
        Alert.alert("Success", "تم حجز الموعد بنجاح");
    } catch (error: any) {
        Alert.alert("Error", error.message);
    }
};

// Get User Bookings
export const getBookings = async () => {
    const user = auth.currentUser;
    if (!user) return [];

    try {
        const { query, where, getDocs, orderBy } = await import("firebase/firestore");
        const q = query(
            collection(db, "bookings"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
        console.error("Error fetching bookings:", error);
        return [];
    }
};