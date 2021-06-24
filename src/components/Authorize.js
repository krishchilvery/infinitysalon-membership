import React from 'react';
import {
  Button,
  Container,
  makeStyles
} from "@material-ui/core";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import { firebaseConfig } from "./config";
import Google from "../images/google.svg";
import { setUser } from "../services/auth";
import { navigate } from "@reach/router"

const useStyles = (theme) => ({

})

const GoogleIcon = (props) => (
  <img
    src={Google}
    width={props.width || "24px"}
    height={props.height || "24px"}
  />
);

export default function Authorize(props) {
  const { handleSuccess, handleError } = props;
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }
  window.firebase = firebase
  
  var provider = new firebase.auth.GoogleAuthProvider();

  const googleSignIn = () => {
    firebase.auth().signInWithPopup(provider).then(
        (result) => {
            setUser(result.user);
            handleSuccess("Sucessfully Authenticated")
            navigate('/user')
        }
    ).catch((error) => {
        console.error(error);
        handleError("Couldn't sign in with google. Please try again later.")
    });
  };

  return (
    <Container>
        <Button style={{padding:"10px", fontWeight:"bold", textTransform:"none"}} variant="outlined" size="large" startIcon={<GoogleIcon />} onClick={googleSignIn}>Sign in with Google</Button>
    </Container>
  );
}
