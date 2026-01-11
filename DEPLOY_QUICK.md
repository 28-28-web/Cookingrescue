# Quick Start: Deploy in 5 Minutes

## Step 1: Push to GitHub (3 minutes)

```bash
cd /home/ubuntu/cookingrescue

# Initialize git
git init
git add .
git commit -m "Lead magnet ready for deployment"

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/cookingrescue-leadmagnet.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy in Coolify (2 minutes)

1. Open Coolify dashboard
2. Click "+ New" → "Application"
3. Source: "Public Repository"
4. Paste your GitHub repo URL
5. Build Pack: "Dockerfile"
6. Port: `3000`
7. Domain: `cookingrescue.com`
8. Click "Deploy"

## Step 3: Update DNS

Point cookingrescue.com A record to your Oracle VPS IP address.

## Done! 

Wait 5-10 minutes for deployment and DNS propagation.

Visit https://cookingrescue.com and test the form!

---

**Need detailed help?** See [coolify_deployment_guide.md](file:///home/ubuntu/.gemini/antigravity/brain/060749a2-b373-4f57-abb6-a5e94e19fbe4/coolify_deployment_guide.md)
