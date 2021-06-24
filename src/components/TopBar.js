import React from "react";
import { AppBar, IconButton, makeStyles, Toolbar, Tooltip } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home';
import { navigate } from '@reach/router';
import { logout } from '../services/auth';

const useStyles = makeStyles(theme => ({
    topbar: {
        alignItems:'center',
        justifyContent: 'center'
    },
    margin: {
        margin: theme.spacing(1)
    }
}))

export default function TopBar(props) {
    const classes = useStyles()
    const handleHome = (event) => {
        navigate('/')
        logout()
    }
    return (
        <AppBar position="fixed" className={classes.topbar}>
            <Toolbar>
                <Tooltip title="Home">
                    <IconButton onClick={handleHome} className={classes.margin}>
                        <HomeIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    )
}