<?php
/*
Template Name: Sales Homepage (Fire & Charcoal)
*/
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php the_title(); ?> - CookingRescue</title>
    <meta name="description" content="Stop outsourcing your health. The 15-minute meal protocol for students and professionals.">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
    <?php wp_head(); ?>

    <style>
        /* ─── TOKENS & RESET ─── */
        :root {
            /* Palette: Fire & Charcoal */
            --charcoal-dark: #1A2228;
            --charcoal-base: #2C3942;
            --charcoal-light: #36454F;

            --fire-orange: #FF8C00;
            --fire-light: #FFA54F;
            --fire-glow: rgba(255, 140, 0, 0.15);

            --cream: #FAF7F2;
            --white: #FFFFFF;
            --text-body: #E0E0E0;
            --text-muted: #B0B0B0;
            --text-on-light: #2C3942;

            --green-success: #4A7C59;
            --red-alert: #D9534F;
            
            /* Chatbot Specific */
            --chatbot-primary: #FF8C00;

            /* Spacing & Layout */
            --container-width: 1200px;
            --section-padding: 100px;
            --radius-button: 50px;
            --radius-card: 16px;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'DM Sans', sans-serif;
            background-color: var(--charcoal-base);
            color: var(--text-body);
            line-height: 1.6;
            overflow-x: hidden;
        }

        h1, h2, h3, h4 { font-family: 'Playfair Display', serif; color: var(--white); line-height: 1.2; }
        a { text-decoration: none; transition: all 0.2s ease; }
        ul { list-style: none; }
        img { max-width: 100%; display: block; }
        .container { max-width: var(--container-width); margin: 0 auto; padding: 0 24px; }
        
        /* Updates */
        .text-fire { color: var(--fire-orange); }
        .text-center { text-align: center; }
        .flex-center { display: flex; align-items: center; justify-content: center; }

        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 16px 32px; border-radius: var(--radius-button); font-weight: 700; font-size: 1rem; cursor: pointer; border: none; transition: transform 0.2s, box-shadow 0.2s; }
        .btn-primary { background: var(--fire-orange); color: var(--white); box-shadow: 0 4px 20px rgba(255, 140, 0, 0.4); }
        .btn-primary:hover { transform: translateY(-2px); background: #FF7300; }
        .btn-secondary { background: transparent; border: 2px solid rgba(255, 255, 255, 0.2); color: var(--white); }
        .btn-secondary:hover { border-color: var(--fire-orange); color: var(--fire-orange); }

        /* Nav */
        nav { position: fixed; top: 0; left: 0; right: 0; height: 80px; background: rgba(44, 57, 66, 0.95); backdrop-filter: blur(10px); z-index: 1000; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .nav-inner { height: 100%; display: flex; align-items: center; justify-content: space-between; }
        .nav-menu { display: flex; gap: 32px; align-items: center; }
        .nav-link { color: var(--text-muted); font-weight: 500; font-size: 0.95rem; }
        .nav-link:hover { color: var(--fire-orange); }

        /* Hero */
        .hero { padding-top: 140px; padding-bottom: 80px; position: relative; background: radial-gradient(circle at 70% 30%, #3a4b57 0%, var(--charcoal-base) 60%); }
        .hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 60px; align-items: center; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.05); padding: 8px 16px; border-radius: 50px; font-size: 0.85rem; color: var(--fire-light); margin-bottom: 24px; border: 1px solid rgba(255, 255, 255, 0.1); }
        .hero h1 { font-size: 3.5rem; margin-bottom: 24px; letter-spacing: -1px; }
        .hero p { font-size: 1.2rem; color: var(--text-muted); margin-bottom: 40px; max-width: 500px; }
        .hero-actions { display: flex; gap: 16px; margin-bottom: 48px; }
        .trust-bar { display: flex; align-items: center; gap: 24px; font-size: 0.85rem; color: var(--text-muted); opacity: 0.8; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 24px; }
        .visual-card { background: var(--charcoal-dark); border-radius: 20px; padding: 24px; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3); }

        /* Calculator */
        .section-problem { background: var(--charcoal-dark); padding: 80px 0; border-top: 1px solid rgba(255, 255, 255, 0.05); }
        .calc-header { margin-bottom: 40px; text-align: center; }
        .calc-header h2 { font-size: 2.5rem; margin-bottom: 16px; }
        .calculator-box { background: var(--charcoal-light); border-radius: 24px; padding: 40px; max-width: 800px; margin: 0 auto; border: 1px solid rgba(255, 255, 255, 0.1); display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .calc-inputs label { display: block; font-size: 0.9rem; margin-bottom: 8px; color: var(--text-muted); }
        .calc-range { width: 100%; margin-bottom: 24px; -webkit-appearance: none; height: 6px; background: rgba(255, 255, 255, 0.1); border-radius: 5px; outline: none; }
        .calc-range::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: var(--fire-orange); cursor: pointer; }
        .calc-result-box { background: rgba(0, 0, 0, 0.2); border-radius: 16px; padding: 30px; text-align: center; display: flex; flex-direction: column; justify-content: center; }
        .calc-big-num { font-size: 3rem; font-weight: 700; color: var(--fire-orange); font-family: 'DM Sans', sans-serif; }
        
        /* Solution/Funnel Step */
        .section-solution { padding: var(--section-padding) 0; }
        .funnel-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 60px; }
        .step-card { background: var(--charcoal-light); padding: 40px 32px; border-radius: var(--radius-card); border: 1px solid rgba(255, 255, 255, 0.05); transition: transform 0.3s; position: relative; }
        .step-card:hover { transform: translateY(-10px); border-color: var(--fire-orange); }
        .step-num { font-size: 4rem; font-weight: 700; color: rgba(255, 255, 255, 0.03); position: absolute; top: 20px; right: 20px; line-height: 1; }
        .step-icon { font-size: 2rem; margin-bottom: 24px; display: inline-block; }
        .step-title { font-size: 1.25rem; font-weight: 700; color: var(--white); margin-bottom: 12px; }
        .step-desc { font-size: 0.95rem; color: var(--text-muted); margin-bottom: 24px; }

        /* Social Proof */
        .section-proof { background: var(--charcoal-dark); padding: 80px 0; text-align: center; }
        .proof-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 40px; }
        .review-card { background: var(--charcoal-base); padding: 32px; border-radius: 16px; text-align: left; border: 1px solid rgba(255, 255, 255, 0.05); }
        .stars { color: var(--fire-orange); margin-bottom: 16px; letter-spacing: 2px; }
        .review-text { font-size: 0.95rem; font-style: italic; margin-bottom: 20px; }
        .reviewer { font-weight: 700; font-size: 0.9rem; color: var(--white); }
        .reviewer span { font-weight: 400; color: var(--text-muted); font-size: 0.8rem; display: block; }

        /* Offer */
        .section-offer { background: radial-gradient(circle at 50% 50%, #4a3b2a 0%, var(--charcoal-base) 100%); padding: 100px 0; position: relative; overflow: hidden; }
        .offer-box { background: rgba(26, 34, 40, 0.8); backdrop-filter: blur(20px); border: 1px solid var(--fire-orange); border-radius: 32px; padding: 60px; max-width: 900px; margin: 0 auto; text-align: center; box-shadow: 0 20px 80px rgba(255, 140, 0, 0.15); }
        .scarcity-badge { background: var(--red-alert); color: white; padding: 6px 16px; border-radius: 50px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; display: inline-block; }
        .offer-price { font-size: 4rem; font-weight: 700; color: var(--white); margin: 24px 0; font-family: 'DM Sans', sans-serif; }
        .offer-price span { font-size: 1.2rem; color: var(--text-muted); font-weight: 400; }
        .perks-list { display: flex; justify-content: center; gap: 24px; margin-bottom: 40px; flex-wrap: wrap; }
        .perk { display: flex; align-items: center; gap: 8px; color: var(--text-body); }
        .perk svg { color: var(--green-success); }
        
        /* CHATBOT CSS REMOVED */
        
        /* Responsive */
        @media (max-width: 768px) {
            .hero-grid, .calculator-box, .funnel-steps, .proof-grid { grid-template-columns: 1fr; }
            .nav-menu { display: none; }
        }

        @keyframes loadProgress {
            from { width: 0%; }
            to { width: 75%; }
        }
    </style>
</head>

<body class="page-template-sales-homepage">

    <!-- NAV -->
    <nav>
        <div class="container nav-inner">
            <a href="/" class="logo">
                <img src="https://cookingrescue.com/wp-content/uploads/2025/12/cropped-Cooking-Rescue-Logo-scaled-1.png" alt="CookingRescue" style="height: 45px;">
            </a>
            <div class="nav-menu">
                <a href="#problem" class="nav-link">The Problem</a>
                <a href="#solution" class="nav-link">The Protocol</a>
                <a href="#reviews" class="nav-link">Reviews</a>
                <a href="https://cookingrescue.com/blog" class="nav-link">Blog</a>
                <a href="#offer" class="btn btn-primary" style="padding: 10px 24px; font-size: 0.9rem;">Join Masterclass</a>
            </div>
        </div>
    </nav>

    <!-- HERO SECTION -->
    <section class="hero">
        <div class="container">
            <div class="hero-grid">
                <div>
                    <div class="hero-badge">✨ Trusted by 50,000+ Students & Pros</div>
                    <h1>Reclaim 10 Hours & <span class="text-fire">$300 a Month.</span></h1>
                    <p style="font-size: 1.25rem; margin-bottom: 32px; color: var(--text-body);">Stop Cooking, Start Assembling. The meal planning system for busy professionals who hate meal prep.</p>
                    
                    <div class="hero-actions">
                        <a href="#free-guide" class="btn btn-primary" style="padding: 18px 36px; font-size: 1.1rem;">Get Free 7-Day Protocol</a>
                        <a href="#offer" class="btn btn-secondary">See How It Works</a>
                    </div>

                    <div class="trust-bar">
                        <span style="opacity: 0.6; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">Featured in:</span>
                        <strong style="color: var(--white); opacity: 0.9;">StudentLife</strong>
                        <strong style="color: var(--white); opacity: 0.9;">BudgetBytes</strong>
                        <strong style="color: var(--white); opacity: 0.9;">LifeHacker</strong>
                    </div>
                </div>

                <div class="visual-card" style="position: relative;">
                    <!-- Video Placeholder / Dynamic Card -->
                    <div style="background: radial-gradient(circle at center, #333, #111); border-radius: 12px; height: 400px; display: flex; align-items: center; justify-content: center; flex-direction: column; overflow: hidden; position: relative;">
                        <!-- Mock Video UI -->
                        <div style="position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.6); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; color: white;">⚡ 14:32 Real Time</div>
                        
                        <div style="font-size: 5rem; margin-bottom: 10px; filter: drop-shadow(0 0 20px rgba(255,140,0,0.4));">🍲</div>
                        <div style="color: white; font-weight: 700; font-size: 1.5rem; margin-bottom: 8px;">The Assembly System</div>
                        
                        <div style="display: flex; gap: 10px; margin-top: 20px;">
                            <span style="font-size: 0.8rem; background: rgba(255,255,255,0.1); padding: 4px 12px; border-radius: 12px;">High Protein</span>
                            <span style="font-size: 0.8rem; background: rgba(255,255,255,0.1); padding: 4px 12px; border-radius: 12px;"><$3.50/meal</span>
                        </div>

                        <!-- Progress Bar Animation -->
                        <div style="width: 240px; height: 6px; background: rgba(255,255,255,0.1); margin-top: 30px; border-radius: 4px; overflow: hidden;">
                            <div style="width: 100%; height: 100%; background: linear-gradient(90deg, var(--fire-orange), #ff4d00); animation: loadProgress 2s ease-out forwards;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- PROBLEM: CALCULATOR -->
    <section class="section-problem" id="problem">
        <div class="container">
            <div class="calc-header">
                <h2>The Hidden Cost of "Convenience"</h2>
                <p style="color: var(--text-muted);">See exactly what the "Takeout Tax" is costing you annually.</p>
            </div>

            <div class="calculator-box">
                <div class="calc-inputs">
                    <label>How many times do you order out per week?</label>
                    <input type="range" class="calc-range" id="ordersPerWeek" min="1" max="14" value="5" oninput="updateCalculator()">
                    <div style="display: flex; justify-content: space-between; color: white;">
                        <span>1x</span><span id="ordersDisplay" class="text-fire" style="font-weight: 700;">5x</span><span>14x</span>
                    </div>
                    <br>
                    <label>Average cost per order ($)</label>
                    <input type="range" class="calc-range" id="costPerOrder" min="10" max="60" value="35" oninput="updateCalculator()">
                    <div style="display: flex; justify-content: space-between; color: white;">
                        <span>$10</span><span id="costDisplay" class="text-fire" style="font-weight: 700;">$35</span><span>$60</span>
                    </div>
                </div>
                <div class="calc-result-box">
                    <div style="font-size: 0.9rem; color: var(--text-muted);">You burn this much annually:</div>
                    <div class="calc-big-num" id="annualInches">$9,100</div>
                    <div style="margin-top: 16px; font-size: 0.9rem; color: var(--text-muted);">Plus ~150 hours waiting for delivery.</div>
                </div>
            </div>
        </div>
    </section>

    <!-- SOLUTION: THE PROTOCOL -->
    <section class="section-solution" id="solution">
        <div class="container">
            <div class="text-center" style="max-width: 700px; margin: 0 auto;">
                <span class="text-fire" style="font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">The Ecosystem</span>
                <h2 style="margin-top: 16px;">We don't teach "Recipes".<br>We install a System.</h2>
            </div>
            <div class="funnel-steps">
                <!-- Step 1 -->
                <div class="step-card" id="free-guide">
                    <div class="step-num">01</div>
                    <div class="step-icon">📜</div>
                    <h3 class="step-title">The Foundation</h3>
                    <p class="step-desc">Get the Free 7-Day Protocol. A complete PDF guide to resetting your kitchen workflow.</p>
                    <form id="brevo-form" style="display: flex; flex-direction: column; gap: 12px;">
                        <input type="text" id="fn" placeholder="First Name" style="padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.2); color: white;">
                        <input type="email" id="email" placeholder="Email Address" required style="padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.2); color: white;">
                        <button type="submit" class="btn btn-primary" style="width: 100%; font-size: 0.9rem;">Send Me The Guide</button>
                    </form>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 12px; text-align: center;">Join 25,000+ subscribers.</p>
                </div>
                <!-- Step 2 -->
                <div class="step-card">
                    <div class="step-num">02</div>
                    <div class="step-icon">📊</div>
                    <h3 class="step-title">The Tools</h3>
                    <p class="step-desc">Budget Meal Planner. Automated Notion template to track costs and macros.</p>
                    <div class="text-fire" style="font-weight: 700; font-size: 1.5rem; margin-bottom: 16px;">$9 <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 400;">/ one-time</span></div>
                    <a href="https://cookingrescue.gumroad.com/l/sijgb?wanted=true" class="btn btn-secondary" style="width: 100%; justify-content: center;">Get The Planner</a>
                </div>
                <!-- Step 3 -->
                <div class="step-card" style="border-color: var(--fire-orange);">
                    <div class="step-num">03</div>
                    <div class="step-icon">🎓</div>
                    <h3 class="step-title">The Academy</h3>
                    <p class="step-desc">CookingRescue Masterclass. Video library, community access, and advanced techniques.</p>
                    <div class="text-fire" style="font-weight: 700; font-size: 1.5rem; margin-bottom: 16px;">$49 <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 400;">/ lifetime</span></div>
                    <a href="#offer" class="btn btn-primary" style="width: 100%; justify-content: center;">Join Academy</a>
                </div>
            </div>
        </div>
    </section>

    <!-- SOCIAL PROOF (The Tribe) -->
    <section class="section-proof" id="reviews">
        <div class="container">
            <h2 style="margin-bottom: 12px;">Join 10,000+ others preventing burnout.</h2>
            <p style="color: var(--text-muted); margin-bottom: 48px;">Real results from the #CookingRescue community.</p>
            
            <div class="proof-grid">
                <!-- ig card 1 -->
                <div class="review-card" style="padding: 0; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                    <div style="height: 200px; background: #333; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.2);">
                        📸 Food Photo
                    </div>
                    <div style="padding: 24px;">
                        <div style="display: flex; gap: 4px; margin-bottom: 12px; font-size: 0.8rem; color: var(--fire-orange);">
                            ★★★★★
                        </div>
                        <p class="review-text" style="font-size: 0.9rem; font-style: normal; margin-bottom: 16px;">
                            "I used to spend $600/mo on UberEats. Last month I spent $220 on groceries and ate better food. The math is undeniable. #budget #mealprep"
                        </p>
                        <div class="reviewer" style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 32px; height: 32px; background: #555; border-radius: 50%;"></div>
                            <div>
                                Sarah Jenkins
                                <span style="font-size: 0.75rem;">@sarah_medStudent</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ig card 2 -->
                <div class="review-card" style="padding: 0; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                    <div style="height: 200px; background: #444; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.2);">
                        📸 Meal Prep
                    </div>
                    <div style="padding: 24px;">
                        <div style="display: flex; gap: 4px; margin-bottom: 12px; font-size: 0.8rem; color: var(--fire-orange);">
                            ★★★★★
                        </div>
                        <p class="review-text" style="font-size: 0.9rem; font-style: normal; margin-bottom: 16px;">
                            "The 15-minute rule is real. I timed it. Chicken Rice Bowl took me 12:45. Why did I ever think cooking was hard?"
                        </p>
                        <div class="reviewer" style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 32px; height: 32px; background: #555; border-radius: 50%;"></div>
                            <div>
                                Marcus Chen
                                <span style="font-size: 0.75rem;">@marcus_dev</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ig card 3 -->
                <div class="review-card" style="padding: 0; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                    <div style="height: 200px; background: #2a2a2a; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.2);">
                        📸 Batch Cook
                    </div>
                    <div style="padding: 24px;">
                        <div style="display: flex; gap: 4px; margin-bottom: 12px; font-size: 0.8rem; color: var(--fire-orange);">
                            ★★★★★
                        </div>
                        <p class="review-text" style="font-size: 0.9rem; font-style: normal; margin-bottom: 16px;">
                            "The Masterclass paid for itself in week one. Just the 'Batch Protocol' video saved me 3 hours on Sunday. Recommended!"
                        </p>
                        <div class="reviewer" style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 32px; height: 32px; background: #555; border-radius: 50%;"></div>
                            <div>
                                Jessica T.
                                <span style="font-size: 0.75rem;">@marketing_jess</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- OFFER SECTION -->
    <section class="section-offer" id="offer">
        <div class="container">
            <div class="offer-box">
                <span class="scarcity-badge">Limited Enrollment</span>
                <h2>Deploy The Full System</h2>
                <p style="color: var(--text-muted); max-width: 600px; margin: 16px auto;">Get immediate access to the Video Masterclass, all templates, the community, and the budget planner.</p>
                <div class="offer-price">$49 <span>/ one-time</span></div>
                <div class="perks-list">
                    <div class="perk"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12" /></svg> 20+ Video Modules</div>
                    <div class="perk"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12" /></svg> Notion Templates</div>
                    <div class="perk"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12" /></svg> Private Discord</div>
                    <div class="perk"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12" /></svg> 30-Day Guarantee</div>
                </div>
                <button class="btn btn-primary" style="padding: 20px 48px; font-size: 1.2rem;">Join The Academy Now</button>
            </div>
        </div>
    </section>

    <!-- FOOTER -->
    <footer style="background: var(--charcoal-dark); padding: 40px 0; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
        <div class="container">
            <div style="display: flex; justify-content: center; gap: 24px; margin-bottom: 24px; font-size: 0.9rem;">
                <a href="/privacy-policy" style="color: var(--text-muted);">Privacy Policy</a>
                <a href="/terms-of-service" style="color: var(--text-muted);">Terms of Service</a>
                <a href="/contact" style="color: var(--text-muted);">Contact Support</a>
            </div>
            <div style="color: rgba(255,255,255,0.2); font-size: 0.8rem;">&copy; <?php echo date("Y"); ?> CookingRescue. All rights reserved.</div>
        </div>
    </footer>

    <!-- CHATBOT WIDGET REMOVED -->

    <!-- SCRIPTS -->
    <?php wp_footer(); ?>
    <script>
    // ─── CALCULATOR LOGIC ───
    function updateCalculator() {
        const orders = document.getElementById('ordersPerWeek').value;
        const cost = document.getElementById('costPerOrder').value;
        const total = orders * cost * 52;
        
        document.getElementById('ordersDisplay').innerText = orders + 'x';
        document.getElementById('costDisplay').innerText = '$' + cost;
        document.getElementById('annualInches').innerText = '$' + total.toLocaleString();
    }
    updateCalculator(); // Init

    document.addEventListener('DOMContentLoaded', () => {
        // Brevo Form (Lead Magnet)
        document.getElementById('brevo-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const fn = document.getElementById('fn').value;
            const em = document.getElementById('email').value;
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;
            
            btn.innerText = 'Sending...';
            
            try {
                await fetch('https://home.cookingrescue.com/api/subscribe', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({firstName: fn, email: em})
                });
                btn.innerText = 'Protocol Sent! Check Email.';
                btn.style.background = 'var(--green-success)';
            } catch (error) {
                btn.innerText = 'Error. Try again.';
            }
        });
    });
    </script>
</body>
</html>
