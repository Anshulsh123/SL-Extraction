#!/bin/bash

# Script to set up GitHub repository for SL Extraction
# Make sure you have a GitHub personal access token with repo permissions

REPO_NAME="SL-Extraction"
GITHUB_USER="Anshulsh123"

echo "🚀 Setting up GitHub repository: $REPO_NAME"
echo ""

# Check if remote already exists
if git remote get-url origin &>/dev/null; then
    echo "⚠️  Remote 'origin' already exists. Removing it..."
    git remote remove origin
fi

# Add remote
echo "📦 Adding remote repository..."
git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo ""
echo "✅ Remote added successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Go to https://github.com/new"
echo "2. Repository name: ${REPO_NAME}"
echo "3. Make sure it's set to Public (or Private if you prefer)"
echo "4. DO NOT initialize with README, .gitignore, or license (we already have these)"
echo "5. Click 'Create repository'"
echo ""
echo "6. Then run:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "Or if you have a GitHub personal access token, you can create the repo via API:"
echo "   curl -X POST -H 'Authorization: token YOUR_TOKEN' \\"
echo "        -H 'Content-Type: application/json' \\"
echo "        -d '{\"name\":\"${REPO_NAME}\",\"private\":false}' \\"
echo "        https://api.github.com/user/repos"
