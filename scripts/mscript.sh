#!/bin/bash
[[ ${TERM}=="" ]] && TPUTTERM='-T xterm-256color' \
                  || TPUTTERM=''

declare -r    RES='tput${TPUTTERM} sgr0'       REV='tput${TPUTTERM} rev'
declare -r    fRD='tput${TPUTTERM} setaf 1'    bRD='tput${TPUTTERM} setab 1'
declare -r    fGN='tput${TPUTTERM} setaf 2'    bGN='tput${TPUTTERM} setab 2'