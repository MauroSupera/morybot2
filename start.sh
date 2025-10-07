#!/bin/bash

GREEN='\033[0;32m'
clear

while true; do
    echo "${GREEN} © Sasha Bot online! Versão 1.0.0 — Desenvolvido por Biel!"
    
    node utils/connection.js
    
    sleep 1  # Aguarda 1 segundos antes de tentar reconectar
done