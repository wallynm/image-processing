import React from 'react';
import { Box, Text } from 'ink';

// Define the shape of a status message
export type StatusMessage = {
	id: number;
	text: string;
	type: 'success' | 'error' | 'info';
};

// Props for the StatusMessages component
type StatusMessagesProps = {
	messages: StatusMessage[];
};

// Component to render a list of status messages using Static
export function StatusMessages({ messages }: StatusMessagesProps): JSX.Element {
	return (
		<Box flexDirection="column">
			{messages.map((message) => (
				<Text
					key={message.id}
					color={message.type === 'error' ? 'red' : message.type === 'success' ? 'green' : 'white'}
				>
					{message.text}
				</Text>
			))}
		</Box>
	);
} 