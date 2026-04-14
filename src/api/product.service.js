//database
import {
    doc,
    getDoc,
    collection,
    getDocs,
    updateDoc,
    addDoc,
    deleteDoc,
} from "firebase/firestore";
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
        const querySnapshot = await getDoc(doc(database, COLLECTIONS.PRODUCTS, id));

        if (!querySnapshot.exists()) {
            return null;
        }

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

export const getAllProductsExceptById = async (id) => {
    try {
        const querySnapshot = await getDocs(collection(database, COLLECTIONS.PRODUCTS));

        const products = querySnapshot.docs
            .filter(doc => doc.id !== id)
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

        return products;
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

export const createProduct = async (payload) => {
    try {
        const productRef = await addDoc(collection(database, COLLECTIONS.PRODUCTS), {
            ...payload,
            createdAt: new Date(),
        });

        return productRef.id;
    } catch (error) {
        console.error('Error creating product on server', error);
        return null;
    }
}

export const updateProductById = async (id, payload) => {
    try {
        const productRef = doc(database, COLLECTIONS.PRODUCTS, id);

        await updateDoc(productRef, payload);

        return true;
    } catch (error) {
        console.error('Error updating product on server', error);
        return null;
    }
}

export const deleteProductById = async (id) => {
    try {
        const productRef = doc(database, COLLECTIONS.PRODUCTS, id);

        await deleteDoc(productRef);

        return true;
    } catch (error) {
        console.error('Error deleting product on server', error);
        return null;
    }
}

