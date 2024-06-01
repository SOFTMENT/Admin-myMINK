#!/bin/bash

# Check if the TERM variable is set and the terminal supports color
if [ -n "$TERM" ] && tput setaf 1 &>/dev/null; then
    RED=$(tput setaf 1)
    GREEN=$(tput setaf 2)
    RESET=$(tput sgr0)
else
    RED=""
    GREEN=""
    RESET=""
fi

echo "${RED}This is red text${RESET}"
echo "${GREEN}This is green text${RESET}"
echo "This is normal text"