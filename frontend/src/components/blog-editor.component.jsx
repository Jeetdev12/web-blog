import { Link } from "react-router-dom";
import logo from "../imgs/logo.png"
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png"
import { uploadImage } from "../common/aws";
import { useRef } from "react";
import { Toaster, toast } from 'react-hot-toast'


const BlogEditor = () => {
    let blogBannerRef = useRef();

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

                    blogBannerRef.current.src = url;
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
    const handleTitle = (e) => {
        const input = e.target;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + "px";
    }

    return (
        <>
            <nav className="navbar" >
                <Link to="/">
                    <img src={logo} className="flex-none w-12" />
                </Link>

                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    New Blog
                </p>

                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2">
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
                                    ref={blogBannerRef}
                                    src={defaultBanner} />
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
                            onChange={handleTitle}
                        ></textarea>
                    </div>
                </section>
            </AnimationWrapper>

        </>
    )
}

export default BlogEditor;