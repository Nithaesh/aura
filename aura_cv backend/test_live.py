import cv2
import requests
import numpy as np
import time

# CONFIGURATION
API_URL = "http://127.0.0.1:8000/analyze"
cap = cv2.VideoCapture(0)

print("?? Opening Webcam... Press q to quit.")

while True:
    ret, frame = cap.read()
    if not ret: break

    _, img_encoded = cv2.imencode(".jpg", frame)
    
    try:
        response = requests.post(
            API_URL, 
            files={"file": ("image.jpg", img_encoded.tobytes(), "image/jpeg")}
        )
        
        if response.status_code == 200:
            data = response.json()
            status = data["status"]
            
            # Draw
            color = (0, 255, 0)
            if "Perfect" not in status and "Searching" not in status:
                color = (0, 0, 255)
            
            cv2.rectangle(frame, (0, 0), (640, 50), (0, 0, 0), -1)
            cv2.putText(frame, status, (10, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

    except:
        pass

    cv2.imshow("AURA PROTOTYPE", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()

