# 🧠 AURA Backend (Computer Vision Engine)

This is the Python/FastAPI backend for AURA. It uses MediaPipe to track:
1. **Shoulder Slouching** (Posture)
2. **Head Orientation** (Pitch/Yaw)
3. **Eye Gaze** (Distraction detection)

---

## ⚠️ CRITICAL SETUP FOR COLLEGE NETWORK

If you are running this on the university WiFi/LAN, you **MUST** follow these steps to avoid `Proxy Error 407` or `MediaPipe Crash`.

### 1. Prerequisites
- Python 3.10 or 3.11 installed.
- VS Code.

### 2. Installation (Do this strictly)

**Step A: Open the project folder**
Open this folder in VS Code.

**Step B: Create a Virtual Environment**
Run this in the terminal:
```bash
python -m venv venv

Step C: Activate the Environment

Windows: .\venv\Scripts\activate

Mac/Linux: source venv/bin/activate

Step D: Install Dependencies (WITH PROXY) You must use the proxy flag, or the install will fail. Run this exact command:

pip install -r requirements.txt --proxy [http://edcguest:edcguest@172.31.100.27:3128](http://edcguest:edcguest@172.31.100.27:3128)

🚀 How to Run
Make sure your virtual environment is active (you should see (venv) in the terminal).

Run the server:

cd backend
python -m uvicorn main:app --reload

🧪 Testing Without Frontend
We have included a test script test_live.py that simulates the frontend webcam stream.

Keep the server running in one terminal.

Open a new terminal (activate venv).

Run:

Bash
python test_live.py


🛠 Common Errors & Fixes
Error: ModuleNotFoundError: No module named 'mediapipe' Fix: You forgot to activate the venv. Run .\venv\Scripts\activate.

Error: ProtocolBuffers or AttributeError crash. Fix: You installed the wrong version. Run: pip install "mediapipe==0.10.9" "protobuf<4" --proxy http://edcguest:edcguest@172.31.100.27:3128

Error: Tunnel connection failed: 407 Proxy Authentication Required Fix: You forgot the --proxy flag during installation.


---

### **Step 4: Push to GitHub**

Now that your files are ready, run these commands in your `AURA_FRESH` terminal to push it online:

```powershell
# 1. Initialize Git
git init

# 2. Add all files (Notice .gitignore will block venv automatically)
git add .

# 3. Commit
git commit -m "Initial commit: Completed CV Logic with Posture, Gaze, and Proxy fixes"

# 4. Connect to your repo (Replace URL with your actual GitHub repo link)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 5. Push
git push -u origin main
A window should pop up showing the AI analysis.