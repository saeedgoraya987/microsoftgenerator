from flask import Flask, request, jsonify
import requests
import logging

app = Flask(__name__)

logging.basicConfig(level=logging.INFO)

@app.route('/api/getOffice', methods=['POST'])
def get_office():
    try:
        logging.info("Received request for getOffice")
        
        data = {
            "subscription": "16ddbbfc-09ea-4de2-b1d7-312db6112d70",
            "email": {
                "username": "tanji",
                "domain": "2gfre.mcsoft.org"
            },
            "code": "Teams@Free"
        }

        response = requests.post('https://2gfre.kskb.eu.org/getOffice', json=data)
        response.raise_for_status()  # This will raise an error for bad HTTP status codes

        logging.info("Received response from external API")
        return jsonify(response.json()), response.status_code

    except requests.exceptions.RequestException as e:
        logging.error(f"Request failed: {e}")
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        logging.exception("An unexpected error occurred")
        return jsonify({"error": "An unexpected error occurred: " + str(e)}), 500

if __name__ == '__main__':
    app.run()
