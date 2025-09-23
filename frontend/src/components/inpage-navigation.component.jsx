


const InPageNavigation= ({routes})=>{
 console.log(routes)
return(
    <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
    { routes.map((route,i)=>(
        <button className="m-4">
            {route}
       </button>
     ))}
    </div>
)

}


export default InPageNavigation;