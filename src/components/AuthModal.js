import React, { createContext, useState, createRef } from "react";
import Authorize from "./Authorize";
import Modal from "./Modal";

function AuthModal(props) {
  const buttonRef = createRef();
  const successCallback = () => {
    if (props.successCallback) {
      props.successCallback();
    }
    props.handleClose();
  };
  return (
    <Modal
      title={"Authorize"}
      initialFocus={buttonRef}
      open={props.open}
      handleClose={props.handleClose}
    >
      <div className="mt-2">
        <p className="text-sm text-gray-500">
          Looks like you haven't been authorized to view this content. Please
          login below to continue
        </p>
      </div>
      <div className="mt-4" ref={buttonRef}>
        <Authorize successCallback={successCallback} />
      </div>
    </Modal>
  );
}

export const AuthContext = createContext();

export default function AuthProvider(props) {
  const [open, setOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const openModal = () => {
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
  };
  const logout = () => {
    if (window.firebase) {
      window.firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("logged out successfully");
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setAuthorized(false);
  };
  const login = () => {
    setAuthorized(true);
  };
  return (
    <AuthContext.Provider value={{ openModal, authorized, logout }}>
      <AuthModal open={open} handleClose={closeModal} successCallback={login} />
      {props.children}
    </AuthContext.Provider>
  );
}
