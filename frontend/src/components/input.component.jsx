import { useState } from "react";


const InputBox = ({ name, type, id, value, placeholder, icon }) => {

    const [PasswordVisible, setPasswordVisible] = useState(false)

    return (
        <div className="relative w-[100%] mb-4">
            <input
                name={name}
                type={type == "Password" ? PasswordVisible ? "text" : "Password" : type}
                placeholder={placeholder}
                defaultValue={value}
                id={id}
                className="input-box"
            />
            <i className={"fi " + icon + " input-icon"}></i>

            {

                type == "Password" ?
                    <i className={"fi fi-rr-eye" + (!PasswordVisible ? "-crossed" : "") + " input-icon left-[auto] right-4 cursor-pointer"} onClick={() => setPasswordVisible(currentVal => !currentVal)}></i>
                    : ""

            }
        </div >

    )
}


export default InputBox;