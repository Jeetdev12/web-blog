import { Toaster } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";

const PublishForm = () => {
    const { blog: { banner,title }, setEditorState } = useContext(EditorContext)
    const handleCloseEvent = () => {
        setEditorState("editor");
    }

    return (
        <AnimationWrapper>
            <section className="w-full min-h-screen grid items-center lg:grid-cold-2 py-16"> 
                <Toaster />
                <button className="w-12 h-12  absolute right-[5vw] z-10 top-[5%] lg:[10%]"
                    onClick={handleCloseEvent}>
                    <i className="fi fi-br-cross"></i>
                </button>
                <div>
                    <p className="text-dark-grey mb-1">Preview</p>
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
                        <img src={banner} />
                    </div>
                    <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">{title}</h1>
                </div>
            </section>
        </AnimationWrapper>
    )
}

export default PublishForm;