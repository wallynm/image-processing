import { openAIProvider } from './openai.js';
import { deepSeekProvider } from './deepseek.js';
import { googleProvider } from './google.js';
// Register available models here, ensuring all ModelType keys are present
const registeredProviders = {
    openai: openAIProvider, // Use literal key
    deepseek: deepSeekProvider, // Use literal key
    google: googleProvider, // Use literal key
    // Add new providers here using their literal key
};
export const availableModels = Object.values(registeredProviders);
export function getModelProvider(key) {
    return registeredProviders[key]; // Direct access is now safe
}
