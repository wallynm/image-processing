import { IModelProvider, ModelType } from './types.js';
export declare const availableModels: IModelProvider[];
export declare function getModelProvider(key: ModelType): IModelProvider | undefined;
export { ModelType, IModelProvider };
