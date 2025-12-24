# SL Extraction

A React + Vite application for displaying and managing Service Level Extractions with Material UI.

## Features

- Interactive data table with horizontal and vertical scrolling
- Row selection with checkboxes
- Single and multi-row deletion
- Filter options for taxonomy fields
- Retrigger extraction functionality with custom instructions
- AI Insights and References sections
- Export table data as JSON

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

This will start the development server on `http://localhost:5173`

### Build

```bash
npm run build
```

## Technology Stack

- React 18
- Vite
- Material UI (MUI)
- Emotion (CSS-in-JS)

## GitHub Repository Setup

### Option 1: Using the Script (Recommended)

1. Get a GitHub Personal Access Token:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select the `repo` scope
   - Generate and copy the token

2. Run the setup script:
   ```bash
   ./create-github-repo.sh YOUR_GITHUB_TOKEN
   ```

### Option 2: Manual Setup

1. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Repository name: `SL-Extraction`
   - Make it Public (or Private if preferred)
   - **DO NOT** initialize with README, .gitignore, or license

2. Push the code:
   ```bash
   git remote add origin https://github.com/Anshulsh123/SL-Extraction.git
   git branch -M main
   git push -u origin main
   ```

## Component Features

- **Table with Scrollbars**: Horizontal and vertical scrolling for large datasets
- **Row Selection**: Checkboxes to select individual or multiple rows
- **Delete Functionality**: Delete single rows or multiple selected rows
- **Filter Options**: Filter buttons on taxonomy fields (Line of Business, Program/Project, SL Type, SI)
- **Retrigger Extraction**: 
  - Column-level retrigger with custom instructions
  - Row-level retrigger for selected rows
  - Instruction textbox for agent communication
- **Export**: Export table data as JSON
- **Submit**: Submit entire table data as JSON to agent
- **AI Insights**: Display extracted insights
- **References**: Show document references
