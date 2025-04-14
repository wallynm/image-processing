import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { ModelType } from './ModelSelector.js'; // Import shared type
import { StatusMessage } from './StatusMessages.js';

// Props for the ProcessingView component
type ProcessingViewProps = {
	modelType: ModelType;
	totalImages: number;
	currentIndex: number;
	messages: StatusMessage[];
	isProcessing: boolean; // To show loading indicator only during actual processing step
	currentFile?: string; // Add current file being processed
};

// Component to display the processing status
export function ProcessingView({ 
    modelType, 
    totalImages, 
    currentIndex, 
    messages, 
    isProcessing,
    currentFile
}: ProcessingViewProps) {
	const modelName = modelType === 'openai' ? 'OpenAI GPT-4o' : 'DeepSeek Vision';
	
	// Filter messages to count different types
	const successCount = messages.filter(msg => msg.type === 'success').length;
	const errorCount = messages.filter(msg => msg.type === 'error').length;
	const skippedCount = currentIndex - (successCount + errorCount);

	return (
		<Box flexDirection="column" marginTop={1}>
			<Text>Using model: {modelName}</Text>
			<Text>Found {totalImages} images</Text>
			
			{/* Progress information */}
			<Box marginTop={1} flexDirection="column">
				<Text>Progress: {currentIndex} of {totalImages}</Text>
				<Text>• Processed: <Text color="green">{successCount}</Text></Text>
				{errorCount > 0 && <Text>• Errors: <Text color="red">{errorCount}</Text></Text>}
				{skippedCount > 0 && <Text>• Skipped: <Text color="yellow">{skippedCount}</Text></Text>}
			</Box>

			{/* Current file being processed */}
			{isProcessing && currentFile && (
				<Box marginTop={1}>
					<Text>
						<Text color="green"><Spinner type="dots" /></Text>
						<Text> Processing: {currentFile}</Text>
					</Text>
				</Box>
			)}

			{/* Show only error messages */}
			<Box flexDirection="column" marginTop={1}>
				{messages
					.filter(msg => msg.type === 'error')
					.map((msg) => (
						<Text key={msg.id} color="red">{msg.text}</Text>
					))
				}
			</Box>
		</Box>
	);
} 