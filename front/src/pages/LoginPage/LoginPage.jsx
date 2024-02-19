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

const LinkStyled = styled(Link)({
    display: 'block',
    textAlign: 'center',
    marginTop: '13px',
})

const LoginPage = () => {
    const [Cards, setCards] = useState(['']);
    const [selectedImage, setSelectedImage] = useState(null);

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
                alert("Não foi possivel carregar os cards!");
                console.log(error);
            }
        )
    }

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <StyledEngineProvider injectFirst>
            <div style={{textAlign: 'center'}}>
                {selectedImage && (
                    <div style={{display: 'inline-block', textAlign: 'center'}}>
                        {selectedImage === 'camera' ? (
                            <video
                                autoPlay
                                style={{width: '100%', maxWidth: '300px', maxHeight: '300px', marginTop: '20px'}}
                            />
                        ) : (
                            <img
                                src={selectedImage}
                                alt="Uploaded"
                                style={{maxWidth: '100%', maxHeight: '300px', marginTop: '20px'}}
                            />
                        )}
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    style={{display: 'none'}}
                    id="upload-image"
                />
                <label htmlFor="upload-image">
                    <ButtonStyled variant="contained" htmlFor="upload-image" component="span">
                        Upload Picture
                    </ButtonStyled>
                </label>
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