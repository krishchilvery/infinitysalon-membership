import './App.css';
import AddMember from './components/AddMember';
import TopBar from './components/TopBar';
import HomePage from './components/HomePage';
import { useState } from 'react';
import VerifyMember from './components/VerifyMember';
import { createMuiTheme, CssBaseline, Snackbar, ThemeProvider } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import UserDetails from './components/UserDetails';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
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

  const handleClose = (message) => {
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
              <Route path="/add">
                  <AddMember handleSuccess={handleSuccess} handleError={handleError}/>
              </Route>
              <Route path="/user">
                  <UserDetails handleSuccess={handleSuccess} handleError={handleError}/>
              </Route>
              <Route path="/verify">
                  <VerifyMember handleSuccess={handleSuccess} handleError={handleError}/>
              </Route>
              <Route path="/">
                  <HomePage />
              </Route>
          </Switch>
        </Router>
        {/* {page === 'home' && (<HomePage setPage={setPage} />)}
        {page === 'add' && (<AddMember handleSuccess={handleSuccess} handleError={handleError} />)}
        {page === 'verify' && (<VerifyMember handleSuccess={handleSuccess} handleError={handleError} />)} */}
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
