import React from 'react';
import { Box, Text } from 'ink';

// Define the shape of the summary data
export type ProcessingSummary = {
	total: number;
	processed: number;
	skipped: number;
	errors: number;
};

// Props for the SummaryView component
type SummaryViewProps = {
	summary: ProcessingSummary;
};

// Component to display the final processing summary
export function SummaryView({ summary }: SummaryViewProps) {
	return (
		<Box flexDirection="column" marginTop={1} borderStyle="round" padding={1} borderColor="green">
			<Text bold color="green">=== Processing Summary ===</Text>
			<Text>Total images found: {summary.total}</Text>
			<Text>New text files created: {summary.processed}</Text>
			<Text>Images skipped (existing text file): {summary.skipped}</Text>
			<Text color={summary.errors > 0 ? "red" : "white"}>Errors encountered: {summary.errors}</Text>
			<Box marginTop={1}>
				<Text>Done.</Text>
			</Box>
		</Box>
	);
} 