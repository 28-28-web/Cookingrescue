from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import urllib.request
import urllib.error
import os

# Configuration: LOAD FROM COOLIFY (No secrets in code!)
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY') 
BREVO_API_KEY = os.environ.get('BREVO_API_KEY')
BREVO_LIST_ID = int(os.environ.get('BREVO_LIST_ID', '9')) 

class RequestHandler(SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        if self.path == '/api/subscribe':
            self.handle_subscribe()
        elif self.path == '/api/chat':
            self.handle_chat()
        else:
            self.send_error(404)

    def handle_subscribe(self):
        try:
            length = int(self.headers['Content-Length'])
            data = json.loads(self.rfile.read(length))
            
            if not data.get('email') or not data.get('firstName'):
                return self.send_json(400, {'success': False, 'message': 'Missing fields'})

            if not BREVO_API_KEY:
                return self.send_json(500, {'success': False, 'message': 'Server Config Error: Missing Brevo Key'})

            url = 'https://api.brevo.com/v3/contacts'
            payload = {
                'email': data['email'],
                'attributes': {'FIRSTNAME': data['firstName']},
                'listIds': [BREVO_LIST_ID],
                'updateEnabled': True
            }
            
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode('utf-8'),
                headers={'Content-Type': 'application/json', 'api-key': BREVO_API_KEY},
                method='POST'
            )
            
            with urllib.request.urlopen(req) as response:
                self.send_json(200, {'success': True})
                
        except Exception as e:
            self.send_json(500, {'success': False, 'message': str(e)})

    def handle_chat(self):
        try:
            length = int(self.headers['Content-Length'])
            data = json.loads(self.rfile.read(length))
            user_msg = data.get('message')

            system_prompt = "You are a helpful cooking assistant for CookingRescue.com. Keep answers short, practical, and friendly."

            if not GEMINI_API_KEY:
                return self.send_json(500, {'message': "Server Config Error: Missing AI Key"})

            url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={GEMINI_API_KEY}'
            
            payload = { "contents": [{ "parts": [{"text": f"{system_prompt}\n\nUser: {user_msg}"}] }] }

            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode('utf-8'),
                headers={'Content-Type': 'application/json'},
                method='POST'
            )

            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read())
                try:
                    ai_text = result['candidates'][0]['content']['parts'][0]['text']
                except (KeyError, IndexError):
                    ai_text = "I'm having trouble thinking of a recipe right now. Please try again."
                
                self.send_json(200, {'response': ai_text})

        except urllib.error.HTTPError as e:
            self.send_json(500, {'message': f"API Error: {e.code}"})
        except Exception as e:
            self.send_json(500, {'message': "Connection error."})

    def send_json(self, code, data):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3000))
    print(f"Starting server on port {port}...")
    try:
        HTTPServer(('0.0.0.0', port), RequestHandler).serve_forever()
    except KeyboardInterrupt:
        pass
