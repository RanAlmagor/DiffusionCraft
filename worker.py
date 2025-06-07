import requests
import time
import base64
import json
from PIL import Image
from io import BytesIO
from datetime import datetime
from colorama import Fore, Style, init
from tqdm import tqdm
import os
import sys

print("\n🌀 Starting DiffusionCraft Worker... Initializing components...\n")
sys.stdout.flush()

import torch
from diffusers import StableDiffusionPipeline

# === INIT ===
init(autoreset=True)
os.system("title DiffusionCraft Worker")  # Windows only

# === CONFIGURATION ===
GATEWAY_BASE_URL = "https://vwx6lrkyh4.execute-api.us-east-1.amazonaws.com/prod"
READ_PROMPT_URL = f"{GATEWAY_BASE_URL}/readPromptFromQueue"
UPLOAD_IMAGE_URL = f"{GATEWAY_BASE_URL}/uploadImageData"
CHECK_INTERVAL = 10  # seconds

# === LOAD STABLE DIFFUSION PIPELINE ===
print(Fore.YELLOW + "\n🧠 Initializing DiffusionCraft AI Image Generator...")

try:
    with tqdm(total=100, desc="Loading model...", bar_format="{l_bar}{bar}| {n_fmt}/{total_fmt}") as pbar:
        pipe = StableDiffusionPipeline.from_pretrained(
            "runwayml/stable-diffusion-v1-5",
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
            use_auth_token=True
        )
        pbar.update(70)
        pipe.to("cuda" if torch.cuda.is_available() else "cpu")
        pbar.update(30)
    print(Fore.GREEN + "\n✅ Stable Diffusion pipeline loaded successfully!\n")
except Exception as e:
    print(Fore.RED + f"❌ Failed to load pipeline: {e}")
    sys.exit(1)

# === IMAGE GENERATION FUNCTION ===
def generate_image(prompt):
    print(Fore.CYAN + f"✨ Generating image for prompt: {prompt}")
    start_time = time.time()
    image = pipe(prompt).images[0]
    elapsed = time.time() - start_time
    print(Fore.CYAN + f"🕒 Image generated in {elapsed:.2f} seconds.")
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()

# === MAIN WORKER LOOP ===
def worker_loop():
    print(Fore.CYAN + Style.BRIGHT + f"[{datetime.now()}] 🚀 DiffusionCraft worker is running...\n")

    while True:
        try:
            response = requests.get(READ_PROMPT_URL)
            if response.status_code != 200:
                print(Fore.RED + f"❌ Failed to fetch prompt: {response.text}")
                time.sleep(CHECK_INTERVAL)
                continue

            data = response.json()
            if "prompt" not in data:
                print(Fore.YELLOW + f"[{datetime.now()}] ⏳ No prompts in queue.")
                time.sleep(CHECK_INTERVAL)
                continue

            prompt = data["prompt"]
            user_sub = data["userSub"]
            image_id = data["imageId"]

            image_bytes = generate_image(prompt)
            image_base64 = base64.b64encode(image_bytes).decode("utf-8")

            upload_payload = {
                "userSub": user_sub,
                "imageId": image_id,
                "imageBase64": image_base64
            }

            upload_resp = requests.post(UPLOAD_IMAGE_URL, json=upload_payload)
            if upload_resp.status_code == 200:
                print(Fore.GREEN + f"[{datetime.now()}] ✅ Image uploaded successfully.\n")
            else:
                print(Fore.RED + f"[{datetime.now()}] ❌ Upload failed: {upload_resp.text}\n")

        except Exception as e:
            print(Fore.RED + f"🔥 Unexpected error: {str(e)}\n")

        time.sleep(CHECK_INTERVAL)

# === RUN ===
if __name__ == "__main__":
    try:
        worker_loop()
    except KeyboardInterrupt:
        print(Fore.MAGENTA + "\n👋 Worker stopped by user.")
        sys.exit(0)
