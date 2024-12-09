# GitHub Repository Cloner

This Node.js script allows you to fetch all repositories from a GitHub organization and clone them to your local machine. It checks if you have the necessary access rights to clone each repository, ensuring that you only attempt to clone repositories you have permission to access.

## Features

- Fetches all repositories from a specified GitHub organization.
- Checks for access to each repository using the GitHub API (requires authentication).
- Clones repositories to a local directory if access is granted.
- Handles pagination for organizations with more than 100 repositories.
- Skips already cloned repositories and checks for any access issues.

## Prerequisites

Before running the script, ensure the following:

- **Node.js** (v14 or higher) is installed on your machine.
- **Git** is installed and available in the system path.
- A **GitHub Personal Access Token** is needed to authenticate and access private repositories.

## Installation

1. **Clone or download the repository** to your local machine:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies** using `npm`. You must install `node-fetch@2` for compatibility:
   ```bash
   npm install node-fetch@2
   ```

3. If you haven't installed Git globally, you may need to install it as well. For instructions on how to do that, visit [Git Installation Guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

## Configuration

In the script file (`script.js`), you need to set up the following variables:

1. **GITHUB_ORG**: The GitHub organization or account whose repositories you want to clone.
   ```javascript
   const GITHUB_ORG = 'your-github-organization';
   ```

2. **GITHUB_TOKEN**: Your GitHub personal access token. You can create one from your GitHub account settings under *Developer settings* > *Personal access tokens*.
   ```javascript
   const GITHUB_TOKEN = 'your-personal-access-token';
   ```

3. **OUTPUT_DIRECTORY**: The directory where the repositories will be cloned. The default is `repositories` in the current directory.
   ```javascript
   const OUTPUT_DIRECTORY = path.join(__dirname, "repositories");
   ```

Make sure to replace `your-github-organization` and `your-personal-access-token` with actual values.

## Usage

Once the configuration is done, you can run the script to fetch and clone repositories:

```bash
node script.js
```

### What Happens When You Run the Script:
1. The script fetches the list of repositories from the specified GitHub organization.
2. It checks if you have access to each repository (using your GitHub token).
3. If access is granted, it will clone the repository into the `OUTPUT_DIRECTORY`.
4. It will skip any repositories that are already cloned to avoid duplication.
5. The process repeats for all repositories in the organization.

## Error Handling

### Fetch Errors:
If the script throws an error related to `fetch` (typically if you're using an incompatible version), you may need to install a specific version of `node-fetch`.

To fix this, install `node-fetch@2`:
```bash
npm install node-fetch@2
```

### Access Denied:
If you do not have access to a repository (private or restricted), the script will skip cloning that repository and display a message indicating the lack of access.

### Existing Repositories:
If a repository has already been cloned, it will be skipped to avoid re-cloning.



## Contributing

Contributions are welcome! If you'd like to improve the script, feel free to submit a pull request. For large changes, please open an issue first to discuss the proposed changes.

---

