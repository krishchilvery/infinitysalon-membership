import React, { useContext, useState } from "react";
import SearchIcon from "../images/search.svg";
import { AuthContext } from "./AuthModal";

export default function Search(props) {
  const { setUserFromPhone } = props;
  const auth = useContext(AuthContext);
  const firebase = window.firebase;


  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      auth.logout();
      auth.openModal();
    }
  });

  const [searchString, setSearchString] = useState("");
  const [searchDisable, setSearchDisable] = useState(true);
  const handleChange = (event) => {
    setSearchString(event.target.value);
    let re = /^[0-9]{10}$/g;
    if (re.test(event.target.value)) {
      setSearchDisable(false);
    } else {
      setSearchDisable(true);
    }
  };
  const search = (event) => {
    setUserFromPhone(searchString);
  };

  return (
    <div className="flex h-content m-auto space-x-4">
      <img src={SearchIcon} alt="Search" className="w-10" />
      <input
        className="bg-transparent font-semibold p-2 border-solid border-b-2 border-current focus:border-b-2"
        type="search"
        placeholder={"Enter Mobile Number"}
        value={searchString}
        onChange={handleChange}
      />
      <button
        disabled={searchDisable}
        className="font-semibold bg-pink-700 px-4 rounded-md disabled:opacity-50"
        onClick={search}
      >
        Submit
      </button>
    </div>
  );
}
