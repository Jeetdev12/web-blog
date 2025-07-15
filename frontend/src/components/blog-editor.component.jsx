import { Link } from "react-router-dom";
import logo from "../imgs/logo.png"
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png"
import { uploadImage } from "../common/aws";
import { useContext, useEffect } from "react";
import { Toaster, toast } from 'react-hot-toast'
import { EditorContext } from "../pages/editor.pages";
import EditorJS from '@editorjs/editorjs'
import { tools } from "./tools.component";


const BlogEditor = () => {

    const {blog,blog: {banner, title, des,content,tags},setBlog ,textEditor,setTextEditor} = useContext(EditorContext)

    // console.log(blog)

    useEffect(()=>{

         setTextEditor(new EditorJS({
            holder:"textEditor",
            data:'',
            tools:tools,
            placeholder:"Write your blog here"
         }))
    },[])

    const handleBannerUpload = async (e) => {

        console.log("handle...")
        let img = e.target.files[0];
        console.log("img:", img);

        if (img) {
            let loadingToast = toast.loading("Uploading...")
            await uploadImage(img).then((url) => {
                if (url) {
                    toast.dismiss(loadingToast);
                    toast.success("Uploaded successfully...")

                    // blogBannerRef.current.src = url;

                    setBlog({...blog, banner:url})
                }
            }).catch((error) => {
                toast.dismiss(loadingToast);
                return toast.error(error);
            })
        }
    }

    const handleKeyDown = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    }
    const handleTitleChange = (e) => {
        const input = e.target;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + "px";
        setBlog({...blog,title:input.value})
    }

    const handleError = (e)=>{
        let img = e.target;
        img.src= defaultBanner;
    }
   
    const handlePublish= (e)=>{
        e.preventDefault();
        if(!banner.length){
            return toast.error("Upload banner to publish it.")
        }

        if(!title.length){
            return toast.error("Enter title of your blog to publish it ...")
        }

        if(textEditor.isReady){
            textEditor.save().then((data)=>{
                if(data.blocks.length){
                    setBlog({...blog,content:data});
                    setEditorState("publish")
                }else{
                    return toast.error("Write something in your blog to publish it ")
                }
            })
        }
    }


    return (
        <>
            <nav className="navbar" >
                <Link to="/">
                    <img src={logo} className="flex-none w-12" />
                </Link>

         {/* //removed max-md:hidden */}
                <p className=" text-black line-clamp-1 w-full"> 
                    {title.length ? title: "New Blog"}
                </p>

                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2" onClick={handlePublish}>
                        Publish
                    </button>
                    <button className="btn-light py-2">
                        Save Draft
                    </button>
                </div>
            </nav>

            <Toaster />

            <AnimationWrapper>
                <section>
                    <div className="mx-auto  max-w-[900px] w-full">
                        <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                            <label htmlFor="uploadBanner">
                                < img
                                    src={banner}
                                    onError={handleError}
                                    />
                                <input
                                    id="uploadBanner"
                                    type="file"
                                    accept=".png,.jpg,.jpeg"
                                    hidden
                                    onChange={handleBannerUpload}
                                />
                            </label>
                        </div>
                        <textarea
                            placeholder="Blog title "
                            className="mt-10 text-4xl font-medium w-full h-20 outline-none resize-none leading-tight 
                        placeholder:opacity-40  "
                            onKeyDown={handleKeyDown}
                            onChange={handleTitleChange}
                        ></textarea>
                        <hr className="w-full opacity-10"/>
                        <div id="textEditor"></div>
                    </div>
                </section>
            </AnimationWrapper>

        </>
    )
}

export default BlogEditor;