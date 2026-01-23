import cv2
import mediapipe as mp
import numpy as np
import math

# --- INITIALIZE MEDIAPIPE ---
mp_holistic = mp.solutions.holistic
mp_face_mesh = mp.solutions.face_mesh

holistic = mp_holistic.Holistic(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5,
    refine_face_landmarks=True 
)

# --- MATH HELPER FUNCTIONS ---
def calculate_distance(p1, p2):
    return math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2)

def get_gaze_ratio(eye_points, iris_point):
    eye_width = calculate_distance(eye_points[0], eye_points[1])
    if eye_width == 0: return 0.5
    dist_to_left = calculate_distance(eye_points[0], iris_point)
    ratio = dist_to_left / eye_width
    return ratio

def analyze_frame(frame):
    if frame is None:
        return {"status": "Error", "data": None}

    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = holistic.process(rgb_frame)

    status = "Searching for user..."
    feedback = []
    
    pose_data = {
        "head_pitch": 0, 
        "head_yaw": 0,    
        "gaze_score": 0.5, 
        "shoulder_tilt": 0
    }

    if results.pose_landmarks and results.face_landmarks:
        landmarks = results.pose_landmarks.landmark
        face_lm = results.face_landmarks.landmark

        # --- A. SHOULDER ANALYSIS ---
        left_shoulder = landmarks[11]
        right_shoulder = landmarks[12]
        
        # 1. Shoulder Tilt (Uneven)
        dy = left_shoulder.y - right_shoulder.y
        dx = left_shoulder.x - right_shoulder.x
        shoulder_angle = math.degrees(math.atan2(dy, dx))
        pose_data["shoulder_tilt"] = round(shoulder_angle, 2)

        if abs(shoulder_angle) > 10:
            feedback.append("Uneven Shoulders")

        # 2. Shoulder Slouching (The Turtle Check) [REFINED]
        # We use EAR positions instead of NOSE to avoid false positives when looking down.
        left_ear = face_lm[234]
        right_ear = face_lm[454]
        
        # Midpoint of Shoulders
        sh_mid_x = (left_shoulder.x + right_shoulder.x) / 2
        sh_mid_y = (left_shoulder.y + right_shoulder.y) / 2
        
        # Midpoint of Ears (Head Center)
        ear_mid_x = (left_ear.x + right_ear.x) / 2
        ear_mid_y = (left_ear.y + right_ear.y) / 2
        
        # Distance between Neck base and Head Center
        neck_len = math.hypot(sh_mid_x - ear_mid_x, sh_mid_y - ear_mid_y)
        
        # Shoulder Width (Normalization)
        sh_width = math.hypot(left_shoulder.x - right_shoulder.x, left_shoulder.y - right_shoulder.y)
        
        # Ratio: If head sinks into shoulders, this ratio drops.
        # Threshold: < 0.25 usually means the neck has "disappeared"
        if sh_width > 0:
            hunch_ratio = neck_len / sh_width
            if hunch_ratio < 0.25:
                feedback.append("Slouching! Sit Up ⚠️")

        # --- B. HEAD POSE (Neck Movement) ---
        nose = face_lm[1]

        # 1. Pitch (Looking UP/DOWN)
        ear_y_avg = (left_ear.y + right_ear.y) / 2
        pitch_ratio = (nose.y - ear_y_avg) * 100
        pose_data["head_pitch"] = round(pitch_ratio, 2)

        if pitch_ratio < -5: feedback.append("Looking UP ⬆️")
        if pitch_ratio > 5:  feedback.append("Looking DOWN ⬇️")

        # 2. Yaw (Turning Neck) -- [CORRECTED LATERAL INVERSION]
        ear_x_mid = (left_ear.x + right_ear.x) / 2
        yaw_ratio = (nose.x - ear_x_mid) * 100
        pose_data["head_yaw"] = round(yaw_ratio, 2)

        head_turning = False
        if yaw_ratio < -8: 
            feedback.append("Neck Turned RIGHT ➡️") 
            head_turning = True
        if yaw_ratio > 8: 
            feedback.append("Neck Turned LEFT ⬅️")  
            head_turning = True

        # --- C. EYE GAZE TRACKING -- [CORRECTED LATERAL INVERSION] ---
        l_eye_l = face_lm[33]
        l_eye_r = face_lm[133]
        l_iris = face_lm[468]
        left_gaze = get_gaze_ratio([l_eye_l, l_eye_r], l_iris)

        r_eye_l = face_lm[362]
        r_eye_r = face_lm[263]
        r_iris = face_lm[473]
        right_gaze = get_gaze_ratio([r_eye_l, r_eye_r], r_iris)

        avg_gaze = (left_gaze + right_gaze) / 2
        pose_data["gaze_score"] = round(avg_gaze, 2)

        if not head_turning:
            if avg_gaze < 0.42: feedback.append("Side Eye (Right) 👀") 
            if avg_gaze > 0.58: feedback.append("Side Eye (Left) 👀") 

        # --- D. FINAL STATUS ---
        if not feedback:
            status = "Focus: Perfect ✅"
        else:
            status = " | ".join(feedback)

    return {
        "status": status,
        "pose_data": pose_data
    }