
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt';
dotenv.config();
import User from './Schema/User.js';
import { nanoid } from 'nanoid';
import jwt from "jsonwebtoken";
import cors from "cors";
import { getAuth } from "firebase-admin/auth";



//import serviceAccountKey from "./blog-io-a944e-firebase-adminsdk-fbsvc-77ab4fa75f.json" assert {type: "json"};


import aws from 'aws-sdk'
let PORT = process.env.PORT
const server = express();

// console.log("serviceAccountKey", serviceAccountKey);

const allowedOrigins = [
    'http://localhost:5173', 'http://localhost:3000',
    'https://your-frontend-name.vercel.app'
];

server.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccountKey)
// })

server.use(express.json());


let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

mongoose.connect(process.env.db_location, { autoIndex: true })

// Connnecting aws 

const s3 = new aws.S3(
    {
        region: 'eu-north-1',
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
)

const generateUploadURL = async () => {
    const date = new Date();
    const imageName = `${nanoid}-${date.getTime()}.jpeg`

    return await s3.getSignedUrlPromise('putObject', {
        Bucket: 'blogy-blogging-website',
        Key: imageName,
        Expires: 1000,
        ContentType: 'image/jpeg'
    })
}

// const verifconst jwt = require("jsonwebtoken");



const verifyJWT = (req, res, next) => {

    console.log("verifying token ...")
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ error: "No access token " })
    }

    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Access token is invalid" })
        }

        req.user = user.id;
             next()
    })
}



let generateUsername = (email) => {
    let username = email.split("@")[0];
    let isUsernameExists = User.exists({ "personal_info.username": username }).then((result) => result);
    username = isUsernameExists ? username + nanoid().substring(0, 3) : "";
    let fileName = `${username}.jpeg`;
    return fileName;
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

server.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// upload image url route 

server.get('/get-upload-url', (req, res) => {
    generateUploadURL().then(url => res.status(200).json({ "uploadUrl": url })).catch(error => {
        console.log(error.message);
        return res.status(500).json({ error: error.message });
    })
})

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
    console.log(email, password)

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
                    return res.status(403).json({ "error": "This email was signed up with password .Please login with password to access the account " })
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



server.post("/create-blog", verifyJWT, (req, res) => {

    let authorId = user.id;

    let {title, des , banner, tags, content, draft} = req.body;

    if(!title.length){
        return res.status(403).json({error:"You must provide a title to publish the blog "})
    }

    if(!des.length || des.length>200){
        return res.status(403).json({error:"You must provide blog banner to publish it "});
    }

    if(!banner.length){
        return res.status(403).json({error:"You must provide banner to publish it "})
    }
    if(content.blocks.length){
        return res.status(403).json({error:"You must be some blog content to publish it "})
    }
    if(tags.length || tags.length>10){
        return res.status(403).json({error:"Provides tags to publish it "})
    }

    tags = tags.map(tag=>tag.toLowerCase());

    let blogId = title.replace(/[^a-zA-Z0-9]/g,' ').replace(/\s+/g,"-").trim()+nanoid();
   console.log(blogId)
    return res.json.status(200)({message:"Successfull"})
})


server.listen(PORT, () => {
    console.log('listening on port -->' + PORT)
})

