import { useContext, useState } from "react";
import logo from "../imgs/logo.png";
import { Link, Outlet } from "react-router-dom";
import { UserContext } from "../App";
import UserNavigationPanel from "./user-navigation.component.jsx"


const Navbar = () => {
  const [searchBoxVisibility, setsearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);

  const { userAuth, userAuth: { access_token, profile_img } } = useContext(UserContext)

  const handleNavPanel = () => {
    setUserNavPanel(currentVal => !currentVal);
  }

  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false)
    }, 200)
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} />
        </Link>

        <div
          className={
            "absolute  bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-6 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show  " +
            (searchBoxVisibility ? "show" : "hide")
          }
        >
          <input
            type="text"
            placeholder="Search"
            className="bg-grey w-full md:w-auto p-4 pl-6 pr-[12%] md:pr-6 rounded-full  placeholder:text-dark-grey md:pl-12"
          />
          <i className="fi fi-br-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 "></i>
        </div>

        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <button
            className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
            onClick={() =>
              setsearchBoxVisibility((currentVisibility) => !currentVisibility)
            }
          >
            <i className="fi fi-br-search "></i>
          </button>
        </div>

        <Link to={"/editor"} className="hidden md:flex gap-3 link">
          <i className="fi fi-rr-file-edit"></i>
          <p>Write</p>
        </Link>

        {
          access_token ?
            <>
              <Link to="/dasboard/notification">
                <button className="w-12 h-12 rounded-full bg-grey hover:bg-black/10">
                  <i className="fi fi-rr-bell"></i>
                </button>
              </Link>

              <div className="relative" onClick={handleNavPanel} onBlur={handleBlur}>
                <button className="w-12 h-12 rounded-full mt-1">
                  <img src={profile_img} className="w-full h-full object-cover rounded-full" />
                </button>
              </div>

              {
                userNavPanel ? <UserNavigationPanel /> : ""
              }


            </>
            :
            <>
              <Link to={"/signin"} className="btn-dark py-2">
                Sign In
              </Link>
              <Link to={"/signup"} className="btn-light py-2 hidden md:block">
                Sign up
              </Link>
            </>
        }
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
