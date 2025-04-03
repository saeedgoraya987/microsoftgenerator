const axios = require('axios');

module.exports = async (req, res) => {
    // Check if the request method is POST
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    // Generate a random 5-digit number
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;

    // Create the payload
    const payload = {
        subscription: "16ddbbfc-09ea-4de2-b1d7-312db6112d70",
        email: {
            username: `${randomNumber}_tanji`,  // Prepend random number to username
            domain: "2gfre.mcsoft.org"
        },
        code: "Teams@Free"
    };

    // Set the headers
    const headers = {
        "Content-Type": "application/json"
    };

    try {
        // Make the POST request
        const response = await axios.post("https://2gfre.kskb.eu.org/getOffice", payload, { headers });

        // Send back the response from the external API
        res.status(200).json(response.data);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(error.response ? error.response.status : 500).send(error.message || 'Error occurred');
    }
};
