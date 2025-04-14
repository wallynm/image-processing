import React from 'react';
import { Box, Text } from 'ink';
// Component to render a list of status messages using Static
export function StatusMessages({ messages }) {
    return (React.createElement(Box, { flexDirection: "column" }, messages.map((message) => (React.createElement(Text, { key: message.id, color: message.type === 'error' ? 'red' : message.type === 'success' ? 'green' : 'white' }, message.text)))));
}
