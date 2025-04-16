import { IModelProvider, ModelType } from './types.js';
import { openAIProvider } from './openai.js';
import { deepSeekProvider } from './deepseek.js';
import { googleProvider } from './google.js';

// Register available models here, ensuring all ModelType keys are present
const registeredProviders: Record<ModelType, IModelProvider> = {
	openai: openAIProvider, // Use literal key
	deepseek: deepSeekProvider, // Use literal key
	google: googleProvider, // Use literal key
	// Add new providers here using their literal key
};

export const availableModels: IModelProvider[] = Object.values(registeredProviders);

export function getModelProvider(key: ModelType): IModelProvider | undefined {
	return registeredProviders[key]; // Direct access is now safe
}

export { ModelType, IModelProvider }; 