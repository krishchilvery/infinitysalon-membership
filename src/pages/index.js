import React from "react";
import TopBar from '../components/TopBar';
import { useState } from 'react';
import { createMuiTheme, CssBaseline, Snackbar, ThemeProvider } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Router } from '@reach/router'
import UserDetails from '../components/UserDetails';
import Authorize from "../components/Authorize";

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

function App() {
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
      <div className={"App"}>
        <TopBar />
        <Router>
          <Authorize path="/" handleSuccess={handleSuccess} handleError={handleError}/>
          <UserDetails path="/user" handleSuccess={handleSuccess} handleError={handleError}/>
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
