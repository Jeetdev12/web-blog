import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";

let Editor = () => {

    //editor will allow only if signed in 
    let { userAuth: { access_token } } = useContext(UserContext)
    let [editorState, setEditorState] = useState("editor");

    return (
        access_token === null ? <Navigate to="/signin" />
            : editorState == "editor" ? <BlogEditor /> : < PublishForm />
    )

}


export default Editor;