import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
export const openAIProvider = {
    key: 'openai',
    name: 'OpenAI GPT-4o',
    async validateEnvironment() {
        if (!process.env['OPENAI_API_KEY']) {
            throw new Error('OPENAI_API_KEY is not set in .env file');
        }
        // Add any further OpenAI-specific validation if needed
    },
    async generateText(prompt, base64Image, mimeType) {
        const model = openai('gpt-4o');
        const result = await generateText({
            model: model,
            maxTokens: 4096,
            temperature: 0.7,
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt },
                        {
                            type: 'image',
                            image: base64Image,
                            mimeType: mimeType,
                        }
                    ]
                }
            ]
        });
        if (!result || !result.text) {
            throw new Error('No response received from the OpenAI API');
        }
        return result.text;
    },
};
