document.getElementById("send-btn").addEventListener("click", handleSend);
document.getElementById("teach-btn").addEventListener("click", handleTeach);
document.getElementById("reset-memory-btn").addEventListener("click", handleResetMemory);
document.getElementById("user-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        handleSend();
    }
});

// Load memory from localStorage when the page loads
let memory = JSON.parse(localStorage.getItem("chatbotMemory")) || {};

const grammarRules = [
    // ...existing grammar rules
];

// Base64 encoded password (for example, "reset123")
const encodedPassword = "cmVzZXQxMjM=";  // This is the Base64 encoding of "reset123"

// Decode the Base64 string to get the password
function decodePassword(encoded) {
    return atob(encoded);  // atob() decodes a Base64 encoded string
}

// Helper function to clean input (remove punctuation and convert to lowercase)
function cleanInput(input) {
    return input.replace(/[.,?!]/g, "").toLowerCase();
}

// Function to calculate the Levenshtein distance between two strings
function levenshteinDistance(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,        // Deletion
                matrix[i][j - 1] + 1,        // Insertion
                matrix[i - 1][j - 1] + cost  // Substitution
            );
        }
    }
    return matrix[a.length][b.length];
}

// Function to find the closest match within a tolerance level
function findClosestMatch(input, tolerance = 2) {
    const cleanedInput = cleanInput(input);
    for (const question in memory) {
        const cleanedQuestion = cleanInput(question);
        if (levenshteinDistance(cleanedInput, cleanedQuestion) <= tolerance) {
            return memory[question];
        }
    }
    return null;
}

// Function to detect if the input is a math expression
function isMathExpression(input) {
    return /^[\d+\-*/().\s]+$/.test(input);
}

// Function to evaluate math expressions safely
function evaluateMathExpression(expression) {
    try {
        return new Function(`return ${expression}`)();
    } catch (error) {
        return "I couldn't calculate that. Please check the expression.";
    }
}

// Function to handle sending a message in the chat
function handleSend() {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    addMessage("user", userInput);
    document.getElementById("user-input").value = "";

    setTimeout(() => {
        const response = generateResponse(userInput);
        addMessage("ai", response);
    }, 500);
}

// Function to handle teaching the bot a new response
function handleTeach() {
    const question = document.getElementById("teach-question").value.trim().toLowerCase();
    const answer = document.getElementById("teach-answer").value.trim();

    if (question && answer) {
        memory[question] = answer;

        // Save the updated memory to localStorage
        localStorage.setItem("chatbotMemory", JSON.stringify(memory));

        addMessage("ai", `Got it! I'll respond to "${question}" with "${answer}".`);

        document.getElementById("teach-question").value = "";
        document.getElementById("teach-answer").value = "";
    } else {
        addMessage("ai", "Please enter both a question and an answer to teach me.");
    }
}

// Function to display messages in the chat window
function addMessage(sender, text) {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message", sender === "user" ? "user-message" : "ai-message");
    messageContainer.textContent = text;

    document.getElementById("chat-messages").appendChild(messageContainer);
    document.getElementById("chat-window").scrollTop = document.getElementById("chat-window").scrollHeight;
}

// Function to generate responses using memory, grammar check, math evaluation, or fuzzy matching
function generateResponse(input) {
    const cleanedInput = cleanInput(input);

    // Check if the input is a math expression and evaluate it if true
    if (isMathExpression(cleanedInput)) {
        const result = evaluateMathExpression(input);
        return `The answer is: ${result}`;
    }

    // First try exact match
    if (memory[cleanedInput]) {
        return memory[cleanedInput];
    }

    // Try finding a close match if exact match fails
    const closeMatch = findClosestMatch(cleanedInput);
    if (closeMatch) {
        return closeMatch;
    }

    return `I'm not sure how to respond to that. You can teach me a response using the training feilds.`;
}

// Function to handle resetting memory
function handleResetMemory() {
    const enteredPassword = prompt("Please enter the secret password to reset memory:");

    if (enteredPassword === decodePassword(encodedPassword)) {
        // Clear memory and update localStorage
        memory = {};
        localStorage.removeItem("chatbotMemory");

        addMessage("ai", "Memory has been reset.");
    } else {
        addMessage("ai", "Incorrect password. Memory not reset.");
    }
}
