# deploy-windows.ps1 — create GitHub repo (optional) and deploy website/ to Netlify and/or Vercel
# run with: PowerShell -ExecutionPolicy Bypass -File .\deploy-windows.ps1

Set-StrictMode -Version Latest
$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Working from $PSScriptRoot"
Set-Location $PSScriptRoot

function Prompt-SecretIfMissing {
    param(
        [string]$EnvName,
        [string]$PromptText
    )

    $existing = [Environment]::GetEnvironmentVariable($EnvName, 'Process')
    if (-not [string]::IsNullOrEmpty($existing)) {
        return
    }

    $secure = Read-Host -Prompt "$PromptText (leave blank to skip)" -AsSecureString
    if ($secure -and $secure.Length -gt 0) {
        $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
        try {
            $plain = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
        }
        finally {
            [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) | Out-Null
        }
        [Environment]::SetEnvironmentVariable($EnvName, $plain, 'Process')
    }
}

function Ensure-GitUser {
    $name = git config --get user.name 2>$null
    if ([string]::IsNullOrWhiteSpace($name)) {
        git config user.name "Oluku Deploy Bot"
    }

    $email = git config --get user.email 2>$null
    if ([string]::IsNullOrWhiteSpace($email)) {
        git config user.email "deploy@oluku.local"
    }
}

Prompt-SecretIfMissing -EnvName 'NETLIFY_AUTH_TOKEN' -PromptText 'Enter NETLIFY_AUTH_TOKEN'
Prompt-SecretIfMissing -EnvName 'VERCEL_TOKEN' -PromptText 'Enter VERCEL_TOKEN'

if (-not $env:GITHUB_REPO) {
    $repoInput = Read-Host -Prompt "Enter GitHub repo in the form 'owner/repo' to push (leave blank to skip GitHub push)"
    if (-not [string]::IsNullOrWhiteSpace($repoInput)) {
        $env:GITHUB_REPO = $repoInput
    }
}

if (-not (Test-Path (Join-Path $PSScriptRoot '.git'))) {
    Write-Host "Initializing git repository..."
    git init | Out-Null
    try { git checkout -b main | Out-Null } catch { try { git checkout -b master | Out-Null } catch { } }
}

Ensure-GitUser

$hasHead = $false
try {
    git rev-parse --verify HEAD > $null 2>&1
    $hasHead = $true
}
catch {
    $hasHead = $false
}

if (-not $hasHead) {
    git add --all
    git commit -m "Initial commit: Oluku LLC website + mobile app starter"
}
else {
    Write-Host "Git repo already has commits. Skipping initial commit."
}

if ($env:GITHUB_REPO) {
    Write-Host "Preparing to push to GitHub repo: $($env:GITHUB_REPO)"
    if (Get-Command gh -ErrorAction SilentlyContinue) {
        Write-Host "gh CLI detected."
        $ghAuthOk = $false
        try {
            gh auth status > $null 2>&1
            $ghAuthOk = $true
        }
        catch {
            $ghAuthOk = $false
        }

        if (-not $ghAuthOk) {
            Prompt-SecretIfMissing -EnvName 'GITHUB_TOKEN' -PromptText 'Enter GitHub PAT (repo scope) to authenticate gh'
            if ($env:GITHUB_TOKEN) {
                $env:GITHUB_TOKEN | gh auth login --with-token > $null 2>&1
            }
            else {
                Write-Host "Skipping gh authentication; gh commands may fail if not authenticated."
            }
        }

        gh repo create $env:GITHUB_REPO --public --source=. --remote=origin --push --confirm -y 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "gh repo create returned non-zero; attempting to push to existing remote..."
            try { git remote get-url origin > $null; $originExists = $true } catch { $originExists = $false }
            if (-not $originExists) {
                try { git remote add origin "https://github.com/$($env:GITHUB_REPO).git" } catch { git remote add origin "git@github.com:$($env:GITHUB_REPO).git" }
            }
            try { git push -u origin main } catch { git push -u origin master }
        }
    }
    else {
        Write-Host "gh CLI not installed — adding remote and pushing (ensure you have permissions)"
        try { git remote get-url origin > $null; $originExists = $true } catch { $originExists = $false }
        if (-not $originExists) {
            try { git remote add origin "https://github.com/$($env:GITHUB_REPO).git" } catch { git remote add origin "git@github.com:$($env:GITHUB_REPO).git" }
        }
        try { git push -u origin main } catch { git push -u origin master }
    }
}
else {
    Write-Host "GITHUB_REPO not provided — skipping GitHub push."
}

if ($env:NETLIFY_AUTH_TOKEN) {
    Write-Host "Deploying to Netlify..."
    $netlifyOut = & npx --yes netlify deploy --dir=website --prod --auth $env:NETLIFY_AUTH_TOKEN 2>&1
    Write-Host ($netlifyOut | Out-String)
    $netlifyText = ($netlifyOut | Out-String)
    $netlifyMatch = [regex]::Match($netlifyText, 'https?://[^\s)]+')
    if ($netlifyMatch.Success) {
        $netlifyUrl = $netlifyMatch.Value
        Write-Host "Detected Netlify URL: $netlifyUrl"
        if ($env:OPEN_AFTER_DEPLOY -eq '1' -or $env:OPEN_AFTER_DEPLOY -eq 'true') {
            Start-Process $netlifyUrl
        }
    }
    else {
        Write-Host "Could not detect a Netlify URL in the CLI output."
    }
}
else {
    Write-Host "NETLIFY_AUTH_TOKEN not set or skipped — skipping Netlify deploy."
}

if ($env:VERCEL_TOKEN) {
    Write-Host "Deploying to Vercel..."
    $vercelOut = & npx --yes vercel --prod website --token $env:VERCEL_TOKEN --confirm 2>&1
    if (-not $vercelOut) {
        $vercelOut = & npx --yes vercel --prod --token $env:VERCEL_TOKEN website --confirm 2>&1
    }
    Write-Host ($vercelOut | Out-String)
    $vercelText = ($vercelOut | Out-String)
    $vercelMatch = [regex]::Match($vercelText, 'https?://[^\s)]+')
    if ($vercelMatch.Success) {
        $vercelUrl = $vercelMatch.Value
        Write-Host "Detected Vercel URL: $vercelUrl"
        if ($env:OPEN_AFTER_DEPLOY -eq '1' -or $env:OPEN_AFTER_DEPLOY -eq 'true') {
            Start-Process $vercelUrl
        }
    }
    else {
        Write-Host "Could not detect a Vercel URL in the CLI output."
    }
}
else {
    Write-Host "VERCEL_TOKEN not set or skipped — skipping Vercel deploy."
}

Write-Host "Done. Review the outputs above for deployment URLs and any errors."
