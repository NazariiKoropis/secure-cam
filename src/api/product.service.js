//database
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { database } from './../config/firebase';

import { COLLECTIONS } from "@constants/collections"

export const getAllProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(database, COLLECTIONS.PRODUCTS));

        const products = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return products;
    } catch (error) {
        console.error('Error fetching data from server', error);
        return null;
    }
}

export const getProductById = async (id) => {
    try {
        const querySnapshot = await getDoc(doc(database, `${COLLECTIONS.PRODUCTS}/${id}`));

        const product = {
            id: querySnapshot.id,
            ...querySnapshot.data(),
        }

        return product
    } catch (error) {
        console.error('Error fetching data from server', error);
        return null;
    }
}

export const getAllProductsCategory = async () => {
    try {
        const querySnapshot = await getDocs(collection(database, COLLECTIONS.PRODUCTS));

        const categories = new Set();
        querySnapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.category) categories.add(data.category);
        });

        return Array.from(categories);
    } catch (error) {
        console.error('Error fetching data from server', error);
        return null;
    }
}
