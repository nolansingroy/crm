import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, leadId, leadName, leadCompany, leadEmail, customerType } = body

    if (!prompt || !leadId) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt and leadId' },
        { status: 400 }
      )
    }

    // For now, we'll simulate AI email generation
    // In production, you would call your actual AI service (Gemini, OpenAI, etc.)
    
    // Parse the prompt to understand what we need to generate
    const emailCount = prompt.includes('3 emails') ? 3 : 
                      prompt.includes('5 emails') ? 5 : 
                      prompt.includes('7 emails') ? 7 : 
                      prompt.includes('10 emails') ? 10 : 3

    // Generate sample emails based on the research prompt
    const emails: { [key: string]: { subject: string; body: string; html: string; reactEmailComponent: string } } = {}
    
    for (let i = 1; i <= emailCount; i++) {
      const emailKey = `Email ${i}`
      
      // Create personalized subject and body based on the research
      const subject = generateSubject(i, leadCompany, customerType)
      const body = generateReactEmailBody(i, leadName, leadCompany, customerType, prompt)
      const html = generateHTMLTemplate(i, leadName, leadCompany, customerType, body)
      
      emails[emailKey] = {
        subject,
        body,
        html,
        reactEmailComponent: generateReactEmailComponent(i, leadName, leadCompany, customerType, body)
      }
    }

    return NextResponse.json({
      success: true,
      emails,
      message: `Generated ${emailCount} personalized emails from research`
    })

  } catch (error) {
    console.error('Error generating emails:', error)
    return NextResponse.json(
      { error: 'Failed to generate emails' },
      { status: 500 }
    )
  }
}

function generateSubject(emailNumber: number, company: string, customerType: string): string {
  const subjects = {
    1: `Quick question about ${company}`,
    2: `Following up - ${company}`,
    3: `Growth opportunity for ${company}`,
    4: `Quick call about ${company}`,
    5: `Final follow-up - ${company}`,
    6: `Partnership opportunity - ${company}`,
    7: `Innovation for ${company}`,
    8: `Growth roadmap - ${company}`,
    9: `Success story - ${company}`,
    10: `Partnership proposal - ${company}`
  }
  
  return subjects[emailNumber as keyof typeof subjects] || subjects[1]
}

function generateReactEmailBody(emailNumber: number, leadName: string, company: string, customerType: string, researchPrompt: string): string {
  const firstName = leadName.split(' ')[0] || leadName
  
  // Extract key insights from the research prompt
  const hasResearchData = researchPrompt.toLowerCase().includes('research') || 
                          researchPrompt.toLowerCase().includes('findings') ||
                          researchPrompt.toLowerCase().includes('company') ||
                          researchPrompt.toLowerCase().includes('challenges')
  
  // MUCH SHORTER, mobile-friendly emails for busy home care owners
  const baseMessages = {
    1: `Hi ${firstName},

I've been researching ${company} and I'm impressed by your approach to ${customerType.replace('-', ' ')}.

The challenge I see for organizations like yours: how to grow your client base while maintaining quality care and not burning out your team.

Our AI solutions help ${customerType.replace('-', ' ')} leaders save 2-4 hours daily on administrative tasks, which translates to:

• More time for client care
• Better team retention  
• Increased growth opportunities

Would you be interested in a quick 15-minute call to discuss how we might help ${company} scale more effectively?

Looking forward to connecting!`,

    2: `Hi ${firstName},

Quick follow-up on supporting ${company}'s growth.

What's the biggest challenge you're currently facing in terms of client acquisition or operational efficiency?

We've helped similar ${customerType.replace('-', ' ')} organizations achieve remarkable results, and I'd love to see if we could do the same for you.

When might be a good time for a brief call to discuss how we might support ${company}'s mission?`,

    3: `Hi ${firstName},

I hope you're having a great week. I wanted to circle back on ${company}'s growth opportunities.

Based on my research, I see specific opportunities where our AI solutions could amplify your existing strengths.

Would you be interested in a brief 15-minute call next week to discuss how we might help ${company} scale more effectively?

Looking forward to connecting!`
  }
  
  // If we have research data, enhance the message with specific findings
  if (hasResearchData) {
    let enhancedMessage = baseMessages[emailNumber as keyof typeof baseMessages] || baseMessages[1]
    
    // Add research-specific personalization based on the research content
    if (researchPrompt.toLowerCase().includes('challenge') || researchPrompt.toLowerCase().includes('pain point')) {
      enhancedMessage = enhancedMessage.replace(
        'The challenge I see for organizations like yours:',
        'Based on my research, the specific challenges I see for your organization include:'
      )
    }
    
    if (researchPrompt.toLowerCase().includes('growth') || researchPrompt.toLowerCase().includes('scale')) {
      enhancedMessage = enhancedMessage.replace(
        'growth opportunities',
        'growth opportunities and the specific scaling challenges I identified'
      )
    }
    
    return enhancedMessage
  }
  
  return baseMessages[emailNumber as keyof typeof baseMessages] || baseMessages[1]
}

// Generate React Email component code that matches the exact HTML template
function generateReactEmailComponent(emailNumber: number, leadName: string, company: string, customerType: string, message: string): string {
  const firstName = leadName.split(' ')[0] || leadName
  
  return `import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Markdown,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

interface EmailTemplateProps {
  firstName?: string;
  company?: string;
  customerType?: string;
}

export const EmailTemplate${emailNumber}: React.FC<EmailTemplateProps> = ({
  firstName = '${firstName}',
  company = '${company}',
  customerType = '${customerType}',
}) => {
  return (
    <Html>
      <Head />
      <Preview>Addis Care</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerSection}>
            <div style={logoContainer}>
              <Img
                src="https://drive.google.com/uc?export=view&id=1iRPRqtYsUEE1o2R3hpLn_C2p4AOTV0t0"
                alt=""
                style={logo}
              />
            </div>
            <Heading style={h1}>More Clients • Save Time • Better Care</Heading>
            <Text style={subtitle}>Supporting ${company} with AI-powered growth solutions</Text>
          </Section>

          {/* Content */}
          <Section style={contentSection}>
            <Text style={greeting}>Hi {firstName},</Text>
            <div style={spacer}></div>
            
            <Markdown
              markdownCustomStyles={{
                p: { 
                  margin: '0 0 20px 0',
                  color: '#333',
                  lineHeight: '1.8',
                  fontSize: '16px'
                },
                ul: {
                  margin: '0 0 20px 0',
                  paddingLeft: '20px'
                },
                li: {
                  margin: '0 0 10px 0',
                  color: '#333',
                  lineHeight: '1.6'
                },
                strong: {
                  fontWeight: '600',
                  color: '#333'
                }
              }}
            >
              {message.split('\\n\\n').filter(paragraph => paragraph.trim() && !paragraph.startsWith('Hi ')).join('\\n\\n')}
            </Markdown>
          </Section>

          {/* Signature */}
          <Section style={signatureSection}>
            <div style={profileContainer}>
              <div style={avatarContainer}>
                <Img
                  src="https://drive.google.com/uc?export=view&id=1GjhtKnPNuTGQoH92R58B0DbP9GSLpvTn"
                  alt="Nolan Singroy"
                  style={avatar}
                />
              </div>
              <div style={profileInfo}>
                <Heading style={profileName}>Nolan Singroy</Heading>
                <Text style={profileTitle}>Nolan Singroy, <Link href="https://www.addiscare.ai" style={link}>Addis Care</Link></Text>
              </div>
            </div>

            <div style={signatureText}>
              <Text style={cheers}>Cheers,</Text>
              <Text style={signatureName}><strong>Nolan Singroy</strong></Text>
            </div>

            {/* Contact Links */}
            <div style={contactLinks}>
              {/* First Row */}
              <div style={contactRow}>
                <Link href="https://www.addiscare.ai" style={contactButton}>🌐 Website</Link>
                <Link href="https://www.linkedin.com/in/nolansingroy" style={contactButton}>💼 LinkedIn</Link>
                <Link href="https://calendar.app.google/BvAkPiFnGpoyXKnh7" style={contactButton}>👉🏽 Schedule Time Now</Link>
              </div>
              {/* Second Row */}
              <div style={contactRow}>
                <Link href="https://www.instagram.com/addiscare" style={contactButton}>📸 Instagram</Link>
                <Link href="tel:+1234567890" style={contactButton}>📞 Call</Link>
                <Link href="https://www.addiscare.ai/testimonials" style={contactButton}>⭐ Customer Testimonials</Link>
              </div>
            </div>
          </Section>

          {/* Footer with Unsubscribe */}
          <Section style={footerSection}>
            <Text style={footerText}>© 2025 <Link href="https://www.addiscare.ai" style={link}>Addis Care</Link>. All rights reserved.</Text>
            <Text style={footerSubtext}>Modern multilingual care training platform</Text>
            <div style={footerDivider}>
              <Text style={footerLegal}>
                You're receiving this email because you're a potential customer of <Link href="https://www.addiscare.ai" style={link}>Addis Care</Link>.
              </Text>
              <Text style={unsubscribeText}>
                <Link href="http://localhost:3000/api/unsubscribe?email={firstName}&id=leadId" style={link}>
                  📧 Unsubscribe from emails
                </Link>
              </Text>
            </div>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  margin: '0',
  padding: '0',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  backgroundColor: '#f8f9fa',
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const headerSection = {
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  padding: '30px',
  textAlign: 'center' as const,
};

const logoContainer = {
  marginBottom: '20px',
};

const logo = {
  height: '70px',
  width: 'auto',
  display: 'block',
  margin: '0 auto',
};

const h1 = {
  color: '#666',
  margin: '0',
  fontSize: '20px',
  fontWeight: '300',
};

const subtitle = {
  color: '#888',
  margin: '5px 0 0 0',
  fontSize: '14px',
  fontWeight: '300',
};

const contentSection = {
  padding: '40px 30px',
  lineHeight: '1.8',
  color: '#333',
  fontSize: '16px',
};



const greeting = {
  margin: '0 0 20px 0',
};

const spacer = {
  height: '20px',
};

const paragraphStyle = {
  margin: '0 0 20px 0',
};

const listContainer = {
  margin: '0 0 20px 0',
};

const listRow = {
  margin: '0 0 12px 0',
};

const bulletIconColumn = {
  width: '24px',
  verticalAlign: 'top',
};

const bulletTextColumn = {
  width: 'calc(100% - 24px)',
  verticalAlign: 'top',
};

const bulletIcon = {
  fontSize: '18px',
  color: '#667eea',
  fontWeight: 'bold',
  lineHeight: '1.4',
};

const listItemStyle = {
  margin: '0',
  color: '#333',
  lineHeight: '1.6',
};

const signatureSection = {
  backgroundColor: '#f8f9fa',
  padding: '30px',
  borderTop: '1px solid #e9ecef',
};

const profileContainer = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '20px',
};

const avatarContainer = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  overflow: 'hidden',
  marginRight: '20px',
  border: '2px solid #667eea',
};

const avatar = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const profileInfo = {
  flex: '1',
};

const profileName = {
  margin: '0',
  color: '#333',
  fontSize: '18px',
};

const profileTitle = {
  margin: '5px 0 0 0',
  color: '#666',
  fontSize: '14px',
};

const signatureText = {
  marginBottom: '20px',
};

const cheers = {
  margin: '0',
  color: '#333',
  fontSize: '16px',
};

const signatureName = {
  margin: '5px 0 0 0',
  color: '#333',
  fontSize: '16px',
  fontWeight: '500',
};

const contactLinks = {
  marginBottom: '20px',
};

const contactRow = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '15px',
  marginBottom: '15px',
};

const contactButton = {
  color: '#667eea',
  textDecoration: 'none',
  fontSize: '14px',
  padding: '8px 16px',
  border: '1px solid #667eea',
  borderRadius: '6px',
  transition: 'all 0.3s ease',
};



const link = {
  color: '#667eea',
  textDecoration: 'none',
};

const footerSection = {
  backgroundColor: '#333',
  color: 'white',
  padding: '20px',
  textAlign: 'center' as const,
  fontSize: '12px',
};

const footerText = {
  margin: '0',
};

const footerSubtext = {
  margin: '5px 0 0 0',
  opacity: '0.8',
};

const footerDivider = {
  marginTop: '15px',
  paddingTop: '15px',
  borderTop: '1px solid #555',
};

const footerLegal = {
  margin: '0',
  opacity: '0.7',
  fontSize: '11px',
};

const unsubscribeText = {
  margin: '15px 0 0 0',
};

export default EmailTemplate${emailNumber};`
}

// Generate HTML template that matches the exact design
function generateHTMLTemplate(emailNumber: number, leadName: string, company: string, customerType: string, message: string): string {
  const firstName = leadName.split(' ')[0] || leadName
  
  // Process the message content properly - direct approach
  const messageContent = message
    .split('\\n\\n')
    .filter(paragraph => paragraph.trim())
    .map(paragraph => {
      const trimmedParagraph = paragraph.trim()
      
      // Skip the greeting line since we already have it
      if (trimmedParagraph.startsWith('Hi ')) {
        return ''
      }
      
      // Check if paragraph contains bullet points
      if (trimmedParagraph.includes('•')) {
        const lines = trimmedParagraph.split('\\n').filter(line => line.trim())
        const introText = lines[0]
        const bulletPoints = lines.slice(1).filter(line => line.trim().startsWith('•'))
        
        if (bulletPoints.length > 0) {
          return `
            <p style="margin: 0 0 20px 0;">${introText}</p>
            <ul style="margin: 0 0 20px 0; padding-left: 20px;">
              ${bulletPoints.map(bullet => 
                `<li style="margin: 0 0 10px 0; color: #333;">${bullet.replace('•', '').trim()}</li>`
              ).join('\\n              ')}
            </ul>
          `
        }
      }
      
      // Regular paragraph
      return `<p style="margin: 0 0 20px 0;">${trimmedParagraph}</p>`
    })
    .filter(content => content.trim()) // Remove empty content
    .join('\\n            ')
  
  return `<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Addis Care</title>
</head>

<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 30px; text-align: center;">
            <div style="margin-bottom: 20px;">
                <img src="https://drive.google.com/uc?export=view&id=1iRPRqtYsUEE1o2R3hpLn_C2p4AOTV0t0" alt="" style="height: 70px; width: auto; display: block; margin: 0 auto;">
            </div>
            <h1 style="color: #666; margin: 0; font-size: 20px; font-weight: 300;">More Clients • Save Time • Better Care</h1>
            <p style="color: #888; margin: 5px 0 0 0; font-size: 14px; font-weight: 300;">Supporting ${company} with AI-powered growth solutions</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px; line-height: 1.8; color: #333; font-size: 16px;">
            <p style="margin: 0 0 20px 0;">Hi ${firstName},</p>
            <div style="height: 20px;"></div>
            
            ${messageContent}
        </div>

        <!-- Signature -->
        <div style="background-color: #f8f9fa; padding: 30px; border-top: 1px solid #e9ecef;">
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div style="width: 60px; height: 60px; border-radius: 50%; overflow: hidden; margin-right: 20px; border: 2px solid #667eea;">
                    <img src="https://drive.google.com/uc?export=view&id=1GjhtKnPNuTGQoH92R58B0DbP9GSLpvTn" alt="Nolan Singroy" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div>
                    <h3 style="margin: 0; color: #333; font-size: 18px;">Nolan Singroy</h3>
                    <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Nolan Singroy, <a href="https://www.addiscare.ai" style="color: #667eea; text-decoration: none;">Addis Care</a></p>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <p style="margin: 0; color: #333; font-size: 16px;">Cheers,</p>
                <p style="margin: 5px 0 0 0; color: #333; font-size: 16px; font-weight: 500;"><strong>Nolan Singroy</strong></p>
            </div>

            <!-- Contact Links -->
            <div style="margin-bottom: 20px;">
                <!-- First Row -->
                <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 15px;">
                    <a href="https://www.addiscare.ai" style="color: #667eea; text-decoration: none; font-size: 14px; padding: 8px 12px; border: 1px solid #667eea; border-radius: 6px; transition: all 0.3s ease;">🌐 Website</a>
                    <a href="https://www.linkedin.com/in/nolansingroy" style="color: #667eea; text-decoration: none; font-size: 14px; padding: 8px 12px; border: 1px solid #667eea; border-radius: 6px; transition: all 0.3s ease;">💼 LinkedIn</a>
                    <a href="https://calendar.app.google/BvAkPiFnGpoyXKnh7" style="color: #667eea; text-decoration: none; font-size: 14px; padding: 8px 12px; border: 1px solid #667eea; border-radius: 6px; transition: all 0.3s ease;">👉🏽 Schedule Time Now</a>
                </div>
                <!-- Second Row -->
                <div style="display: flex; flex-wrap: wrap; gap: 15px;">
                    <a href="https://www.instagram.com/addiscare" style="color: #667eea; text-decoration: none; font-size: 14px; padding: 8px 12px; border: 1px solid #667eea; border-radius: 6px; transition: all 0.3s ease;">📸 Instagram</a>
                    <a href="tel:+1234567890" style="color: #667eea; text-decoration: none; font-size: 14px; padding: 8px 12px; border: 1px solid #667eea; border-radius: 6px; transition: all 0.3s ease;">📞 Call</a>
                    <a href="https://www.addiscare.ai/testimonials" style="color: #667eea; text-decoration: none; font-size: 14px; padding: 8px 12px; border: 1px solid #667eea; border-radius: 6px; transition: all 0.3s ease;">⭐ Customer Testimonials</a>
                </div>
            </div>
        </div>

        <!-- Footer with Unsubscribe -->
        <div style="background-color: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2025 <a href="https://www.addiscare.ai" style="color: #667eea; text-decoration: none;">Addis Care</a>. All rights reserved.</p>
            <p style="margin: 5px 0 0 0; opacity: 0.8;">Modern multilingual care training platform</p>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #555;">
                <p style="margin: 0; opacity: 0.7; font-size: 11px;">
                    You're receiving this email because you're a potential customer of <a href="https://www.addiscare.ai" style="color: #667eea; text-decoration: none;">Addis Care</a>.
                </p>
                <p style="margin: 15px 0 0 0;">
                    <a href="http://localhost:3000/api/unsubscribe?email=${firstName}&id=leadId" style="color: #667eea; text-decoration: none; font-size: 11px;">
                        📧 Unsubscribe from emails
                    </a>
                </p>
            </div>
        </div>
    </div>
</body>

</html>`
}

