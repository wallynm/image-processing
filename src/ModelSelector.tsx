import React from 'react';
import { Box, Text } from 'ink';
import SelectInput /*, { type Item }*/ from 'ink-select-input';
import { StatusMessage, StatusMessages } from './StatusMessages.js';
// Import model types from the central models directory
import { ModelType, IModelProvider } from './models/index.js';

// Remove the local ModelType definition
// export type ModelType = 'openai' | 'deepseek';

// Remove hardcoded items array
// const items = [...];

// Props for the ModelSelector component - updated
type ModelSelectorProps = {
	messages: StatusMessage[];
	availableModels: IModelProvider[]; // Accept the list of providers
	onModelSelect: (modelKey: ModelType) => void; // Send back the key
};

// Component for selecting the AI model using SelectInput
export function ModelSelector({ messages, availableModels, onModelSelect }: ModelSelectorProps) {
	// Transform providers into items for SelectInput
	const items = availableModels.map(provider => ({
		label: provider.name, // Use provider's display name
		value: provider.key, // Use provider's key as the value
	}));

	// handleSelect - simplified type annotation
	const handleSelect = (item: { value?: ModelType }) => { 
		// item.value is the ModelType key we need to pass up
		if (item.value) { // Ensure value exists
			onModelSelect(item.value);
		}
	};

	return (
		<Box flexDirection="column" marginTop={1}>
			<StatusMessages messages={messages} />

			<Text>Select an AI model to use (↑/↓ arrows, Enter to select):</Text>
			
			<Box>
				{/* Pass the dynamically generated items */}
				<SelectInput<ModelType> // Specify the type for value
					items={items} 
					onSelect={handleSelect} 
				/>
			</Box>
		</Box>
	);
} 