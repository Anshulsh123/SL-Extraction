# GitHub Repository Setup Guide

## Quick Setup (Using Script)

1. **Get GitHub Personal Access Token:**
   - Visit: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Name it: "SL Extraction Setup"
   - Select scope: `repo` (full control of private repositories)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again)

2. **Run the setup script:**
   ```bash
   cd "/Users/anshulsharma/Desktop/SL-Extraction"
   ./create-github-repo.sh YOUR_TOKEN_HERE
   ```

   Replace `YOUR_TOKEN_HERE` with the token you copied.

## Manual Setup

If you prefer to create the repository manually:

1. **Create Repository on GitHub:**
   - Go to: https://github.com/new
   - Repository name: `SL-Extraction`
   - Description: "Service Level Extractions UI Component - React + Vite with Material UI"
   - Choose Public or Private
   - **Important:** Do NOT check "Add a README file", "Add .gitignore", or "Choose a license"
   - Click "Create repository"

2. **Push Your Code:**
   ```bash
   cd "/Users/anshulsharma/Desktop/SL-Extraction"
   git remote add origin https://github.com/Anshulsh123/SL-Extraction.git
   git branch -M main
   git push -u origin main
   ```

## Verify

After setup, your repository will be available at:
https://github.com/Anshulsh123/SL-Extraction
