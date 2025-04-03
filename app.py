   from flask import Flask, request, jsonify
   import requests

   app = Flask(__name__)

   @app.route('/api/getOffice', methods=['POST'])
   def get_office():
       data = {
           "subscription": "16ddbbfc-09ea-4de2-b1d7-312db6112d70",
           "email": {
               "username": "tanji",
               "domain": "2gfre.mcsoft.org"
           },
           "code": "Teams@Free"
       }
       
       # Send a request to the external API
       try:
           response = requests.post('https://2gfre.kskb.eu.org/getOffice', json=data)
           response.raise_for_status()  # Raise an error for bad responses
           return jsonify(response.json()), response.status_code
       except requests.exceptions.RequestException as e:
           return jsonify({"error": str(e)}), 500

   if __name__ == '__main__':
       app.run()
   
