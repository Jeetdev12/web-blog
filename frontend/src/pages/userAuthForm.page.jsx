import { Link, Navigate } from "react-router-dom";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png"
import AnimationWrapper from "../common/page-animation"
import { useContext, useRef } from "react";
import { Toaster, toast } from "react-hot-toast"
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";


const UserAuthForm = ({ type }) => {

    const authForm = useRef();

    let { userAuth: { access_token }, setUserAuth } = useContext(UserContext);
    // console.log(access_token)

    const userAuthThroughServer = (serverRoute, formData) => {

        try {
            console.log("Backend URL:", import.meta.env.VITE_SERVER_DOMAIN);
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
                .then(({ data }) => {
                    storeInSession("user", JSON.stringify(data));
                    setUserAuth(data);
                    console.log("data:", data)
                })
                .catch(({ response }) => {
                    const message = error?.response?.data?.error || error.message || "Unknown error";
                    toast.error(message);
                })
        } catch (error) {
            console.log(error)
        }
    }


    const handleSubmit = (e) => {

        e.preventDefault();

        let serverRoute = type == "sign-in" ? "/signin" : "/signup"

        const form = new FormData(authForm.current);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        let { fullname, email, password } = formData;

        if (fullname) {
            if (fullname.length < 3) {
                return toast.error("Fullname must be at least  3 letter long ")
            }
        }

        if (!email.length) {
            return toast.error(" Please Enter email")
        }

        if (!emailRegex.test(email)) {
            return toast.error("Enter valid email")
        }

        if (!passwordRegex.test(password)) {
            return toast.error("Password should be 8 to 20 characters long with a numberic, 1 lowercase & 1 upercase letters")
        }

        userAuthThroughServer(serverRoute, formData);

    }

    const handleGoogleAuth = (e) => {

        e.preventDefault();
        authWithGoogle().then((user) => {
            console.log(user)
            let serverRoute = "/google-auth";

            let formData = {
                access_token: user.accessToken
            }

            userAuthThroughServer(serverRoute, formData);
        }).catch(err => {
            toast.error("trouble login through Google ")
            return console.log(err);
        })
    }

    return (
        access_token ? <Navigate to="/" />
            :
            <AnimationWrapper keyValue={type}>
                <section className="h-cover flex items-center justify-center">
                    <Toaster />
                    <form ref={authForm} id="formElement" className="w-[80%] max-w-[400px]" >
                        <h1 className="text-4xl font-gelasio capitalize text-center  mb-24">
                            {type == "sign-in" ? "Welcome back" : "Join us today"}
                        </h1>
                        {
                            type != "sign-in" ?
                                <InputBox
                                    name="fullname"
                                    type="text"
                                    placeholder="Full Name"
                                    icon="fi-rr-user"
                                />
                                : ""
                        }
                        <InputBox
                            name="email"
                            type="email"
                            placeholder="email "
                            icon="fi-rr-envelope"
                        />
                        <InputBox
                            name="password"
                            type="password"
                            placeholder="password "
                            icon="fi-rr-key"
                        />
                        <button className="btn-dark center mt-14 "
                            type="submit"
                            onClick={handleSubmit}
                        >
                            {type.replace("-", " ")}
                        </button>

                        <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black-bold">
                            <hr className="w-1/2 border-black" />
                            <p>or</p>
                            <hr className="w-1/2 border-black" />
                        </div>

                        <button className="btn-dark  flex items-center justify-center gap-4 w-[90%] center" onClick={handleGoogleAuth}>
                            <img src={googleIcon} className="w-5" />
                            Continue with google
                        </button>

                        {
                            type == "sign-in" ?
                                <p className="m-6 text-dark-grey text-xl text-center ">
                                    Don't have an account ?
                                    <Link to="/signup" className="underline text-black-xl ml-1">
                                        Join us today
                                    </Link>
                                </p>
                                :
                                <p className="m-6 text-dark-grey text-xl text-center ">
                                    Don't have an account ?
                                    <Link to="/signin" className="underline text-black-xl ml-1">
                                        Sign in here.
                                    </Link>
                                </p>
                        }

                    </form>
                </section >
            </AnimationWrapper>

    )
}



export default UserAuthForm;