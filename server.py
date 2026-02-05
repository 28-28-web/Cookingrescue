from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import urllib.request
import urllib.error
import os

# CONFIG
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY') 
BREVO_API_KEY = os.environ.get('BREVO_API_KEY')
BREVO_LIST_ID = int(os.environ.get('BREVO_LIST_ID', '9')) 

class RequestHandler(SimpleHTTPRequestHandler):
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
            
            url = 'https://api.brevo.com/v3/contacts'
            payload = { 'email': data['email'], 'attributes': {'FIRSTNAME': data['firstName']}, 'listIds': [BREVO_LIST_ID], 'updateEnabled': True }
            
            req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json', 'api-key': BREVO_API_KEY}, method='POST')
            with urllib.request.urlopen(req) as response:
                self.send_json(200, {'success': True})
        except Exception as e:
            self.send_json(500, {'success': False, 'message': str(e)})

    def handle_chat(self):
        self.send_json(500, {'message': "Chatbot removed."})

    def send_json(self, code, data):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3000))
    HTTPServer(('0.0.0.0', port), RequestHandler).serve_forever()
