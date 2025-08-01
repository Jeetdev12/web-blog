import toast, { Toaster } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { useContext, useEffect } from "react";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";



const PublishForm = () => {
    const characterLimit = 200;
    const tagLimit = 10;
    const tagIndex = 0;
    const { blog, blog: { banner, tags, title, des }, setEditorState, setBlog } = useContext(EditorContext)
    const handleCloseEvent = () => {
        setEditorState("editor");
    }

    const handleBlogTitleChange = (e) => {
        let input = e.target;
        setBlog({ ...blog, title: input.value })
    }
    const handleBlogDesChange = (e) => {
        let input = e.target;
        setBlog({ ...blog, des: input.value })
    }

    const handleKeyDown = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    }
    const handleKeyDownt = (e) => {
        if (e.keyCode === 13 || e.keyCode === 188) {
            e.preventDefault();

            let tag = e.target.value;
            console.log("tagg",tag)
                    setBlog({ ...blog, tags: [ ...tags, tag] })
         
            if (tags.lenght < tagLimit) {

                if (!tags.includes(tag) && tag.length) {
                    setBlog({ ...blog, tags: [ ...tags, tag] })
                }
            }else{
                toast.error(`You can add max ${tagLimit} tags`)
            }
            e.target.value = "";
        }
    }

    
    useEffect(()=>{
            console.log(tags)
       
    },[blog])
    return (
        <AnimationWrapper>
            <section className="w-full min-h-screen grid items-center lg:grid-cols-2 py-16">
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
                    <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">{des}</p>
                </div>

                <div className="ml-5">
                    <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
                    <input type="text" placeholder="Blog title " defaultValue={title} className="input-box pl-4" onChange={handleBlogTitleChange} />

                    <p className="text-dark-grey mb-2 mt-9">short description of your blog</p>

                    <textarea maxLength={characterLimit} defaultValue={des} className="h-40 resize-none leading-7 input-box pl-4" placeholder="Hello ji ......" onChange={handleBlogDesChange} onKeyDown={handleKeyDown}>
                    </textarea>
                    <p className="mt-1 text-dark-grey text-sm text-right">{characterLimit - des.length} characters left</p>

                    <p className="text-dark-grey mb-2 mt-9">Topics - (Helps in searching and ranking your blog post )</p>
                </div>
                <div>
                    <div className="relative input-box pl-2 py-2 pb-4">
                    <input className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white" onKeyDown={handleKeyDownt} />
                    {
                        tags.map((tag, i) => {
                           return (<Tag tag={tag} tagIndex = {i} key={i} />)
                        })
                    }
                </div>

                 <p className="mt-1 mb-4 text-dark-gray text-right">{tagLimit - tags.length} Tags left</p>
                </div>

                <button className="btn">Publish</button>
               
            </section>
        </AnimationWrapper>
    )
}

export default PublishForm;