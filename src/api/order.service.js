
import { collection, addDoc } from "firebase/firestore";
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