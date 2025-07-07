import { Link } from "react-router-dom";
import logo from "../imgs/logo.png"
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png"
import { uploadImage } from "../common/aws";
import { useRef } from "react";

const BlogEditor = () => {
    let blogBannerRef = useRef();

    const handleBannerUpload = async (e) => {
        console.log("handle...")
        let img = e.target.files[0];
        console.log("img:", img)
        if (img) {
            await uploadImage(img).then((url) => {
                if (url) {
                    blogBannerRef.current.src = url;
                    console.log("Error", blogBannerRef.current.src);
                }
            }).catch((error)=>{
                 console.log("error while uploading image ", error.message);
            }) 
        }
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
                    </div>
                </section>
            </AnimationWrapper>

        </>
    )
}

export default BlogEditor;