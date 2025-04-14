import React from 'react';
import { ModelType } from './ModelSelector.js';
import { StatusMessage } from './StatusMessages.js';
type ProcessingViewProps = {
    modelType: ModelType;
    totalImages: number;
    currentIndex: number;
    messages: StatusMessage[];
    isProcessing: boolean;
    currentFile?: string;
};
export declare function ProcessingView({ modelType, totalImages, currentIndex, messages, isProcessing, currentFile }: ProcessingViewProps): React.JSX.Element;
export {};
