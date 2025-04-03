const { StableDiffusionImg2ImgPipeline } = require('diffusers');
const express = require('express');
const cors = require('cors');
const { loadImage } = require('canvas'); 
const axios = require('axios');

const app = express();
app.use(cors());

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
        console.error('Error generating image: ', error);
        res.status(500).send('Error generating image: ' + error.message);
    }
});

const loadModel = async () => {
    const modelId = "nitrosocke/Ghibli-Diffusion";
    try {
        const model = await StableDiffusionImg2ImgPipeline.from_pretrained(modelId);
        return model;
    } catch (error) {
        throw new Error('Failed to load model: ' + error.message);
    }
};

const generateGhibliImage = async (image, pipe, strength) => {
    const prompt = "Ghibli-style anime painting, soft pastel colors, highly detailed, masterpiece";
    try {
        return await pipe(prompt, { image, strength });
    } catch (error) {
        throw new Error('Failed to generate image: ' + error.message);
    }
};

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
