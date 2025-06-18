import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in environment variables');
    throw new Error('GEMINI_API_KEY is not set in environment variables');
}

console.log('Initializing Gemini API with key:', process.env.GEMINI_API_KEY.substring(0, 5) + '...');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to generate chat suggestions based on relationship
async function generateChatSuggestion(message, relationship) {
    if (!message || !relationship) {
        console.error('Missing required parameters:', { message, relationship });
        throw new Error('Message and relationship are required');
    }

    try {
        console.log('Creating Gemini model instance...');
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Create a prompt based on the relationship
        const prompt = `Generate a natural, contextual response to this message: "${message}"

        Important guidelines:
        - DO NOT include any labels or prefixes like "As a friend:" or "Friend:"
        - DO NOT explain your role or relationship
        - Just provide the response directly
        - Keep it concise and natural
        
        Adjust the tone based on the relationship (${relationship}):
        - Professional: Formal and respectful
        - Friend: Casual and friendly
        - Family: Warm and familiar
        
        Example of what NOT to do:
        ❌ "As a friend, I would say..."
        ❌ "Friend: Hey there!"
        ❌ "Professional response: I would like to..."
        
        Example of what to do:
        ✅ "Hey! That sounds great!"
        ✅ "I understand your concern and would be happy to help."
        ✅ "Thanks for letting me know!"`;

        console.log('Sending request to Gemini API with prompt:', prompt);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log('Received response from Gemini API:', response.text());
        return response.text();
    } catch (error) {
        console.error('Error generating chat suggestion:', {
            message: error.message,
            stack: error.stack,
            error: error
        });
        
        if (error.message.includes('API key')) {
            throw new Error('Invalid or missing Gemini API key');
        }
        if (error.message.includes('model')) {
            throw new Error('Invalid model name or model not available');
        }
        if (error.message.includes('quota')) {
            throw new Error('API quota exceeded');
        }
        throw new Error('Failed to generate chat suggestion: ' + error.message);
    }
}

export { generateChatSuggestion }; 