from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from cv_logic import analyze_frame 
import cv2
import numpy as np
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AURA Brain is Active"}

@app.post("/analyze")
async def analyze_endpoint(file: UploadFile = File(...)):
    try:
        # Read the image file sent from React
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Run the CV Logic
        result = analyze_frame(frame)
        
        # Print status to terminal so you can see it working
        print(f"📊 {result['status']} | Pitch: {result['pose_data']['head_pitch'] if result['pose_data'] else 0}")
        
        return result

    except Exception as e:
        print(f"❌ Error: {e}")
        return {"status": "Server Error", "pose_data": None}