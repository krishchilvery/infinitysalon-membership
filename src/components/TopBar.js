import React, { useContext } from "react";
import HomeIcon from '@material-ui/icons/Home';
import { AuthContext } from "./AuthModal";
import { navigate } from "@reach/router";

export default function TopBar(props) {
    const authContext = useContext(AuthContext)
    const handleHome = () => {
        navigate("/")
    }
    const handleLogout = () => {
        authContext.logout()
    }
    return (
        <div className="fixed container flex top-0 h-10 border-b border-current items-center divide-x-2 divide-current divide-solid w-full">
            <div id="title" className="flex font-semibold p-2">Infinity Salons</div>
            <div id="navigation" className="flex flex-grow justify-center font-semibold">
                <div className="flex items-center cursor-pointer transition-transform transform hover:-translate-y-1 hover:scale-110" onClick={handleHome}>
                    <HomeIcon fontSize="small"/>Home
                </div>
            </div>
            <div id="profile" className="flex font-semibold cursor-pointer p-2">
                <div className="flex items-center transition-transform transform hover:-translate-y-1 hover:scale-110" onClick={handleLogout}>
                    Logout
                </div>
            </div>
        </div>
    )
}