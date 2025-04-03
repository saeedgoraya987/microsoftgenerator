import requests
import json
import random

# Define the API endpoint
url = "https://2gfre.kskb.eu.org/getOffice"

# Generate a random 5-digit number
random_number = random.randint(10000, 99999)

# Create the payload with a random username
payload = {
    "subscription": "16ddbbfc-09ea-4de2-b1d7-312db6112d70",
    "email": {
        "username": f"{random_number}_tanji",  # Prepend random number to username
        "domain": "2gfre.mcsoft.org"
    },
    "code": "Teams@Free"
}

# Set the headers if needed (e.g., for JSON content)
headers = {
    "Content-Type": "application/json"
}

# Make the POST request
response = requests.post(url, headers=headers, data=json.dumps(payload))

# Check the response
if response.status_code == 200:
    print("Response JSON:", response.json())
else:
    print("Error:", response.status_code, response.text)
