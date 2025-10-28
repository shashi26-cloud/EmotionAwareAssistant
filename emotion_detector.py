import cv2
import numpy as np
from deepface import DeepFace
import json
from datetime import datetime

class EmotionDetector:
    def __init__(self):
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.emotion_history = []
    
    def detect_emotion_from_frame(self, frame):
        """Detect emotion from a single frame"""
        try:
            # Convert frame to RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Analyze emotion using DeepFace
            result = DeepFace.analyze(rgb_frame, actions=['emotion'], enforce_detection=False)
            
            if isinstance(result, list):
                result = result[0]
            
            dominant_emotion = result['dominant_emotion']
            emotion_scores = result['emotion']
            
            return {
                'dominant_emotion': dominant_emotion,
                'emotion_scores': emotion_scores,
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            print(f"Error in emotion detection: {e}")
            return None
    
    def analyze_webcam_emotion(self, duration=10):
        """Analyze emotion from webcam for specified duration"""
        cap = cv2.VideoCapture(0)
        emotions_detected = []
        
        start_time = datetime.now()
        
        while (datetime.now() - start_time).seconds < duration:
            ret, frame = cap.read()
            if not ret:
                break
            
            emotion_data = self.detect_emotion_from_frame(frame)
            if emotion_data:
                emotions_detected.append(emotion_data)
            
            # Display frame with emotion
            if emotion_data:
                cv2.putText(frame, f"Emotion: {emotion_data['dominant_emotion']}", 
                           (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            
            cv2.imshow('Emotion Detection', frame)
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        
        cap.release()
        cv2.destroyAllWindows()
        
        return self.process_emotion_results(emotions_detected)
    
    def process_emotion_results(self, emotions_detected):
        """Process and summarize emotion detection results"""
        if not emotions_detected:
            return None
        
        emotion_counts = {}
        for emotion_data in emotions_detected:
            emotion = emotion_data['dominant_emotion']
            emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
        
        # Find most frequent emotion
        dominant_emotion = max(emotion_counts, key=emotion_counts.get)
        
        # Calculate emotion percentages
        total_detections = len(emotions_detected)
        emotion_percentages = {
            emotion: (count / total_detections) * 100 
            for emotion, count in emotion_counts.items()
        }
        
        return {
            'dominant_emotion': dominant_emotion,
            'emotion_percentages': emotion_percentages,
            'total_detections': total_detections,
            'session_timestamp': datetime.now().isoformat()
        }