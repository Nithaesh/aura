# 🧠 **AURA: The Future of AI Interview Coaching** 🚀

> **Master your technical interviews with the power of Real-Time Computer Vision, Generative AI, and Voice Synthesis.** 🎤👁️✨

Welcome to **AURA**, your personal AI-powered coach designed to simulate high-pressure technical interviews. By tracking your **body language**, **eye contact**, and **vocal confidence**, AURA doesn't just listen to your answers—it watches *how* you deliver them. 🤯

---

## ✨ **Key Features that Set You Apart**

### 🎯 **1. Real-Time AI Mock Interviews**

* **🗣️ Dynamic Voice Interaction:** Chat naturally with an AI interviewer powered by **Edge TTS** for a lifelike human voice.
* **🔄 Adaptive Questioning:** No scripts here! The AI generates follow-up questions *on the fly* based on your resume and previous answers.
* **⚡ Zero-Latency Response:** Optimized **WebSocket** connections mean the conversation flows instantly without awkward pauses.

### 👁️ **2. The "AURA Eye" (Computer Vision)**

* **🧘 Posture Perfection:** Built-in **MediaPipe Pose** detection alerts you if you're slouching, leaning, or sitting off-center.
* **👀 Eye Contact Mastery:** Intelligent iris tracking ensures you're engaging with the interviewer, not looking at your ceiling!
* **🚨 Live Feedback Loop:** Get instant **Yellow/Red visual warnings** on your video feed the moment you break focus or posture.

### 📄 **3. Intelligent Resume Analysis**

* **📥 Seamless PDF Parsing:** Upload your resume directly to the dashboard securely.
* **🤖 AI Scoring Engine:** Powered by **Google Gemini 2.5 Flash**, AURA grades your resume on **ATS compatibility**, **impact**, and **keywords**.
* **📈 Instant Profile Sync:** New user? No problem. Upload your resume and watch your "AURA Score" calculate instantly!

### 📊 **4. Deep-Dive Performance Reports**

* **🕸️ Skill Radar Charts:** Visualize your strengths across **Technical Knowledge**, **Communication**, and **Confidence**.
* **📜 Session History:** Every interview is saved to **Firebase Firestore**, tracking your duration and score improvements over time.
* **🧠 Behavioral Insights:** Get granular data on your non-verbal cues (e.g., *"Eye Contact: 85%"*).

---

## 🛠️ **Tech Stack**

### **Frontend (The Face) 🎨**

* **⚛️ Framework:** React.js (Vite)
* **💅 Styling:** Tailwind CSS (Stunning Glassmorphism UI)
* **✨ Animations:** Framer Motion
* **📉 Charts:** Recharts
* **🔥 Database:** Firebase Firestore & Auth
* **🧠 AI (Client-side):** Google Gemini SDK

### **Backend (The Brain) 🧠**

* **⚡ Server:** FastAPI (Python)
* **🤖 AI (Server-side):** Google Gemini 2.0 Flash
* **👁️ Vision:** MediaPipe & OpenCV (Face & Pose Tracking)
* **🗣️ Audio:** Edge TTS (Text-to-Speech)
* **🔌 Protocol:** WebSockets (Real-time bi-directional communication)

---

## 🚀 **Installation Guide: Run AURA Anywhere!** 💻

Ready to level up your interview skills? Follow these steps to get AURA running on your local machine.

### **Prerequisites** 📋

* **Node.js** (v18 or higher) 🟢
* **Python** (v3.10 or higher) 🐍
* **Google Gemini API Key** (Get it free from [Google AI Studio](https://aistudio.google.com/)) 🔑
* **Firebase Config** (Enable Firestore & Auth in your Firebase Console) 🔥

---

### **Step 1: Ignite the Backend (The Brain) 🧠**

1. **Open your terminal** and navigate to the `backend` folder.
2. **Create a virtual environment** (Highly recommended to keep things clean!):
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

```


3. **Install the magic:**
```bash
pip install -r requirements.txt

```


4. **🔑 Important:** Open `server.py` and replace `YOUR_GEMINI_API_KEY_HERE` with your actual API Key.
5. **Launch the server:**
```bash
uvicorn server:app --reload --port 8000

```


*(Keep this terminal open to keep the brain running!)*

---

### **Step 2: Launch the Frontend (The Interface) 🎨**

1. Open a **new terminal window** and navigate to the `frontend` (or `aura-web`) folder.
2. **Install dependencies:**
```bash
npm install
npm install @google/generative-ai pdfjs-dist lucide-react recharts framer-motion react-webcam firebase

```


3. **☁️ Cloudinary Setup:** Double-check your `Dashboard.jsx` has the correct `CLOUDINARY_CLOUD_NAME` and an **Unsigned** Upload Preset named `resume_upload`.
4. **Start the React app:**
```bash
npm run dev

```


5. **Blast off!** 🚀 Open the link shown (usually `http://localhost:5173`) in your browser.

---

## 🧪 **How to Use AURA**

1. **📝 Sign Up:** Create an account. Your dashboard starts fresh with 0 scores.
2. **📤 Upload Resume:** Head to the **Resume Analysis** tab. Upload your PDF and watch your **AURA Score** climb!
3. **🎬 Start Interview:**
* Click **Start Interview**.
* Select **"Practice Mode"**.
* ✅ Allow Camera/Microphone permissions.
* **👀 Test Vision:** Slouch or look away—dare to trigger those warnings!
* **🗣️ Talk:** Answer the AI's question. Click **"Done Speaking"** to hear the personalized reply.


4. **📊 Get Report:** Click **End Interview**. Instantly receive a detailed breakdown of your performance, duration, and behavioral metrics.

---

## 📄 **License**

**MIT License.** 🎓 Free for educational use. Build, learn, and conquer your interviews!
