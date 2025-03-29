# Project Updater

**Project Updater** is a Node.js-based automation tool designed to help teams streamline the process of updating project information across multiple platforms. It ensures consistency and saves time by centralizing project name and ID changes using integrations with Slack and other services like Airtable, Monday.com, Google Drive, and Box.

## Features

- 🔁 **Update Project Name & ID Across Platforms**
- 🤖 **Slack Bot Integration** – Trigger updates via a Slack command
- 📋 **Airtable Sync** – Automatically updates the Master ID List
- ✅ **Supports Monday.com, Box, Google Drive, Frame.io**, and more (via modular integrations)
- 🔐 **Environment-based Configuration**

## How It Works

1. A user types `/update-project` in Slack and provides:
   - Old Project Name
   - New Project Name
   - Old Project ID
   - New Project ID
2. The bot receives the input and runs updates across all integrated platforms.
3. Airtable is updated with the new name/ID, and the old ID is stored in a backup column.
4. Confirmation is sent back to the user in Slack.

## Tech Stack

- Node.js
- Express
- Slack Bolt SDK
- Axios (for API calls)
- Dotenv (for managing secrets)
- Platform SDKs/APIs: Airtable, Monday.com, Google Drive, Box, Frame.io

## Setup

### 1. Clone the Repo

```bash
git clone https://github.com/glassandmarker/project-updater.git
cd project-updater
