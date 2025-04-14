import React from 'react';
import { Box, Text } from 'ink';
// Component to display the final processing summary
export function SummaryView({ summary }) {
    return (React.createElement(Box, { flexDirection: "column", marginTop: 1, borderStyle: "round", padding: 1, borderColor: "green" },
        React.createElement(Text, { bold: true, color: "green" }, "=== Processing Summary ==="),
        React.createElement(Text, null,
            "Total images found: ",
            summary.total),
        React.createElement(Text, null,
            "New text files created: ",
            summary.processed),
        React.createElement(Text, null,
            "Images skipped (existing text file): ",
            summary.skipped),
        React.createElement(Text, { color: summary.errors > 0 ? "red" : "white" },
            "Errors encountered: ",
            summary.errors),
        React.createElement(Box, { marginTop: 1 },
            React.createElement(Text, null, "Done."))));
}
