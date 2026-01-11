# 🍳 Cooking Rescue - Lead Magnet Landing Page

A conversion-optimized lead magnet landing page with Brevo email integration for cookingrescue.com.

## Features

- 🎯 Beautiful, conversion-focused landing page
- 📧 Automated email capture with Brevo API
- 🔒 Secure environment variable configuration
- 🐳 Docker-ready for easy deployment
- 📱 Fully responsive design

## Quick Start (Local Development)

```bash
# Install Python 3.11+
python3 server.py

# Visit http://localhost:3000
```

## Deployment to Production

### Option 1: Coolify (Recommended)

1. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/cookingrescue.git
   git push -u origin main
   ```

2. **Configure Coolify:**
   - Add new application
   - Connect GitHub repository
   - Build Pack: Dockerfile
   - Port: 3000
   - Domain: cookingrescue.com

3. **Set Environment Variables in Coolify:**
   - `BREVO_API_KEY`: Your Brevo API key
   - `BREVO_LIST_ID`: Your Brevo list ID (e.g., 9)

4. **Deploy!**

### Option 2: Vercel/Railway/Render

Similar process - connect repo, set environment variables, deploy.

## Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
BREVO_API_KEY=your-api-key-here
BREVO_LIST_ID=your-list-id-here
```

Get your Brevo API key from: https://app.brevo.com/settings/keys/api

## Files

- `index.html` - Lead magnet landing page
- `styles.css` - Glassmorphism design system
- `app.js` - Form validation & submission
- `server.py` - Python backend with Brevo integration
- `Dockerfile` - Docker configuration

## After Deployment

1. Test form submission at https://cookingrescue.com
2. Verify contacts appear in your Brevo list
3. Set up 5-email welcome sequence in Brevo automation

## Support

For issues or questions, check the deployment guides.

---

Made with ❤️ for home cooks everywhere
