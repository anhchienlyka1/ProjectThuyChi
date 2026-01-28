import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    private app: FirebaseApp;
    private _firestore: Firestore;
    private _auth: Auth;
    private _analytics: Analytics | null = null;
    private _storage: FirebaseStorage;

    constructor() {
        // Initialize Firebase
        this.app = initializeApp(environment.firebase);

        // Initialize services
        this._firestore = getFirestore(this.app);
        this._auth = getAuth(this.app);
        this._storage = getStorage(this.app);

        // Analytics only works in browser, not in SSR
        if (typeof window !== 'undefined') {
            this._analytics = getAnalytics(this.app);
        }
    }

    get firestore(): Firestore {
        return this._firestore;
    }

    get auth(): Auth {
        return this._auth;
    }

    get analytics(): Analytics | null {
        return this._analytics;
    }

    get storage(): FirebaseStorage {
        return this._storage;
    }

    get firebaseApp(): FirebaseApp {
        return this.app;
    }
}
