#!/bin/bash
# Fix Docker DNS in WSL

echo "Fixing Docker DNS..."

# Backup existing resolv.conf
sudo cp /etc/resolv.conf /etc/resolv.conf.backup

# Add Google DNS
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf > /dev/null
echo "nameserver 8.8.4.4" | sudo tee -a /etc/resolv.conf > /dev/null

# Restart Docker
sudo service docker restart

echo "✓ DNS fixed! Try: docker compose up -d"
