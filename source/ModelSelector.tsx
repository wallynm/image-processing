import React from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input'; // Import SelectInput
import { StatusMessage, StatusMessages } from './StatusMessages.js';

// Define the types for AI model selection
export type ModelType = 'openai' | 'deepseek';

// Define the items for the SelectInput
const items = [
	{
		label: 'OpenAI GPT-4o',
		value: 'openai' as ModelType, // Ensure value matches ModelType
	},
	{
		label: 'DeepSeek Vision',
		value: 'deepseek' as ModelType,
	},
];

// Props for the ModelSelector component
type ModelSelectorProps = {
	messages: StatusMessage[]; // To display transient messages like "Finding images..."
	onModelSelect: (model: ModelType) => void;
};

// Component for selecting the AI model using SelectInput
export function ModelSelector({ messages, onModelSelect }: ModelSelectorProps) {
	const handleSelect = (item: { label: string; value: ModelType }) => {
		onModelSelect(item.value);
	};

	return (
		<Box flexDirection="column" marginTop={1}>
			{/* Display messages passed from parent first */}
			<StatusMessages messages={messages} />

			<Text>Select an AI model to use (↑/↓ arrows, Enter to select):</Text>
			
			<Box>
				<SelectInput 
					items={items} 
					onSelect={handleSelect} 
				/>
			</Box>
		</Box>
	);
} 