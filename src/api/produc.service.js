//database
import { collection, getDocs } from "firebase/firestore";
import { database } from './../config/firebase';

import { COLLECTIONS } from "@constants/collections"

export const getAllProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(database, COLLECTIONS.PRODUCTS));

        const products = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return products;
    } catch (error) {
        console.error('Error fetching data from server', error);
        return null;
    }
}