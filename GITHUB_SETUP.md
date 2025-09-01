# 🚀 GitHub Repository Setup Guide

This guide will help you set up the Addis Care CRM project on GitHub.

## 📋 Prerequisites

- GitHub account
- Git installed on your local machine
- Node.js and npm installed

## 🔧 Setup Steps

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - **Repository name**: `addis-crm`
   - **Description**: `AI-powered CRM system for home care agencies with personalized email campaigns`
   - **Visibility**: Private (recommended for business use)
   - **Initialize with**: Don't initialize (we already have files)
5. Click "Create repository"

### 2. Connect Local Repository to GitHub

```bash
# Add the remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/addis-crm.git

# Push the initial commit
git branch -M main
git push -u origin main
```

### 3. Set Up Environment Variables

1. Go to your GitHub repository
2. Click on "Settings" tab
3. Click on "Secrets and variables" → "Actions"
4. Add the following repository secrets:

#### Required Secrets:
- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `FIREBASE_CLIENT_EMAIL` - Firebase service account email
- `FIREBASE_PRIVATE_KEY` - Firebase service account private key
- `RESEND_API_KEY` - Your Resend API key
- `GOOGLE_API_KEY` - Your Google AI API key

#### Optional Secrets:
- `SLACK_WEBHOOK_URL` - Slack webhook for notifications
- `NEXT_PUBLIC_APP_URL` - Your app URL (e.g., https://your-app.vercel.app)

### 4. Set Up Deployment (Optional)

#### Vercel Deployment:
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables in Vercel dashboard
4. Deploy

#### Netlify Deployment:
1. Go to [Netlify](https://netlify.com)
2. Import your GitHub repository
3. Configure environment variables in Netlify dashboard
4. Deploy

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env.local` files
- Use GitHub Secrets for sensitive data
- Keep API keys secure and rotate regularly

### Firebase Security
- Use Firebase Security Rules to protect your data
- Limit service account permissions
- Monitor Firebase usage and costs

### Email Security
- Use Resend's unsubscribe features
- Implement proper email validation
- Monitor email deliverability

## 📝 Repository Structure

```
addis-crm/
├── src/                    # Source code
│   ├── app/               # Next.js app directory
│   │   ├── ai-research/   # AI research and email generation
│   │   ├── api/           # API routes
│   │   └── globals.css    # Global styles
│   ├── components/        # Reusable UI components
│   └── lib/               # Utility functions
├── public/                # Static assets
├── docs/                  # Documentation
├── README.md              # Project documentation
├── MESSAGING_GUIDE.md     # Messaging guidelines
├── WEBHOOK_SETUP.md       # Webhook setup instructions
└── GITHUB_SETUP.md        # This file
```

## 🤝 Contributing Guidelines

### Branch Naming Convention
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/urgent-fix` - Critical fixes
- `docs/documentation-update` - Documentation updates

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

Examples:
- `feat(email): add broadcast email system`
- `fix(scheduling): resolve email delay issues`
- `docs(readme): update installation instructions`

### Pull Request Process
1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Update documentation if needed
5. Create a pull request
6. Request review from team members
7. Merge after approval

## 🚀 Continuous Integration

### GitHub Actions (Optional)
Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Use Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - run: npm ci
    - run: npm run build
    - run: npm test
```

## 📞 Support

For questions or issues:
1. Check the documentation in `/docs`
2. Search existing issues
3. Create a new issue with detailed description
4. Contact the development team

## 🔄 Maintenance

### Regular Tasks
- Update dependencies monthly
- Review and rotate API keys
- Monitor Firebase usage
- Check email deliverability
- Update documentation

### Security Updates
- Monitor security advisories
- Update dependencies promptly
- Review access permissions
- Audit environment variables

---

**Note**: This is a private repository for Addis Care. Please ensure all team members have appropriate access and follow security best practices.
