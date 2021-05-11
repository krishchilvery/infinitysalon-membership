import { Button, makeStyles } from '@material-ui/core'
import { useHistory } from 'react-router'

const useStyles = makeStyles(theme => ({
    home: {
        display: 'flex',
        flexDirection: 'row',
        width: '100vh',
        height: '50vh'
    },
    homePaper: {
        backgroundColor: '#121212',
        display: 'flex',
        flexDirection: 'column',
        alignItems:'center',
        justifyContent: 'center',
        margin: theme.spacing(2),
        width: '50%',
        fontSize: 'calc(10px + 2vmin)',
        textTransform: 'none',
    }
}))

export default function HomePage(props) {
    let history = useHistory()
    const classes = useStyles()
    const handleClick = (route) => {
        history.push(route)
    }
    return (
        <div className={classes.home}>
                <Button onClick={event => {handleClick("/add")}} className={classes.homePaper} >Add Member</Button>
                <Button onClick={event => {handleClick("/verify")}} className={classes.homePaper} >Verify Member</Button>
        </div>
    )
}