import React, { useState, useContext } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {
  firebaseConfig,
  FIRESTORE_COLLECTION_CLIENTS,
} from "./components/config";
import { Router, navigate } from "@reach/router";
import { useAlert } from "react-alert";
import Search from "./components/Search";
import Modal from "./components/Modal";
import UserDetails from "./components/UserDetails";
import TopBar from "./components/TopBar";
import { AuthContext } from "./components/AuthModal";

function App() {
  const [uid, setUid] = useState("");
  const [addDialogModal, setAddDialogModal] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [phone, setPhone] = useState("");
  const alert = useAlert();

  //firebase init
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }

  window.firebase = firebase;

  const auth = useContext(AuthContext);

  const setUserFromPhone = (phone) => {
    const firestore = firebase.firestore();
    setPhone(phone);
    var clientsRef = firestore.collection(FIRESTORE_COLLECTION_CLIENTS);
    clientsRef
      .where("phone", "==", phone)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          console.log("empty");
          setAddDialogModal(true);
          return;
        }
        const user = querySnapshot.docs[0];
        setNewUser(false);
        setUid(user.id);
        navigate("/user");
      })
      .catch((error) => {
        alert.error("Error getting user from phone: " + error);
        auth.logout();
      });
  };

  const handleAddNewClient = () => {
    setNewUser(true);
    setAddDialogModal(false);
    navigate("/user");
  };

  return (
    <div className="h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex justify-center align-center items-center">
      <TopBar />
      <Router>
        {/* <Users path="/" /> */}
        <Search path="/" setUserFromPhone={setUserFromPhone} />
        <UserDetails
          path="/user"
          uid={uid}
          setUid={setUid}
          newUser={newUser}
          setNewUser={setNewUser}
          phone={phone}
          setPhone={setPhone}
        />
      </Router>

      <Modal
        open={addDialogModal}
        closable={false}
        handleClose={() => {
          setAddDialogModal(false);
        }}
      >
        <div>
          <div className="font-semibold">
            Looks like the user you're trying to search doesn't exist in the
            database. Do you want to add a new user?
          </div>
          <br />
          <div className="flex space-x-2">
            <button
              onClick={() => {
                handleAddNewClient();
              }}
              className="bg-green-500 hover:bg-green-200 py-1 font-semibold shadow rounded-md w-full text-center"
            >
              Yes
            </button>
            <button
              onClick={() => {
                setAddDialogModal(false);
              }}
              className="bg-red-500 hover:bg-red-200 font-semibold shadow rounded-md w-full text-center"
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
