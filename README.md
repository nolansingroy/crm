# 🏥 [Addis Care](https://www.addiscare.ai) CRM

A comprehensive CRM system for home care agencies with AI-powered personalization, email campaigns, analytics, and sales cycle tracking.

## 🚀 Features

### 📧 Email Campaigns
- **Personalized Email Generation** - AI-powered content creation with Gemini Pro
- **Email Scheduling** - Natural language scheduling with Resend
- **Campaign Management** - Multi-step email sequences with delay scheduling
- **Campaign Tracking** - Real-time status updates (enrolled, opened, clicked, replied, meeting, customer)
- **Unsubscribe Management** - Compliant unsubscribe links with webhook integration

### 🧠 AI Research & Personalization
- **Comet Browser Integration** - Structured research instructions for lead research
- **Gemini Pro Analysis** - Intelligent insights extraction and email generation
- **Personalized Content** - Research-driven email customization based on company type
- **Dynamic Headers** - Personalized email headers based on prospect's company and role
- **Has Email Filter** - Filter leads with email addresses for targeted campaigns

### 📊 Analytics & Performance
- **Campaign Analytics** - Email tracking and engagement metrics
- **Webhook Integration** - Real-time email event tracking (delivered, opened, clicked, unsubscribed)
- **Lead Management** - Complete lead lifecycle tracking with Firestore
- **Campaign Status Tracking** - Monitor who is in campaigns and at what stage

### 📁 Data Management
- **CSV Upload** - Bulk lead import functionality
- **Firestore Integration** - Real-time data storage and synchronization
- **Lead Management** - Complete lead lifecycle tracking
- **Multi-Data Type Support** - Home care, adult care, CCRC, ALF

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd addis-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your API keys and configuration
   ```

4. **Set up Firebase**
   - Create a Firebase project
   - Download service account key to `service-account-key.json`
   - Update Firebase configuration in `.env.local`

## 🔧 Configuration

### Environment Variables (.env.local)
```env
# Firebase Configuration
GOOGLE_CLOUD_PROJECT=your-project-id
FIREBASE_SERVICE_ACCOUNT_PATH=service-account-key.json

# Resend Configuration
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=your-email@domain.com
REPLY_TO_EMAIL=your-reply-email@domain.com

# Google AI Configuration
GOOGLE_API_KEY=your-google-api-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

### Run Tests
```bash
# Run all tests
npm test

# Run specific test
npm test -- --testNamePattern="email"
```

## 📁 Project Structure

```
addis-crm/
├── src/                           # Source code
│   ├── app/                       # Next.js app directory
│   │   ├── ai-research/           # AI research and email generation
│   │   ├── api/                   # API routes
│   │   │   ├── campaigns/         # Campaign management
│   │   │   ├── generate-emails/   # Email generation API
│   │   │   ├── leads/             # Lead management
│   │   │   ├── send-email/        # Email sending via Resend
│   │   │   ├── unsubscribe/       # Unsubscribe handling
│   │   │   └── webhooks/          # Webhook endpoints
│   │   └── globals.css            # Global styles
│   ├── components/                # Reusable UI components
│   └── lib/                       # Utility functions
├── public/                        # Static assets
├── .next/                         # Next.js build output
├── node_modules/                  # Dependencies
├── package.json                   # Project configuration
├── next.config.js                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── components.json                # shadcn/ui configuration
├── env.example                    # Environment variables template
├── README.md                      # Project documentation
├── MESSAGING_GUIDE.md             # Messaging guidelines
└── WEBHOOK_SETUP.md               # Webhook setup instructions
```

## 🎯 Usage

### 1. AI Research & Email Generation
- Generate research instructions for Comet Browser
- Analyze research findings with Gemini Pro
- Create personalized email sequences
- Filter leads with email addresses using "Has Email" filter

### 2. Email Campaigns
- Send personalized emails to leads
- Schedule emails with natural language (e.g., "in 1 hour", "in 2 days")
- Manage multi-step campaign sequences
- Track campaign status and engagement

### 3. Campaign Management
- Create campaigns with multiple email sequences
- Track lead status throughout the campaign
- Monitor email events via webhooks
- Handle unsubscribe requests compliantly

### 4. Lead Management
- Upload CSV files with lead data
- Manage leads and email tracking
- View existing data and analytics
- Filter leads by various criteria

## 🔗 Integrations

- **Firebase Firestore** - Real-time database and lead storage
- **Resend** - Email delivery, scheduling, and webhook management
- **Google Gemini Pro** - AI research and content generation
- **Comet Browser** - Web research automation
- **Next.js 15** - Modern React framework with App Router

## 📊 Data Types Supported

- **Home Care Agencies** - In-home care services
- **Adult Care Family Homes** - Residential care facilities
- **CCRC (Continuing Care Retirement Communities)** - Multi-level care
- **ALF (Assisted Living Facilities)** - Assisted living services

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
```bash
# Deploy to Vercel, Netlify, or similar platform
npm run build
npm start
```

## 📈 Performance

- **Real-time Analytics** - Live dashboard updates
- **Scalable Architecture** - Handles thousands of leads
- **AI-Powered Personalization** - Research-driven content
- **Comprehensive Tracking** - Full campaign lifecycle monitoring
- **Webhook Integration** - Real-time email event tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software for [Addis Care](https://www.addiscare.ai).

## 🆘 Support

For support and questions, please contact the development team.

## 📋 Backlog & Future Features

### 🎯 High Priority
- **Broadcast Email System** - Static campaigns for leads without personalization data
  - Filter leads without LinkedIn/website domain data
  - Pre-written broadcast templates for different customer types
  - Bulk email sending to multiple leads simultaneously
  - Integration with Resend's broadcast API
  - Campaign performance tracking for broadcasts

### 🔄 Medium Priority
- **Advanced Analytics Dashboard** - Enhanced reporting and insights
- **Email Template Library** - Reusable template system
- **Lead Scoring** - Automated lead prioritization
- **Integration Hub** - Connect with additional CRM systems
- **Mobile App** - Native mobile experience

### 💡 Nice to Have
- **AI Chatbot** - Automated lead qualification
- **Social Media Integration** - LinkedIn, Facebook outreach
- **Video Email** - Personalized video messages
- **Advanced Segmentation** - Behavioral and demographic targeting
- **White-label Solution** - Customizable for different agencies
