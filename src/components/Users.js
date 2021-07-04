import React, { useState, useContext } from "react";
import { FIRESTORE_COLLECTION_CLIENTS } from "./config";
import UserDetails from "./UserDetails";
import { useAlert } from "react-alert";
import { AuthContext } from "./AuthModal";
import Modal from "./Modal";

export class User {
  constructor(
    id,
    name,
    dob,
    gender,
    is_member,
    membership_start_date,
    membership_renew_date,
    phone,
    discount
  ) {
    this.id = id;
    this.name = name;
    this.dob = dob;
    this.gender = gender;
    this.is_member = is_member;
    this.membership_start_date = membership_start_date;
    this.membership_renew_date = membership_renew_date;
    this.phone = phone;
    this.discount = discount;
  }
}

const columns = [
  //   { field: "id", headerName: "ID", width: 150, sortable: false },
  { field: "name", headerName: "Name", width: 150, sortable: false },
  { field: "phone", headerName: "Phone", width: 150, sortable: false },
  { field: "gender", headerName: "Gender", width: 150, sortable: false },
  { field: "dob", headerName: "Date of Birth", width: 150, sortable: false },
  { field: "discount", headerName: "Discount", width: 150, sortable: false },
  {
    field: "is_member",
    headerName: "Member",
    width: 100,
    sortable: false,
  },
  {
    field: "membership_start_date",
    headerName: "Joined on",
    width: 150,
    sortable: false,
  },
  {
    field: "membership_renew_date",
    headerName: "Renew Date",
    width: 150,
    sortable: false,
  },
];

export const userConverter = {
  toFirestore: (user) => ({
    name: user.name,
    dob: user.dob,
    gender: user.gender,
    is_member: user.is_member,
    membership_start_date: user.membership_start_date,
    membership_renew_date: user.membership_renew_date,
    phone: user.phone,
    discount: user.discount,
  }),
  fromFirestore: (snapshot, options) => {
    let data = snapshot.data(options);
    return new User(
      snapshot.id,
      data.name,
      new Date(data.dob.seconds * 1000),
      data.gender,
      data.is_member,
      new Date(data.membership_start_date.seconds * 1000),
      new Date(data.membership_renew_date.seconds * 1000),
      data.phone,
      data.discount
    );
  },
};

export default function Users(props) {
  const [clients, setClients] = useState([]);
  const [uid, setUid] = useState([]);
  const [open, setOpen] = useState(false);

  const alert = useAlert();
  const handleSuccess = (message) => {
    alert.success(message);
  };
  const handleError = (message) => {
    alert.error(message);
  };

  const auth = useContext(AuthContext);
  const firebase = window.firebase;

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      getClients();
    } else {
      auth.logout();
      auth.openModal();
    }
  });

  //TODO: Implement Pagination Later
  //   const [startIndex, setStartIndex] = useState(0);
  //   const limit = USERS_PAGINATION_LIMIT;

  if (firebase === undefined) {
    auth.openModal();
  }
  const firestore = firebase.firestore();

  const handleRowClick = (id) => {
    setUid(id);
    setOpen(true);
  };

  const getClients = () => {
    let clientsRef = firestore.collection(FIRESTORE_COLLECTION_CLIENTS);
    clientsRef
      .get()
      .then((querySnapshot) => {
        let docs = [];
        querySnapshot.forEach((doc) => {
          docs.push(userConverter.fromFirestore(doc));
        });
        setClients(docs);
      })
      .catch((error) => {
        console.log(error);
        auth.openModal();
      });
  };

  return (
    <div className="container mx-auto p-4">
      <table className="w-full">
        <thead className=" border-solid border-current border-t-2 border-b-2">
          <tr style={{borderColor:"currentColor"}} className="table-row py-4">
            {columns.map((column, index) => (
              <th>
                {column.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clients.map((row, index) => (
            <tr
              role="button"
              className="table-row cursor-pointer hover:bg-gray-100"
              onClick={() => {
                handleRowClick(row.id);
              }}
              key={row.id}
              onKeyPress={() => {}}
              tabIndex={0}
            >
              <td>{row.name}</td>
              <td>{row.phone}</td>
              <td>{row.gender}</td>
              <td>{row.dob.toDateString()}</td>
              <td>{row.discount}</td>
              <td>
                {row.is_member ? (
                  <span style={{ color: "green" }}>Yes</span>
                ) : (
                  <span style={{ color: "red" }}>No</span>
                )}
              </td>
              <td>
                {row.membership_start_date.toDateString()}
              </td>
              <td>
                {row.membership_renew_date.toDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        open={open}
        widthClass={"container"}
        handleClose={() => {
          setOpen(false);
          console.log("here");
        }}
        disableOverlayClose={true}
      >
        <UserDetails
          uid={uid}
        />
      </Modal>
    </div>
  );
}
