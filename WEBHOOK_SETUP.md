# Resend Webhook Setup Guide

## Overview
This system uses Resend webhooks to automatically track email events and update lead status in real-time.

## Webhook URL
```
https://your-domain.com/api/webhooks/resend
```

## Events Tracked
- ✅ `email.delivered` - Email successfully delivered
- ✅ `email.opened` - Email opened by recipient
- ✅ `email.clicked` - Link clicked in email
- ✅ `email.complained` - Recipient marked as spam
- ✅ `email.bounced` - Email bounced (hard/soft)
- ✅ `email.unsubscribed` - Recipient unsubscribed
- ✅ `email.sent` - Email sent from Resend
- ✅ `email.failed` - Email failed to send
- ✅ `email.delivery_delayed` - Email delivery delayed

## Setup Instructions

### 1. Configure in Resend Dashboard
1. Go to [Resend Dashboard](https://resend.com/webhooks)
2. Click "Add Webhook"
3. Enter your webhook URL: `https://your-domain.com/api/webhooks/resend`
4. Select all event types listed above
5. Save the webhook

### 2. Environment Variables
Add to your `.env.local`:
```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 3. Webhook Security (Optional)
For production, consider adding webhook signature verification:
```javascript
// In webhook route
const signature = request.headers.get('resend-signature')
// Verify signature with Resend's public key
```

## How It Works

### Email Tracking
1. **Email Sent** → Webhook updates `emails` collection
2. **Email Opened** → Updates lead engagement metrics
3. **Link Clicked** → Tracks click events
4. **Unsubscribed** → Marks lead as unsubscribed

### Lead Updates
- **Unsubscribe Events**: Automatically marks leads as unsubscribed
- **Complaints**: Marks lead as unsubscribed due to spam complaint
- **Bounces**: Marks lead as unsubscribed due to bounce
- **Engagement**: Tracks opens, clicks, and other metrics

### Database Updates
```javascript
// Lead document updates
{
  unsubscribed: true,
  unsubscribed_at: "2024-01-15T10:30:00Z",
  unsubscribe_reason: "webhook|complaint|bounce",
  total_opens: 5,
  total_clicks: 2,
  last_email_event: "email.opened",
  last_email_event_at: "2024-01-15T10:30:00Z"
}
```

## Testing Webhooks

### Local Development
1. Use [ngrok](https://ngrok.com/) to expose local server
2. Set webhook URL to: `https://your-ngrok-url.ngrok.io/api/webhooks/resend`
3. Send test emails to trigger webhooks

### Production
1. Deploy your app
2. Update webhook URL in Resend dashboard
3. Send test emails to verify webhook delivery

## Troubleshooting

### Webhook Not Receiving Events
1. Check webhook URL is correct
2. Verify webhook is enabled in Resend dashboard
3. Check server logs for errors
4. Ensure webhook endpoint returns 200 OK

### Events Not Updating Database
1. Check Firestore connection
2. Verify lead_id and firestore_id tags are present
3. Check webhook logs for processing errors

## Benefits
- ✅ **Real-time Updates**: Lead status updates immediately
- ✅ **Automatic Unsubscribe**: Handles unsubscribe events automatically
- ✅ **Engagement Tracking**: Tracks opens, clicks, complaints
- ✅ **Compliance**: Meets email deliverability requirements
- ✅ **Analytics**: Provides detailed email performance data
