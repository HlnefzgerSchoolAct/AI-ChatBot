# AI Chatbot with Memory and Teaching Feature

This is a simple AI chatbot built with HTML, CSS, and JavaScript that allows for basic interactions, teaching the AI new responses, and resetting its memory. The chatbot has a modern dark theme with neon blue effects, and it's designed to be interactive and user-friendly.

## Features

- **AI Chatbot**: The bot can respond to user messages.
- **Teach the AI**: You can teach the AI new question-answer pairs via the input fields.
- **Memory Reset**: A button allows you to reset the AI's memory (with a password verification).
- **Advanced Settings**: A section to handle additional settings for the bot.
- **Modern UI**: Dark theme with neon blue effects, smooth animations, and interactive input fields.
- **Responsive Layout**: The interface is responsive to fit on smaller screens (e.g., mobile devices).

## Prerequisites

Before running the application, ensure you have the following:

- A web browser (Chrome, Firefox, Safari, etc.)


## How to Use

1. **Clone or Download the Repository**:
   - If you're using Git, you can clone the repository using:
     ```bash
     git clone <repository-url>
     ```
   - Or download the ZIP file and extract it.

2. **Open the Application**:
   - Open the `index.html` file in your preferred web browser.

3. **Chat with the Bot**:
   - Type your message in the input field and click the "Send" button to interact with the chatbot.

4. **Teach the AI**:
   - You can teach the AI by entering a question in the "Enter a question" input and the answer in the "Enter the answer" input, then click the "Teach" button.
   - The bot will remember these new pairs and respond with the saved answer when asked the question again.

5. **Reset Memory**:
   - Click the **Reset Memory** button to clear the AI's memory.
   - A password is required for resetting the memory. The password is encoded in the JavaScript file for security.

6. **Advanced Settings**:
   - Click the **Advanced Settings** button to configure or access additional settings (this can be expanded in the future).

## Features Explained

### Chatbot Interaction

- **Chat Window**: Messages from both the user and the bot are displayed in the chat window.
- **User Input**: The user can type messages and send them to the bot.
- **Bot Response**: The bot provides a response based on the input.

### Teaching the AI

- **Teach the AI**: When you type a question and an answer and click "Teach," the AI will remember this information and respond with the saved answer when the question is asked again.
- **Memory Management**: You can store multiple question-answer pairs. The bot will match the closest question and provide the associated answer.

### Memory Reset

- **Reset Memory Button**: This button clears all stored data from the AI’s memory. A password is required to reset the memory. This feature is implemented for security and control over the chatbot's memory.

### Advanced Settings

- **Advanced Settings Button**: This button can be expanded in the future to include more sophisticated features such as adjusting response styles or other custom settings.

## CSS Styling

- **Dark Theme**: The chatbot features a modern dark theme with neon blue accents for a futuristic look.
- **Responsive Layout**: The design is responsive, meaning it will adjust to fit smaller screens, such as mobile phones.
- **Animations**: Smooth animations are applied when sending messages and adding new content to the chat.

## Technologies Used

- **HTML**: For the structure of the chatbot and its UI.
- **CSS**: For styling and layout, with a dark theme and animations.
- **JavaScript**: For the chatbot logic, including message handling, teaching the bot, and memory reset functionality.

## Future Enhancements

- Add more advanced settings for the AI, such as configuring its tone or language.
- Enable saving of chat history in a database or local storage.
- Improve security features for password protection and memory reset.

## License

This project is open-source and can be freely used and modified. For more details, refer to the [LICENSE](LICENSE) file.
