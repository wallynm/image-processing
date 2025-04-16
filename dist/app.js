import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text } from 'ink';
import fs from 'fs-extra';
import path from 'node:path';
import dotenv from 'dotenv';
import { availableModels, getModelProvider } from './models/index.js';
import { ProcessingView } from './ProcessingView.js';
import { SummaryView } from './SummaryView.js';
import { StatusMessages } from './StatusMessages.js';
import { useStatusMessages } from './hooks/useStatusMessages.js';
import { ModelSelector } from './ModelSelector.js';
dotenv.config();
const PROMPT = `
Please analyze this image and provide a detailed description.
Focus on describing the layout, objects, terrain features,
camera position, and any notable elements visible in the image.
Be specific about positions, colors, and arrangements of objects.
This description will be used for training other AI models in image
recognition tasks focused into generating new images in the same
camera position focused into topdown view for grid and battlemap
scenarios. Generate all descriptions in english, following a format
without bullet points, but a plain-text description with all info gathered
about the image in nice description.
- Always start the description with 'Topdown image with a focused camera for a for a battle grid RPG scenario, {generated_description}'
`;
export default function App() {
    const { statusMessages, errorMessage, step, addMessage, addSuccessMessage, addErrorMessage, setErrorState, clearStatusMessages, setStep } = useStatusMessages();
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [imagesToProcess, setImagesToProcess] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [summary, setSummary] = useState({ total: 0, processed: 0, skipped: 0, errors: 0 });
    useEffect(() => {
        if (!step || step === 'initial') {
            setStep('selectModel');
        }
    }, [step, setStep]);
    const handleModelSelected = useCallback(async (selectedModelKey) => {
        const provider = getModelProvider(selectedModelKey);
        if (!provider) {
            setErrorState(`Invalid model selected: ${selectedModelKey}`);
            return;
        }
        setSelectedProvider(provider);
        setStep('validating');
        clearStatusMessages();
        addMessage(`Validating environment for ${provider.name}...`);
        try {
            await provider.validateEnvironment();
            setStep('findingImages');
            const imageDir = path.join(process.cwd(), 'images');
            addMessage(`Searching for JPG/JPEG images in ${imageDir}...`);
            if (!await fs.pathExists(imageDir)) {
                throw new Error(`Image directory not found: ${imageDir}`);
            }
            const files = await fs.readdir(imageDir);
            const imageFiles = files.filter((file) => /\.(jpg|jpeg)$/i.test(file)).map((file) => path.join('images', file));
            if (imageFiles.length === 0) {
                throw new Error(`No JPG/JPEG images found in ${imageDir}.`);
            }
            setImagesToProcess(imageFiles);
            setSummary({ total: imageFiles.length, processed: 0, skipped: 0, errors: 0 });
            setCurrentImageIndex(0);
            addMessage(`Found ${imageFiles.length} images.`);
            // Proceed to processing
            addMessage(`Starting processing with ${provider.name}...`);
            setStep('processing');
        }
        catch (error) {
            setErrorState(error.message);
        }
        // Dependencies updated: remove setErrorState, clearStatusMessages and add provider dependency indirectly via setSelectedProvider
    }, [addMessage, clearStatusMessages, setErrorState, setStep]);
    // --- Process Images ---
    useEffect(() => {
        // Check if selectedProvider is available
        if (step !== 'processing' || !selectedProvider || currentImageIndex >= imagesToProcess.length) {
            if (step === 'processing' && currentImageIndex >= imagesToProcess.length) {
                addMessage('Processing complete.');
                setStep('summary');
            }
            return;
        }
        let isActive = true;
        const processCurrentImage = async () => {
            const imageFile = imagesToProcess[currentImageIndex];
            if (!imageFile)
                return;
            const baseName = path.basename(imageFile, path.extname(imageFile));
            const txtPath = path.join(process.cwd(), 'images', `${baseName}.txt`);
            const imageExt = path.extname(imageFile).toLowerCase(); // e.g., '.jpg'
            const mimeType = imageExt === '.jpeg' || imageExt === '.jpg' ? 'image/jpeg' : `image/${imageExt.substring(1)}`; // Determine MIME type
            let processed = false;
            let skipped = false;
            let errorOccurred = false;
            try {
                if (await fs.pathExists(txtPath)) {
                    skipped = true;
                }
                else {
                    const fullImagePath = path.join(process.cwd(), imageFile);
                    const imageBuffer = await fs.readFile(fullImagePath);
                    if (imageBuffer.length === 0) {
                        throw new Error(`Empty image file: ${imageFile}`);
                    }
                    const base64Image = imageBuffer.toString('base64');
                    // Use the selected provider's generateText method
                    const description = await selectedProvider.generateText(PROMPT, base64Image, mimeType);
                    // Removed model-specific generateText calls and argument preparation
                    await fs.writeFile(txtPath, description);
                    processed = true;
                }
            }
            catch (error) {
                errorOccurred = true;
                if (isActive) {
                    // Simplified error logging, provider-specific details can be logged within the provider itself if needed
                    let errorMessage = `Error processing ${path.basename(imageFile)} with ${selectedProvider.name}: ${error.message}`;
                    // You might want to retain more detailed logging based on error types from the provider if needed
                    addErrorMessage(errorMessage);
                    console.error(`Full error details for ${selectedProvider.name} on image:`, path.basename(imageFile), {
                        message: error.message,
                        stack: error.stack,
                        // Add any generic error details if available (e.g., from AxiosError)
                        ...(error.response && { status: error.response.status, data: error.response.data }),
                    });
                }
            }
            if (isActive) {
                if (processed) {
                    addSuccessMessage(`Processed ${path.basename(imageFile)}`);
                }
                else if (skipped) {
                    setSummary((prev) => ({
                        ...prev,
                        skipped: prev.skipped + 1
                    }));
                }
                setSummary((prev) => ({
                    ...prev,
                    processed: prev.processed + (processed ? 1 : 0),
                    errors: prev.errors + (errorOccurred ? 1 : 0),
                }));
                setCurrentImageIndex(prevIndex => prevIndex + 1);
            }
        };
        processCurrentImage();
        return () => {
            isActive = false;
        };
        // Dependencies updated: use selectedProvider instead of modelType
    }, [step, selectedProvider, currentImageIndex, imagesToProcess, addMessage, addSuccessMessage, addErrorMessage, setStep]);
    // --- Effect to handle exit on error (remains the same) ---
    useEffect(() => {
        if (step === 'error') {
            console.error('Error occurred:', errorMessage);
            // Remove the automatic exit
            // const timer = setTimeout(() => exit(), 2000);
            // return () => clearTimeout(timer);
        }
        return undefined;
    }, [step, errorMessage]);
    // --- Render Logic ---
    return (React.createElement(Box, { flexDirection: "column", padding: 1 },
        React.createElement(Text, { bold: true, color: "cyan" }, "=== Image Processing with AI ==="),
        (step === 'validating' || step === 'findingImages') && React.createElement(StatusMessages, { messages: statusMessages }),
        step === 'error' && errorMessage && (React.createElement(Box, { flexDirection: "column", marginTop: 1 },
            React.createElement(Text, { color: "red" },
                "Error: ",
                errorMessage),
            React.createElement(Text, null, "Exiting..."))),
        step === 'selectModel' && (React.createElement(ModelSelector, { messages: statusMessages, availableModels: availableModels, onModelSelect: handleModelSelected })),
        step === 'processing' && selectedProvider && (React.createElement(ProcessingView
        // Pass provider name instead of modelType key
        , { 
            // Pass provider name instead of modelType key
            modelName: selectedProvider.name, totalImages: summary.total, currentIndex: currentImageIndex, messages: statusMessages, isProcessing: true, currentFile: imagesToProcess[currentImageIndex] })),
        step === 'summary' && (React.createElement(React.Fragment, null,
            React.createElement(StatusMessages, { messages: statusMessages }),
            React.createElement(SummaryView, { summary: summary })))));
}
