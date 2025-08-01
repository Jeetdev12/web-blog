import { createContext, useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";

const blogStructure = {
    title: '',
    banner: '',
    content: [],
    tags:[],
    des: '',
    author: { personal_info: {} }
}

export const EditorContext = createContext({})

let Editor = () => {
    const [blog, setBlog] = useState(blogStructure)

    //editor will allow only if signed in 
    let { userAuth: { access_token } } = useContext(UserContext);
    let [editorState, setEditorState] = useState("editor");
    let [textEditor , setTextEditor] = useState({isReady:false});


    return (
        <EditorContext.Provider value={{blog, setBlog ,editorState ,setEditorState,textEditor,setTextEditor}}>
            {
                access_token === null ? <Navigate to="/signin" />
                    : editorState == "editor" ? <BlogEditor /> : < PublishForm />
            }
        </EditorContext.Provider>

    )

}


export default Editor;