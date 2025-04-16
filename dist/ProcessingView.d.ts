import React from 'react';
import { StatusMessage } from './StatusMessages.js';
type ProcessingViewProps = {
    modelName: string;
    totalImages: number;
    currentIndex: number;
    messages: StatusMessage[];
    isProcessing: boolean;
    currentFile?: string;
};
export declare function ProcessingView({ modelName, totalImages, currentIndex, messages, isProcessing, currentFile }: ProcessingViewProps): React.JSX.Element;
export {};
