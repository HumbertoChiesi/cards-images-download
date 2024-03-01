import React, {useState} from "react";
import * as tf from '@tensorflow/tfjs';
import {styled} from "@mui/system";
import {Button} from "@mui/material";


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

const ObjectDetection = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [detectedObjects, setDetectedObjects] = useState([]);

    const loadModel = async () => {
        return await tf.loadGraphModel('./src/model/best.onnx');
    };

    // Function to postprocess the model output and extract detected objects
    const postprocessOutput = (output) => {
        // Example: Extract bounding boxes, labels, and scores from the output tensor
        const boxes = output[0].arraySync(); // Example: Output tensor containing bounding box coordinates
        const labels = output[1].arraySync(); // Example: Output tensor containing class labels
        const scores = output[2].arraySync(); // Example: Output tensor containing confidence scores

        // Combine bounding boxes, labels, and scores into detected objects
        return boxes.map((box, index) => ({
            box,
            label: labels[index],
            score: scores[index]
        }));
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        setSelectedImage(URL.createObjectURL(file)); // Display the uploaded image

        const reader = new FileReader();
        reader.onload = async (e) => {
            const imgDataUrl = e.target.result;
            const img = new Image();
            img.onload = async () => {
                const tensor = tf.browser.fromPixels(img);
                const model = await loadModel();

                // Preprocess the input image if needed
                // Example: const preprocessedImage = preprocessImage(tensor);

                // Perform inference with the model
                const output = await model.executeAsync(tensor);

                // Postprocess the output to get detected objects
                const detectedObjects = postprocessOutput(output);

                // Update state with detected objects
                setDetectedObjects(detectedObjects);

                tensor.dispose(); // Dispose tensor to free up memory
            };
            img.src = imgDataUrl;
        };
        reader.readAsDataURL(file);
    };

    return (
        <div>
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
            {selectedImage && (
                <div style={{position: 'relative', display: 'inline-block'}}>
                    <img src={selectedImage} alt="Uploaded"/>
                    {detectedObjects.map((object, index) => (
                        <div
                            key={index}
                            style={{
                                position: 'absolute',
                                border: '2px solid red',
                                borderRadius: '3px',
                                top: `${object.box[0]}px`,
                                left: `${object.box[1]}px`,
                                width: `${object.box[2] - object.box[0]}px`,
                                height: `${object.box[3] - object.box[1]}px`
                            }}
                        >
                            <p style={{ margin: 0, background: 'red', color: 'white' }}>{object.label}: {object.score}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ObjectDetection;
