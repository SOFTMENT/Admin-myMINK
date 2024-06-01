#!/bin/bash

# Check if the TERM variable is set and the terminal supports color
if [ "${TERM:-}" = "" ]; then
  echo "Setting TERM to dumb" # makes tput happy
  TERM="dumb"
fi
