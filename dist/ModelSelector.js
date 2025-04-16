import React from 'react';
import { Box, Text } from 'ink';
import SelectInput /*, { type Item }*/ from 'ink-select-input';
import { StatusMessages } from './StatusMessages.js';
// Component for selecting the AI model using SelectInput
export function ModelSelector({ messages, availableModels, onModelSelect }) {
    // Transform providers into items for SelectInput
    const items = availableModels.map(provider => ({
        label: provider.name, // Use provider's display name
        value: provider.key, // Use provider's key as the value
    }));
    // handleSelect - simplified type annotation
    const handleSelect = (item) => {
        // item.value is the ModelType key we need to pass up
        if (item.value) { // Ensure value exists
            onModelSelect(item.value);
        }
    };
    return (React.createElement(Box, { flexDirection: "column", marginTop: 1 },
        React.createElement(StatusMessages, { messages: messages }),
        React.createElement(Text, null, "Select an AI model to use (\u2191/\u2193 arrows, Enter to select):"),
        React.createElement(Box, null,
            React.createElement(SelectInput, { items: items, onSelect: handleSelect }))));
}
