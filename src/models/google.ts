import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { IModelProvider } from './types.js';

export const googleProvider: IModelProvider = {
	key: 'google',
	name: 'Google Gemini Flash',

	async validateEnvironment(): Promise<void> {
		const apiKey = process.env['GOOGLE_GENERATIVE_AI_API_KEY']; // Or the specific env var for Google
		if (!apiKey) {
			throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set in .env file');
		}
		// Add any further Google-specific validation if needed
		// e.g., check API key format or length if known
	},

	async generateText(prompt: string, base64Image: string, mimeType: string): Promise<string> {
		// Use the correct model identifier for Gemini Flash with vision
		const model = google('models/gemini-1.5-flash-latest');

		const result = await generateText({
			model: model,
			maxTokens: 4096,
			temperature: 0.7,
			// Google's API might expect image data differently, adjust as needed
			// Based on Vercel AI SDK documentation, it often handles multi-modal within the prompt/messages
			messages: [
				{
					role: 'user',
					content: [
						{ type: 'text', text: prompt },
						{
							type: 'image',
							image: Buffer.from(base64Image, 'base64'), // Google SDK might prefer Buffer
							mimeType: mimeType,
						}
					]
				}
			]
		});

		if (!result || !result.text) {
			throw new Error('No response received from the Google API');
		}

		return result.text;
	},
}; 