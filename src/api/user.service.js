//database
import { doc, getDoc } from "firebase/firestore";
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
            console.warn(`Користувача з ID ${uid} не знайдено в базі.`);
            return '';
        }

    } catch (error) {
        console.error('Помилка при отриманні телефону:', error);
        return '';
    }
}