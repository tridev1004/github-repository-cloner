const fetch = require("node-fetch");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Configuration
const GITHUB_ORG = ""; // Replace with the GitHub organization ID or the account whose repo you want to scrap
const GITHUB_TOKEN = ""; // Replace with your GitHub personal access token
const OUTPUT_DIRECTORY = path.join(__dirname, "repositories"); // Replace with the output directory

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIRECTORY)) {
  fs.mkdirSync(OUTPUT_DIRECTORY);
}

// Function to fetch repositories from an organization
async function getOrgRepositories(org, token) {
  const apiUrl = `https://api.github.com/orgs/${org}/repos`;
  let page = 1;
  let repos = [];

  while (true) {
    const headers = token ? { Authorization: `token ${token}` } : {};

    const response = await fetch(`${apiUrl}?page=${page}&per_page=100`, { headers });

    if (!response.ok) {
      console.error(`Failed to fetch repositories: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    if (data.length === 0) break;

    repos = repos.concat(data);
    page++;
  }

  return repos.map(repo => repo.clone_url);
}

// Function to check if the user has access to a repository
async function checkRepoAccess(repoOwner, repoName) {
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}`;
  const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};

  const response = await fetch(apiUrl, { headers });

  // If we have a rate limit issue or don't have permission, log the error
  if (!response.ok) {
    console.error(`Failed to check access for "${repoName}": ${response.statusText}`);
    const errorData = await response.json();
    console.error('Error details:', errorData);
    return false;
  }

  const repoDetails = await response.json();
  console.log(`Access check for "${repoName}":`, repoDetails.permissions);
  return repoDetails.permissions.pull || repoDetails.permissions.push || repoDetails.permissions.admin;
}

// Function to clone repositories
async function cloneRepositories(repositories) {
  for (const repoUrl of repositories) {
    const repoName = repoUrl.split("/").pop().replace(".git", "");
    const repoPath = path.join(OUTPUT_DIRECTORY, repoName);

    if (fs.existsSync(repoPath)) {
      console.log(`Repository "${repoName}" already exists. Skipping...`);
      continue;
    }

    // Get the repo owner and repo name for checking access
    const [repoOwner, repoNameWithExtension] = repoUrl.split("/").slice(-2);
    const repoNameWithoutExtension = repoNameWithExtension.replace(".git", "");

    // Check if the user has access to the repository
    const hasAccess = await checkRepoAccess(repoOwner, repoNameWithoutExtension);
    if (!hasAccess) {
      console.log(`Skipping "${repoName}" (no access).`);
      continue;
    }

    console.log(`Cloning "${repoName}"...`);
    await new Promise((resolve, reject) => {
      exec(`git clone ${repoUrl}`, { cwd: OUTPUT_DIRECTORY }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error cloning "${repoName}":`, stderr);
          reject(error);
        } else {
          console.log(stdout);
          resolve();
        }
      });
    });
  }
}

// Main function
(async function main() {
  try {
    const repositories = await getOrgRepositories(GITHUB_ORG, GITHUB_TOKEN);
    console.log(`Found ${repositories.length} repositories.`);
    if (repositories.length === 0) return;

    await cloneRepositories(repositories);
    console.log("All accessible repositories cloned successfully.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
