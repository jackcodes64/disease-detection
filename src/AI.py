import requests
import base64
import os

image_path = os.path.join(os.path.dirname(__file__), "test_image.png")

url = "https://susya.onrender.com"

# Open an image and convert to Base64
with open( image_path, "rb") as img_file:
    img_data = base64.b64encode(img_file.read()).decode("utf-8")

# Send request
response = requests.post(url, json={"image": img_data})

print(response.text)
