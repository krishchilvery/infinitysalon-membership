import { Button, Container, InputAdornment, makeStyles, Paper, TextField, RadioGroup, Radio, FormControl, FormControlLabel, FormLabel, Typography, Slider } from "@material-ui/core";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database"
import "firebase/firestore"
import { firebaseConfig } from "./config";
import { useHistory } from "react-router";

const useStyles = makeStyles(theme => ({
    authPaper: {
        backgroundColor: '#121212',
        padding: "20px",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50vh'
    },
    phoneFlexBox: {
        display: 'flex',
        flexDirection: 'row'
    },
    authField: {
        margin:theme.spacing(1),
        backgroundColor: '#121212'
    },
    hiddenAuthField: {
        visibility: "hidden"
    },
    authButton: {
        textTransform: "none",
        "&:disabled": {
            visibility: "hidden"
        }
    },
    detailsFlexBox: {
        display: "flex",
        flexDirection: "column"
    }
    })
)

export default function AddMember(props) {
    const {handleSuccess, handleError} = props
    const history = useHistory()
    if(!firebase.apps.length){
        firebase.initializeApp(firebaseConfig)
    }else{
        firebase.app()
    }
    const classes = useStyles()

    useEffect(()=>{
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
              console.log(response)
            }
        });
    }, [])
    
    const onSignInSubmit = () => {
        const phoneNumber = "+91"+phone;
        const appVerifier = window.recaptchaVerifier;
        firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            handleSuccess("OTP Sent to the Client")
            console.log("OTP Sent") 
            setShowOtpField(true)
            window.confirmationResult = confirmationResult;
            // ...
        }).catch((error) => {
            console.error(error)
            handleError("OTP Could not be sent. Please note down the phonenumber and try again later.")
            // Error; SMS not sent
            // ...
        });
    }

    const handleVerify = () => {
        const code = otp;
        window.confirmationResult.confirm(code).then(response => {
            window.user = response.user
            console.log("Successfully Verified")
            handleSuccess("User Created! Please enter additional details in the next page.")
            history.push("/user", {newUser: true})
        }).catch(error => {
            handleError("User could not be created. Please note down the phonenumber and try again later.")
            console.log(error)
        })
    }

    const [phone, setPhone] = useState("")
    const [otp, setOtp] = useState("")
    const [phoneValidation, setPhoneValidation] = useState(true) 
    const [showOtpField, setShowOtpField] = useState(false)
    

    useEffect(()=> {
        if(!phoneValidation){
            setShowOtpField(false)
        }
    }, [phoneValidation])

    const handlePhone = (event) => {
        const phoneRe = /^([0-9]){10}$/g
        if(phoneRe.test(event.target.value)){
            setPhoneValidation(true)
        }else{
            setPhoneValidation(false)
        }
        setPhone(event.target.value)
    }
    const handleOtp = (event) => {
        setOtp(event.target.value)
    }
    const sendOtp = () => {
        onSignInSubmit()
    }

    return (
        <Container>
            <Paper className={classes.authPaper}>
                <form noValidate>
                    <div className={classes.phoneFlexBox}>
                        <TextField
                            error={!phoneValidation}
                            helperText={phoneValidation?"":"Not a Valid Phone Number"}
                            className={classes.authField}
                            required 
                            id="phone-number" 
                            label="Phone"
                            variant="outlined"
                            value={phone}
                            onChange={handlePhone}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">+91</InputAdornment>
                            }}
                        />
                        <Button classes={{root: classes.authButton}} disabled={!(phoneValidation && phone)} id="sign-in-button" onClick={sendOtp}><b>Send OTP</b></Button>
                    </div>
                    <div className={`${showOtpField ? classes.authField : classes.hiddenAuthField} ${classes.phoneFlexBox}`}>
                        <TextField
                            id="otp"
                            label="OTP"
                            variant="outlined"
                            className={classes.authField}
                            value={otp}
                            onChange={handleOtp}
                        />
                        <Button classes={{root: classes.authButton}} onClick={handleVerify}><b>Verify</b></Button>
                    </div>
                </form>
            </Paper>
        </Container>
    )
}