document.getElementById("theme-switch").addEventListener("change", handleTrainingModeToggle);

let isTrainingMode = document.getElementById("theme-switch").checked;

document.getElementById("send-btn").addEventListener("click", handleSend);
document.getElementById("teach-btn").addEventListener("click", handleTeach);
document.getElementById("reset-memory-btn").addEventListener("click", handleResetMemory);
document.getElementById("user-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        handleSend();
    }
});

let memory = JSON.parse(localStorage.getItem("chatbotMemory")) || {};
const grammarRules = [];
const encodedPassword = "cmVzZXQxMjM=";
let conversationHistory = []; 

const stopWords = [
    "the", "is", "at", "which", "on", "of", "and", "a", "an", "for", "in", "to", "by", 
    "with", "as", "that", "it", "or", "be", "was", "were", "are", "this", "these", "those", 
    "but", "from", "i", "you", "he", "she", "they", "we", "me", "him", "her", "them", "us",
    "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was",
    "were", "be", "been", "it's", "does", "how", "many"
];
function removeStopWords(input) {
    const words = input.split(" ");
    const filteredWords = words.filter(word => !stopWords.includes(word.toLowerCase()));
    return filteredWords.join(" ");
}

function decodePassword(encoded) {
    return atob(encoded); 
}

function cleanInput(input) {
    const cleanedInput = removeStopWords(input);
    return cleanedInput.replace(/[.,?!]/g, "").toLowerCase();
}

function levenshteinDistance(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,        
                matrix[i][j - 1] + 1,       
                matrix[i - 1][j - 1] + cost 
            );
        }
    }
    return matrix[a.length][b.length];
}

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

function isMathExpression(input) {
    return /^[\d+\-*/().\s]+$/.test(input);
}

function evaluateMathExpression(expression) {
    try {
        return new Function(`return ${expression}`)();
    } catch (error) {
        return "I couldn't calculate that. Please check the expression.";
    }
}

function handleSend() {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    addMessage("user", userInput);
    document.getElementById("user-input").value = "";

    
    conversationHistory.push({ role: "user", message: userInput });

    setTimeout(() => {
        const response = generateResponse(userInput);
        addMessage("ai", response);
    }, 500);
}

function handleTeach() {
    if (!isTrainingMode) {
        addMessage("ai", "Training mode is disabled. Please turn it on using the switch.");
        return;
    }

    const question = document.getElementById("teach-question").value.trim().toLowerCase();
    const answer = document.getElementById("teach-answer").value.trim();

    if (question && answer) {
        memory[question] = answer;

        localStorage.setItem("chatbotMemory", JSON.stringify(memory));

        addMessage("ai", `Got it! I'll respond to "${question}" with "${answer}".`);

        document.getElementById("teach-question").value = "";
        document.getElementById("teach-answer").value = "";
    } else {
        addMessage("ai", "Please enter both a question and an answer to teach me.");
    }
}

function addMessage(sender, text) {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message", sender === "user" ? "user-message" : "ai-message");
    messageContainer.textContent = text;

    document.getElementById("chat-messages").appendChild(messageContainer);
    document.getElementById("chat-window").scrollTop = document.getElementById("chat-window").scrollHeight;
}

function generateResponse(input) {
    const cleanedInput = cleanInput(input);

    if (isMathExpression(cleanedInput)) {
        const result = evaluateMathExpression(input);
        return `The answer is: ${result}`;
    }

    if (memory[cleanedInput]) {
        return memory[cleanedInput];
    }

    const closeMatch = findClosestMatch(cleanedInput);
    if (closeMatch) {
        return closeMatch;
    }

  
    const aiResponse = getAIResponse(input);
    return aiResponse;
}

function getAIResponse(input) {
   
    const context = conversationHistory.slice(-3);
    if (input.toLowerCase().includes("how are you")) {
        return "I'm just a bot, but I'm doing great! How about you?";
    }

    if (input.toLowerCase().includes("help")) {
        return "I can assist you with many things. Ask me anything!";
    }

    if (input.toLowerCase().includes("weather")) {
        return "I can't check the weather, but you can use a weather app or website for that!";
    }

    const response = `I'm not sure how to respond to that, but here's something: I see you're interested in ${input}. Can you tell me more?`;

    return response;
}

function handleResetMemory() {
    const enteredPassword = prompt("Please enter the secret password to reset memory:");

    if (enteredPassword === 123)) {
        memory = {};
        localStorage.removeItem("chatbotMemory");

        addMessage("ai", "Memory has been reset.");
    } else {
        addMessage("ai", "Incorrect password. Memory not reset.");
    }
}

function handleTrainingModeToggle() {
    const enteredPassword = prompt("Please enter the secret password to toggle training mode:");

    if (enteredPassword === decodePassword(encodedPassword)) {
        isTrainingMode = document.getElementById("theme-switch").checked;
        if (isTrainingMode) {
            addMessage("ai", "Training mode enabled. You can now teach me.");
        } else {
            addMessage("ai", "Training mode disabled.");
        }
    } else {
        document.getElementById("theme-switch").checked = !isTrainingMode;
        addMessage("ai", "Incorrect password. Training mode not changed.");
    }
}
