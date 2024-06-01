if [ -n "$TERM" ]; then
    tput setaf 1; echo "This will print in red if the terminal supports color"; tput sgr0
else
    echo "This will print normally without color"
fi
