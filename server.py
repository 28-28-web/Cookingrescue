from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import urllib.request
import urllib.parse
from urllib.error import HTTPError
import os

# Brevo Configuration - Use environment variables in production
BREVO_API_KEY = os.getenv('BREVO_API_KEY')
BREVO_LIST_ID = int(os.getenv('BREVO_LIST_ID', '9'))
BREVO_API_URL = 'https://api.brevo.com/v3/contacts'

# Google AI Studio (Gemini) Configuration for Chatbot
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
CHATBOT_MODEL = os.getenv('CHATBOT_MODEL', 'gemini-1.5-flash')
CHATBOT_MAX_TOKENS = int(os.getenv('CHATBOT_MAX_TOKENS', '500'))

class BrevoHandler(SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle preflight CORS requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        """Handle POST requests to /api/subscribe and /api/chat"""
        if self.path == '/api/subscribe':
            try:
                # Read request body
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                first_name = data.get('firstName', '')
                email = data.get('email', '')
                
                # Validate
                if not first_name or not email:
                    self.send_error_response(400, 'First name and email are required')
                    return
                
                # Prepare Brevo API request
                brevo_data = {
                    'email': email,
                    'attributes': {
                        'FIRSTNAME': first_name
                    },
                    'listIds': [BREVO_LIST_ID],
                    'updateEnabled': True
                }
                
                # Call Brevo API
                req = urllib.request.Request(
                    BREVO_API_URL,
                    data=json.dumps(brevo_data).encode('utf-8'),
                    headers={
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'api-key': BREVO_API_KEY
                    },
                    method='POST'
                )
                
                try:
                    with urllib.request.urlopen(req) as response:
                        self.send_success_response({'success': True, 'message': 'Successfully subscribed!'})
                except HTTPError as e:
                    error_body = e.read().decode('utf-8')
                    print(f'Brevo API Error: {error_body}')
                    self.send_error_response(e.code, 'Failed to subscribe to Brevo')
                    
            except json.JSONDecodeError:
                self.send_error_response(400, 'Invalid JSON')
            except Exception as e:
                print(f'Server Error: {str(e)}')
                self.send_error_response(500, 'Internal server error')
        
        elif self.path == '/api/chat':
            try:
                # Check if Gemini API key is configured
                if not GEMINI_API_KEY:
                    self.send_error_response(500, 'Chatbot not configured. Please set GEMINI_API_KEY environment variable.')
                    return
                
                # Read request body
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                user_message = data.get('message', '')
                history = data.get('history', [])
                
                # Validate
                if not user_message:
                    self.send_error_response(400, 'Message is required')
                    return
                
                # System prompt for cooking assistant
                system_instruction = '''You are a friendly and knowledgeable cooking assistant for CookingRescue.com. 

Your role is to help home cooks with:
- Quick, practical recipe suggestions (especially 30-minute meals)
- Meal planning and prep strategies
- Cooking techniques and tips
- Ingredient substitutions
- Nutrition advice
- Food storage and waste reduction
- Kitchen equipment recommendations

Personality traits:
- Warm, encouraging, and supportive
- Practical and time-conscious (understand users are busy)
- Focus on simple, achievable solutions
- Use emojis occasionally to be friendly (but not excessively)
- Keep responses concise but helpful (2-4 short paragraphs max)
- When suggesting recipes, focus on common ingredients and simple steps

Brand values:
- Save time in the kitchen
- Reduce food waste
- Make cooking stress-free
- Family-friendly meals
- Healthy, nutritious options

If users seem interested in meal planning, gently mention our free 7-Day Meal Prep Guide available on the website.'''
                
                # Build conversation history for Gemini
                # Gemini uses a different format: alternating user/model messages
                contents = []
                
                # Add history (convert from OpenAI format to Gemini format)
                for msg in history[-5:]:  # Last 5 messages
                    role = 'user' if msg.get('role') == 'user' else 'model'
                    contents.append({
                        'role': role,
                        'parts': [{'text': msg.get('content', '')}]
                    })
                
                # Add current user message
                contents.append({
                    'role': 'user',
                    'parts': [{'text': user_message}]
                })
                
                # Prepare Gemini API request
                gemini_data = {
                    'contents': contents,
                    'systemInstruction': {
                        'parts': [{'text': system_instruction}]
                    },
                    'generationConfig': {
                        'temperature': 0.7,
                        'maxOutputTokens': CHATBOT_MAX_TOKENS,
                        'topP': 0.95,
                        'topK': 40
                    }
                }
                
                # Build Gemini API URL with API key
                gemini_url = f'https://generativelanguage.googleapis.com/v1beta/models/{CHATBOT_MODEL}:generateContent?key={GEMINI_API_KEY}'
                
                # Call Gemini API
                req = urllib.request.Request(
                    gemini_url,
                    data=json.dumps(gemini_data).encode('utf-8'),
                    headers={
                        'Content-Type': 'application/json'
                    },
                    method='POST'
                )
                
                try:
                    with urllib.request.urlopen(req, timeout=30) as response:
                        response_data = json.loads(response.read().decode('utf-8'))
                        
                        # Extract response from Gemini format
                        if 'candidates' in response_data and len(response_data['candidates']) > 0:
                            candidate = response_data['candidates'][0]
                            if 'content' in candidate and 'parts' in candidate['content']:
                                ai_response = candidate['content']['parts'][0]['text']
                            else:
                                ai_response = 'Sorry, I couldn\'t generate a response.'
                        else:
                            ai_response = 'Sorry, I didn\'t get a response.'
                        
                        self.send_success_response({
                            'success': True,
                            'response': ai_response
                        })
                        
                except HTTPError as e:
                    error_body = e.read().decode('utf-8')
                    print(f'Gemini API Error: {error_body}')
                    
                    if e.code == 400:
                        self.send_error_response(400, 'Invalid request to AI service')
                    elif e.code == 401 or e.code == 403:
                        self.send_error_response(401, 'Invalid API key')
                    elif e.code == 429:
                        self.send_error_response(429, 'Rate limit exceeded')
                    else:
                        self.send_error_response(e.code, 'AI service error')
                        
            except json.JSONDecodeError:
                self.send_error_response(400, 'Invalid JSON')
            except Exception as e:
                print(f'Chatbot Error: {str(e)}')
                self.send_error_response(500, 'Internal server error')
        
        else:
            self.send_error_response(404, 'Not found')
    
    def send_success_response(self, data):
        """Send JSON success response"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))
    
    def send_error_response(self, code, message):
        """Send JSON error response"""
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        error_data = {'success': False, 'message': message}
        self.wfile.write(json.dumps(error_data).encode('utf-8'))
    
    def end_headers(self):
        """Override to add CORS headers to all responses"""
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

if __name__ == '__main__':
    PORT = int(os.getenv('PORT', '3000'))
    server = HTTPServer(('0.0.0.0', PORT), BrevoHandler)
    print(f'Server running at http://0.0.0.0:{PORT}')
    print(f'API endpoint: http://0.0.0.0:{PORT}/api/subscribe')
    print('Press Ctrl+C to stop')
    server.serve_forever()
