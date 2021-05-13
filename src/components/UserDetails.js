import { Button, ButtonGroup, Checkbox, Collapse, Divider, FormControl, FormControlLabel, FormLabel, makeStyles, Paper, Radio, RadioGroup, Slider, Table, TableCell, TableRow, TextField, Typography } from "@material-ui/core"
import DateFnsUtils from '@date-io/date-fns'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers'
import { useState } from "react"
import { DEFAULT_DISCOUNT, FIRESTORE_COLLECTION_CLIENTS } from "./config"
import { useHistory } from "react-router"
import EditIcon from '@material-ui/icons/Edit';


const useStyles = makeStyles(theme => ({
    mainFlexBox: {
        padding: "30px",
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70vh',
        maxWidth: '100vw'

    },
    detailsFlexBox: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    billFlexBox: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: '30px'
    },
    authField: {
        margin: theme.spacing(1),
    },
    authButton: {
        textTransform: "none",
        "&:disabled": {
            visibility: "hidden"
        }
    },
})
)

export default function UserDetails(props) {

    const firebase = window.firebase
    const firestore = firebase.firestore()

    const history = useHistory()

    const { handleSuccess, handleError } = props
    const classes = useStyles()
    const [name, setName] = useState("")
    const [dob, setDob] = useState(new Date())
    const [gender, setGender] = useState('female')
    const [discount, setDiscount] = useState(DEFAULT_DISCOUNT)
    const [isMember, setIsMember] = useState(true)
    const [membershipStartDate, setMembershipStartDate] = useState(new Date())
    const [membershipRenewDate, setMembershipRenewDate] = useState(new Date())
    //TODO: Add Membership Renewal Maybe
    const [newUser, setNewuser] = useState(false)
    const [edit, setEdit] = useState(false)

    const handleEdit = (event) => {
        setEdit(true)

    }

    const handleDiscount = (event, newDiscount) => {
        if (edit) {
            setDiscount(newDiscount)
        }

    }

    const handleIsMember = (event) => {
        if (edit) {
            setIsMember(event.target.checked)
        }

    }

    const handleGender = (event) => {
        if (edit) {
            setGender(event.target.value);
        }

    }

    const handleName = (event) => {
        if (edit) {
            setName(event.target.value)
        }
    }

    const handleDob = (date) => {
        if (edit) {
            setDob(date)
        }
    }

    const [bill, setBill] = useState(0.0)
    const [discountAmt, setDiscountAmt] = useState(0.0)

    const handleBill = (event) => {
        setBill(event.target.value)
        setDiscountAmt(0)
    }

    const calculateBill = (event) => {
        let damt = bill * discount / 100
        setDiscountAmt(damt)
    }

    const getFirestoreData = () => {
        const user = window.user
        if (!user) {
            history.replace("/")
        } else {
            let userRef = firestore.collection(FIRESTORE_COLLECTION_CLIENTS).doc(user.uid)
            userRef.get().then((doc) => {
                if (doc.exists) {
                    const userData = doc.data()
                    setName(userData.full_name)
                    setDob(new Date(userData.dob.seconds * 1000))
                    setGender(userData.gender)
                    setIsMember(userData.is_member)
                    setDiscount(userData.discount)
                    setMembershipStartDate(new Date(userData.membership_start_date * 1000))
                    setMembershipRenewDate(new Date(userData.membership_renew_date * 1000))
                } else {
                    setNewuser(true)
                    setEdit(true)
                }
            })
        }
    }

    getFirestoreData()

    const handleSubmit = () => {
        const user = window.user
        firestore.collection(FIRESTORE_COLLECTION_CLIENTS).doc(user.uid).set({
            full_name: name,
            dob: dob,
            gender: gender,
            membership_start_date: membershipStartDate,
            membership_renew_date: membershipRenewDate,
            is_member: true,
            discount: discount
        }).then(response => {
            console.log(response)
            setNewuser(false)
            setEdit(false)
            handleSuccess("Client Details Successfully Updated")
        }).catch(error => {
            console.log(error)
            handleError("Client Details could not be updated. Please not down the details and try again later")
        })
    }

    const handleUpdate = () => {
        const user = window.user
        firestore.collection(FIRESTORE_COLLECTION_CLIENTS).doc(user.uid).update({
            full_name: name,
            dob: dob,
            gender: gender,
            membership_start_date: membershipStartDate,
            membership_renew_date: membershipRenewDate,
            is_member: true,
            discount: discount
        }).then(response => {
            console.log(response)
            setNewuser(false)
            setEdit(false)
            handleSuccess("Client Details Successfully Updated")
        }).catch(error => {
            console.log(error)
            handleError("Client Details could not be updated. Please not down the details and try again later")
        })
    }

    const handleCancel = () => {
        getFirestoreData()
        setEdit(false)
    }

    return (
        <Paper className={classes.mainFlexBox}>
            <form style={{ width: "100%", paddingRight: "30px" }}>
                <FormLabel>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Typography variant="h6" style={{ color: "#121212" }}>Client Details</Typography>
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
                </FormLabel>
                <Divider />
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
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            margin="normal"
                            variant="outlined"
                            id="dob"
                            className={classes.authField}
                            label="Date of Birth"
                            format="dd/MM/yyyy"
                            value={dob}
                            onChange={handleDob}
                            readOnly={!edit}
                        />
                    </MuiPickersUtilsProvider>
                    <FormControl readOnly={!edit} component="fieldset" className={classes.authField}>
                        <FormLabel component="legend">Gender</FormLabel>
                        <RadioGroup aria-label="gender" name="gender" value={gender} onChange={handleGender}>
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="other" control={<Radio />} label="Other" />
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
                            <Typography style={{ color: "#121212" }}>Discount: {discount} % </Typography>
                            <Collapse in={edit}>
                                <Slider
                                    onChange={handleDiscount}
                                    defaultValue={discount}
                                    step={1}
                                    min={0}
                                    max={50}
                                    marks={[{ value: 0, label: "0 %" }, { value: 50, label: "50 %" }]}
                                    valueLabelDisplay="on"
                                />
                            </Collapse>
                        </FormLabel>
                    </FormControl>
                    {
                        newUser ?
                            <Button classes={{ root: classes.authButton }} onClick={handleSubmit}><b>Submit</b></Button> :
                            (
                                <ButtonGroup>
                                    <Button disabled={!edit} classes={{ root: classes.authButton }} onClick={handleUpdate}><b>Update</b></Button>
                                    <Button disabled={!edit} classes={{ root: classes.authButton }} onClick={handleCancel}><b>Cancel</b></Button>
                                </ButtonGroup>
                            )
                    }
                </div>
            </form>
            {
                (!edit && !newUser) ?
                    (
                        <>
                            <Divider orientation="vertical" />
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
                                <Button style={{ marginTop: '10px' }} color="primary" raised variant="contained" onClick={calculateBill}><b>Calculate Bill</b></Button>
                                <Divider />
                                <Table style={{ visibility: discountAmt ? '' : 'hidden' }}>
                                    <TableRow>
                                        <TableCell>Total Bill</TableCell>
                                        <TableCell>{bill}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Discount : {discount} %</TableCell>
                                        <TableCell>{discountAmt}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Amount to be payed</TableCell>
                                        <TableCell>{bill - discountAmt}</TableCell>
                                    </TableRow>
                                </Table>
                            </div>
                        </>
                    ) :
                    (<></>)
            }
        </Paper>
    )
}