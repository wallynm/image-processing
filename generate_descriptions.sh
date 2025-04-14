#!/bin/zsh

# Script to generate text files for images without existing text descriptions
# Each text file will start with a predefined prefix

# Initialize counters
total_images=0
new_files_created=0

# Predefined prefix for text files
prefix="Topdown image with a focused camera for a for a battle grid RPG scenario,"

# Loop through all files in the current directory
for file in *; do
    # Check if the file is a JPG image (case insensitive)
    if [[ $file =~ \.(jpg|JPG)$ ]]; then
        ((total_images++))
        
        # Get base name without extension
        base_name="${file%.*}"
        txt_file="${base_name}.txt"
        
        # Check if corresponding text file already exists
        if [[ ! -f "$txt_file" ]]; then
            # Create new text file with the prefix
            echo "$prefix" > "$txt_file"
            ((new_files_created++))
            echo "Created: $txt_file"
        fi
    fi
done

# Print summary
echo ""
echo "Summary:"
echo "Total images processed: $total_images"
echo "New text files created: $new_files_created"
echo "Done."

