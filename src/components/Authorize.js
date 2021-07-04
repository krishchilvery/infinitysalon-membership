import React from "react";
import Google from "../images/google.svg";
import { useAlert } from "react-alert";

const GoogleIcon = (props) => (
  <img
    src={Google}
    width={props.width || "24px"}
    height={props.height || "24px"}
    alt="Google logo"
  />
);

export default function Authorize(props) {
  const { successCallback, errorCallback } = props;

  const alert = useAlert();
  const handleSuccess = (message) => {
    alert.success(message);
  };
  const handleError = (message) => {
    alert.error(message);
  };

  var firebase = window.firebase;
  var provider = new firebase.auth.GoogleAuthProvider();

  const googleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        handleSuccess("Sucessfully Authenticated");
        if (successCallback) {
          successCallback();
        }
      })
      .catch((error) => {
        console.error(error);
        handleError(error.message);
        if (errorCallback) {
          errorCallback()
        }
      });
  };

  return (
    <button className="flex space-x-2 cursor-pointer w-full items-center justify-center shadow-inner py-2 rounded-full bg-blue-900 border-none outline-none" onClick={googleSignIn}>
      <GoogleIcon/>
      <p className="font-sans font-semibold text-white">Sign in with Google</p>
    </button>
    // <button
    //   onClick={googleSignIn}
    // >
    //   Sign in with Google
    // </button>
  );
}