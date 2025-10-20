// 聊天应用主类
class ChatApp {
    constructor() {
        this.currentChatId = null;
        this.chats = new Map();
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialData();
        this.scrollToBottom();
    }

    // 绑定事件
    bindEvents() {
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const newChatBtn = document.getElementById('newChatBtn');
        const historyList = document.getElementById('historyList');
        const regenerateBtn = document.getElementById('regenerateBtn');
        const copyBtn = document.getElementById('copyBtn');
        const clearBtn = document.getElementById('clearBtn');

        // 发送消息
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        // 新对话
        newChatBtn.addEventListener('click', () => this.createNewChat());
        
        // 切换历史对话
        historyList.addEventListener('click', (e) => {
            const historyItem = e.target.closest('.history-item');
            if (historyItem) {
                this.switchChat(historyItem.dataset.chatId);
            }
        });

        // 输入框事件
        messageInput.addEventListener('input', () => this.autoResizeTextarea());
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // 功能按钮
        regenerateBtn.addEventListener('click', () => this.regenerateResponse());
        copyBtn.addEventListener('click', () => this.copyConversation());
        clearBtn.addEventListener('click', () => this.clearConversation());
    }

    // 加载初始数据
    loadInitialData() {
        // 添加示例对话历史
        const sampleChats = [
            { id: '1', title: 'AI助手使用指南', active: true },
            { id: '2', title: 'JavaScript学习计划', active: false },
            { id: '3', title: '项目需求分析', active: false }
        ];

        sampleChats.forEach(chat => {
            this.addChatToHistory(chat.id, chat.title, chat.active);
            if (chat.active) {
                this.currentChatId = chat.id;
                this.loadChatMessages(chat.id);
            }
        });
    }

    // 自动调整输入框高度
    autoResizeTextarea() {
        const textarea = document.getElementById('messageInput');
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    // 发送消息
    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (message === '') return;

        // 移除欢迎消息（如果是第一次发送）
        this.removeWelcomeMessage();

        // 添加用户消息
        this.addMessage(message, 'user');
        messageInput.value = '';
        this.autoResizeTextarea();

        // 禁用发送按钮
        document.getElementById('sendBtn').disabled = true;

        // 显示AI正在输入
        this.showTypingIndicator();

        // 模拟AI回复
        setTimeout(() => {
            this.removeTypingIndicator();
            const aiResponse = this.generateAIResponse(message);
            this.addMessage(aiResponse, 'assistant');
            document.getElementById('sendBtn').disabled = false;
            this.scrollToBottom();
        }, 1500);
    }

    // 添加消息到聊天区域
    addMessage(content, sender) {
        const messages = document.getElementById('messages');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        avatarDiv.textContent = sender === 'user' ? '你' : 'AI';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        messages.appendChild(messageDiv);
        
        this.scrollToBottom();
    }

    // 显示输入指示器
    showTypingIndicator() {
        const messages = document.getElementById('messages');
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant';
        typingDiv.id = 'typingIndicator';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        avatarDiv.textContent = 'AI';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'typing-indicator';
        contentDiv.innerHTML = `
            <span>AI正在思考</span>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        `;
        
        typingDiv.appendChild(avatarDiv);
        typingDiv.appendChild(contentDiv);
        messages.appendChild(typingDiv);
        
        this.scrollToBottom();
    }

    // 移除输入指示器
    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // 移除欢迎消息
    removeWelcomeMessage() {
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
    }

    // 滚动到底部
    scrollToBottom() {
        const messages = document.getElementById('messages');
        messages.scrollTop = messages.scrollHeight;
    }

    // 生成AI回复（模拟）
    generateAIResponse(userMessage) {
        const responses = [
            "这是一个很好的问题！让我详细解释一下...",
            "根据我的理解，这个问题涉及多个方面。首先...",
            "感谢你的提问！关于这个问题，我可以提供以下信息...",
            "我明白你的疑问。让我从几个角度来分析这个问题...",
            "这是一个常见的问题。简单来说，主要涉及以下几个方面..."
        ];
        
        // 简单关键词匹配
        if (userMessage.includes('代码') || userMessage.includes('编程')) {
            return "关于编程问题，我可以帮你分析代码、提供示例或解释概念。你能具体说明你遇到的编程问题吗？";
        } else if (userMessage.includes('学习') || userMessage.includes('教程')) {
            return "学习新技能是一个很好的想法！我可以为你制定学习计划、推荐资源或解释复杂概念。你想学习什么具体内容？";
        } else if (userMessage.includes('项目') || userMessage.includes('开发')) {
            return "项目开发涉及多个阶段，包括需求分析、设计、实现和测试。我可以协助你进行项目规划、技术选型或问题排查。";
        } else if (userMessage.includes('你好') || userMessage.includes('嗨')) {
            return "你好！很高兴与你交流。我是DeepSeek AI助手，可以回答你的问题、协助解决问题或进行有意义的对话。今天有什么我可以帮助你的吗？";
        } else {
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }

    // 创建新对话
    createNewChat() {
        const chatId = 'chat_' + Date.now();
        const title = '新对话';
        
        this.addChatToHistory(chatId, title, true);
        this.switchChat(chatId);
        
        // 清空消息区域并显示欢迎消息
        const messages = document.getElementById('messages');
        messages.innerHTML = `
            <div class="welcome-message">
                <h2>新对话已开始</h2>
                <p>我是您的AI助手，可以回答各种问题、协助编程、分析文档等</p>
            </div>
            <div class="message assistant">
                <div class="avatar">AI</div>
                <div class="message-content">
                    你好！我是DeepSeek AI助手，很高兴为你服务。我可以帮你解答问题、提供信息、协助编程、分析文档等等。请告诉我你需要什么帮助？
                </div>
            </div>
        `;
    }

    // 添加对话到历史记录
    addChatToHistory(chatId, title, active = false) {
        const historyList = document.getElementById('historyList');
        
        const historyItem = document.createElement('div');
        historyItem.className = `history-item ${active ? 'active' : ''}`;
        historyItem.dataset.chatId = chatId;
        historyItem.innerHTML = `
            <i class="fas fa-comment"></i>
            <span>${title}</span>
        `;
        
        // 添加到列表顶部
        historyList.insertBefore(historyItem, historyList.firstChild);
        
        // 存储聊天数据
        if (!this.chats.has(chatId)) {
            this.chats.set(chatId, {
                id: chatId,
                title: title,
                messages: []
            });
        }
    }

    // 切换对话
    switchChat(chatId) {
        // 更新活跃状态
        document.querySelectorAll('.history-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-chat-id="${chatId}"]`).classList.add('active');
        
        this.currentChatId = chatId;
        this.loadChatMessages(chatId);
    }

    // 加载聊天消息
    loadChatMessages(chatId) {
        // 在实际应用中，这里会从存储中加载消息
        const messages = document.getElementById('messages');
        messages.innerHTML = `
            <div class="message assistant">
                <div class="avatar">AI</div>
                <div class="message-content">
                    已切换到选中的对话历史。这是之前的对话内容...
                </div>
            </div>
            <div class="message user">
                <div class="avatar">你</div>
                <div class="message-content">
                    这是之前的问题示例
                </div>
            </div>
            <div class="message assistant">
                <div class="avatar">AI</div>
                <div class="message-content">
                    这是之前的回答示例
                </div>
            </div>
        `;
    }

    // 重新生成回复
    regenerateResponse() {
        const messages = document.getElementById('messages');
        const lastAssistantMessage = messages.querySelector('.message.assistant:last-child .message-content');
        
        if (lastAssistantMessage) {
            lastAssistantMessage.textContent = '重新生成的回复内容...';
        }
    }

    // 复制对话
    copyConversation() {
        const messages = document.getElementById('messages');
        const text = Array.from(messages.children)
            .map(message => {
                const sender = message.classList.contains('user') ? '你' : 'AI';
                const content = message.querySelector('.message-content').textContent;
                return `${sender}: ${content}`;
            })
            .join('\n\n');
        
        navigator.clipboard.writeText(text).then(() => {
            alert('对话已复制到剪贴板');
        });
    }

    // 清除对话
    clearConversation() {
        if (confirm('确定要清除当前对话吗？')) {
            const messages = document.getElementById('messages');
            messages.innerHTML = `
                <div class="welcome-message">
                    <h2>对话已清除</h2>
                    <p>开始新的对话吧</p>
                </div>
            `;
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});