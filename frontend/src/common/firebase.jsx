
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyDZiUPt3fuGWYf_p9k7bkqpJga2BBU-UQ0",
    authDomain: "blog-io-a944e.firebaseapp.com",
    projectId: "blog-io-a944e",
    storageBucket: "blog-io-a944e.firebasestorage.app",
    messagingSenderId: "853768681701",
    appId: "1:853768681701:web:e3105df332d6e08b2ebc0c"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const authWithGoogle = async () => {

    let user = null;
    await signInWithPopup(auth, provider)
        .then((result) => {
            user = result.user;
        })
        .catch((error) => {
            console.log(error);
        })

    return user;
}
