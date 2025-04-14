# Image Processing with Vercel AI SDK

This project contains scripts to process RPG battle grid images using OpenAI's vision capabilities through the Vercel AI SDK.

## Requirements

- Node.js (v16 or higher)
- npm
- OpenAI API key

## Installation

1. Install the required dependencies:

```bash
npm install ai openai fs-extra path
```

2. Set your OpenAI API key as an environment variable:

```bash
export OPENAI_API_KEY=your_openai_api_key
```

## Usage

### Process Images with OpenAI

To process images using the OpenAI vision model:

```bash
node process_images.js
```

This script will:
- Find all JPG images in the current directory
- Skip images that already have corresponding text files
- Send images without text files to OpenAI for analysis
- Save the AI-generated descriptions to text files

## Note

OpenAI API usage incurs costs. Make sure you have a valid API key and understand OpenAI's pricing structure.

