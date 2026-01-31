/**
 * AI Chatbot Configuration for CookingRescue.com
 * Customize chatbot behavior, appearance, and AI personality
 */

const CHATBOT_CONFIG = {
    // API Configuration
    api: {
        endpoint: '/api/chat',
        timeout: 30000, // 30 seconds
        retryAttempts: 2
    },

    // AI Personality & System Prompt
    ai: {
        systemPrompt: `You are a friendly and knowledgeable cooking assistant for CookingRescue.com. 

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

If users seem interested in meal planning, gently mention our free 7-Day Meal Prep Guide available on the website.`,

        model: 'gpt-4o-mini', // Can be changed to gpt-4, claude-3-sonnet, etc.
        maxTokens: 500,
        temperature: 0.7
    },

    // UI Customization
    ui: {
        welcomeMessage: {
            icon: '👋',
            title: "Hi! I'm your cooking assistant",
            subtitle: "Ask me anything about recipes, meal planning, cooking techniques, or nutrition!"
        },

        quickActions: [
            {
                label: '🕐 Quick dinner ideas',
                message: 'What are some quick 30-minute dinner ideas?'
            },
            {
                label: '📅 Meal prep tips',
                message: 'How do I meal prep for the week?'
            },
            {
                label: '🥗 Healthy substitutes',
                message: 'What are healthy substitutes for common ingredients?'
            },
            {
                label: '♻️ Reduce waste',
                message: 'How can I reduce food waste?'
            }
        ],

        botAvatar: '🍳',
        userAvatar: '👤',

        placeholderText: 'Type your question...',

        // Show typing indicator
        showTypingIndicator: true,

        // Auto-scroll to new messages
        autoScroll: true
    },

    // Features
    features: {
        // Save chat history to localStorage
        persistHistory: true,

        // Maximum messages to keep in history
        maxHistoryMessages: 50,

        // Show notification badge for new messages
        showNotificationBadge: true,

        // Enable quick actions
        enableQuickActions: true,

        // Auto-open chat on first visit
        autoOpenOnFirstVisit: false,

        // Show timestamps on messages
        showTimestamps: true
    },

    // Rate Limiting (client-side)
    rateLimit: {
        maxMessagesPerMinute: 10,
        maxMessagesPerHour: 50
    },

    // Error Messages
    messages: {
        networkError: "Oops! I'm having trouble connecting. Please check your internet and try again.",
        rateLimitError: "You're sending messages too quickly. Please wait a moment and try again.",
        serverError: "Something went wrong on my end. Please try again in a moment.",
        emptyMessage: "Please type a message before sending.",
        apiKeyMissing: "The chatbot is not configured properly. Please contact support."
    }
};

// Export for use in chatbot.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CHATBOT_CONFIG;
}
