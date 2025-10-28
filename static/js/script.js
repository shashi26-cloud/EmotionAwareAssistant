// Global variables
let currentAnalysis = null;
let analysisTimeout = null;

// Emotion Analysis Functions
async function startEmotionAnalysis() {
    try {
        showModal('Starting emotion analysis... Please look at the camera');
        
        const response = await fetch('/analyze_emotion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ duration: 10 })
        });
        
        const data = await response.json();
        hideModal();
        
        if (data.success) {
            displayEmotionResults(data.emotion_result, data.recommendations);
            showResultsSection();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        hideModal();
        alert('Analysis failed: ' + error.message);
    }
}

async function startVoiceAnalysis() {
    try {
        showModal('Analyzing voice... Please speak clearly');
        
        const response = await fetch('/analyze_voice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ duration: 5 })
        });
        
        const data = await response.json();
        hideModal();
        
        if (data.success) {
            displayVoiceResults(data.voice_result);
            showResultsSection();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        hideModal();
        alert('Voice analysis failed: ' + error.message);
    }
}

// Quick analysis functions for dashboard
async function quickEmotionCheck() {
    try {
        showAnalysisModal('Quick emotion check... Look at camera for 30 seconds');
        
        const response = await fetch('/analyze_emotion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ duration: 30 })
        });
        
        const data = await response.json();
        hideAnalysisModal();
        
        if (data.success) {
            updateCurrentStatus(data.emotion_result, data.recommendations);
            displayCurrentRecommendations(data.recommendations);
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        hideAnalysisModal();
        alert('Quick check failed: ' + error.message);
    }
}

async function quickVoiceCheck() {
    try {
        showAnalysisModal('Voice stress check... Please speak for 5 seconds');
        
        const response = await fetch('/analyze_voice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ duration: 5 })
        });
        
        const data = await response.json();
        hideAnalysisModal();
        
        if (data.success) {
            updateVoiceStatus(data.voice_result);
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        hideAnalysisModal();
        alert('Voice check failed: ' + error.message);
    }
}

// Display Functions
function displayEmotionResults(emotionData, recommendations) {
    const resultsDiv = document.getElementById('emotion-results');
    
    let emotionHTML = `
        <div class="emotion-result">
            <h3>🎭 Emotion Analysis Results</h3>
            <p><strong>Dominant Emotion:</strong> ${emotionData.dominant_emotion}</p>
            <p><strong>Total Detections:</strong> ${emotionData.total_detections}</p>
            <div class="emotion-breakdown">
                <h4>Emotion Breakdown:</h4>
    `;
    
    for (const [emotion, percentage] of Object.entries(emotionData.emotion_percentages)) {
        emotionHTML += `
            <div class="emotion-percentage">
                <span>${emotion}:</span>
                <div class="percentage-bar">
                    <div class="percentage-fill" style="width: ${percentage}%"></div>
                </div>
                <span>${percentage.toFixed(1)}%</span>
            </div>
        `;
    }
    
    emotionHTML += `</div></div>`;
    resultsDiv.innerHTML = emotionHTML;
    
    if (recommendations) {
        displayRecommendations(recommendations);
    }
}

function displayVoiceResults(voiceData) {
    const resultsDiv = document.getElementById('voice-results');
    
    const voiceHTML = `
        <div class="voice-result">
            <h3>🎤 Voice Analysis Results</h3>
            <p><strong>Recognized Text:</strong> "${voiceData.text}"</p>
            <p><strong>Estimated Stress Level:</strong> ${voiceData.estimated_stress}</p>
            <p><strong>Energy Level:</strong> ${voiceData.energy_level.toFixed(0)}</p>
            <p><strong>Analysis Time:</strong> ${new Date(voiceData.timestamp).toLocaleString()}</p>
        </div>
    `;
    
    resultsDiv.innerHTML = voiceHTML;
}

function displayRecommendations(recommendations) {
    const resultsDiv = document.getElementById('recommendations-results');
    
    let recsHTML = `
        <div class="recommendation-item">
            <h3>📚 Personalized Study Recommendations</h3>
            <p><strong>Based on your emotion:</strong> ${recommendations.emotion}</p>
            
            <div class="recommendation-section">
                <h4>💡 Study Tips:</h4>
                <ul>
    `;
    
    recommendations.study_tips.forEach(tip => {
        recsHTML += `<li>${tip}</li>`;
    });
    
    recsHTML += `
                </ul>
            </div>
            
            <div class="recommendation-section">
                <h4>🌟 Motivational Quote:</h4>
                <blockquote>"${recommendations.motivational_quote}"</blockquote>
            </div>
            
            <div class="recommendation-section">
                <h4>🎯 Recommended Activities:</h4>
                <ul>
    `;
    
    recommendations.recommended_activities.forEach(activity => {
        recsHTML += `<li>${activity}</li>`;
    });
    
    recsHTML += `
                </ul>
            </div>
        </div>
    `;
    
    resultsDiv.innerHTML = recsHTML;
}

// Dashboard Functions
async function loadSessionHistory() {
    try {
        const response = await fetch('/session_history');
        const data = await response.json();
        
        if (data.success) {
            displaySessionHistory(data.sessions);
        } else {
            document.getElementById('session-history').innerHTML = 
                '<p>Could not load session history</p>';
        }
    } catch (error) {
        document.getElementById('session-history').innerHTML = 
            '<p>Error loading session history</p>';
    }
}

function displaySessionHistory(sessions) {
    const historyDiv = document.getElementById('session-history');
    
    if (sessions.length === 0) {
        historyDiv.innerHTML = '<p>No previous sessions found</p>';
        return;
    }
    
    let historyHTML = '';
    sessions.slice(0, 5).forEach(session => {
        const emotion = session.emotion_analysis?.dominant_emotion || 'Unknown';
        const timestamp = new Date(session.timestamp).toLocaleString();
        
        historyHTML += `
            <div class="session-item">
                <div class="session-emotion">Emotion: ${emotion}</div>
                <div class="session-time">${timestamp}</div>
            </div>
        `;
    });
    
    historyDiv.innerHTML = historyHTML;
}

function updateCurrentStatus(emotionData, recommendations) {
    const statusDiv = document.getElementById('current-status');
    
    const statusHTML = `
        <div class="current-status-content">
            <p><strong>Current Emotion:</strong> ${emotionData.dominant_emotion}</p>
            <p><strong>Analysis Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Confidence:</strong> ${emotionData.total_detections} detections</p>
            <button onclick="refreshStatus()" class="btn btn-small mt-20">Refresh</button>
        </div>
    `;
    
    statusDiv.innerHTML = statusHTML;
}

function displayCurrentRecommendations(recommendations) {
    const recsDiv = document.getElementById('current-recommendations');
    
    const recsHTML = `
        <div class="current-recs">
            <p><strong>For ${recommendations.emotion} mood:</strong></p>
            <p class="recommendation-tip">${recommendations.study_tips[0]}</p>
            <blockquote class="mini-quote">"${recommendations.motivational_quote}"</blockquote>
        </div>
    `;
    
    recsDiv.innerHTML = recsHTML;
}

// Modal Functions
function showModal(message) {
    const modal = document.getElementById('loading-modal');
    modal.querySelector('p').textContent = message;
    modal.style.display = 'flex';
}

function hideModal() {
    document.getElementById('loading-modal').style.display = 'none';
}

function showAnalysisModal(message) {
    const modal = document.getElementById('analysis-modal');
    if (modal) {
        modal.querySelector('#analysis-message').textContent = message;
        modal.style.display = 'flex';
    }
}

function hideAnalysisModal() {
    const modal = document.getElementById('analysis-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Utility Functions
function showResultsSection() {
    document.getElementById('results-section').style.display = 'block';
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
}

function stopAnalysis() {
    if (currentAnalysis) {
        currentAnalysis.abort();
    }
    if (analysisTimeout) {
        clearTimeout(analysisTimeout);
    }
    hideModal();
    hideAnalysisModal();
}

function stopCurrentAnalysis() {
    stopAnalysis();
}

function refreshStatus() {
    document.getElementById('current-status').innerHTML = 
        '<p>Click "Quick Emotion Check" to analyze your current state</p>';
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Emotion-Aware Study Assistant loaded successfully!');
});