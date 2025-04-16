// Remove unused import
// import { CoreTool } from 'ai';

// Define a common identifier type for models
export type ModelType = 'openai' | 'deepseek' | 'google'; // Extend this union for new models

// Interface for a model provider
export interface IModelProvider {
	key: ModelType; // Unique identifier (e.g., 'openai')
	name: string; // Display name (e.g., 'OpenAI GPT-4o')
	validateEnvironment: () => Promise<void>; // Function to check API keys, etc.
	generateText: (prompt: string, base64Image: string, mimeType: string) => Promise<string>; // Function to call the model
} 