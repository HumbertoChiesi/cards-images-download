import React, {useState} from "react";
import {
    TextField,
    Button,
    Box,
    Link,
    StyledEngineProvider, Backdrop,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {styled} from "@mui/system";

const BoxStyled = styled(Box)({
    width: 519,
    height: 500,
    backgroundColor: '#FFFFFF',
    borderRadius: '50px',
    outline: '1px solid #000',
    position: 'absolute',
    margin: 'auto',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
})
const TextFieldStyled = styled(TextField)({
    mx: 'auto',
    borderRadius:30,
    backgroundColor: '#c4c5d6',
    display: 'block',
    width: 325,
    height: 65,
    marginTop: '30px',
    marginLeft: 'auto',
    marginRight: 'auto',
    '& label.Mui-focused': {
        color: 'black',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            border: 0,
            borderRadius: 30,
        },
        '&:hover fieldset': {
            border: 0,
            borderRadius: 30
        },
        '&.Mui-focused fieldset': {
            border: 0,
            borderRadius: 30
        },
    }
})
const ButtonStyled = styled(Button)({
    backgroundColor: '#666bc4',
    color: '#c8d6c4',
    display: 'block',
    marginTop: '67px',
    borderRadius:30,
    width: 200,
    height: 65,
    marginLeft: 'auto',
    marginRight: 'auto',
    '&:hover': {
        backgroundColor: '#111abf',
    },
})
const LinkStyled = styled(Link)({
    display: 'block',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '13px',
})
const CloseIconStyled = styled(CloseIcon)({
    width: '40px',
    height: '40px',
    color: '#886ca1',
    marginTop: '10px',
    marginRight: '10px',
    marginLeft: '450px'
})


const RegisterLink = () => {
    const [Name, setName] = useState('');
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [popUp, setpopUp] = React.useState(false)

    const token = sessionStorage.getItem('token');

    if (token !== null){
        window.location.href="http://localhost:3000/home";
    }

    function setToken(userToken) {
        sessionStorage.setItem('token', userToken);
    }

    function handlePopUp(e){
        if (popUp){
            setpopUp(false)
        } else {
            setpopUp(true)
        }
    }

    return (
        <StyledEngineProvider injectFirst>
            <LinkStyled underline="hover" color="inherit" onClick={()=>{handlePopUp();}}>
                SignUp
            </LinkStyled>
            {
                popUp === true
                    ? <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={popUp}>

                        <BoxStyled>
                            <Button onClick={()=>{handlePopUp();}}><CloseIconStyled/></Button>
                            <TextFieldStyled onChange={e => setName(e.target.value)}
                                             label="Type your email"
                                             fullWidth id="fullWidth"
                            />
                            <TextFieldStyled onChange={e => setUsername(e.target.value)}
                                             label="Type your username"
                                             fullWidth id="fullWidth"
                            />
                            <TextFieldStyled onChange={e => setPassword(e.target.value)}
                                             label="Type your password"
                                             type="password"
                                             fullWidth id="fullWidth"
                            />
                            <ButtonStyled variant="contained">Sign Up</ButtonStyled>
                        </BoxStyled>

                    </Backdrop>
                    : null
            }
        </StyledEngineProvider>
    )
}

export default RegisterLink