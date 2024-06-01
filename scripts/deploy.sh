#!/bin/bash

# Set up the environment
export TERM=xterm-256color

# Deploy application
echo "Starting deployment..."
# Here, include your actual deployment commands

# Check if the terminal supports color
if tput setaf 2 &>/dev/null; then
    echo "$(tput setaf 2)Deployment completed successfully.$(tput sgr0)"
else
    echo "Deployment completed successfully."
fi