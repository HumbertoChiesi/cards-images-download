import React, {useEffect, useState} from "react";
import {
    Button, Link,
    StyledEngineProvider, TextField,
} from "@mui/material";
import PkmTcgService from "../../services/PkmTcgService";
import Card from "../../components/PkmCard";
import ObjectDetection from "../../components/ObjectDetection"
import {styled} from "@mui/system";
import axios from 'axios';

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
    marginTop: '13px',
})

const LoginPage = () => {
    const [Cards, setCards] = useState(['']);
    const [selectedImage, setSelectedImage] = useState(null);
    const [prediction, setPrediction] = useState(null);

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
            const extractedImages = response.data.data.map((card) => card.images.small);
            console.log(extractedImages.length)
            setCards(extractedImages);
        }).catch(
            function (error){
                alert("Não foi possivel carregar os cards!");
                console.log(error);
            }
        )
    }

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = async () => {
            setSelectedImage(reader.result);
            // Convert the base64 data to a FormData object
            const formData = new FormData();
            formData.append('file', file);
            try {
                const response = await axios.post('http://localhost:8000/predict/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setPrediction(response.data.prediction);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <StyledEngineProvider injectFirst>
            <div style={{textAlign: 'center'}}>
                <ObjectDetection/>
            </div>
            {
                Cards.map((card, index) => (
                    <Card key={index} image={card} index={index}/>
                ))
            }
        </StyledEngineProvider>
    )
}

export default LoginPage