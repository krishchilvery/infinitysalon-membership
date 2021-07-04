import { StyledFirebaseAuth } from "react-firebaseui";
import { useHistory } from "react-router";

export default function FirebaseUI(props) {
    const {handleSuccess ,handleError} = props
    const history = useHistory()
    if(!window.salon){
        history.push("/")
    }
    const uiConfig = ({
        signInOptions: [
            {
                provider: window.firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                recaptchaParameters: {
                    type: 'image',
                    size: 'invisible',
                    badge: 'bottomleft'
                },
                defaultCountry: 'IN'
            }
        ],
        signInSuccessUrl: '/user',
        callbacks:{
            signInSuccessWithAuthResult: (authResult, redirectUrl) => {
                console.log(authResult)
                window.user = authResult.user
                history.push('/user')
                handleSuccess("User successfully signed in / verified !!")
                return false
            },
            signInFailure: (error) => {
                console.log(error)
                window.user = null
                history.push('/')
                handleError("User registration/verification failed. Please not down the details and try again later.")
            }
        }
    })
    return(
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={window.firebase.auth()}/>
    )
}