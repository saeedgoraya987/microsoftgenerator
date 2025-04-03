const { StableDiffusionImg2ImgPipeline } = require('diffusers');
const express = require('express');
const cors = require('cors'); // Import CORS package
const { loadImage } = require('canvas'); 
const axios = require('axios');

const app = express();
app.use(cors()); // Enable CORS for all routes

app.get('/api/generate', async (req, res) => {
    const imageUrl = req.query.image;
    const strength = parseFloat(req.query.strength) || 0.6;

    if (!imageUrl) {
        return res.status(400).send('Image URL is required');
    }

    try {
        const pipe = await loadModel();

        // Download and load the image
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const image = await loadImage(Buffer.from(response.data));

        // Generate Ghibli-style image
        const resultImage = await generateGhibliImage(image, pipe, strength);

        // Send back the image
        res.set('Content-Type', 'image/png');
        const buffer = await resultImage.png().toBuffer();
        res.send(buffer);
        
    } catch (error) {
        console.error('Request URL:', imageUrl);
        console.error('Error details:', error.message);
        res.status(500).send('Error generating image');
    }
});

const loadModel = async () => {
    const modelId = "nitrosocke/Ghibli-Diffusion";
    return await StableDiffusionImg2ImgPipeline.from_pretrained(modelId);
};

const generateGhibliImage = async (image, pipe, strength) => {
    const prompt = "Ghibli-style anime painting, soft pastel colors, highly detailed, masterpiece";
    return await pipe(prompt, { image, strength });
};

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
