
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { Alert } from "react-native";
import { auth, db } from "../config/firebase";
export { auth, db };
interface Booking {
    clinicName: string;
    date: string;
    time: string;
    notes?: string;

}


//  Register + Auto Login
export const registerAndLogin = async (email: string, password: string, name?: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        let user = userCredential.user;

        if (name) {
            await updateProfile(user, { displayName: name });
            await user.reload();
            user = auth.currentUser || user;
        }

        // Ensure user document exists in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: user.displayName || name || "",
            email: user.email,
            role: "user",
            createdAt: serverTimestamp(),
        }, { merge: true });

        Alert.alert("Success", "تم إنشاء الحساب وتسجيل الدخول بنجاح");
        return user;
    } catch (error: any) {
        // لو الحساب موجود، اعمل Login تلقائي
        if (error.code === "auth/email-already-in-use") {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    name: user.displayName || "",
                    email: user.email,
                    role: "user",
                }, { merge: true });

                Alert.alert("Success", "تم تسجيل الدخول بنجاح");
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


export const logout = async () => {
    try {
        await auth.signOut();
        // Firebase onAuthStateChanged in StackNavigator handles navigation automatically
    } catch (error: any) {
        console.error("Logout Error:", error);
        Alert.alert("Error", "حدث خطأ أثناء تسجيل الخروج");
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
        notification("تم حجز الموعد ", "الحجز بتاعك تحت المراجعه برجاء الانتظار قليلا", 'نجاح')
    } catch (error: any) {
        Alert.alert("Error", error.message);
    }
};




// Get User Bookings
export const getBookings = async (passedUid?: string) => {
    const userId = passedUid || auth.currentUser?.uid;
    console.log("UserID in getBookings:", userId);

    if (!userId) {
        console.log("No user found, returning empty array");
        return [];
    }

    try {
        const q = query(
            collection(db, "bookings"),
            where("userId", "==", userId)
        );

        const querySnapshot = await getDocs(q);
        console.log("Fetched bookings count:", querySnapshot.size);

        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Manual sort (Newest first) to avoid indexing error while delivering same result
        return data.sort((a: any, b: any) => {
            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;
            return timeB - timeA;
        });
    } catch (error: any) {
        console.error("Error fetching bookings:", error);
        return [];
    }
};



// Get clinics
export const getClinics = async () => {
    try {
        const q = query(collection(db, "clinics"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
        console.error("Error fetching clinics:", error);
        return [];
    }
};

// Get Current User Data
export const getUserData = async () => {
    const user = auth.currentUser;
    if (!user) return null;

    try {
        const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)));
        if (!userDoc.empty) {
            return userDoc.docs[0].data();
        }
        return null;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};


export const notification = async (titel: string, body: string, status: string) => {
    const user = auth.currentUser;

    if (!user) return null; //  لو مفيش يوزر

    try {
        await addDoc(collection(db, 'notifications'), {
            titel,       //  shorthand
            body,
            status,
            read: false,
            userId: user.uid,
            date: serverTimestamp(),
        });

        return true;  //  ترجع true لو نجح

    } catch (error) {
        console.error("Error adding notification:", error);
        return null;
    }
}


export const getNotification = async () => {
    const user = auth.currentUser;

    if (!user) return []; // ✅

    try {
        const snapshot = await getDocs(
            query(
                collection(db, "notifications"),
                where("userId", "==", user.uid)
            )
        );

        // ترتيب يدوي من الأحدث للأقدم
        const sortedDocs = snapshot.docs.sort((a, b) => {
            const timeA = a.data().date?.seconds || 0;
            const timeB = b.data().date?.seconds || 0;
            return timeB - timeA;
        });

        return { docs: sortedDocs };

    } catch (error) {
        console.error("Error Get notification:", error);
        return [];
    }
}