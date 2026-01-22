# Automated Comment Bot

A repository to test GitHub automation for adding comments to specific issues and closing them.

## Overview

This project implements a GitHub automation script that automatically:
- Adds a comment "Thank you for your contribution!" to any new issue labeled "feedback" or "suggestion"
- Closes the issue after adding the comment

## Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Configure GitHub token in `.env` file
4. Run the automation: `npm start`

## Testing

To test the automation:
1. Create sample issues with labels "feedback", "suggestion", or "bug"
2. The bot will automatically respond to "feedback" and "suggestion" labels
3. Issues with "bug" label will be ignored

## Sample Issues for Testing

- Issue 1: Labels: "feedback", Title: "UI improvement"
- Issue 2: Labels: "suggestion", Title: "New feature"
- Issue 3: Labels: "bug", Title: "Login error"

## Automation Script

The main automation script will be located in `auto-comment-bot/automation.js`