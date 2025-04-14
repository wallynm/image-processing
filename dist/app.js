import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text, useApp } from 'ink';
// @ts-ignore - Assuming @types/fs-extra is not installed
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
// Updated imports for Vercel AI SDK v3+
import { generateText } from 'ai';
// import { createOpenAI } from '@ai-sdk/openai';
// import { createDeepSeek } from '@ai-sdk/deepseek';
import { openai } from '@ai-sdk/openai';
import { deepseek } from '@ai-sdk/deepseek';
// Import sub-components (will be created in the next step)
import { ModelSelector } from './ModelSelector.js';
import { ProcessingView } from './ProcessingView.js';
import { SummaryView } from './SummaryView.js';
import { StatusMessages } from './StatusMessages.js';
dotenv.config();
// AI Prompt
const PROMPT = "Please analyze this image and provide a detailed description. Focus on describing the layout, objects, terrain features, camera position, and any notable elements visible in the image. Be specific about positions, colors, and arrangements of objects. This description will be used for training other AI models in image recognition tasks focused into generating new images in the same camera position focused into topdown view for grid and battlemap scenarios.";
// Main App Component
export default function App() {
    const { exit } = useApp();
    const [step, setStep] = useState('selectModel');
    const [modelType, setModelType] = useState(null);
    const [imagesToProcess, setImagesToProcess] = useState([]);
    const [statusMessages, setStatusMessages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [summary, setSummary] = useState({ total: 0, processed: 0, skipped: 0, errors: 0 });
    const [errorMessage, setErrorMessage] = useState(null);
    // --- Helper: Add Status Message ---
    const addMessage = (text) => {
        setStatusMessages((prev) => [...prev, {
                text,
                type: 'info', // default type
                id: Date.now() + Math.random()
            }]);
    };
    const addSuccessMessage = (text) => {
        setStatusMessages((prev) => [...prev, {
                text,
                type: 'success',
                id: Date.now() + Math.random()
            }]);
    };
    const addErrorMessage = (text) => {
        setStatusMessages((prev) => [...prev, {
                text,
                type: 'error',
                id: Date.now() + Math.random()
            }]);
    };
    // --- Helper: Set Error Step ---
    const setErrorState = useCallback((message) => {
        setErrorMessage(message);
        setStep('error');
    }, []);
    // --- Step 1 (was 2): Handle Model Selection & Find Images ---
    const handleModelSelected = useCallback(async (selectedModel) => {
        setModelType(selectedModel);
        setStep('validating');
        setStatusMessages([]); // Clear messages from selection screen
        addMessage(`Validating environment for ${selectedModel}...`);
        try {
            // Environment validation
            console.log('Environment Variables:', {
                OPENAI_API_KEY: process.env['OPENAI_API_KEY'] ? 'PRESENT' : 'MISSING',
                DEEPSEEK_API_KEY: process.env['DEEPSEEK_API_KEY'] ? 'PRESENT' : 'MISSING'
            });
            if (selectedModel === 'openai' && !process.env['OPENAI_API_KEY']) {
                throw new Error('OPENAI_API_KEY is not set in .env file');
            }
            else if (selectedModel === 'deepseek' && !process.env['DEEPSEEK_API_KEY']) {
                throw new Error('DEEPSEEK_API_KEY is not set in .env file');
            }
            // Validate API key for DeepSeek
            if (selectedModel === 'deepseek') {
                const deepseekApiKey = process.env['DEEPSEEK_API_KEY']?.trim();
                if (!deepseekApiKey || deepseekApiKey.length < 10) {
                    throw new Error('Invalid or incomplete DeepSeek API key');
                }
            }
            addMessage('Environment OK.');
            // --- Find Images (Moved here) ---
            setStep('findingImages');
            const imageDir = path.join(process.cwd(), 'images');
            addMessage(`Searching for JPG/JPEG images in ${imageDir}...`);
            if (!await fs.pathExists(imageDir)) {
                throw new Error(`Image directory not found: ${imageDir}`);
            }
            const files = await fs.readdir(imageDir); // Read from images subdirectory
            const imageFiles = files.filter((file) => /\.(jpg|jpeg)$/i.test(file)).map((file) => path.join('images', file)); // Keep the relative 'images/' path
            if (imageFiles.length === 0) {
                throw new Error(`No JPG/JPEG images found in ${imageDir}.`);
            }
            setImagesToProcess(imageFiles);
            setSummary({ total: imageFiles.length, processed: 0, skipped: 0, errors: 0 }); // Reset summary with new total
            setCurrentImageIndex(0); // Reset index
            addMessage(`Found ${imageFiles.length} images.`);
            // Proceed to processing
            addMessage(`Starting processing with ${selectedModel === 'openai' ? 'OpenAI GPT-4o' : 'DeepSeek Vision'}...`);
            setStep('processing');
        }
        catch (error) {
            setErrorState(error.message);
        }
    }, [addMessage, setErrorState]); // Dependencies
    // --- Step 2 (was 3): Process Images --- 
    useEffect(() => {
        if (step !== 'processing' || !modelType || currentImageIndex >= imagesToProcess.length) {
            if (step === 'processing' && currentImageIndex >= imagesToProcess.length) {
                addMessage('Processing complete.');
                setStep('summary'); // Move to summary when all images are processed
            }
            return; // Only run when in processing step and images remain
        }
        let isActive = true; // Prevent state updates on unmounted component
        const processCurrentImage = async () => {
            const imageFile = imagesToProcess[currentImageIndex];
            if (!imageFile)
                return; // Should not happen
            const baseName = path.basename(imageFile, path.extname(imageFile));
            const txtPath = path.join(process.cwd(), 'images', `${baseName}.txt`);
            let processed = false;
            let skipped = false;
            let errorOccurred = false;
            try {
                // Check if file exists before processing
                if (await fs.pathExists(txtPath)) {
                    skipped = true;
                }
                else {
                    const fullImagePath = path.join(process.cwd(), imageFile);
                    const imageBuffer = await fs.readFile(fullImagePath);
                    const base64Image = imageBuffer.toString('base64');
                    // Get the correct AI model instance
                    const model = modelType === 'openai'
                        ? openai('gpt-4o')
                        : deepseek('deepseek-chat');
                    // Validate image before processing
                    if (imageBuffer.length === 0) {
                        throw new Error(`Empty image file: ${imageFile}`);
                    }
                    // Call generateText with messages array and base64 image
                    const result = await generateText({
                        model: model,
                        messages: [
                            {
                                role: 'user',
                                content: PROMPT
                            }
                        ],
                        ...(modelType === 'openai'
                            ? {
                                images: [{
                                        data: base64Image,
                                        mimeType: 'image/jpeg'
                                    }]
                            }
                            : {
                                images: [base64Image]
                            }),
                        maxTokens: 4096, // Explicitly set max tokens
                        temperature: 0.7 // Add some creativity while maintaining accuracy
                    });
                    if (!result || !result.text) {
                        throw new Error('No response received from the API');
                    }
                    const description = result.text;
                    await fs.writeFile(txtPath, description);
                    processed = true;
                }
            }
            catch (error) {
                errorOccurred = true;
                if (isActive) {
                    // Enhanced error logging
                    const apiError = error.response?.data?.error;
                    const statusCode = error.response?.status;
                    const errorDetail = error.response?.data?.detail;
                    let errorMessage = `Error processing ${path.basename(imageFile)}:`;
                    if (statusCode)
                        errorMessage += ` [${statusCode}]`;
                    if (apiError)
                        errorMessage += ` ${apiError}`;
                    if (errorDetail)
                        errorMessage += ` - ${errorDetail}`;
                    if (!apiError && !errorDetail)
                        errorMessage += ` ${error.message}`;
                    addErrorMessage(errorMessage);
                    console.error('Full error details for image:', path.basename(imageFile), {
                        message: error.message,
                        status: error.response?.status,
                        statusText: error.response?.statusText,
                        data: error.response?.data,
                        stack: error.stack,
                        apiKey: process.env['DEEPSEEK_API_KEY'] ? 'PRESENT' : 'MISSING',
                        modelType: modelType
                    });
                    // Additional diagnostic logging
                    if (modelType === 'deepseek') {
                        console.error('DeepSeek Specific Diagnostics:', {
                            apiKeyLength: process.env['DEEPSEEK_API_KEY']?.length || 0,
                            apiKeyFirstChars: process.env['DEEPSEEK_API_KEY']?.slice(0, 5) || 'N/A',
                            errorType: error.constructor.name,
                            errorProperties: Object.keys(error)
                        });
                    }
                }
            }
            // Only update states if component is still mounted
            if (isActive) {
                if (processed) {
                    addSuccessMessage(`Processed ${path.basename(imageFile)}`);
                }
                else if (skipped) {
                    // Don't show individual skipped files
                    setSummary((prev) => ({
                        ...prev,
                        skipped: prev.skipped + 1
                    }));
                }
                // Update summary state based on outcome
                setSummary((prev) => ({
                    ...prev,
                    processed: prev.processed + (processed ? 1 : 0),
                    errors: prev.errors + (errorOccurred ? 1 : 0),
                }));
                // Move to the next image
                setCurrentImageIndex(prevIndex => prevIndex + 1);
            }
        };
        processCurrentImage();
        // Cleanup function to prevent state updates if the component unmounts during processing
        return () => {
            isActive = false;
        };
    }, [step, modelType, currentImageIndex, imagesToProcess, addMessage, addSuccessMessage, addErrorMessage]); // Dependencies
    // --- Effect to handle exit on error ---
    useEffect(() => {
        if (step === 'error') {
            const timer = setTimeout(() => exit(), 2000);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [step, exit]);
    // --- Render Logic ---
    return (React.createElement(Box, { flexDirection: "column", padding: 1 },
        React.createElement(Text, { bold: true, color: "cyan" }, "=== Image Processing with AI ==="),
        (step === 'validating' || step === 'findingImages') && React.createElement(StatusMessages, { messages: statusMessages }),
        step === 'error' && errorMessage && (React.createElement(Box, { flexDirection: "column", marginTop: 1 },
            React.createElement(Text, { color: "red" },
                "Error: ",
                errorMessage),
            React.createElement(Text, null, "Exiting..."))),
        step === 'selectModel' && (React.createElement(ModelSelector, { messages: statusMessages, onModelSelect: handleModelSelected })),
        step === 'processing' && modelType && (React.createElement(ProcessingView, { modelType: modelType, totalImages: summary.total, currentIndex: currentImageIndex, messages: statusMessages, isProcessing: true, currentFile: imagesToProcess[currentImageIndex] })),
        step === 'summary' && (React.createElement(React.Fragment, null,
            React.createElement(StatusMessages, { messages: statusMessages }),
            React.createElement(SummaryView, { summary: summary })))));
}
