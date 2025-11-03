const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const sendButton = document.getElementById('send-button');
const quickQuestionButtons = document.querySelectorAll('.quick-question-button');
const clearChatButton = document.getElementById('clear-chat-button');
const newChatButton = document.getElementById('new-chat-button');
const welcomeMessageContainer = document.querySelector('.welcome-message');
const historyItemsList = document.getElementById('history-items-list');
const noHistoryMessage = document.getElementById('no-history-message');

// --- NEW Image Upload Elements ---
const imageUploadInput = document.getElementById('image-upload-input');
const imageUploadButton = document.getElementById('image-upload-button');
const imagePreviewArea = document.getElementById('image-preview-area');
const imageFilenameSpan = document.getElementById('image-filename');
const removeImageButton = document.getElementById('remove-image-button');

const API_URL = 'http://127.0.0.1:8000/chat';
let currentSessionId = null;
let selectedImageBase64 = null; // Variable to store the selected image data

function addHistoryItem(sessionId, title) {
    if (noHistoryMessage && noHistoryMessage.style.display !== 'none') {
        noHistoryMessage.style.display = 'none';
    }
    const listItem = document.createElement('li');
    listItem.classList.add('history-item');
    listItem.textContent = title;
    listItem.dataset.sessionId = sessionId;
    listItem.addEventListener('click', () => {
        document.querySelectorAll('.history-item.active').forEach(item => item.classList.remove('active'));
        listItem.classList.add('active');
        console.log(`Clicked history item for session: ${sessionId}`);
    });
    historyItemsList.prepend(listItem);
    setActiveHistoryItem(sessionId);
}

function setActiveHistoryItem(sessionId) {
     document.querySelectorAll('.history-item').forEach(item => {
        if (item.dataset.sessionId === sessionId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function displayMessage(message, sender) {
    const welcomeExists = chatMessages.contains(welcomeMessageContainer);
    if (welcomeExists && sender !== 'clear') {
         if (chatMessages.children.length <= 1) {
             if (chatMessages.contains(welcomeMessageContainer)) {
                 chatMessages.removeChild(welcomeMessageContainer);
             }
         }
    }

    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    const senderClass = sender.includes('typing') ? 'assistant-message typing' : `${sender}-message`;
    messageElement.classList.add(...senderClass.split(' '));

    const iconElement = document.createElement('div');
    iconElement.classList.add('message-icon');
    let iconContent = '';
    if (sender === 'user') {
        iconContent = '🧑‍🌾';
    } else if (sender === 'assistant' || sender.includes('typing')) {
        iconContent = '🤖';
    }
    iconElement.textContent = iconContent;

    const textElement = document.createElement('div');
    textElement.classList.add('message-text');

    if (sender === 'user') {
        messageElement.appendChild(textElement);
        if (iconContent) messageElement.appendChild(iconElement);
    } else {
        if (iconContent) messageElement.appendChild(iconElement);
        messageElement.appendChild(textElement);
    }
    chatMessages.appendChild(messageElement);

    if (sender === 'assistant') {
        textElement.innerHTML = "";
        let i = 0;
        const speed = 20;

        function typeWriter() {
            if (i < message.length) {
                let char = message.charAt(i);
                let nextChar = message.charAt(i + 1);

                if (char === '*' && nextChar === '*') {
                    const closingStars = message.indexOf('**', i + 2);
                    if (closingStars !== -1) {
                        const boldText = message.substring(i + 2, closingStars);
                        textElement.innerHTML += `<strong>${boldText}</strong>`;
                        i = closingStars + 1;
                    } else {
                         textElement.innerHTML += char;
                    }
                }
                else if (char === '\n') {
                    textElement.innerHTML += '<br>';
                }
                 else {
                    textElement.innerHTML += char;
                }

                i++;
                chatMessages.scrollTop = chatMessages.scrollHeight;
                setTimeout(typeWriter, speed);
            } else {
                 applyListFormatting(textElement, message);
            }
        }
        typeWriter();

    } else if (sender.includes('typing')) {
         textElement.textContent = message;
         messageElement.id = 'typing-indicator';
         chatMessages.scrollTop = chatMessages.scrollHeight;
    }
     else {
        textElement.innerHTML = message.replace(/\n/g, '<br>');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function applyListFormatting(textElement, originalMessage) {
    let htmlContent = textElement.innerHTML;
    htmlContent = htmlContent.replace(/^[\*\-] (.*?)(?:<br>|$)/gm, '<li>$1</li>');
    htmlContent = htmlContent.replace(/^\d+\. (.*?)(?:<br>|$)/gm, '<li>$1</li>');
    htmlContent = htmlContent.replace(/<\/li>(?:<br>)?<li>/g, '</li><li>');

    const firstLineTrimmed = originalMessage.trim().split('\n')[0];
    const isOrderedList = /^\d+\./.test(firstLineTrimmed);
    const listTag = isOrderedList ? 'ol' : 'ul';

    if (htmlContent.includes('<li>')) {
        htmlContent = htmlContent.replace(/<\/?ul>|<\/?ol>/g, '');
        const wrappedContent = htmlContent.replace(/(<li>.*?<\/li>)/gs, `$1`);
        const listItemsOnly = wrappedContent.match(/<li>.*?<\/li>/gs)?.join('') || '';

        if (listItemsOnly) {
             const firstLiIndex = htmlContent.indexOf('<li>');
             const lastLiIndex = htmlContent.lastIndexOf('</li>') + 5;
             const contentBefore = htmlContent.substring(0, firstLiIndex);
             const contentAfter = htmlContent.substring(lastLiIndex);
             htmlContent = `${contentBefore}<${listTag}>${listItemsOnly}</${listTag}>${contentAfter}`;
        }
    }
    textElement.innerHTML = htmlContent;
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setLoadingState(isLoading) {
    chatInput.disabled = isLoading;
    sendButton.disabled = isLoading;
    imageUploadButton.disabled = isLoading; // Disable upload button too

    const existingIndicator = document.getElementById('typing-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    if (isLoading) {
       displayMessage('Assistant is typing...', 'assistant typing');
    }
}

function addWelcomeMessage() {
     if (welcomeMessageContainer && !chatMessages.contains(welcomeMessageContainer)) {
         const clonedWelcome = welcomeMessageContainer.cloneNode(true);
         chatMessages.appendChild(clonedWelcome);
     } else if (!welcomeMessageContainer && chatMessages.children.length === 0) {
         const recreatedWelcome = document.createElement('div');
         recreatedWelcome.classList.add('welcome-message');
         recreatedWelcome.innerHTML = `
            <span>🌱</span>
            <h2>Welcome to AI Farmer Assistant!</h2>
            <p>Ask me anything about farming, crops, soil management, pest control, and more.</p>
         `;
         chatMessages.appendChild(recreatedWelcome);
     }
}

// --- NEW Function to handle removing the selected image ---
function removeSelectedImage() {
    selectedImageBase64 = null;
    imagePreviewArea.style.display = 'none';
    imageFilenameSpan.textContent = '';
    imageUploadInput.value = null; // Reset file input
    console.log("Selected image removed.");
}

async function handleSendMessage() {
    const question = chatInput.value.trim();
    // Allow sending only image, or image with question
    if (!question && !selectedImageBase64) return;

    const isNewSession = currentSessionId === null;

    // Display user message (or image indicator)
    let displayUserContent = question;
    if (selectedImageBase64 && question) {
        displayUserContent = `[Image Attached] ${question}`;
    } else if (selectedImageBase64 && !question) {
        displayUserContent = `[Image Attached]`;
    }
    displayMessage(displayUserContent, 'user');

    // Store image data locally before clearing
    const imageToSend = selectedImageBase64;

    // Clear input and image preview AFTER getting values
    chatInput.value = '';
    removeSelectedImage(); // Clear image state from UI

    setLoadingState(true);

    const userState = "Telangana";

    try {
        const payload = {
            question: question || "Describe the attached image.", // Use default question if only image sent
            state: userState,
            session_id: currentSessionId,
            image_base64: imageToSend // Send the stored image data
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        setLoadingState(false);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: response.statusText }));
            console.error('API Error:', response.status, errorData);
            displayMessage(`Error: ${errorData.detail || 'Failed to get response.'}`, 'error');
            return;
        }

        const data = await response.json();

        if (isNewSession && data.session_id) {
            const title = question.substring(0, 25) + (question.length > 25 ? '...' : '');
            addHistoryItem(data.session_id, title || "[Image Query]"); // Use default title if no text question
        } else if (data.session_id) {
             setActiveHistoryItem(data.session_id);
        }
        currentSessionId = data.session_id;

        console.log("Using session ID:", currentSessionId);
        displayMessage(data.answer, 'assistant');

    } catch (error) {
        setLoadingState(false);
        console.error('Network or Fetch Error:', error);
        displayMessage('Error connecting. Is the backend server running?', 'error');
    }
}

sendButton.addEventListener('click', handleSendMessage);

chatInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
    }
});

quickQuestionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const questionText = button.textContent;
        chatInput.value = questionText;
        chatInput.focus();
        removeSelectedImage(); // Clear image if a quick question is clicked
    });
});

clearChatButton.addEventListener('click', () => {
    chatMessages.innerHTML = '';
    addWelcomeMessage();
    console.log("Chat cleared.");
    currentSessionId = null;
    console.log("Session ID reset.");
    document.querySelectorAll('.history-item.active').forEach(item => item.classList.remove('active'));
    removeSelectedImage(); // Clear image on clear chat
});

newChatButton.addEventListener('click', () => {
    chatMessages.innerHTML = '';
    addWelcomeMessage();
    currentSessionId = null;
    console.log("Started a new chat session.");
    document.querySelectorAll('.history-item.active').forEach(item => item.classList.remove('active'));
    removeSelectedImage(); // Clear image on new chat
});

// --- NEW Event Listeners for Image Upload ---
imageUploadButton.addEventListener('click', () => {
    imageUploadInput.click(); // Trigger hidden file input
});

imageUploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            selectedImageBase64 = reader.result; // Store Base64 Data URI string
            imageFilenameSpan.textContent = file.name; // Show filename
            imagePreviewArea.style.display = 'flex'; // Show preview area
            console.log("Image selected:", file.name);
        }
        reader.onerror = (error) => {
            console.error("Error reading file:", error);
            displayMessage("Error reading image file.", 'error');
            removeSelectedImage();
        };
        reader.readAsDataURL(file); // Read file as Base64 Data URI
    } else if (file) {
         displayMessage("Please select a valid image file.", 'error');
         removeSelectedImage();
    }
});

removeImageButton.addEventListener('click', removeSelectedImage);


console.log("Chat interface script loaded and ready.");

if (chatMessages.children.length === 0 && welcomeMessageContainer) {
   // Welcome message logic
} else if (!welcomeMessageContainer && chatMessages.children.length === 0){
    addWelcomeMessage();
}