GitHub repository template & exact commands

This file provides step-by-step commands to create a GitHub repository from this project and deploy the website folder to Netlify or Vercel. Choose the section that matches your environment.

1) Prepare the local repo (macOS / Linux)

cd "C:/Users/lukem/Downloads/Oluku_LLC_Website_and_App_Starter"
# initialize git, create main branch, commit
git init
git checkout -b main
git add .
git commit -m "Initial commit: Oluku LLC website + mobile app starter"

# If you have GitHub CLI (recommended):
# Replace <user> and <repo-name> with your GitHub username and desired repo name.
# This command will create the repo on GitHub, set origin and push.
gh repo create <user>/<repo-name> --public --source=. --remote=origin --push

# If you don't have gh (manual flow):
# 1) Create a new repository on github.com (click New -> Repository)
# 2) Then:
# Replace the URL with the repo URL provided by GitHub (SSH or HTTPS)
git remote add origin git@github.com:<user>/<repo-name>.git
git push -u origin main


2) Prepare the local repo (Windows PowerShell)

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
cd "C:\Users\lukem\Downloads\Oluku_LLC_Website_and_App_Starter"
git init
git checkout -b main
git add .
git commit -m "Initial commit: Oluku LLC website + mobile app starter"

# If you have GitHub CLI installed in PowerShell
gh repo create <user>/<repo-name> --public --source=. --remote=origin --push

# Otherwise create the repo on github.com and then run:
git remote add origin https://github.com/<user>/<repo-name>.git
git push -u origin main


3) Deploy website/ to Netlify (two quick options)

Option A: Drag & drop (no CLI)
- Zip the website/ folder (website.zip is already present in the repo root).
- Go to https://app.netlify.com/drop and drop the contents or website.zip.
- Netlify will publish and give you a URL.

Option B: Netlify CLI (recommended for automation)
# Install CLI (you can use npx if you don't want global install)
npm install -g netlify-cli
# Log in
netlify login
# Deploy the website directory (first run uses --dir to deploy to a draft URL; use --prod to publish)
netlify deploy --dir=website --prod

Notes: you can set build settings and continuous deploys in the Netlify UI by connecting the GitHub repo.


4) Deploy website/ to Vercel (quick)

# Install Vercel CLI
npm install -g vercel
# Log in
vercel login
# From the project root, deploy the site and follow prompts. Use the --prod flag to publish:
vercel --prod website

Or connect your GitHub repo in Vercel and set the project to use the static folder (no build command needed).


5) GitHub Pages (simple static hosting)

# Push the repo to GitHub (see above). Then either:
# - Enable GitHub Pages in repository Settings and point it to the root or gh-pages branch
# - Or deploy to gh-pages branch using the gh-pages package
npm install --save-dev gh-pages
# Add to package.json scripts:
# "predeploy": "cd website && npm run build || true",
# "deploy": "gh-pages -d website"
# Then run:
npm run deploy


6) Useful extra commands

# Show current git remote
git remote -v

# Create a branch for changes
git checkout -b feature/update-deps

# Pull latest
git pull origin main

# Force push (use with caution)
git push --force origin main


7) Security notes
- Never commit secrets (tokens, passwords) into the repo. Use environment variables or your host's secret management.
- For CI/CD, store Netlify/Vercel/GitHub tokens in the host's secure settings.

If you'd like, I can: 
- Create the GitHub repo for you (you will need to run the gh repo create command locally once authenticated), or
- Generate a ready-to-run PowerShell or bash script that automates the steps above for your environment.

