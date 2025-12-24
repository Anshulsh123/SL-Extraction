#!/bin/bash

# Script to create GitHub repository via API
# You need a GitHub Personal Access Token with 'repo' scope
# Get one at: https://github.com/settings/tokens

REPO_NAME="SL-Extraction"
GITHUB_USER="Anshulsh123"
DESCRIPTION="Service Level Extractions UI Component - React + Vite with Material UI"

echo "🚀 Creating GitHub repository: $REPO_NAME"
echo ""

# Check if token is provided
if [ -z "$1" ]; then
    echo "❌ Error: GitHub Personal Access Token required"
    echo ""
    echo "Usage: ./create-github-repo.sh YOUR_GITHUB_TOKEN"
    echo ""
    echo "To get a token:"
    echo "1. Go to https://github.com/settings/tokens"
    echo "2. Click 'Generate new token (classic)'"
    echo "3. Select 'repo' scope"
    echo "4. Generate and copy the token"
    echo ""
    echo "Then run: ./create-github-repo.sh YOUR_TOKEN"
    exit 1
fi

TOKEN=$1

echo "📦 Creating repository on GitHub..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d "{\"name\":\"$REPO_NAME\", \"description\":\"$DESCRIPTION\", \"private\":false}" \
  https://api.github.com/user/repos)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 201 ]; then
    echo "✅ Repository created successfully!"
    echo ""
    echo "📤 Pushing code to GitHub..."
    git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git" 2>/dev/null || git remote set-url origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
    git branch -M main
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 Success! Repository is available at:"
        echo "   https://github.com/${GITHUB_USER}/${REPO_NAME}"
    else
        echo ""
        echo "⚠️  Repository created but push failed. You may need to:"
        echo "   git push -u origin main"
    fi
elif [ "$HTTP_CODE" -eq 422 ]; then
    echo "⚠️  Repository might already exist. Trying to push..."
    git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git" 2>/dev/null || git remote set-url origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
    git branch -M main
    git push -u origin main
else
    echo "❌ Error creating repository. HTTP Code: $HTTP_CODE"
    echo "Response: $BODY"
    echo ""
    echo "You can create it manually at: https://github.com/new"
    exit 1
fi
