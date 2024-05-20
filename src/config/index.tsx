import { firebaseConfigDev } from './firebaseConfig.dev';
import { firebaseConfigProd } from './firebaseConfig.prod';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

let app;
if (!getApps().length) {
    if (process.env.NODE_ENV === 'production') {
        app = initializeApp(firebaseConfigProd);
        console.log('Production environment');
    } else {
        app = initializeApp(firebaseConfigDev);
        console.log('Development environment');
    }
} else {
    app = getApp();
}

const fireAuth = getAuth(app);

export default fireAuth;
