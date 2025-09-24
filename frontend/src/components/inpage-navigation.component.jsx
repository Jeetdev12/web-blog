import { useEffect, useRef, useState } from "react";



const InPageNavigation = ({ routes,defaultActiveIndex = 0, defaultHidden=[], children }) => {

    const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);
    const activeTabLineRef = useRef();
    const activeTabRef = useRef();
 console.log(defaultHidden.includes("Trending Blogs") ? " md:hidden":'null')
    // dark underline under active button
    const handleBtnClick = (btn, i) => {

        const { offsetWidth, offsetLeft } = btn;
        activeTabLineRef.current.style.width = offsetWidth + "px";
        activeTabLineRef.current.style.left = offsetLeft + "px";
        setInPageNavIndex(i)
    }

    useEffect(()=>{
       handleBtnClick(activeTabRef.current,defaultActiveIndex)
    },[])

    return (
        <>
            <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
                {routes.map((route, i) => (
                    <button key={i} className={"p-4 px-5 capitalize " + (inPageNavIndex == i ? "text-black " : "text-dark-grey ") + (defaultHidden.includes(route) ? " md:hidden":'')}
                        onClick={(e) => handleBtnClick(e.target, i)}

                        ref={defaultActiveIndex == i? activeTabRef:null}
                    >
                        {route}
                    </button>
                ))}

                <hr ref={activeTabLineRef} className="absolute bottom-0 duration-300" />
            </div>

            {Array.isArray(children) ? children[inPageNavIndex] :children}
        </>
    )

}


export default InPageNavigation;