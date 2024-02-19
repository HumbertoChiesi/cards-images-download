import React, {useEffect, useState} from "react";
import {
    Button, Link,
    StyledEngineProvider, TextField,
} from "@mui/material";
import PkmTcgService from "../../services/PkmTcgService";
import Card from "./PkmCard";
import {styled} from "@mui/system";
import RegisterLink from "./RegisterLink";

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

const TextFieldStyled = styled(TextField)({
    mx: 'auto',
    borderRadius:30,
    backgroundColor: '#FFFFFF',
    display: 'block',
    width: 330,
    height: '60px',
    paddingTop: 0,
    paddingBottom: 10,
    marginTop: '36px',
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

const LinkStyled = styled(Link)({
    display: 'block',
    textAlign: 'center',
    marginTop: '13px',
})

const LoginPage = () => {
    const [Cards, setCards] = useState(['']);

    useEffect(() => {
        getCards()
    }, [])

    function getCards(){
        const randomPageNumber = Math.floor(Math.random() * 400) + 1;

        PkmTcgService.get("", {
            params: {
                pageSize: 5,
                page: randomPageNumber
            }
        }).then((response) => {
            console.log(response.data)
            const extractedImages = response.data.data.map((card) => card.images.small);
            console.log(extractedImages.length)
            setCards(extractedImages);
        }).catch(
            function (error){
                alert("Não foi possivel carregar os flash cards!");
                console.log(error);
            }
        )
    }

    return (
        <StyledEngineProvider injectFirst>
            <TextFieldStyled label="User" style={{marginTop: '8%'}}/>
            <TextFieldStyled label="Password" type="password"/>
            <ButtonStyled variant="contained">Sign In</ButtonStyled>
            <RegisterLink/>
            {
                Cards.map((card, index) => (
                    <Card key={index} image={card} index={index}/>
                ))
            }
        </StyledEngineProvider>
    )
}

export default LoginPage