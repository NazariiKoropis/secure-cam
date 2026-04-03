//database
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { database } from './../config/firebase';

import { COLLECTIONS } from "@constants/collections"

export const getUserRoleByID = async (uid) => {
    try {
        const docRef = doc(database, COLLECTIONS.USERS, uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return data.role;
        }

    } catch (error) {
        console.log('Error fething data from server', error)
        return null
    }
}

export const getUserPhoneByID = async (uid) => {
    try {
        const docRef = doc(database, COLLECTIONS.USERS, uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data()?.phone || '';
        } else {
            console.log(`Користувача з ID ${uid} не знайдено в базі.`);
            return '';
        }

    } catch (error) {
        console.error('Помилка при отриманні телефону:', error);
        return '';
    }
}

export const getUserById = async (uid) => {
    try {
        const docRef = doc(database, COLLECTIONS.USERS, uid);
        const docSnap = await getDoc(docRef);

        return docSnap.data();

    } catch (error) {
        console.log('Error fething data from server', error)
    }
}

export const updateUserName = async (uid, name) => {
    try {
        const docRef = doc(database, COLLECTIONS.USERS, uid);
        await getDoc(docRef);
        await updateDoc(docRef, {
            displayName: name,
        });
    } catch (error) {
        console.log('Error fething data from server', error)
    }
}


export const updateUserPhone = async (uid, phone) => {
    try {
        const docRef = doc(database, COLLECTIONS.USERS, uid);
        await getDoc(docRef);
        await updateDoc(docRef, {
            phone: phone,
        });
    } catch (error) {
        console.log('Error fething data from server', error)
    }
}
