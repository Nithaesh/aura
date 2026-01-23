import os

from dotenv import load_dotenv
load_dotenv()


# --- FIX: Suppress TensorFlow/Mediapipe Logs ---
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
import edge_tts
import base64
import json
import tempfile
import time
import asyncio
import numpy as np
import cv2
import mediapipe as mp

# =========================
# CONFIGURATION
# =========================

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    # Fallback for local testing
    API_KEY = "YOUR_GEMINI_API_KEY_HERE" 

if API_KEY == "YOUR_GEMINI_API_KEY_HERE":
    print("⚠️ WARNING: GEMINI_API_KEY not set! AI features will fail.")
    client = None
else:
    client = genai.Client(api_key=API_KEY)

AVAILABLE_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-1.5-flash",
]

VOICE = "en-US-JennyNeural"

# =========================
# POSTURE TRACKING
# =========================
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

def get_iris_position(landmarks, iris_indices, eye_indices):
    iris_x = np.mean([landmarks[i].x for i in iris_indices])
    eye_left = landmarks[eye_indices[0]].x
    eye_right = landmarks[eye_indices[8]].x
    total_width = abs(eye_right - eye_left)
    if total_width == 0: return 0.5
    return (iris_x - min(eye_left, eye_right)) / total_width

def analyze_frame(base64_image):
    try:
        if ',' in base64_image: encoded_data = base64_image.split(',')[1]
        else: encoded_data = base64_image
            
        nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if frame is None: return None

        results = face_mesh.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        if not results.multi_face_landmarks: return "No face detected."

        lm = results.multi_face_landmarks[0].landmark
        nose = lm[1]
        
        # Posture
        if nose.x < 0.35: return "Center yourself (Move Left)"
        elif nose.x > 0.65: return "Center yourself (Move Right)"
        if nose.y > 0.7: return "Sit up straight (Head too low)"

        # Eye Contact
        LEFT_IRIS = [474, 475, 476, 477]
        LEFT_EYE = [33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7]
        RIGHT_IRIS = [469, 470, 471, 472]
        RIGHT_EYE = [362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382]

        l_ratio = get_iris_position(lm, LEFT_IRIS, LEFT_EYE)
        r_ratio = get_iris_position(lm, RIGHT_IRIS, RIGHT_EYE)
        avg_ratio = (l_ratio + r_ratio) / 2

        if avg_ratio < 0.30: return "Maintain Eye Contact (Looking Right)"
        if avg_ratio > 0.70: return "Maintain Eye Contact (Looking Left)"

        return None
    except: return None

# =========================
# APP SETUP
# =========================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM_PROMPT = """
You are Aura, a senior technical interviewer.
Rules:
1. Ask ONE short question at a time.
2. Listen to the candidate's answer and ask a relevant FOLLOW-UP question.
3. Keep responses SHORT (max 2 sentences).
"""

# UPDATED: More detailed schema for the UI
REPORT_PROMPT = """
Generate a comprehensive JSON report of the interview performance.
Schema:
{
  "overallScore": number (0-100),
  "summary": "2 sentence executive summary of the candidate.",
  "ratings": [
    {"category": "Technical Proficiency", "score": number, "feedback": "Specific technical feedback"},
    {"category": "Communication Clarity", "score": number, "feedback": "Feedback on voice/clarity"},
    {"category": "Problem Solving", "score": number, "feedback": "How they approached logic"},
    {"category": "Confidence & Pace", "score": number, "feedback": "Tone analysis"}
  ],
  "strengths": ["Bulleted point 1", "Bulleted point 2", "Bulleted point 3"],
  "improvements": ["Bulleted point 1", "Bulleted point 2", "Bulleted point 3"],
  "behavioral": {
     "eyeContact": "Good/Fair/Poor",
     "posture": "Good/Fair/Poor",
     "note": "Observation on non-verbal cues"
  }
}
"""

# =========================
# UTILITIES
# =========================

async def text_to_speech(text: str) -> str:
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as f:
            path = f.name
        await edge_tts.Communicate(text, VOICE).save(path)
        with open(path, "rb") as audio:
            data = audio.read()
        os.remove(path)
        return base64.b64encode(data).decode("utf-8")
    except: return None

def generate_with_fallback(history_log, is_report=False):
    if not client: return None

    sys_instruction = REPORT_PROMPT if is_report else SYSTEM_PROMPT
    mime_type = "application/json" if is_report else "text/plain"

    for model_name in AVAILABLE_MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                config=types.GenerateContentConfig(
                    system_instruction=sys_instruction,
                    temperature=0.7,
                    response_mime_type=mime_type
                ),
                contents=history_log
            )
            return response.text.strip()

        except Exception as e:
            print(f"⚠️ {model_name} Failed: {e}")
            if "429" in str(e): time.sleep(4)
            continue

    return None

# =========================
# WEBSOCKET HANDLER
# =========================

@app.websocket("/ws/interview")
async def interview_socket(ws: WebSocket):
    await ws.accept()
    print("Client Connected")

    conversation_history = []
    
    # Intro
    intro_text = "Let's begin. Can you briefly introduce yourself?"
    conversation_history.append(types.Content(role="model", parts=[types.Part(text=intro_text)]))

    await ws.send_text(json.dumps({"type": "ai_speaking_start"}))
    audio = await text_to_speech(intro_text)
    await ws.send_text(json.dumps({
        "type": "audio_response",
        "text": intro_text,
        "audio": audio
    }))
    await ws.send_text(json.dumps({"type": "ai_speaking_end"}))

    try:
        while True:
            data = await ws.receive_text()
            msg = json.loads(data)

            # --- VIDEO FRAME ---
            if msg["type"] == "video_frame":
                feedback = await asyncio.to_thread(analyze_frame, msg["image"])
                if feedback:
                    await ws.send_text(json.dumps({"type": "feedback", "message": feedback}))

            # --- END SESSION & REPORT ---
            elif msg["type"] == "end_session":
                print("📝 Generating Report...")
                report_json = await asyncio.to_thread(generate_with_fallback, conversation_history, True)
                
                if report_json:
                    await ws.send_text(json.dumps({
                        "type": "report",
                        "data": json.loads(report_json)
                    }))
                else:
                    await ws.send_text(json.dumps({"type": "report", "data": {"overallScore": 0, "summary": "Error generating report."}}))
                break

            # --- USER SPEECH ---
            elif msg["type"] == "user_stopped_speaking":
                user_answer = msg.get("text", "").strip()
                print(f"User: {user_answer}")

                conversation_history.append(types.Content(role="user", parts=[types.Part(text=user_answer)]))

                next_q = await asyncio.to_thread(generate_with_fallback, conversation_history, False)
                if not next_q: next_q = "Let's move on."
                
                conversation_history.append(types.Content(role="model", parts=[types.Part(text=next_q)]))

                await ws.send_text(json.dumps({"type": "ai_speaking_start"}))
                audio = await text_to_speech(next_q)
                await ws.send_text(json.dumps({
                    "type": "audio_response",
                    "text": next_q,
                    "audio": audio
                }))
                await ws.send_text(json.dumps({"type": "ai_speaking_end"}))

    except WebSocketDisconnect:
        print("Disconnected")
    except Exception as e:
        print(f"Server Error: {e}")
        await ws.close()