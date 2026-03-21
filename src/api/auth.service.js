import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";

//database
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, database } from './../config/firebase';

// login
export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
    } catch (error) {
        return { user: null, error };
    }
};

// sign up
export const register = async (email, password, name, phone) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const generatedPhotoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

        await updateProfile(user, {
            displayName: name,
            photoURL: generatedPhotoUrl
        });

        await setDoc(doc(database, "users", user.uid), {
            uid: user.uid,
            displayName: name,
            email: email,
            phone: phone,
            photoURL: generatedPhotoUrl,
            role: "user",
            createdAt: serverTimestamp(),
        });

        return { user: auth.currentUser, error: null };
    } catch (error) {
        return { user: null, error };
    }
}

// log out
export const logout = async () => {
    try {
        await signOut(auth);
        return { error: null };
    } catch (error) {
        return { error };
    }
};