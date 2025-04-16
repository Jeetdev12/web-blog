
import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
const server = express();
let PORT = 3000;
server.use(express.json());

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

mongoose.connect(process.env.db_location, { autoIndex: true })

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

    if (!emailRegex.test(password)) {
        return res.status(403).json({ 'error': "Password should be 8 to 20 characters long with a numberic, 1 lowercase & 1 upercase letters" })
    }




    return res.status(200).json({ "status": "Okay" })

})


server.listen(PORT, () => {
    console.log('listening on port -->' + PORT)
})

