# Brevo Setup Guide for Cooking Rescue Lead Magnet

This guide walks you through setting up your Brevo account to work with the lead magnet landing page.

## Prerequisites

- Active Brevo account (free or paid)
- Access to Brevo dashboard

---

## Step 1: Create Your Contact List

1. Log into your Brevo account at https://app.brevo.com
2. Navigate to **Contacts** → **Lists**
3. Click **Create a list**
4. Name it: "Meal Prep Guide Subscribers" (or your preferred name)
5. Click **Create**
6. **Note the List ID** - you'll find it in the URL (e.g., `lists/123` means List ID is `123`)

---

## Step 2: Get Your API Key

1. In Brevo, go to **Settings** (top right) → **SMTP & API**
2. Click on the **API Keys** tab
3. Click **Generate a new API key**
4. Name it: "Cooking Rescue Website"
5. **Copy the API key immediately** - you won't be able to see it again
6. Save it somewhere secure (you'll paste it into `app.js`)

---

## Step 3: Update Your Website Code

1. Open the file: `/home/ubuntu/cookingrescue/app.js`
2. Find lines 2-6 (the BREVO_CONFIG object)
3. Replace the placeholder values:

```javascript
const BREVO_CONFIG = {
    apiKey: 'xkeysib-abc123...', // Paste your API key here
    listId: '5',                  // Enter your list ID (just the number)
    apiUrl: 'https://api.brevo.com/v3/contacts'
};
```

4. Save the file

---

## Step 4: Create Your Welcome Email Sequence

Brevo calls this "Automation" or "Marketing Automation". Here's how to set it up:

### Create the Automation Workflow

1. Go to **Automation** in the main Brevo menu
2. Click **Create an automation**
3. Choose **Custom workflow** or **Welcome series**

### Set the Trigger

1. Choose trigger: **Contact added to list**
2. Select your list: "Meal Prep Guide Subscribers"
3. Click **Next**

### Add Your 5 Emails

#### Email 1: Deliver the Guide (Immediate)
- **Delay**: 0 minutes (send immediately)
- **Subject**: "Your Free Meal Prep Guide is Here! 🎉"
- **Content**:
  - Welcome message
  - Link to download the guide (you'll need to host your PDF guide)
  - Set expectations for future emails
  - Quick win tip

#### Email 2: Getting Started (Day 1)
- **Delay**: 1 day after subscription
- **Subject**: "Quick Start: Your First Meal Prep Sunday"
- **Content**:
  - Step-by-step for their first prep session
  - Common beginner mistakes to avoid
  - Motivation and encouragement

#### Email 3: Level Up (Day 2)
- **Delay**: 2 days after subscription
- **Subject**: "3 Game-Changing Meal Prep Hacks"
- **Content**:
  - Advanced tips from the guide
  - Time-saving strategies
  - Kitchen organization ideas

#### Email 4: Success Stories (Day 4)
- **Delay**: 4 days after subscription
- **Subject**: "How Sarah Saved 12 Hours Per Week"
- **Content**:
  - Real testimonial or case study
  - Results others have achieved
  - Community invitation (if applicable)

#### Email 5: Next Steps (Day 7)
- **Delay**: 7 days after subscription
- **Subject**: "What's Next on Your Meal Prep Journey?"
- **Content**:
  - Recap of what they've learned
  - Invitation to premium course/cookbook (if you have one)
  - Call to action (follow on social, join community, etc.)

### Activate the Workflow

1. Review all emails in the sequence
2. Send test emails to yourself
3. Click **Activate** when ready

---

## Step 5: Create Your Lead Magnet PDF

You'll need to create the actual "7-Day Meal Prep Mastery Guide" PDF. Here are your options:

### Option A: Design Tools
- **Canva**: Use meal prep templates
- **Google Docs**: Create and export as PDF
- **Adobe InDesign**: Professional design

### Suggested Content Structure

1. **Introduction**
   - Welcome message
   - What they'll learn
   - How to use the guide

2. **Day 1-7 Breakdown**
   - Daily meal prep tasks
   - Shopping lists
   - Recipes or meal ideas
   - Storage tips

3. **Bonus Section**
   - 15 mix-and-match recipes
   - Container guide
   - Meal prep equipment checklist

4. **Next Steps**
   - Link to your blog/website
   - Social media handles
   - Premium offer (optional)

### Host the PDF

Upload your PDF to:
- Your website hosting
- Dropbox/Google Drive (set to public)
- SendOwl or Gumroad (for delivery)

Then link to it in Email #1 of your automation sequence.

---

## Step 6: Test Everything

### Test the Form Locally

1. Make sure the local server is still running (http://localhost:8001)
2. Open the page in your browser
3. Fill out the form with YOUR email address
4. Click submit
5. Check for success message

### Verify in Brevo

1. Go to **Contacts** → **Lists**
2. Open "Meal Prep Guide Subscribers"
3. Confirm your test contact appears
4. Check that the first name is saved correctly

### Check Email Delivery

1. Wait a moment for Email #1 to arrive
2. Check your inbox (and spam folder!)
3. Verify the email looks correct
4. Test all links in the email

---

## Troubleshooting

### "API Error: Invalid API Key"
- Double-check you copied the entire API key
- Make sure there are no extra spaces
- Verify the key hasn't been deleted in Brevo

### "API Error: List not found"
- Confirm the List ID is just the number (not the full name)
- Check that the list exists in your Brevo account

### Form Submits But No Email Arrives
- Check spam/junk folder
- Verify automation is activated in Brevo
- Check Brevo → Automation → View logs for errors
- Make sure the list trigger matches your list

### Contact Not Appearing in Brevo
- Check browser console for JavaScript errors
- Verify internet connection when testing
- Check Brevo API status: https://status.brevo.com

---

## Optional Enhancements

### Add Double Opt-In

For better deliverability and compliance:

1. In Brevo, go to **Settings** → **Double opt-in**
2. Enable it for your list
3. Customize the confirmation email
4. Update automation to trigger after confirmation

### Track Conversions

Add Google Analytics event tracking:

```javascript
// In app.js, after successful submission:
gtag('event', 'conversion', {
    'send_to': 'AW-XXXXXXXXX/YYYYYYYYYY',
    'value': 1.0,
    'currency': 'USD'
});
```

### Add Facebook Pixel

Track lead events for ad campaigns:

```javascript
// In app.js, after successful submission:
fbq('track', 'Lead', {
    content_name: 'Meal Prep Guide',
    content_category: 'Lead Magnet'
});
```

---

## Compliance Checklist

- [ ] Privacy policy page exists with email collection disclosure
- [ ] Unsubscribe link in all emails (Brevo adds this automatically)
- [ ] CAN-SPAM compliance footer (Brevo adds this automatically)
- [ ] GDPR consent checkbox (if targeting EU visitors)
- [ ] Data processing agreement with Brevo (if required)

---

## Success Metrics to Track

Monitor these in Brevo's analytics:

- **Conversion rate**: Form submissions / page visitors
- **Email open rate**: Should be 40%+ for Email #1
- **Click rate**: Track guide download clicks
- **Unsubscribe rate**: Should be <2%
- **List growth**: New subscribers per day/week

---

## Next Steps After Setup

1. **Drive Traffic**:
   - Share on social media
   - Add to blog sidebar
   - Include in email signature
   - Run Facebook/Google ads

2. **Optimize**:
   - A/B test headlines
   - Try different images
   - Experiment with form placement
   - Add exit-intent popup

3. **Nurture**:
   - Continue emailing value after day 7
   - Segment engaged vs. unengaged subscribers
   - Survey audience for content ideas

4. **Monetize**:
   - Offer paid course in Email #5
   - Create affiliate partnerships
   - Sell meal prep containers/tools
   - Launch premium membership

---

**Need Help?**

- Brevo documentation: https://help.brevo.com
- Brevo support: Available in your dashboard
- Community forum: https://community.brevo.com

---

Once setup is complete, your lead magnet will run on autopilot, capturing subscribers and delivering your welcome sequence 24/7! 🚀
