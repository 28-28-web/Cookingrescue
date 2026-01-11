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

class BrevoHandler(SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle preflight CORS requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        """Handle POST requests to /api/subscribe"""
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
