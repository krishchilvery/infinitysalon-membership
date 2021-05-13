import './App.css';
import firebase from "firebase";
import { firebaseConfig } from "./components/config";
import TopBar from './components/TopBar';
import { useState } from 'react';
import { createMuiTheme, CssBaseline, Snackbar, ThemeProvider } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import UserDetails from './components/UserDetails';
import FirebaseUI from './components/FirebaseUI';

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

function App() {
  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
  }else{
      firebase.app()
  }
  window.firebase = firebase
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSuccess = (message) => {
    setSuccessMessage(message)
    setSuccess(true)
  }
  
  const handleClose = () => {
    setSuccess(false)
    setSuccessMessage("")
    setError(false)
    setErrorMessage("")
  }

  const handleError = (message) => {
    setErrorMessage(message)
    setError(true)
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Router>
          <TopBar />
          <Switch>
              <Route path="/user">
                <UserDetails handleSuccess={handleSuccess} handleError={handleError}/>
              </Route>
              <Route path="/">
                <FirebaseUI handleSuccess={handleSuccess} handleError={handleError}/>
              </Route>
          </Switch>
        </Router>
        <Snackbar open={success} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>
        <Snackbar open={error} autoHideDuration={20000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            {errorMessage}
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}

export default App;
