import { AppBar, IconButton, makeStyles, Toolbar, Tooltip, Typography } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home';
import { useHistory } from 'react-router-dom';

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
    let history = useHistory()
    const classes = useStyles()
    const handleHome = (event) => {
        history.push('/')
        window.user = null
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