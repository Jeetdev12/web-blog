

const Tag = ({tag})=>{

    return(
      <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-8">
           <p className="outline-none" contentEditable = "true">{tag}</p>
           <button className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2">
                    <i className="fi fi-br-cross text-sm pointer-events-none mt-2"></i>
           </button>
      </div>
      
    )
} 


export default Tag;