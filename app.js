document.getElementById("send-btn").addEventListener("click", handleSend);
document.getElementById("teach-btn").addEventListener("click", handleTeach);
document.getElementById("reset-memory-btn").addEventListener("click", handleResetMemory);
document.getElementById("user-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        handleSend();
    }
});


let memory = JSON.parse(localStorage.getItem("chatbotMemory")) || {};
const grammarRules = [
];

const encodedPassword = "cmVzZXQxMjM="; 


function decodePassword(encoded) {
    return atob(encoded); 
}

function cleanInput(input) {
    return input.replace(/[.,?!]/g, "").toLowerCase();
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

    setTimeout(() => {
        const response = generateResponse(userInput);
        addMessage("ai", response);
    }, 500);
}

function handleTeach() {
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

    return `I'm not sure how to respond to that. You can teach me a response using the training feilds.`;
}

function handleResetMemory() {
    const enteredPassword = prompt("Please enter the secret password to reset memory:");

    if (enteredPassword === decodePassword(encodedPassword)) {
        memory = {};
        localStorage.removeItem("chatbotMemory");

        addMessage("ai", "Memory has been reset.");
    } else {
        addMessage("ai", "Incorrect password. Memory not reset.");
    }
}
