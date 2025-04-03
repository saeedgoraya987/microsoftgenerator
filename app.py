   from flask import Flask, request, jsonify, send_file
   from diffusers import StableDiffusionImg2ImgPipeline
   import torch
   from PIL import Image
   import io

   app = Flask(__name__)

   # Load model function
   def load_model():
       model_id = "nitrosocke/Ghibli-Diffusion"  # Correct model ID
       dtype = torch.float16 if torch.cuda.is_available() else torch.float32
       print("Loading model...")
       pipe = StableDiffusionImg2ImgPipeline.from_pretrained(model_id, torch_dtype=dtype)
       pipe.to("cuda" if torch.cuda.is_available() else "cpu")
       pipe.enable_attention_slicing()  # Optimize memory usage
       print("Model loaded!")
       return pipe

   pipe = load_model()

   @app.route('/generate', methods=['POST'])
   def generate_ghibli_image():
       if 'image' not in request.files:
           return jsonify({'error': 'No file uploaded.'}), 400
       
       image_file = request.files['image']
       image = Image.open(image_file).convert("RGB")
       image = image.resize((512, 512))  # Ensure proper size

       prompt = "Ghibli-style anime painting, soft pastel colors, highly detailed, masterpiece"
       strength = float(request.form.get('strength', 0.6))  # Default strength if not provided
       strength = max(0.3, min(0.8, strength))  # Clamp between 0.3 and 0.8

       print("Generating image...")
       result = pipe(prompt=prompt, image=image, strength=strength).images[0]

       # Save the result to a BytesIO object
       img_io = io.BytesIO()
       result.save(img_io, 'PNG')
       img_io.seek(0)

       return send_file(img_io, mimetype='image/png', as_attachment=True, download_name='ghibli_portrait.png')

   if __name__ == '__main__':
       app.run(host='0.0.0.0', port=5000)
   
