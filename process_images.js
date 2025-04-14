#!/usr/bin/env node
/**
 * Enhanced Image Processing Script with Model Selection
 * 
 * This script provides a simple CLI to select between different AI models
 * (OpenAI GPT-4o or DeepSeek) for processing images. It reads all JPG images
 * in the current directory that don't have corresponding text files, sends them
 * to the selected AI model for analysis, and saves the descriptions to text files.
 * 
 * Installation instructions:
 * 1. npm install ai @ai-sdk/openai @ai-sdk/deepseek fs-extra path dotenv readline
 * 2. Create a .env file with:
 *    OPENAI_API_KEY=your_openai_api_key
 *    DEEPSEEK_API_KEY=your_deepseek_api_key
 * 3. node process_images.js
 */

// Load environment variables from .env file
require('dotenv').config();

const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');
const { generateText } = require('ai');
const { openai } = require('@ai-sdk/openai');
const { deepseek } = require('@ai-sdk/deepseek');

// The prompt for AI image analysis (used for both models)
const PROMPT = "Describe this topdown image with a focused camera for a battle grid RPG scenario. Identify key features, terrain elements, structures, and objects that would be relevant for tabletop RPG gameplay.";

// Application state
let totalImages = 0;
let processedImages = 0;
let errorCount = 0;
let skippedImages = 0;

/**
 * Display a simple CLI menu and get user selection
 * @returns {Promise<string>} The selected model type: 'openai' or 'deepseek'
 */
function promptForModelSelection() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('\x1b[32m%s\x1b[0m', '=== Image Processing with AI ===');
    console.log('Select an AI model to use:');
    console.log('1. OpenAI GPT-4o');
    console.log('2. DeepSeek Vision');
    
    rl.question('Enter your choice (1 or 2): ', (answer) => {
      rl.close();
      
      if (answer === '1') {
        resolve('openai');
      } else if (answer === '2') {
        resolve('deepseek');
      } else {
        console.log('\x1b[31m%s\x1b[0m', 'Invalid choice. Defaulting to OpenAI GPT-4o.');
        resolve('openai');
      }
    });
  });
}

/**
 * Validate environment variables for the selected model
 * @param {string} modelType - Type of model to use ('openai' or 'deepseek')
 * @throws {Error} If required environment variables are not set
 */
function validateEnvironment(modelType) {
  if (modelType === 'openai' && !process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  } else if (modelType === 'deepseek' && !process.env.DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY is not set in environment variables');
  }
}

/**
 * Get the appropriate AI model based on the selected type
 * @param {string} modelType - Type of model to use ('openai' or 'deepseek')
 * @returns {Object} The AI model instance
 */
function getModel(modelType) {
  if (modelType === 'openai') {
    return openai('gpt-4o');
  } else if (modelType === 'deepseek') {
    return deepseek('deepseek-chat');
  }
  throw new Error(`Unknown model type: ${modelType}`);
}

/**
 * Process a single image with the specified model
 * @param {string} imagePath - Path to the image file
 * @param {string} modelType - Type of model to use ('openai' or 'deepseek')
 * @returns {Promise<boolean>} - Whether processing was successful
 */
async function processImage(imagePath, modelType) {
  const baseName = path.basename(imagePath, path.extname(imagePath));
  const txtPath = path.join(path.dirname(imagePath), `${baseName}.txt`);
  
  // Check if text file already exists
  if (await fs.pathExists(txtPath)) {
    console.log(`Skipping ${imagePath} - Text file already exists`);
    skippedImages++;
    return false;
  }
  
  console.log(`Processing ${imagePath} with ${modelType}...`);
  
  try {
    // Read the image file as base64
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    // Get the appropriate model
    const model = getModel(modelType);
    
    // Use AI SDK's generateText function with the model
    const result = await generateText({
      model: model,
      prompt: PROMPT,
      images: [{
        data: base64Image,
        mimeType: 'image/jpeg'
      }]
    });
    
    // Extract the description
    const description = result.text;
    
    // Save the description to a text file
    await fs.writeFile(txtPath, description);
    
    console.log(`✓ Created ${txtPath}`);
    return true;
  } catch (error) {
    console.error(`✗ Error processing ${imagePath}: ${error.message}`);
    errorCount++;
    return false;
  }
}

/**
 * Process all images in the current directory using the selected model
 * @param {string} modelType - Type of model to use ('openai' or 'deepseek')
 * @returns {Promise<void>}
 */
async function processAllImages(modelType) {
  console.log(`\nStarting image processing with ${modelType}...`);
  
  try {
    // Read all files in the current directory
    const files = await fs.readdir('.');
    
    // Filter for JPG files (case insensitive)
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg)$/i.test(file)
    );
    
    totalImages = imageFiles.length;
    console.log(`Found ${totalImages} image files.`);
    
    // Reset counters
    processedImages = 0;
    errorCount = 0;
    skippedImages = 0;
    
    // Process each image sequentially to avoid rate limits
    for (const imageFile of imageFiles) {
      const processed = await processImage(imageFile, modelType);
      if (processed) processedImages++;
    }
    
    // Print summary
    printSummary();
  } catch (error) {
    console.error(`\nError during processing: ${error.message}`);
    printSummary();
  }
}

/**
 * Print a summary of the processing results
 */
function printSummary() {
  console.log('\n\x1b[32m%s\x1b[0m', '=== Processing Summary ===');
  console.log(`Total images found: ${totalImages}`);
  console.log(`New text files created: ${processedImages}`);
  console.log(`Images with existing text files: ${skippedImages}`);
  console.log(`Errors encountered: ${errorCount}`);
  console.log('\nDone.');
}

/**
 * Main function to run the application
 */
async function main() {
  try {
    // Get user selection
    const modelType = await promptForModelSelection();
    console.log(`\nSelected model: ${modelType === 'openai' ? 'OpenAI GPT-4o' : 'DeepSeek Vision'}`);
    
    // Validate environment variables
    validateEnvironment(modelType);
    
    // Process all images
    await processAllImages(modelType);
  } catch (error) {
    console.error(`\n\x1b[31m%s\x1b[0m`, `Fatal error: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function
main();
