import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
// Component to display the processing status
export function ProcessingView({ modelType, totalImages, currentIndex, messages, isProcessing, currentFile }) {
    const modelName = modelType === 'openai' ? 'OpenAI GPT-4o' : 'DeepSeek Vision';
    // Filter messages to count different types
    const successCount = messages.filter(msg => msg.type === 'success').length;
    const errorCount = messages.filter(msg => msg.type === 'error').length;
    const skippedCount = currentIndex - (successCount + errorCount);
    return (React.createElement(Box, { flexDirection: "column", marginTop: 1 },
        React.createElement(Text, null,
            "Using model: ",
            modelName),
        React.createElement(Text, null,
            "Found ",
            totalImages,
            " images"),
        React.createElement(Box, { marginTop: 1, flexDirection: "column" },
            React.createElement(Text, null,
                "Progress: ",
                currentIndex,
                " of ",
                totalImages),
            React.createElement(Text, null,
                "\u2022 Processed: ",
                React.createElement(Text, { color: "green" }, successCount)),
            errorCount > 0 && React.createElement(Text, null,
                "\u2022 Errors: ",
                React.createElement(Text, { color: "red" }, errorCount)),
            skippedCount > 0 && React.createElement(Text, null,
                "\u2022 Skipped: ",
                React.createElement(Text, { color: "yellow" }, skippedCount))),
        isProcessing && currentFile && (React.createElement(Box, { marginTop: 1 },
            React.createElement(Text, null,
                React.createElement(Text, { color: "green" },
                    React.createElement(Spinner, { type: "dots" })),
                React.createElement(Text, null,
                    " Processing: ",
                    currentFile)))),
        React.createElement(Box, { flexDirection: "column", marginTop: 1 }, messages
            .filter(msg => msg.type === 'error')
            .map((msg) => (React.createElement(Text, { key: msg.id, color: "red" }, msg.text))))));
}
