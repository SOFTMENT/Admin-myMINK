#!/bin/bash
export TERM=xterm-256color
echo "TERM is set to: $TERM"
if tput setaf 1 &>/dev/null; then
    echo "$(tput setaf 1)This is red text$(tput sgr0)"
else
    echo "tput not supported"
fi
