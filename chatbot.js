/**
 * AI Chatbot JavaScript for CookingRescue.com
 * Handles chat interactions, AI API calls, and UI management
 */

class CookingChatbot {
    constructor(config) {
        this.config = config;
        this.isOpen = false;
        this.messages = [];
        this.messageCount = { perMinute: 0, perHour: 0 };

        // DOM Elements
        this.container = document.getElementById('chatbotContainer');
        this.toggleBtn = document.getElementById('chatbotToggle');
        this.closeBtn = document.getElementById('chatbotClose');
        this.window = document.getElementById('chatbotWindow');
        this.messagesContainer = document.getElementById('chatbotMessages');
        this.input = document.getElementById('chatbotInput');
        this.sendBtn = document.getElementById('chatbotSend');
        this.badge = document.getElementById('chatbotBadge');
        this.quickActionsContainer = document.getElementById('chatbotQuickActions');

        this.init();
    }

    init() {
        // Load chat history
        if (this.config.features.persistHistory) {
            this.loadHistory();
        }

        // Event listeners
        this.toggleBtn.addEventListener('click', () => this.toggle());
        this.closeBtn.addEventListener('click', () => this.close());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.input.addEventListener('input', () => this.autoResizeInput());

        // Quick action buttons
        if (this.config.features.enableQuickActions) {
            this.setupQuickActions();
        }

        // Rate limit reset timers
        setInterval(() => { this.messageCount.perMinute = 0; }, 60000);
        setInterval(() => { this.messageCount.perHour = 0; }, 3600000);

        // Auto-open on first visit
        if (this.config.features.autoOpenOnFirstVisit && !localStorage.getItem('chatbot_visited')) {
            setTimeout(() => {
                this.open();
                localStorage.setItem('chatbot_visited', 'true');
            }, 3000);
        }

        // Show notification badge if enabled
        if (this.config.features.showNotificationBadge && !this.isOpen) {
            this.showBadge();
        }
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.window.classList.add('active');
        this.toggleBtn.classList.add('active');
        this.hideBadge();
        this.input.focus();

        // Scroll to bottom
        if (this.config.ui.autoScroll) {
            this.scrollToBottom();
        }
    }

    close() {
        this.isOpen = false;
        this.window.classList.remove('active');
        this.toggleBtn.classList.remove('active');
    }

    showBadge() {
        if (this.badge) {
            this.badge.style.display = 'flex';
        }
    }

    hideBadge() {
        if (this.badge) {
            this.badge.style.display = 'none';
        }
    }

    setupQuickActions() {
        const buttons = this.quickActionsContainer.querySelectorAll('.chatbot-quick-action-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                if (message) {
                    this.input.value = message;
                    this.sendMessage();
                    // Hide quick actions after first use
                    this.quickActionsContainer.style.display = 'none';
                }
            });
        });
    }

    autoResizeInput() {
        this.input.style.height = 'auto';
        this.input.style.height = Math.min(this.input.scrollHeight, 100) + 'px';
    }

    async sendMessage() {
        const message = this.input.value.trim();

        // Validation
        if (!message) {
            this.showError(this.config.messages.emptyMessage);
            return;
        }

        // Rate limiting
        if (this.messageCount.perMinute >= this.config.rateLimit.maxMessagesPerMinute ||
            this.messageCount.perHour >= this.config.rateLimit.maxMessagesPerHour) {
            this.showError(this.config.messages.rateLimitError);
            return;
        }

        // Clear input
        this.input.value = '';
        this.autoResizeInput();

        // Add user message to UI
        this.addMessage('user', message);

        // Update rate limit counters
        this.messageCount.perMinute++;
        this.messageCount.perHour++;

        // Show typing indicator
        if (this.config.ui.showTypingIndicator) {
            this.showTypingIndicator();
        }

        // Hide quick actions after first message
        if (this.quickActionsContainer) {
            this.quickActionsContainer.style.display = 'none';
        }

        try {
            // Call AI API
            const response = await this.callAI(message);

            // Remove typing indicator
            this.hideTypingIndicator();

            // Add bot response to UI
            this.addMessage('bot', response);

        } catch (error) {
            console.error('Chatbot error:', error);
            this.hideTypingIndicator();

            // Show appropriate error message
            if (error.message.includes('network') || error.message.includes('fetch')) {
                this.showError(this.config.messages.networkError);
            } else if (error.message.includes('API key')) {
                this.showError(this.config.messages.apiKeyMissing);
            } else {
                this.showError(this.config.messages.serverError);
            }
        }
    }

    async callAI(userMessage) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.api.timeout);

        try {
            const response = await fetch(this.config.api.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: this.getRecentHistory(5) // Send last 5 messages for context
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('Rate limit exceeded');
                } else if (response.status === 401) {
                    throw new Error('API key missing or invalid');
                }
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            return data.response || data.message || 'Sorry, I didn\'t get a response.';

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('Request timeout - please try again');
            }
            throw error;
        }
    }

    addMessage(type, content) {
        const messageObj = {
            type,
            content,
            timestamp: new Date().toISOString()
        };

        // Add to messages array
        this.messages.push(messageObj);

        // Save to localStorage
        if (this.config.features.persistHistory) {
            this.saveHistory();
        }

        // Create message element
        const messageEl = this.createMessageElement(messageObj);

        // Remove welcome message if it exists
        const welcome = this.messagesContainer.querySelector('.chatbot-welcome');
        if (welcome && this.messages.length > 0) {
            welcome.remove();
        }

        // Append to messages container
        this.messagesContainer.appendChild(messageEl);

        // Scroll to bottom
        if (this.config.ui.autoScroll) {
            this.scrollToBottom();
        }

        // Show notification if window is closed
        if (!this.isOpen && type === 'bot' && this.config.features.showNotificationBadge) {
            this.showBadge();
        }
    }

    createMessageElement(messageObj) {
        const { type, content, timestamp } = messageObj;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${type}`;

        const avatar = document.createElement('div');
        avatar.className = 'chatbot-message-avatar';
        avatar.textContent = type === 'bot' ? this.config.ui.botAvatar : this.config.ui.userAvatar;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'chatbot-message-content';

        const bubble = document.createElement('div');
        bubble.className = 'chatbot-message-bubble';
        bubble.textContent = content;

        contentDiv.appendChild(bubble);

        // Add timestamp if enabled
        if (this.config.features.showTimestamps) {
            const time = document.createElement('div');
            time.className = 'chatbot-message-time';
            time.textContent = this.formatTime(timestamp);
            contentDiv.appendChild(time);
        }

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);

        return messageDiv;
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot';
        typingDiv.id = 'chatbot-typing-indicator';

        const avatar = document.createElement('div');
        avatar.className = 'chatbot-message-avatar';
        avatar.textContent = this.config.ui.botAvatar;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'chatbot-message-content';

        const typing = document.createElement('div');
        typing.className = 'chatbot-typing';
        typing.innerHTML = '<div class="chatbot-typing-dot"></div><div class="chatbot-typing-dot"></div><div class="chatbot-typing-dot"></div>';

        contentDiv.appendChild(typing);
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(contentDiv);

        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('chatbot-typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'chatbot-error';
        errorDiv.textContent = message;

        this.messagesContainer.appendChild(errorDiv);
        this.scrollToBottom();

        // Remove error after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    getRecentHistory(count = 5) {
        return this.messages.slice(-count).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));
    }

    saveHistory() {
        try {
            const historyToSave = this.messages.slice(-this.config.features.maxHistoryMessages);
            localStorage.setItem('chatbot_history', JSON.stringify(historyToSave));
        } catch (error) {
            console.warn('Failed to save chat history:', error);
        }
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('chatbot_history');
            if (saved) {
                this.messages = JSON.parse(saved);

                // Render saved messages
                this.messages.forEach(msg => {
                    const messageEl = this.createMessageElement(msg);
                    this.messagesContainer.appendChild(messageEl);
                });

                // Hide welcome and quick actions if there's history
                if (this.messages.length > 0) {
                    const welcome = this.messagesContainer.querySelector('.chatbot-welcome');
                    if (welcome) welcome.remove();
                    if (this.quickActionsContainer) {
                        this.quickActionsContainer.style.display = 'none';
                    }
                }
            }
        } catch (error) {
            console.warn('Failed to load chat history:', error);
        }
    }

    clearHistory() {
        this.messages = [];
        localStorage.removeItem('chatbot_history');
        this.messagesContainer.innerHTML = '';

        // Re-add welcome message
        const welcome = document.createElement('div');
        welcome.className = 'chatbot-welcome';
        welcome.innerHTML = `
            <div class="chatbot-welcome-icon">${this.config.ui.welcomeMessage.icon}</div>
            <h4>${this.config.ui.welcomeMessage.title}</h4>
            <p>${this.config.ui.welcomeMessage.subtitle}</p>
        `;
        this.messagesContainer.appendChild(welcome);

        // Re-show quick actions
        if (this.quickActionsContainer) {
            this.quickActionsContainer.style.display = 'flex';
        }
    }
}

// Note: Chatbot will be initialized manually after HTML is loaded
// See the initialization code in the HTML pages
