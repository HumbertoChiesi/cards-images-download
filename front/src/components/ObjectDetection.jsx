import * as ort from 'onnxruntime-web';
import {useEffect, useRef, useState} from "react";


const modelPath = process.env.PUBLIC_URL + "/best.onnx";

const InferenceSession = ort.InferenceSession;
const ObjectDetection = () => {
    const [session, setSession] = useState(null);
    const canvasHTMLRef = useRef(null);

    useEffect( () => {
        async function get_session(){
            setSession(await InferenceSession.create(modelPath));
        }
        get_session()
    }, []);

    async function handleImage(img) {
        const canvas = document.createElement('canvas');
        canvas.width = 640; // Set the desired width
        canvas.height = 640; // Set the desired height
        const ctx = canvas.getContext('2d');

        // Draw the image onto the canvas with the desired dimensions
        ctx.drawImage(img, 0, 0, 640, 640);
        const resizedImageDataUrl = canvas.toDataURL();

        // Convert the canvas content to a data URL
        const htmlTensor = await ort.Tensor.fromImage(resizedImageDataUrl);
        const imageHTML = htmlTensor.toImageData();

        const contextHTML = canvasHTMLRef.current.getContext('2d');
        canvasHTMLRef.current.width = 640;
        canvasHTMLRef.current.height = 640;
        contextHTML.drawImage(img, 0, 0, 640, 640);

        try {
            const inputTensor = new ort.Tensor('float32', htmlTensor.data, [1, 3, imageHTML.height, imageHTML.width]);
            const feeds = { "images": inputTensor };
            const outputMap = await session.run(feeds);
            drawBoundingBoxes(outputMap, ctx);
        } catch (error) {
            console.error('Error running inference:', error);
        }
    }

    function drawBoundingBoxes(outputMap, ctx) {
        const output0 = outputMap.output0.data;
        const cardCount = output0[0];
        const scores = output0.slice(1, cardCount + 1);
        const boxes = output0.slice(cardCount + 1);

        for (let i = 0; i < cardCount; i++) {
            const score = scores[i];
            if (score > 0.5) { // Only draw bounding boxes for high-confidence detections
                const boxOffset = i * 4;
                const ymin = boxes[boxOffset] * 640;
                const xmin = boxes[boxOffset + 1] * 640;
                const ymax = boxes[boxOffset + 2] * 640;
                const xmax = boxes[boxOffset + 3] * 640;

                ctx.beginPath();
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.rect(xmin, ymin, xmax - xmin, ymax - ymin);
                ctx.stroke();
            }
        }
    }

    function loadImage(fileReader) {
        const img = document.getElementById('original-image');
        img.onload = () => handleImage(img);
        img.src = fileReader.result;
    }

    function handleFileChange(evt) {
        const files = evt.target.files;
        if (FileReader && files && files.length) {
            const fileReader = new FileReader();
            fileReader.onload = () => loadImage(fileReader);
            fileReader.readAsDataURL(files[0]);
        }
    }

    return (
        <div>
            <h1>Example</h1>
            <div>
                <input title="Image from File" type="file" id="file-in" name="file-in" onChange={handleFileChange}/>
                <img id="original-image" src="#" style={{display: 'none'}} alt="Original"/>
            </div>
            <h3>Image from tensor</h3>
            <canvas id="canvasHTMLElement" ref={canvasHTMLRef}></canvas>
        </div>
    );
};

export default ObjectDetection;
