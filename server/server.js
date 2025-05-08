
import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import bcrypt from 'bcrypt';
import User from './Schema/User.js';
import { nanoid } from 'nanoid';
import jwt from "jsonwebtoken"
import cors from "cors";
import { getAuth } from "firebase-admin/auth"
import admin from 'firebase-admin';
import serviceAccountKey from "./blog-io-a944e-firebase-adminsdk-fbsvc-677686502c.json" assert {type: "json"}


const server = express();

let PORT = 3000;
server.use(express.json());
server.use(cors());

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
})

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

mongoose.connect(process.env.db_location, { autoIndex: true })

let generateUsername = (email) => {
    let username = email.split("@")[0];
    let isUsernameExists = User.exists({ "personal_info.username": username }).then((result) => result);

    isUsernameExists ? username += nanoid().substring(0, 3) : "";
    return username;
}

let formatDatatoSend = (user) => {

    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY)

    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }
}

server.post("/signup", (req, res) => {

    let { fullname, email, password } = req.body;

    if (fullname.length < 3) {
        return res.status(403).json({ 'error': "Fullname must be at least  3 letter long " })
    }

    if (!email.length) {
        return res.status(403).json({ 'error': " Please Enter email" })
    }

    if (!emailRegex.test(email)) {
        return res.status(403).json({ 'error': "Enter valid email" })
    }

    if (!passwordRegex.test(password)) {
        return res.status(403).json({ 'error': "Password should be 8 to 20 characters long with a numberic, 1 lowercase & 1 upercase letters" })
    }

    bcrypt.hash(password, 10, (err, hashed_password) => {
        let username = generateUsername(email);
        let user = new User({
            personal_info: {
                fullname, email, password: hashed_password, username
            }
        })

        user.save().then((u) => {
            return res.status(200).json(formatDatatoSend(u))
        })
            .catch(err => {
                if (err.code == 11000) {
                    return res.status(500).json({ "error": "Email already exists" })
                }
                return res.status(500).json({ "error": err.message })
            })
    })

})

server.post("/signin", (req, res) => {

    let { email, password } = req.body;

    User.findOne({ "personal_info.email": email }).then((user) => {

        if (!user) {
            return res.status(403).json({ "error": "Email not found" });
        }

        if (!user.google_auth) {
            bcrypt.compare(password, user.personal_info.password, (err, result) => {

                if (err) {
                    return res.status(403).json({ "status": "Error occured during login try again" });
                }
                if (!result) {
                    return res.status(403).json({ "status": "Incorrect password" });
                } else {
                    return res.status(200).json(formatDatatoSend(user));
                }
            })
        } else {
            return res.status(403).json({ "error": "Account was created using google . Try login with google . " })
        }



    }).catch((err) => {
        console.log(err.message);
        return res.status(403).json({
            "error": err.message
        })
    })
})

server.post("/google-auth", async (req, res) => {

    let { access_token } = req.body;

    getAuth()
        .verifyIdToken(access_token)
        .then(async (decodedUser) => {
            let { name, email, picture } = decodedUser;
            picture = picture.replace("s96-c", "s384-c");
            let user = await User.findOne({ "personal_info.email": email }).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth").then((u) => {
                return u || null
            }).catch((err) => {
                return res.status(500).json({ 'err': err.message });
            })

            if (user) {
                if (!user.google_auth) {// it will be for sign in 
                    return res.status(403).json({ "error": "This email sign up with password .Please login with password to access the account " })
                }
            }
            else { //it will be for sign up 
                let username = generateUsername(email);


                let user = new User({
                    personal_info: { "fullname": name, email, username },
                    google_auth: true
                })

                await user.save().then((u) => {
                    user = u;
                })
                    .catch((err) => {
                        return res.status(500).json({ "Error": err.message })
                    })
            }
            return res.status(200).json(formatDatatoSend(user));
        })
        .catch((err) => {
            return res.status(500).json({ "error": "failed to authenticate with google . try with other account" })
        })
})

server.listen(PORT, () => {
    console.log('listening on port -->' + PORT)
})

