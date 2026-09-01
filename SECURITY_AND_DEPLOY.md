Security & Deploy Checklist

This file contains immediate, actionable steps to revoke any exposed tokens, create a replacement GitHub personal access token (PAT) with minimal scopes, securely use tokens with the provided deploy scripts, and enable auto-opening of deployed URLs. Do not paste secrets into chats or commit them to source control.

1) Revoke exposed GitHub token (recommended immediate step)

- Open GitHub in your browser and sign in.
- Go to: Settings → Developer settings → Personal access tokens → Fine-grained tokens (or Classic tokens if you created one).
- Locate the token you exposed (or any token you don't trust) and click Revoke / Delete.
- If you are unsure which token was exposed, revoke recent tokens or any you do not recognize.

2) Revoke tokens for other providers (if applicable)

- Netlify: Team Settings → User settings → Personal access tokens → Revoke the token.
- Vercel: Dashboard → Settings → Tokens → Revoke.
- Any other provider: locate their developer or account settings and revoke tokens.

3) Create a new GitHub PAT (recommended: fine-grained token)

- Prefer Fine-grained tokens where possible (more restricted and recommended by GitHub):
  - GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token
  - Name: oluku-deploy-YYYYMMDD
  - Resource owner: choose your account or organization
  - Repository access: Select the specific repository (or leave none if using gh auth with repo creation)
  - Expiration: set a short expiration (e.g., 30 days) and rotate later
  - Permissions: if using a fine-grained token, grant the minimum repo permissions (Read & Write code for the selected repo) — avoid repo admin or org-level scopes.
- If you must use a classic token (not recommended), enable only the repo scope and set a short expiration.
- Copy the token once — GitHub will not show it again. Store it in your OS credential manager or paste it into the secure prompt, not into chat.

4) Use the new token securely (local one-off use)

- Authenticate gh (preferred local workflow):
  printf '%s' "YOUR_TOKEN" | gh auth login --with-token

- Or run the deploy script and type the token when prompted (the script reads tokens securely and does not print them):
  macOS/Linux (bash):
    chmod +x ./deploy.sh
    ./deploy.sh

  Windows PowerShell (process scoped bypass):
    PowerShell -ExecutionPolicy Bypass -File .\deploy-windows.ps1

- You can also export the token into the session (safer than storing in files):
  macOS / Linux:
    export GITHUB_TOKEN='your_token_here'
    export NETLIFY_AUTH_TOKEN='your_netlify_token'
    export VERCEL_TOKEN='your_vercel_token'
    OPEN_AFTER_DEPLOY=1 ./deploy.sh

  Windows PowerShell:
    $env:GITHUB_TOKEN = 'your_token_here'
    $env:NETLIFY_AUTH_TOKEN = 'your_netlify_token'
    $env:VERCEL_TOKEN = 'your_vercel_token'
    $env:OPEN_AFTER_DEPLOY = '1'; PowerShell -ExecutionPolicy Bypass -File .\deploy-windows.ps1

5) CI / Automated deploys (recommended)

- Do NOT put tokens into source code or repository files.
- Use provider secret stores instead:
  - GitHub Actions: repository settings → Secrets → Actions → New repository secret (e.g., NETLIFY_AUTH_TOKEN)
  - Netlify: Site settings → Build & deploy → Environment → Add new variable
  - Vercel: Project Settings → Environment Variables → Add
- In CI, reference secrets as environment variables and run the deploy script non-interactively.

6) Auto-open deployed URLs (how the scripts support it)

- The deploy scripts will try to extract the first https:// URL printed by the Netlify or Vercel CLI output and open it in your default browser if OPEN_AFTER_DEPLOY is set.
- Set OPEN_AFTER_DEPLOY=1 (or true) to enable auto-open.
  - macOS / Linux:
    OPEN_AFTER_DEPLOY=1 ./deploy.sh
  - Windows PowerShell:
    $env:OPEN_AFTER_DEPLOY='1'; PowerShell -ExecutionPolicy Bypass -File .\deploy-windows.ps1

7) Rotate and audit

- Rotate tokens periodically (every 30–90 days depending on sensitivity).
- Revoke tokens you no longer use.
- Audit OAuth apps and authorized tokens in GitHub Settings → Applications.

8) If you already pasted a token in chat (what to do now)

- Revoke the token immediately (step 1).
- Create a replacement token with minimal scope (step 3).
- Use the new token via gh auth login or the secure prompt in the deploy scripts.

9) Troubleshooting tips

- gh CLI not installed: install from https://github.com/cli/cli and run gh auth login to authenticate.
- netlify/vercel CLIs: the scripts use npx so you don't need a global install. If you prefer, install them globally:
  npm i -g netlify-cli vercel
- If the script cannot detect the deployed URL, check the CLI output for the published URL — the script prints the full CLI output to the console.

10) Minimal recommended workflow (quick)

- Revoke any exposed token.
- Create a new fine-grained GitHub token with minimal repo permissions.
- Run deploy script and paste tokens into the local secure prompt when requested.
- Use OPEN_AFTER_DEPLOY=1 to open the resulting site automatically.


Security reminder: never paste secrets into chat, issue trackers, or public code. Use secret stores (CI secrets, OS credential managers) and short-lived tokens when possible.
