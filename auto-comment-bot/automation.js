// auto-comment-bot/automation.js
const { Octokit } = require('@octokit/rest');
require('dotenv').config();

// Initialize GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Configuration
const config = {
  owner: 'sarahmoon71560sarahmoon',
  repo: 'claude-code',
  targetLabels: ['feedback', 'suggestion'],
  commentMessage: 'Thank you for your contribution!',
  pollInterval: 60000 // 1 minute
};

// Function to process new issues
async function processNewIssues() {
  try {
    console.log('Checking for new issues...');
    
    // Get all open issues
    const { data: issues } = await octokit.issues.listForRepo({
      owner: config.owner,
      repo: config.repo,
      state: 'open',
      sort: 'created',
      direction: 'desc'
    });

    for (const issue of issues) {
      // Skip pull requests
      if (issue.pull_request) continue;

      // Check if issue has target labels
      const hasTargetLabel = issue.labels.some(label => 
        config.targetLabels.includes(label.name.toLowerCase())
      );

      if (hasTargetLabel) {
        console.log(`Processing issue #${issue.number}: ${issue.title}`);
        
        // Add comment
        await octokit.issues.createComment({
          owner: config.owner,
          repo: config.repo,
          issue_number: issue.number,
          body: config.commentMessage
        });

        // Close the issue
        await octokit.issues.update({
          owner: config.owner,
          repo: config.repo,
          issue_number: issue.number,
          state: 'closed'
        });

        console.log(`Successfully processed issue #${issue.number}`);
      }
    }
  } catch (error) {
    console.error('Error processing issues:', error.message);
  }
}

// Function to create test issues
async function createTestIssues() {
  const testIssues = [
    {
      title: 'UI improvement',
      labels: ['feedback'],
      body: 'The user interface could use some improvements for better user experience.'
    },
    {
      title: 'New feature',
      labels: ['suggestion'],
      body: 'It would be great to add a dark mode feature to the application.'
    },
    {
      title: 'Login error',
      labels: ['bug'],
      body: 'Users are experiencing login issues when using special characters in passwords.'
    }
  ];

  for (const issue of testIssues) {
    try {
      const { data: createdIssue } = await octokit.issues.create({
        owner: config.owner,
        repo: config.repo,
        title: issue.title,
        body: issue.body,
        labels: issue.labels
      });
      console.log(`Created test issue #${createdIssue.number}: ${createdIssue.title}`);
    } catch (error) {
      console.error(`Error creating test issue "${issue.title}":`, error.message);
    }
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--create-test')) {
    console.log('Creating test issues...');
    await createTestIssues();
  } else {
    console.log('Starting automation bot...');
    // Run immediately and then every minute
    await processNewIssues();
    setInterval(processNewIssues, config.pollInterval);
  }
}

// Start the bot
main().catch(console.error);