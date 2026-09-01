#!/usr/bin/env bash
# deploy.sh — create GitHub repo (optional) and deploy website/ to Netlify and/or Vercel
# Behavior:
# - Prefer using gh CLI for GitHub repo creation/push. If gh is missing, falls back to adding a remote and pushing.
# - If NETLIFY_AUTH_TOKEN or VERCEL_TOKEN or GITHUB_TOKEN/GITHUB_REPO are not set, prompts interactively (secure input) so you don't have to export them.
# - Tokens are read securely (not printed) and not stored by the script.

set -euo pipefail
cd "$(dirname "$0")"
ROOT=$(pwd)
echo "Working from $ROOT"

prompt_secret_if_missing() {
  # $1 = env var name, $2 = prompt text
  local varname="$1"
  local prompt_text="$2"
  if [ -z "${!varname-}" ]; then
    # prompt securely
    echo -n "$prompt_text (leave blank to skip): "
    # read -s will not echo; use REPLY var
    read -s REPLY
    echo
    if [ -n "$REPLY" ]; then
      # export into current environment for later use
      export "$varname"="$REPLY"
    fi
  fi
}

# Prompt for tokens if not set (Netlify / Vercel)
prompt_secret_if_missing NETLIFY_AUTH_TOKEN "Enter NETLIFY_AUTH_TOKEN"
prompt_secret_if_missing VERCEL_TOKEN "Enter VERCEL_TOKEN"

# Prompt for github repo if not set
if [ -z "${GITHUB_REPO-}" ]; then
  echo -n "Enter GitHub repo in the form 'owner/repo' to push (leave blank to skip GitHub push): "
  read GITHUB_REPO
fi

# If gh exists but not authenticated, allow interactive auth using a token
if [ -n "${GITHUB_REPO-}" ]; then
  echo "Preparing to push to GitHub repo: $GITHUB_REPO"
  if command -v gh >/dev/null 2>&1; then
    echo "gh CLI detected."
    # If not authenticated, attempt to authenticate using GITHUB_TOKEN or prompt
    if ! gh auth status >/dev/null 2>&1; then
      prompt_secret_if_missing GITHUB_TOKEN "Enter a GitHub personal access token (scopes: repo) to authenticate gh"
      if [ -n "${GITHUB_TOKEN-}" ]; then
        # login non-interactively: gh auth login --with-token reads token from stdin
        printf "%s" "$GITHUB_TOKEN" | gh auth login --with-token || echo "gh auth login failed; continuing"
      else
        echo "Skipping gh authentication; gh commands may fail if not authenticated."
      fi
    fi

    # Try to create repo (if missing) and push
    gh repo create "$GITHUB_REPO" --public --source=. --remote=origin --push --confirm || {
      echo "gh repo create returned non-zero; attempting to push to existing remote..."
      if git remote get-url origin >/dev/null 2>&1; then
        echo "Remote origin already set. Skipping remote add."
      else
        git remote add origin "https://github.com/${GITHUB_REPO}.git" || git remote add origin "git@github.com:${GITHUB_REPO}.git" || true
      fi
      git push -u origin main || git push -u origin master || true
    }
  else
    echo "gh CLI not installed — adding remote and pushing (ensure you have permissions)"
    if git remote get-url origin >/dev/null 2>&1; then
      echo "Remote origin already set. Skipping remote add."
    else
      git remote add origin "https://github.com/${GITHUB_REPO}.git" || git remote add origin "git@github.com:${GITHUB_REPO}.git" || true
    fi
    git push -u origin main || git push -u origin master || true
  fi
else
  echo "GITHUB_REPO not provided — skipping GitHub push."
fi

# Deploy to Netlify if token provided
if [ -n "${NETLIFY_AUTH_TOKEN-}" ]; then
  echo "Deploying to Netlify..."
  # Capture CLI output so we can optionally open the published URL
  NETLIFY_OUT=$(npx --yes netlify deploy --dir=website --prod --auth "$NETLIFY_AUTH_TOKEN" 2>&1 || true)
  echo "$NETLIFY_OUT"
  # Try to extract the first https URL from output
  NETLIFY_URL=$(printf "%s" "$NETLIFY_OUT" | grep -Eo 'https?://[^[:space:)]+' | head -n1 || true)
  if [ -n "${NETLIFY_URL-}" ]; then
    echo "Detected Netlify URL: $NETLIFY_URL"
    # Open in default browser if requested
    if [ "${OPEN_AFTER_DEPLOY-}" = "1" ] || [ "${OPEN_AFTER_DEPLOY-}" = "true" ]; then
      if command -v xdg-open >/dev/null 2>&1; then
        xdg-open "$NETLIFY_URL" || true
      elif command -v open >/dev/null 2>&1; then
        open "$NETLIFY_URL" || true
      fi
    fi
  else
    echo "Could not detect a Netlify URL in the CLI output."
  fi
else
  echo "NETLIFY_AUTH_TOKEN not set or skipped — skipping Netlify deploy."
fi

# Deploy to Vercel if token provided
if [ -n "${VERCEL_TOKEN-}" ]; then
  echo "Deploying to Vercel..."
  VERCEL_OUT=$(npx --yes vercel --prod website --token "$VERCEL_TOKEN" --confirm 2>&1 || npx --yes vercel --prod --token "$VERCEL_TOKEN" website --confirm 2>&1 || true)
  echo "$VERCEL_OUT"
  VERCEL_URL=$(printf "%s" "$VERCEL_OUT" | grep -Eo 'https?://[^[:space:)]+' | head -n1 || true)
  if [ -n "${VERCEL_URL-}" ]; then
    echo "Detected Vercel URL: $VERCEL_URL"
    if [ "${OPEN_AFTER_DEPLOY-}" = "1" ] || [ "${OPEN_AFTER_DEPLOY-}" = "true" ]; then
      if command -v xdg-open >/dev/null 2>&1; then
        xdg-open "$VERCEL_URL" || true
      elif command -v open >/dev/null 2>&1; then
        open "$VERCEL_URL" || true
      fi
    fi
  else
    echo "Could not detect a Vercel URL in the CLI output."
  fi
else
  echo "VERCEL_TOKEN not set or skipped — skipping Vercel deploy."
fi

echo "Done. Review the outputs above for deployment URLs and any errors."
