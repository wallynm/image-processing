import React from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input'; // Import SelectInput
import { StatusMessages } from './StatusMessages.js';
// Define the items for the SelectInput
const items = [
    {
        label: 'OpenAI GPT-4o',
        value: 'openai', // Ensure value matches ModelType
    },
    {
        label: 'DeepSeek Vision',
        value: 'deepseek',
    },
];
// Component for selecting the AI model using SelectInput
export function ModelSelector({ messages, onModelSelect }) {
    const handleSelect = (item) => {
        onModelSelect(item.value);
    };
    return (React.createElement(Box, { flexDirection: "column", marginTop: 1 },
        React.createElement(StatusMessages, { messages: messages }),
        React.createElement(Text, null, "Select an AI model to use (\u2191/\u2193 arrows, Enter to select):"),
        React.createElement(Box, null,
            React.createElement(SelectInput, { items: items, onSelect: handleSelect }))));
}
