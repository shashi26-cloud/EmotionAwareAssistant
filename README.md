# 🌟 EmotionAware Assistant — AI-Powered Emotion Detection & Study Support

A cutting-edge AI-powered Emotion Detection Assistant that analyzes **facial emotions** and **voice tone** to provide personalized study tips, motivation, and productivity support.

---

## 🔰 Badges

---

## 🚀 Features

* 🎭 **Real-time Facial Emotion Detection** using OpenCV & MediaPipe
* 🎤 **Voice Tone (Sentiment) Analysis** using SpeechRecognition & ML models
* 🧠 **Smart Recommendation Engine** that gives:

  * Study tips
  * Motivation quotes
  * Productivity suggestions
* 🌐 Web-friendly architecture & simple integration
* 📁 Clean, modular project structure

---

## 🛠️ Tech Stack

**Languages:** Python

**Libraries Used:**

* OpenCV
* MediaPipe
* SpeechRecognition
* NumPy
* Scikit-learn / TensorFlow (if used for tone analysis)

---

## 📂 Project Structure

```
EmotionAwareAssistant/
│
├── data/               # Any datasets, models
├── models/             # ML models (emotion, tone)
├── src/
│   ├── face_detector.py
│   ├── voice_analyzer.py
│   ├── recommender.py
│   ├── main.py
│
├── requirements.txt
├── README.md
└── LICENSE
```

---

## ▶️ How to Run

### 1. Clone the repository

```bash
git clone https://github.com/shashi26-cloud/EmotionAwareAssistant.git
cd EmotionAwareAssistant
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the app

```bash
python src/main.py
```

---

## 🧩 How It Works

### **1️⃣ Facial Emotion Detection**

* Captures webcam frames
* Uses MediaPipe for face landmarks
* Classifies emotion (happy, sad, angry, neutral, etc.)

### **2️⃣ Voice Tone Analysis**

* Captures audio input
* Converts speech → text
* Runs sentiment/emotion model on the audio features

### **3️⃣ Recommendation Engine**

Depending on detected emotion, gives:

* Study motivation
* Productivity hacks
* Relaxation tips
* Encouragement messages

---

## 🌟 Future Enhancements

* 🌐 Web UI (Flask / React)
* 📊 User progress tracking
* 🧠 More emotion classes
* 🔊 Better voice sentiment model
* 📱 Mobile app version

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📜 License

MIT License © 2025 Shashi Maruthi
