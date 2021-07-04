import React, { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Checkbox,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  Typography,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { DEFAULT_DISCOUNT, FIRESTORE_COLLECTION_CLIENTS } from "./config";
import { navigate } from "@reach/router";
import EditIcon from "@material-ui/icons/Edit";
import { useAlert } from "react-alert";

const useStyles = makeStyles((theme) => ({
  mainFlexBox: {
    padding: "30px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "70vh",
    maxWidth: "100vw",
  },
  detailsFlexBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  billFlexBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: "30px",
  },
  authField: {
    margin: theme.spacing(1),
  },
  authButton: {
    textTransform: "none",
    "&:disabled": {
      visibility: "hidden",
    },
  },
}));

export default function UserDetails(props) {

  const alert = useAlert()

  const firebase = window.firebase;
  if (firebase === undefined) {
    navigate("/");
  }
  const firestore = firebase.firestore();

  const {uid, setUid} = props;
  const {phone, setPhone} = props;
  const {newUser, setNewUser} = props;

  if(uid === "" && phone === "" && !newUser){
    window.location.pathname="/"
  }

  const classes = useStyles();
  const [name, setName] = useState("");
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState("female");
  const [discount, setDiscount] = useState(DEFAULT_DISCOUNT);
  const [isMember, setIsMember] = useState(true);
  const [membershipStartDate, setMembershipStartDate] = useState(new Date());
  const [membershipRenewDate, setMembershipRenewDate] = useState(new Date());
  //TODO: Add Membership Renewal Maybe
  const [edit, setEdit] = useState(false || props.newUser);

  const handleEdit = (event) => {
    setEdit(true);
  };

  const handleDiscount = (event, newDiscount) => {
    if (edit) {
      setDiscount(newDiscount);
    }
  };

  const handleIsMember = (event) => {
    if (edit) {
      setIsMember(event.target.checked);
    }
  };

  const handleGender = (event) => {
    if (edit) {
      setGender(event.target.value);
    }
  };

  const handleName = (event) => {
    if (edit) {
      setName(event.target.value);
    }
  };

  const handleDob = (value) => {
    if (edit) {
      setDob(value);
    }
  };
  
  const handlePhone = (event) => {
    if (edit) {
      setPhone(event.target.value);
    }
  }

  const [bill, setBill] = useState(0.0);
  const [discountAmt, setDiscountAmt] = useState(0.0);

  const handleBill = (event) => {
    setBill(event.target.value);
    setDiscountAmt(0);
  };

  const calculateBill = (event) => {
    let damt = (bill * discount) / 100;
    setDiscountAmt(damt);
  };

  const getFirestoreData = () => {
    let userRef = firestore.collection(FIRESTORE_COLLECTION_CLIENTS).doc(uid);
    userRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          setName(userData.full_name);
          setPhone(userData.phone)
          setDob(new Date(userData.dob.seconds * 1000));
          setGender(userData.gender);
          setIsMember(userData.is_member);
          setDiscount(userData.discount);
          setMembershipStartDate(
            new Date(userData.membership_start_date * 1000)
          );
          setMembershipRenewDate(
            new Date(userData.membership_renew_date * 1000)
          );
        } else {
          setNewUser(true);
          setEdit(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if(!newUser){
      getFirestoreData();
    }
  }, [])

  const handleSubmit = () => {
    firestore
      .collection(FIRESTORE_COLLECTION_CLIENTS)
      .add({
        full_name: name,
        dob: dob,
        gender: gender,
        membership_start_date: membershipStartDate,
        membership_renew_date: membershipRenewDate,
        phone: phone,
        is_member: true,
        discount: discount,
      })
      .then((response) => {
        console.log(response);
        setUid(response.id)
        setNewUser(false);
        setEdit(false);
        alert.success("Client Successfully Added");
      })
      .catch((error) => {
        console.log(error);
        alert.error(
          "Client Details could not be updated. Please not down the details and try again later"
        );
      });
  };

  const handleUpdate = () => {
    firestore
      .collection(FIRESTORE_COLLECTION_CLIENTS)
      .doc(uid)
      .update({
        full_name: name,
        dob: dob,
        gender: gender,
        membership_start_date: membershipStartDate,
        membership_renew_date: membershipRenewDate,
        is_member: true,
        discount: discount,
      })
      .then((response) => {
        console.log(response);
        setNewUser(false);
        setEdit(false);
        alert.success("Client Details Successfully Updated");
      })
      .catch((error) => {
        console.log(error);
        alert.error(
          "Client Details could not be updated. Please not down the details and try again later"
        );
      });
  };

  const handleCancel = () => {
    getFirestoreData();
    setEdit(false);
  };

  return (
    <div className="flex container divide-x-2 divide-solid space-x-4 bg-gray-50 p-5 rounded-md shadow-lg w-full">
      <form>
        <div className="flex">
          <h6 className="font-bold">
            Client Details
          </h6>
          <Button
            disabled={newUser}
            classes={{ root: classes.authButton }}
            color="secondary"
            startIcon={<EditIcon fontSize="small" />}
            style={{ justifyContent: "flex-end" }}
            onClick={handleEdit}
          >
            Edit
          </Button>
        </div>
        <div className={classes.detailsFlexBox}>
          <TextField
            required
            readOnly={!edit}
            id="name"
            label="Name"
            className={classes.authField}
            value={name}
            onChange={handleName}
          />
          <TextField
            required
            readOnly={!edit}
            id="phone"
            label="Phone"
            className={classes.authField}
            value={phone}
            onChange={handlePhone}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              variant="inline"
              id="dob"
              className={classes.authField}
              label="Date of Birth"
              format="dd/MM/yyyy"
              value={dob}
              onChange={handleDob}
              readOnly={!edit}
              cancelLabel={"cancel"}
            />
          </MuiPickersUtilsProvider>
          <FormControl
            readOnly={!edit}
            component="fieldset"
            className={classes.authField}
          >
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender"
              value={gender}
              onChange={handleGender}
            >
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={isMember}
                onChange={handleIsMember}
                id="is-member"
                color="primary"
                readOnly={!edit}
              />
            }
            label="Is Member?"
          />
          <FormControl className={classes.authField}>
            <FormLabel>
              <Typography style={{ color: "#121212" }}>
                Discount: {discount} %{" "}
              </Typography>
              <Collapse in={edit}>
                <Slider
                  onChange={handleDiscount}
                  defaultValue={discount}
                  step={1}
                  min={0}
                  max={50}
                  marks={[
                    { value: 0, label: "0 %" },
                    { value: 50, label: "50 %" },
                  ]}
                  valueLabelDisplay="on"
                />
              </Collapse>
            </FormLabel>
          </FormControl>
          {newUser ? (
            <Button
              classes={{ root: classes.authButton }}
              onClick={handleSubmit}
            >
              <b>Submit</b>
            </Button>
          ) : (
            <ButtonGroup>
              <Button
                disabled={!edit}
                classes={{ root: classes.authButton }}
                onClick={handleUpdate}
              >
                <b>Update</b>
              </Button>
              <Button
                disabled={!edit}
                classes={{ root: classes.authButton }}
                onClick={handleCancel}
              >
                <b>Cancel</b>
              </Button>
            </ButtonGroup>
          )}
        </div>
      </form>
      {!edit && !newUser ? (
        <>
          <div className={classes.billFlexBox}>
            <TextField
              required
              id="bill"
              label="Bill Amount"
              className={classes.authField}
              value={bill}
              onChange={handleBill}
            />
            <TextField
              readonly
              id="discount"
              label="Discount"
              className={classes.authField}
              value={discount}
            />
            <Button
              style={{ marginTop: "10px" }}
              color="primary"
              raised
              variant="contained"
              onClick={calculateBill}
            >
              <b>Calculate Bill</b>
            </Button>
            <Divider />
            <table style={{ visibility: discountAmt ? "" : "hidden" }}>
              <tr>
                <td>Total Bill</td>
                <td>{bill}</td>
              </tr>
              <tr>
                <td>Discount : {discount} %</td>
                <td>{discountAmt}</td>
              </tr>
              <tr>
                <td>Amount to be payed</td>
                <td>{bill - discountAmt}</td>
              </tr>
            </table>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
