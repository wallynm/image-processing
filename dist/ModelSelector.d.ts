import React from 'react';
import { StatusMessage } from './StatusMessages.js';
import { ModelType, IModelProvider } from './models/index.js';
type ModelSelectorProps = {
    messages: StatusMessage[];
    availableModels: IModelProvider[];
    onModelSelect: (modelKey: ModelType) => void;
};
export declare function ModelSelector({ messages, availableModels, onModelSelect }: ModelSelectorProps): React.JSX.Element;
export {};
