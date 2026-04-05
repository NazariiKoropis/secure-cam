
import { collection, addDoc, getDocs, where, query } from "firebase/firestore";
import { database } from './../config/firebase';
import { COLLECTIONS } from "@constants/collections"

export const createOrder = async (order) => {
    try {
        const orderRef = await addDoc(collection(database, COLLECTIONS.ORDERS), {
            ...order,
            createdAt: new Date().toISOString(),
        })

        console.log("Review added with ID: ", orderRef.id);
    } catch (error) {
        console.error('Error adding order on server', error);
        return null;
    }
}

export const getOrdersByUserId = async (uid) => {
    try {
        const ordersRef = collection(database, COLLECTIONS.ORDERS);

        const q = query(ordersRef, where("userId", "==", uid));

        const querySnapshot = await getDocs(q);

        const orders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return orders;
    } catch (error) {
        console.error('Error fetching orders from server', error);
        return null;
    }
}