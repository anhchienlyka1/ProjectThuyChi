import { Injectable } from '@angular/core';
import {
    collection,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    setDoc,
    doc,
    query,
    where,
    DocumentData,
    QueryConstraint
} from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

/**
 * Firestore Database Service
 * Service này cung cấp các phương thức CRUD cơ bản để làm việc với Firestore
 * 
 * Ví dụ sử dụng:
 * 
 * 1. Thêm document:
 *    await this.db.addDocument('users', { name: 'John', age: 25 });
 * 
 * 2. Lấy tất cả documents:
 *    const users = await this.db.getAllDocuments('users');
 * 
 * 3. Lấy document theo ID:
 *    const user = await this.db.getDocument('users', 'userId123');
 * 
 * 4. Cập nhật document:
 *    await this.db.updateDocument('users', 'userId123', { age: 26 });
 * 
 * 5. Xóa document:
 *    await this.db.deleteDocument('users', 'userId123');
 * 
 * 6. Query với điều kiện:
 *    const adults = await this.db.queryDocuments('users', 
 *      where('age', '>=', 18)
 *    );
 */
@Injectable({
    providedIn: 'root'
})
export class FirestoreService {

    constructor(private firebaseService: FirebaseService) { }

    /**
     * Thêm một document mới vào collection
     * @param collectionName Tên collection
     * @param data Dữ liệu của document
     * @returns ID của document vừa tạo
     */
    async addDocument(collectionName: string, data: DocumentData): Promise<string> {
        try {
            const colRef = collection(this.firebaseService.firestore, collectionName);
            const docRef = await addDoc(colRef, {
                ...data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            console.log('Document added with ID:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error adding document:', error);
            throw error;
        }
    }

    /**
     * Lấy một document theo ID
     * @param collectionName Tên collection
     * @param documentId ID của document
     * @returns Dữ liệu của document hoặc null nếu không tìm thấy
     */
    async getDocument(collectionName: string, documentId: string): Promise<DocumentData | null> {
        try {
            const docRef = doc(this.firebaseService.firestore, collectionName, documentId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                console.log('No document found with ID:', documentId);
                return null;
            }
        } catch (error) {
            console.error('Error getting document:', error);
            throw error;
        }
    }

    /**
     * Lấy tất cả documents trong một collection
     * @param collectionName Tên collection
     * @returns Mảng các documents
     */
    async getAllDocuments(collectionName: string): Promise<DocumentData[]> {
        try {
            const colRef = collection(this.firebaseService.firestore, collectionName);
            const querySnapshot = await getDocs(colRef);

            const documents: DocumentData[] = [];
            querySnapshot.forEach((doc) => {
                documents.push({ id: doc.id, ...doc.data() });
            });

            return documents;
        } catch (error) {
            console.error('Error getting documents:', error);
            throw error;
        }
    }

    /**
     * Query documents với điều kiện
     * @param collectionName Tên collection
     * @param constraints Các điều kiện query (sử dụng where từ firebase/firestore)
     * @returns Mảng các documents thỏa mãn điều kiện
     */
    async queryDocuments(collectionName: string, ...constraints: QueryConstraint[]): Promise<DocumentData[]> {
        try {
            const colRef = collection(this.firebaseService.firestore, collectionName);
            const q = query(colRef, ...constraints);
            const querySnapshot = await getDocs(q);

            const documents: DocumentData[] = [];
            querySnapshot.forEach((doc) => {
                documents.push({ id: doc.id, ...doc.data() });
            });

            return documents;
        } catch (error) {
            console.error('Error querying documents:', error);
            throw error;
        }
    }

    /**
     * Cập nhật một document
     * @param collectionName Tên collection
     * @param documentId ID của document
     * @param data Dữ liệu cần cập nhật
     */
    async updateDocument(collectionName: string, documentId: string, data: DocumentData): Promise<void> {
        try {
            const docRef = doc(this.firebaseService.firestore, collectionName, documentId);
            await updateDoc(docRef, {
                ...data,
                updatedAt: new Date().toISOString()
            });
            console.log('Document updated successfully');
        } catch (error) {
            console.error('Error updating document:', error);
            throw error;
        }
    }

    /**
     * Set document (tạo mới hoặc ghi đè hoàn toàn)
     * @param collectionName Tên collection
     * @param documentId ID của document (tự định nghĩa)
     * @param data Dữ liệu của document
     */
    async setDocument(collectionName: string, documentId: string, data: DocumentData): Promise<void> {
        try {
            const docRef = doc(this.firebaseService.firestore, collectionName, documentId);
            await setDoc(docRef, {
                ...data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            console.log('Document set successfully with ID:', documentId);
        } catch (error) {
            console.error('Error setting document:', error);
            throw error;
        }
    }

    /**
     * Xóa một document
     * @param collectionName Tên collection
     * @param documentId ID của document
     */
    async deleteDocument(collectionName: string, documentId: string): Promise<void> {
        try {
            const docRef = doc(this.firebaseService.firestore, collectionName, documentId);
            await deleteDoc(docRef);
            console.log('Document deleted successfully');
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    }
}
