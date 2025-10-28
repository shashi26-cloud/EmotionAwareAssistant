from flask import Flask, render_template, jsonify, request, session
import json
import os
from datetime import datetime
from emotion_detector import EmotionDetector
from voice_analyzer import VoiceAnalyzer
from study_recommendations import StudyRecommendations

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Change this in production

# Initialize components
emotion_detector = EmotionDetector()
voice_analyzer = VoiceAnalyzer()
study_recommender = StudyRecommendations()

# Ensure data directories exist
os.makedirs('data/user_sessions', exist_ok=True)

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    """Dashboard page"""
    return render_template('dashboard.html')

@app.route('/analyze_emotion', methods=['POST'])
def analyze_emotion():
    """Analyze emotion through webcam"""
    try:
        duration = request.json.get('duration', 5)
        
        # Perform emotion analysis
        emotion_result = emotion_detector.analyze_webcam_emotion(duration)
        
        if emotion_result:
            # Get study recommendations
            recommendations = study_recommender.get_recommendations(
                emotion_result['dominant_emotion']
            )
            
            # Save session data
            session_data = {
                'emotion_analysis': emotion_result,
                'recommendations': recommendations,
                'timestamp': datetime.now().isoformat()
            }
            
            # Save to file
            session_id = datetime.now().strftime('%Y%m%d_%H%M%S')
            session_file = f'data/user_sessions/session_{session_id}.json'
            
            with open(session_file, 'w') as f:
                json.dump(session_data, f, indent=2)
            
            return jsonify({
                'success': True,
                'emotion_result': emotion_result,
                'recommendations': recommendations
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Could not detect emotion'
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/analyze_voice', methods=['POST'])
def analyze_voice():
    """Analyze voice tone"""
    try:
        duration = request.json.get('duration', 5)
        
        # Perform voice analysis
        voice_result = voice_analyzer.analyze_voice_tone(duration)
        
        if voice_result:
            return jsonify({
                'success': True,
                'voice_result': voice_result
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Could not analyze voice'
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/get_recommendations', methods=['POST'])
def get_recommendations():
    """Get study recommendations based on emotion and stress"""
    try:
        data = request.json
        emotion = data.get('emotion', 'neutral')
        stress_level = data.get('stress_level')
        
        recommendations = study_recommender.get_recommendations(emotion, stress_level)
        
        return jsonify({
            'success': True,
            'recommendations': recommendations
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/session_history')
def session_history():
    """Get user session history"""
    try:
        sessions = []
        session_dir = 'data/user_sessions'
        
        if os.path.exists(session_dir):
            for filename in sorted(os.listdir(session_dir), reverse=True):
                if filename.endswith('.json'):
                    filepath = os.path.join(session_dir, filename)
                    with open(filepath, 'r') as f:
                        session_data = json.load(f)
                        sessions.append(session_data)
        
        return jsonify({
            'success': True,
            'sessions': sessions[:10]  # Return last 10 sessions
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

if __name__ == '__main__':
    app.run(debug=True, port=5000)