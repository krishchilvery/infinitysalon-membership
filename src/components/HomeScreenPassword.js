import { Button, makeStyles, Paper, TextField } from "@material-ui/core";
import { useState } from "react";
import { useHistory } from "react-router";

const useStyles = makeStyles(theme => ({
    mainFlexBox: {
        padding: "30px",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100vw'
    }
})
)

export default function HomeScreenPassword(props) {
    const history = useHistory()
    if(window.salon){
        history.push('/verify')
    }
    const firebase = window.firebase
    const firestore = firebase.firestore()
    const [password, setPassword] = useState('')
    const checkPassword = () => {
        firestore.collection('app').doc('secrets').get().then((doc) => {
            if(doc.exists){
                const pin = doc.data().pin
                if(password === pin){
                    window.salon=true
                    handleSuccess("Successfully Authenticated")
                    history.push("/verify")
                }else{
                    handleError("Wrong Pin. Please try again")
                }
            } else {
                handleError("Server error. Please contact developer")
            }
        })
    }
    const classes = useStyles()
    const {handleSuccess, handleError} = props
    return (
        <Paper className={classes.mainFlexBox}>
            <TextField
                required
                type="password"
                id="password"
                label="Password"
                className={classes.authField}
                value={password}
                onChange={(event) => {setPassword(event.target.value)}}
            />
            <br/>
            <Button color="primary" variant="contained" onClick={checkPassword}>Authenticate</Button>
        </Paper>
    )
}