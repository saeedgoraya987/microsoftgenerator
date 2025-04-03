const { StableDiffusionImg2ImgPipeline } = require('diffusers');
const express = require('express');
const { Image } = require('canvas');
const axios = require('axios');

const app = express();

app.get('/api/generate', async (req, res) => {
    const imageUrl = req.query.image;
    const strength = req.query.strength || 0.6;

    if (!imageUrl) {
        return res.status(400).send('Image URL is required');
    }

    try {
        // Load model
        const pipe = await loadModel();

        // Download the image
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const image = new Image();
        image.src = Buffer.from(response.data);

        // Generate Ghibli-style image
        const resultImage = await generateGhibliImage(image, pipe, strength);

        // Send back the image
        res.set('Content-Type', 'image/png');
        resultImage.png().pipe(res);
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating image');
    }
});

const loadModel = async () => {
    const modelId = "nitrosocke/Ghibli-Diffusion";
    const pipe = StableDiffusionImg2ImgPipeline.from_pretrained(modelId);
    return pipe;
};

const generateGhibliImage = async (image, pipe, strength) => {
    const prompt = "Ghibli-style anime painting, soft pastel colors, highly detailed, masterpiece";
    return await pipe(prompt, { image, strength });
};

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
