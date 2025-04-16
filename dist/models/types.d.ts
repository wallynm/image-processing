export type ModelType = 'openai' | 'deepseek' | 'google';
export interface IModelProvider {
    key: ModelType;
    name: string;
    validateEnvironment: () => Promise<void>;
    generateText: (prompt: string, base64Image: string, mimeType: string) => Promise<string>;
}
