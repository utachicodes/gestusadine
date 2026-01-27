import { collection, query, where, getDocs, getDoc, doc, setDoc, updateDoc, deleteDoc, addDoc, orderBy, limit, Timestamp, serverTimestamp, QueryConstraint, getCountFromServer } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';

/**
 * Firebase Firestore Helper Functions
 */

// Get a single document by ID
export async function getDocument(collectionName: string, docId: string) {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
}

// Get all documents from a collection with optional constraints
export async function getDocuments(collectionName: string, constraints: QueryConstraint[] = []) {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

// Get count of documents
export async function getDocumentCount(collectionName: string, constraints: QueryConstraint[] = []) {
    const q = query(collection(db, collectionName), ...constraints);
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
}

// Add a new document
export async function addDocument(collectionName: string, data: any) {
    const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        created_at: serverTimestamp()
    });
    return docRef.id;
}

// Set a document with a specific ID
export async function setDocument(collectionName: string, docId: string, data: any) {
    await setDoc(doc(db, collectionName, docId), {
        ...data,
        updated_at: serverTimestamp()
    });
}

// Update a document
export async function updateDocument(collectionName: string, docId: string, data: any) {
    await updateDoc(doc(db, collectionName, docId), {
        ...data,
        updated_at: serverTimestamp()
    });
}

// Delete a document
export async function deleteDocument(collectionName: string, docId: string) {
    await deleteDoc(doc(db, collectionName, docId));
}

/**
 * Firebase Storage Helper Functions
 */

// Upload a file to Firebase Storage
export async function uploadFile(path: string, file: File | Blob): Promise<string> {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
}

// Delete a file from Firebase Storage
export async function deleteFile(path: string) {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
}

// Get download URL for a file
export async function getFileURL(path: string): Promise<string> {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
}

/**
 * Common Query Helpers
 */

export { where, orderBy, limit, Timestamp, serverTimestamp };
