#!/bin/bash
# Explicitly setting TERM to a commonly supported value for color output.
export TERM=xterm-256color

# Debugging: Output the current setting of TERM to ensure it's set correctly.
echo "TERM is set to: $TERM"

# Check if 'tput' can set text attributes and use it if possible.
if tput setaf 1 &>/dev/null; then
    # If 'tput' is successful, use it to set text color to red.
    echo "$(tput setaf 1)This is red text$(tput sgr0)"
else
    # Fallback message if 'tput' is not supported.
    echo "tput not supported"
fi
