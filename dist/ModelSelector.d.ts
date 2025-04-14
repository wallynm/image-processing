import React from 'react';
import { StatusMessage } from './StatusMessages.js';
export type ModelType = 'openai' | 'deepseek';
type ModelSelectorProps = {
    messages: StatusMessage[];
    onModelSelect: (model: ModelType) => void;
};
export declare function ModelSelector({ messages, onModelSelect }: ModelSelectorProps): React.JSX.Element;
export {};
