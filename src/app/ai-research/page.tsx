'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-hot-toast'
import { Loader2, Search, Mail, Calendar, Building, Users, Filter, Target } from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  company: string
  position: string
  type: string
  facility_type: string
  linkedin?: string
  website?: string
  notes?: string
  created_at: string
  unsubscribed?: boolean
  campaign_status?: string
  status?: string
  assigned_to?: string
}

interface EmailData {
  subject: string
  body: string
  html?: string
  reactEmailComponent?: string
}

interface CampaignSettings {
  customerType: string
  emailSequenceLength: number
}

const CLOUD_FUNCTION_URL = process.env.NEXT_PUBLIC_CLOUD_FUNCTION_URL || 'https://us-central1-your-project.cloudfunctions.net/post_email'

export default function AIResearchPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [hasEmailFilter, setHasEmailFilter] = useState('all')
  const [hasResearchDataFilter, setHasResearchDataFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [ownerFilter, setOwnerFilter] = useState('all')
  const [researchPrompt, setResearchPrompt] = useState('')
  const [cometContent, setCometContent] = useState('')
  const [emails, setEmails] = useState<{ [key: string]: EmailData }>({})
  const [emailSchedules, setEmailSchedules] = useState<{ [key: string]: string }>({})
  const [sendingEmails, setSendingEmails] = useState<{ [key: string]: boolean }>({})
  const [campaignSettings, setCampaignSettings] = useState<CampaignSettings>({
    customerType: 'home-care-agency',
    emailSequenceLength: 3
  })
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [campaignDays, setCampaignDays] = useState(3)
  const [cometPrompt, setCometPrompt] = useState('')
  const [generatingCometPrompt, setGeneratingCometPrompt] = useState(false)
  const [showLeadDetail, setShowLeadDetail] = useState(false)
  const [selectedLeadDetail, setSelectedLeadDetail] = useState<Lead | null>(null)
  const [campaignMetrics, setCampaignMetrics] = useState({
    enrolled: 0,
    opened: 0,
    clicked: 0,
    replied: 0,
    meetings: 0
  })
  const [emailViewMode, setEmailViewMode] = useState<'text' | 'react' | 'html'>('text')
  const [htmlViewMode, setHtmlViewMode] = useState<'preview' | 'code'>('preview')

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch leads on component mount
  useEffect(() => {
    if (mounted) {
      fetchLeads()
    }
  }, [mounted])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      console.log('Fetching leads...')
      const response = await fetch('/api/leads')
      if (response.ok) {
        const data = await response.json()
        console.log('Leads data received:', data)
        if (data.leads && Array.isArray(data.leads)) {
          setLeads(data.leads)
          console.log('Leads set successfully, count:', data.leads.length)
        } else {
          console.error('Invalid leads data structure:', data)
          setLeads([])
        }
      } else {
        console.error('Failed to fetch leads, status:', response.status)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  const filteredLeads = leads.filter(lead => {
    try {
      // Add safety checks for lead properties
      if (!lead || typeof lead !== 'object') {
        console.warn('Invalid lead object:', lead)
        return false
      }

      const matchesSearch = (lead.name && lead.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesType = filterType === 'all' || lead.type === filterType || lead.facility_type === filterType
      
      const matchesEmailFilter = hasEmailFilter === 'all' || 
                                (hasEmailFilter === 'has-email' && lead.email) ||
                                (hasEmailFilter === 'no-email' && !lead.email)
      
      const matchesResearchDataFilter = hasResearchDataFilter === 'all' ||
                                      (hasResearchDataFilter === 'has-research-data' && (lead.linkedin || lead.website)) ||
                                      (hasResearchDataFilter === 'no-research-data' && !lead.linkedin && !lead.website)
      
      const matchesStatusFilter = statusFilter === 'all' || lead.status === statusFilter
      
      const matchesOwnerFilter = ownerFilter === 'all' || lead.assigned_to === ownerFilter
      
      return matchesSearch && matchesType && matchesEmailFilter && matchesResearchDataFilter && matchesStatusFilter && matchesOwnerFilter
    } catch (error) {
      console.error('Error filtering lead:', lead, error)
      return false
    }
  })

  // Debug logging
  useEffect(() => {
    console.log('Current leads state:', leads)
    console.log('Current filteredLeads:', filteredLeads)
    console.log('Current searchTerm:', searchTerm)
  }, [leads, filteredLeads, searchTerm])

  const openLeadDetail = (lead: Lead) => {
    setSelectedLeadDetail(lead)
    setShowLeadDetail(true)
  }

  const getMessagingGuide = (customerType: string) => {
    const guides = {
      'home-care-agency': {
        valuePropositions: `Key Value Propositions for Home Care Agencies:
- More clients and growth
- Save 2-4 hours/day on administrative tasks
- Better compassionate care delivery
- HIPAA secure family communication to build trust
- Effective care plans and coordination
- Streamlined compliance and training`,
        keyTalkingPoints: [
          'Growth: "Get more clients and grow your agency"',
          'Efficiency: "Save time on administrative tasks"',
          'Quality: "Deliver better, more compassionate care"',
          'Trust: "HIPAA secure family communication builds trust"',
          'Compliance: "Stay compliant while improving care"'
        ],
        painPoints: [
          'Client Acquisition: Difficulty getting new clients',
          'Administrative Burden: Too much time on paperwork',
          'Family Communication: Inconsistent family updates',
          'Care Coordination: Fragmented care planning',
          'Compliance: HIPAA and regulatory concerns'
        ]
      },
      'adult-care-home': {
        valuePropositions: `Key Value Propositions for Adult Care Homes:
- Streamline daily operations
- Reduce administrative overhead
- Improve staff productivity
- Cost management and optimization
- Maintain regulatory compliance
- Better resident outcomes`,
        keyTalkingPoints: [
          'Efficiency: "Streamline operations and reduce overhead"',
          'Cost: "Optimize costs and improve financial performance"',
          'Compliance: "Maintain regulatory compliance"',
          'Quality: "Improve resident care and outcomes"'
        ],
        painPoints: [
          'Operational Inefficiency: Complex daily operations',
          'High Costs: Administrative overhead and inefficiencies',
          'Compliance: Regulatory requirements and audits',
          'Staff Productivity: Time spent on administrative tasks'
        ]
      },
      'ccrc': {
        valuePropositions: `Key Value Propositions for CCRC (Continuing Care Retirement Communities):
- Enhanced resident experience and satisfaction
- Streamlined care coordination across levels
- Better family engagement and communication
- Operational efficiency and cost optimization
- Regulatory compliance management
- Comprehensive care planning`,
        keyTalkingPoints: [
          'Resident Experience: "Enhance resident satisfaction"',
          'Efficiency: "Streamline care coordination"',
          'Family Engagement: "Better family communication"',
          'Compliance: "Maintain regulatory standards"'
        ],
        painPoints: [
          'Care Coordination: Complex multi-level care management',
          'Family Communication: Inconsistent family updates',
          'Operational Efficiency: Administrative complexity',
          'Compliance: Multiple regulatory requirements'
        ]
      },
      'alf': {
        valuePropositions: `Key Value Propositions for ALF (Assisted Living Facilities):
- Improved resident care and outcomes
- Better staff productivity and satisfaction
- Enhanced family engagement and communication
- Streamlined operations and compliance
- Cost optimization and efficiency
- Quality assurance and monitoring`,
        keyTalkingPoints: [
          'Resident Care: "Improve resident outcomes"',
          'Staff Efficiency: "Better staff productivity"',
          'Family Engagement: "Enhanced family communication"',
          'Compliance: "Streamlined regulatory compliance"'
        ],
        painPoints: [
          'Care Quality: Maintaining high care standards',
          'Staff Management: Staff productivity and retention',
          'Family Communication: Keeping families informed',
          'Compliance: Meeting regulatory requirements'
        ]
      }
    }
    
    return guides[customerType as keyof typeof guides] || guides['home-care-agency']
  }

  const generateGeminiPrompt = (lead: Lead) => {
    // Get customer type for messaging guide
    const customerType = lead.type || lead.facility_type || 'home-care-agency'
    
    // Messaging guide based on customer type
    const messagingGuide = getMessagingGuide(customerType)
    
    const basePrompt = `You are a sales research specialist for Addis Care, a modern multilingual care training platform.

RESEARCH AND DRAFT COMPLETE EMAILS for this prospect:

Company: ${lead.company}
Contact: ${lead.name} (${lead.position})
Email: ${lead.email}
Type: ${customerType}

${messagingGuide.valuePropositions}

RESEARCH INSTRUCTIONS:
1. Research ${lead.company} online
2. Look for their website, LinkedIn, social media
3. Understand their services, challenges, and values
4. Find specific pain points they might have
5. Look for any multilingual or cultural focus

EMAIL REQUIREMENTS:
- Create ${campaignSettings.emailSequenceLength} complete emails
- Use natural, conversational tone
- Reference specific research findings
- Include personalized value propositions from the messaging guide
- DO NOT use placeholder text - write complete emails
- Make each email build on the previous one
- Use the messaging guide's key talking points and pain points

FORMAT YOUR RESPONSE AS:
Subject: [Email Subject]
[Complete email body with proper formatting]

Subject: [Email Subject]  
[Complete email body with proper formatting]

[Continue for all ${campaignSettings.emailSequenceLength} emails]`

    return basePrompt
  }

  const generateCometPrompt = async () => {
    if (!selectedLead) {
      toast.error('Please select a lead first')
      return
    }

    setGeneratingCometPrompt(true)
    try {
      // Update campaign settings with selected days
      setCampaignSettings(prev => ({
        ...prev,
        emailSequenceLength: campaignDays
      }))

      // Generate the comet prompt using Gemini
      const prompt = generateGeminiPrompt(selectedLead)
      
      // Here you would call your Gemini API
      // For now, we'll simulate the response
      const response = await fetch('/api/generate-comet-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          lead: selectedLead,
          campaignDays
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate comet prompt')
      }

      const data = await response.json()
      setCometPrompt(data.cometPrompt)
      toast.success('Comet prompt generated successfully!')
      
      // Close the modal after successful generation
      setShowCampaignModal(false)
      
    } catch (error) {
      console.error('Error generating comet prompt:', error)
      toast.error('Failed to generate comet prompt')
    } finally {
      setGeneratingCometPrompt(false)
    }
  }

  const generateEmails = async () => {
    if (!selectedLead) {
      toast.error('Please select a lead first')
      return
    }

    setLoading(true)
    try {
      const prompt = generateGeminiPrompt(selectedLead)
      const response = await fetch('/api/generate-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          leadId: selectedLead.id,
          leadName: selectedLead.name,
          leadCompany: selectedLead.company,
          leadEmail: selectedLead.email,
          customerType: campaignSettings.customerType
        })
      })

      if (response.ok) {
        const data = await response.json()
        setEmails(data.emails)
        toast.success('Emails generated successfully!')
      } else {
        const error = await response.json()
        toast.error(`Failed to generate emails: ${error.error}`)
      }
    } catch (error) {
      console.error('Error generating emails:', error)
      toast.error('Failed to generate emails')
    } finally {
      setLoading(false)
    }
  }

  const extractEmailsFromCometContent = (content: string) => {
    const emailRegex = /Subject:\s*(.+?)\s*\n([\s\S]*?)(?=Subject:|$)/g
    const emails: { [key: string]: EmailData } = {}
    let match
    let emailCount = 0

    while ((match = emailRegex.exec(content)) !== null && emailCount < campaignSettings.emailSequenceLength) {
      const subject = match[1].trim()
      const body = match[2].trim()
      
      if (subject && body) {
        const emailKey = `Email ${emailCount + 1}`
        emails[emailKey] = {
          subject: subject.replace(/^[-•*]\s*/, '').trim(),
          body: body
        }
        emailCount++
      }
    }

    return emails
  }

  const generateEmailsWithGemini = async () => {
    if (!selectedLead) {
      toast.error('Please select a lead first')
      return
    }

    setLoading(true)
    try {
      const prompt = generateGeminiPrompt(selectedLead)
      const response = await fetch('/api/generate-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          leadId: selectedLead.id,
          leadName: selectedLead.name,
          leadCompany: selectedLead.company,
          leadEmail: selectedLead.email,
          customerType: campaignSettings.customerType
        })
      })

      if (response.ok) {
        const data = await response.json()
        setEmails(data.emails)
        toast.success('Emails generated with Gemini!')
      } else {
        const error = await response.json()
        toast.error(`Failed to generate emails: ${error.error}`)
      }
    } catch (error) {
      console.error('Error generating emails:', error)
      toast.error('Failed to generate emails')
    } finally {
      setLoading(false)
    }
  }

  const generateReactEmailComponent = (emailKey: string, leadName: string, company: string, customerType: string, message: string): string => {
    const firstName = leadName.split(' ')[0] || leadName
    const emailNumber = emailKey.replace('Email ', '')
    
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
            <Text style={subtitle}>Supporting {company} with AI-powered growth solutions</Text>
          </Section>

          {/* Content */}
          <Section style={contentSection}>
            <Text style={greeting}>Hi {firstName},</Text>
            <div style={spacer}></div>
            <div style={spacer}></div>
            
            ${message.split('\\n\\n').map(paragraph => 
              `<Text style={paragraphStyle}>${paragraph}</Text>`
            ).join('\\n            ')}
            
            <div style={spacer}></div>
            <div style={spacer}></div>
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
  height: '12px',
};

const paragraphStyle = {
  margin: '0 0 20px 0',
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
  padding: '8px 12px',
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

  const generateEmailsFromComet = async () => {
    if (!selectedLead) {
      toast.error('Please select a lead first')
      return
    }

    if (!cometContent.trim()) {
      toast.error('Please paste your research findings first')
      return
    }

    setLoading(true)
    try {
      // Create a prompt that combines the lead info with the research findings
      const researchPrompt = `You are a sales specialist for Addis Care. 

LEAD INFORMATION:
Company: ${selectedLead.company}
Contact: ${selectedLead.name} (${selectedLead.position})
Email: ${selectedLead.email}
Type: ${selectedLead.type || selectedLead.facility_type}

RESEARCH FINDINGS:
${cometContent}

TASK: Create ${campaignSettings.emailSequenceLength} personalized emails based on the research findings above.

REQUIREMENTS:
- Use specific details from the research to personalize each email
- Reference company challenges, pain points, or opportunities found in research
- Make each email build on the previous one
- Use natural, conversational tone
- Include specific value propositions relevant to their situation
- Reference actual research findings (company culture, challenges, etc.)

FORMAT YOUR RESPONSE AS:
Subject: [Email Subject]
[Complete email body with proper formatting]

Subject: [Email Subject]  
[Complete email body with proper formatting]

[Continue for all ${campaignSettings.emailSequenceLength} emails]`

      console.log('Sending research prompt to API:', researchPrompt)
      console.log('API payload:', {
        prompt: researchPrompt,
        leadId: selectedLead.id,
        leadName: selectedLead.name,
        leadCompany: selectedLead.company,
        leadEmail: selectedLead.email,
        customerType: campaignSettings.customerType
      })

      const response = await fetch('/api/generate-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: researchPrompt,
          leadId: selectedLead.id,
          leadName: selectedLead.name,
          leadCompany: selectedLead.company,
          leadEmail: selectedLead.email,
          customerType: campaignSettings.customerType
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('📧 Email generation response:', data)
        if (data.emails && Object.keys(data.emails).length > 0) {
          // Log each email to verify structure
          Object.entries(data.emails).forEach(([key, email]: [string, any]) => {
            console.log(`📧 ${key}:`, {
              subject: email.subject,
              body: email.body?.substring(0, 100) + '...',
              html: email.html?.substring(0, 100) + '...',
              hasHtml: !!email.html
            })
          })
          
          setEmails(data.emails)
          toast.success(`${campaignSettings.emailSequenceLength} personalized emails generated from research!`)
        } else {
          toast.error('No emails were generated. Please check the response.')
        }
      } else {
        const errorText = await response.text()
        console.error('Email generation error response:', errorText)
        try {
          const error = JSON.parse(errorText)
          toast.error(`Failed to generate emails: ${error.error}`)
        } catch {
          toast.error(`Failed to generate emails: ${response.status} ${response.statusText}`)
        }
      }
    } catch (error) {
      console.error('Error generating emails from comet research:', error)
      toast.error('Failed to generate emails from research')
    } finally {
      setLoading(false)
    }
  }

  const sendEmailDirectly = async (emailKey: string) => {
    if (!selectedLead) {
      toast.error('Please select a lead first')
      return
    }

    if (!emails[emailKey]) {
      toast.error('No email content found')
      return
    }

    setSendingEmails(prev => ({ ...prev, [emailKey]: true }))

    try {
      const emailData = emails[emailKey]
      const delaySetting = emailSchedules[emailKey] || 'now'
      
      // Use Resend's natural language scheduling
      let scheduledTime = null
      let isScheduled = false
      
      if (delaySetting !== 'now') {
        scheduledTime = delaySetting
        isScheduled = true
      }
      
      // Step 1: Post to Firestore first (if CLOUD_FUNCTION_URL is configured)
      if (CLOUD_FUNCTION_URL && CLOUD_FUNCTION_URL !== 'https://us-central1-your-project.cloudfunctions.net/post_email') {
        try {
          const firestorePayload = {
            subject: emailData.subject,
            html_content: emailData.html || emailData.body, // Use HTML if available
            lead_email: selectedLead.email,
            lead_name: selectedLead.name,
            lead_company: selectedLead.company,
            lead_id: selectedLead.id,
            status: isScheduled ? 'scheduled' : 'sent',
            scheduled_time: scheduledTime,
            email_type: emailKey,
            created_at: new Date().toISOString()
          }

          console.log('📤 Posting to Firestore:', firestorePayload)

          const firestoreResponse = await fetch(CLOUD_FUNCTION_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(firestorePayload)
          })

          if (!firestoreResponse.ok) {
            console.warn('⚠️ Firestore post failed, but continuing with email send')
          } else {
            const firestoreResult = await firestoreResponse.json()
            console.log('✅ Posted to Firestore:', firestoreResult)
          }
        } catch (firestoreError) {
          console.warn('⚠️ Firestore error, but continuing with email send:', firestoreError)
        }
      }
      
      // Step 2: Send via our API
      const resendPayload = {
        to: selectedLead.email,
        subject: emailData.subject,
        html_content: emailData.html || emailData.body, // Use HTML if available
        lead_name: selectedLead.name,
        lead_company: selectedLead.company,
        lead_id: selectedLead.id,
        scheduled_time: scheduledTime
      }

      // Validate the payload
      if (!resendPayload.to || !resendPayload.subject || !resendPayload.html_content) {
        console.error('❌ Invalid payload:', resendPayload)
        console.error('❌ Email data structure:', emailData)
        console.error('❌ Selected lead:', selectedLead)
        toast.error('Invalid email data. Please check the console for details.')
        return
      }

      // Log the exact payload being sent
      console.log('📤 Final payload being sent to API:', JSON.stringify(resendPayload, null, 2))

      console.log('📤 Sending email via API:', {
        ...resendPayload,
        scheduled_time: scheduledTime,
        isScheduled: isScheduled,
        delaySetting: delaySetting,
        html_available: !!emailData.html
      })
      
      const resendResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resendPayload)
      })

      console.log('📥 API response status:', resendResponse.status)
      console.log('📥 API response headers:', Object.fromEntries(resendResponse.headers.entries()))

      if (resendResponse.ok) {
        const resendResult = await resendResponse.json()
        console.log('✅ Email sent successfully:', resendResult)
        
        if (isScheduled) {
          toast.success(`${emailKey} scheduled ${scheduledTime} successfully!`)
        } else {
          toast.success(`${emailKey} sent immediately!`)
        }
      } else {
        const errorText = await resendResponse.text()
        console.error('❌ Email send error response:', errorText)
        console.error('❌ Response status:', resendResponse.status)
        console.error('❌ Response statusText:', resendResponse.statusText)
        
        try {
          const error = JSON.parse(errorText)
          toast.error(`Failed to send email: ${error.error}`)
        } catch {
          toast.error(`Failed to send email: ${resendResponse.status} ${resendResponse.statusText}`)
        }
      }
    } catch (error) {
      console.error('❌ Error sending email:', error)
      toast.error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSendingEmails(prev => ({ ...prev, [emailKey]: false }))
    }
  }

  const postEmail = async (emailKey: string) => {
    if (!selectedLead) {
      toast.error('Please select a lead first')
      return
    }

    const emailData = emails[emailKey]
    if (!emailData) {
      toast.error('Email not found')
      return
    }

    setLoading(true)
    try {
      const payload = {
        subject: emailData.subject,
        html_content: emailData.body,
        lead_email: selectedLead.email,
        lead_name: selectedLead.name,
        lead_company: selectedLead.company,
        lead_id: selectedLead.id,
        email_type: emailKey,
        created_at: new Date().toISOString()
      }

      const response = await fetch(CLOUD_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`Failed to post ${emailKey}`)
      }

      toast.success(`${emailKey} posted to Firestore successfully!`)
    } catch (error) {
      console.error('Error posting email:', error)
      toast.error('Failed to post email')
    } finally {
      setLoading(false)
    }
  }

  const postAllEmails = async () => {
    if (!selectedLead) {
      toast.error('Please select a lead first')
      return
    }

    if (Object.keys(emails).length === 0) {
      toast.error('No emails to post')
      return
    }

    setLoading(true)
    try {
      for (const [emailKey, emailData] of Object.entries(emails)) {
        const payload = {
          subject: emailData.subject,
          html_content: emailData.body,
          lead_email: selectedLead.email,
          lead_name: selectedLead.name,
          lead_company: selectedLead.company,
          lead_id: selectedLead.id,
          email_type: emailKey,
          created_at: new Date().toISOString()
        }

        const response = await fetch(CLOUD_FUNCTION_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          throw new Error(`Failed to post ${emailKey}`)
        }
      }

      toast.success('All emails posted to Firestore successfully!')
    } catch (error) {
      console.error('Error posting emails:', error)
      toast.error('Failed to post emails')
    } finally {
      setLoading(false)
    }
  }

  const createEmailTemplate = (emailKey: string, emailData: EmailData) => {
    // Get selected lead for personalization
    const currentLead = leads.find(lead => lead.id === selectedLead?.id) || selectedLead
    
    // Create personalized header based on company information
    const getPersonalizedHeader = () => {
      if (!currentLead) {
        return {
          title: "More Clients • Save Time • Better Care",
          subtitle: "AI-powered solutions for home care agencies"
        }
      }
      
      const company = currentLead.company || ''
      const position = currentLead.position || ''
      const type = currentLead.type || ''
      const facilityType = currentLead.facility_type || ''
      
      // Customize based on company type and position
      if (type === 'home-care-agency' || facilityType === 'home-care-agency') {
        return {
          title: "More Clients • Save Time • Better Care",
          subtitle: `Helping ${company} grow faster with AI-powered solutions`
        }
      } else if (type === 'adult-care-homes' || facilityType === 'adult-care-homes') {
        return {
          title: "Streamline Operations • Reduce Costs • Improve Care",
          subtitle: `Helping ${company} optimize efficiency and compliance`
        }
      } else if (position && position.toLowerCase().includes('director')) {
        return {
          title: "Scale Growth • Automate Admin • Enhance Quality",
          subtitle: `Supporting ${company}'s leadership with proven solutions`
        }
      } else if (position && position.toLowerCase().includes('owner')) {
        return {
          title: "Grow Revenue • Save Time • Build Trust",
          subtitle: `Partnering with ${company} to scale and succeed`
        }
      } else {
        return {
          title: "More Clients • Save Time • Better Care",
          subtitle: `Supporting ${company} with AI-powered growth solutions`
        }
      }
    }
    
    const personalizedHeader = getPersonalizedHeader()

    const firstName = selectedLead?.name?.split(' ')[0] || 'there'
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/unsubscribe?email=${encodeURIComponent(selectedLead?.email || '')}&id=${selectedLead?.id || ''}`
    
    // Process email body content
    let processedContent = emailData.body
      .replace(/^\[|\]$/g, '') // Remove outer brackets
      .replace(/\[([^\]]*)\]/g, '$1') // Remove inner brackets
      .replace(/Addis Care/g, '<a href="https://www.addiscare.ai" style="color: #667eea; text-decoration: none;">Addis Care</a>') // Make Addis Care a link

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${emailData.subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 30px; text-align: center;">
          <div style="margin-bottom: 20px;">
            <img src="https://drive.google.com/uc?export=view&id=1iRPRqtYsUEE1o2R3hpLn_C2p4AOTV0t0" alt="" style="height: 70px; width: auto; display: block; margin: 0 auto;">
          </div>
          <h1 style="color: #666; margin: 0; font-size: 20px; font-weight: 300;">${personalizedHeader.title}</h1>
          <p style="color: #888; margin: 5px 0 0 0; font-size: 14px; font-weight: 300;">${personalizedHeader.subtitle}</p>
        </div>
        
        <!-- Email Content -->
        <div style="padding: 40px 30px;">
          <p style="margin: 0 0 20px 0; font-size: 16px; color: #333;">
            Hi <strong>${firstName}</strong>,
          </p>
          
          <div style="font-size: 16px; color: #333; line-height: 1.6;">
            ${processedContent}
          </div>
          
          <p style="margin: 20px 0 0 0; font-size: 16px; color: #333;">
            Best regards,<br>
            <strong>Nolan Singroy</strong>
          </p>
        </div>
        
        <!-- Signature -->
        <div style="background-color: #f8f9fa; padding: 30px; border-top: 1px solid #e9ecef;">
          <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <div style="width: 60px; height: 60px; border-radius: 50%; overflow: hidden; margin-right: 20px; border: 2px solid #667eea;">
              <img src="https://drive.google.com/uc?export=view&id=1iRPRqtYsUEE1o2R3hpLn_C2p4AOTV0t0" alt="Nolan Singroy" style="width: 100%; height: 100%; object-fit: cover;">
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
              <a href="${unsubscribeUrl}" style="color: #667eea; text-decoration: none; font-size: 11px;">
                📧 Unsubscribe from emails
              </a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Research & Email Generation</h1>
          <p className="text-gray-600">Generate personalized emails using AI research</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-gray-600">Research Ready</div>
            <div className="text-lg font-semibold text-green-600">
              {filteredLeads.filter(lead => lead.linkedin || lead.website).length}
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">
            {filteredLeads.length} total leads
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="home-care-agency">Home Care Agency</SelectItem>
                  <SelectItem value="adult-care-homes">Adult Care Homes</SelectItem>
                  <SelectItem value="ccrc">CCRC</SelectItem>
                  <SelectItem value="alf">ALF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Has Email</label>
              <Select value={hasEmailFilter} onValueChange={setHasEmailFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Leads</SelectItem>
                  <SelectItem value="has-email">Has Email</SelectItem>
                  <SelectItem value="no-email">No Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Research Data</label>
              <Select value={hasResearchDataFilter} onValueChange={setHasResearchDataFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Leads</SelectItem>
                  <SelectItem value="has-research-data">Has LinkedIn/Website</SelectItem>
                  <SelectItem value="no-research-data">No Research Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={fetchLeads}
                variant="outline"
                className="w-full"
              >
                <Search className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Lead</CardTitle>
            <CardDescription>Choose a lead to generate personalized emails</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {!mounted ? (
                <div className="text-center text-gray-500 py-8">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Initializing...</p>
                </div>
              ) : loading ? (
                <div className="text-center text-gray-500 py-8">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Loading leads...</p>
                </div>
              ) : leads.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No leads found</p>
                  <p className="text-sm">Try refreshing or check your connection</p>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Search className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No leads match your current filters</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedLead?.id === lead.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{lead.name}</h3>
                      <p className="text-sm text-gray-600">{lead.company}</p>
                      <p className="text-sm text-gray-500">{lead.position}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {lead.type || lead.facility_type}
                        </Badge>
                        {lead.email && (
                          <Badge variant="secondary" className="text-xs">
                            <Mail className="h-3 w-3 mr-1" />
                            Has Email
                          </Badge>
                        )}
                        {(lead.linkedin || lead.website) && (
                          <Badge variant="default" className="text-xs bg-green-100 text-green-800 border-green-200">
                            🔍 Research Ready
                          </Badge>
                        )}
                        {lead.status && (
                          <Badge variant="outline" className="text-xs">
                            {lead.status}
                          </Badge>
                        )}
                        {lead.assigned_to && (
                          <Badge variant="outline" className="text-xs">
                            👤 {lead.assigned_to}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {lead.email && (
                        <Mail className="h-4 w-4 text-gray-400" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          openLeadDetail(lead)
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Campaign Generation */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Generation</CardTitle>
            <CardDescription>Generate comet prompts and research leads</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedLead ? (
              <div className="space-y-4">
                {/* Research Data Warning */}
                {!selectedLead.linkedin && !selectedLead.website ? (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="text-yellow-600 text-sm">⚠️</div>
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">Limited Personalization Available</p>
                        <p className="text-xs mt-1">This lead has no LinkedIn profile or website. Personalized emails will be less effective without research data.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="text-green-600 text-sm">✅</div>
                      <div className="text-sm text-green-800">
                        <p className="font-medium">Research Ready</p>
                        <p className="text-xs mt-1">This lead has research data available for personalized outreach.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium">Campaign Days</label>
                  <Select 
                    value={campaignDays.toString()} 
                    onValueChange={(value) => setCampaignDays(parseInt(value))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3-Day Campaign</SelectItem>
                      <SelectItem value="5">5-Day Campaign</SelectItem>
                      <SelectItem value="7">7-Day Campaign</SelectItem>
                      <SelectItem value="10">10-Day Campaign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={() => setShowCampaignModal(true)}
                  className={`w-full ${
                    selectedLead.linkedin || selectedLead.website 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!selectedLead}
                >
                  🚀 Generate Comet Prompt
                  {!selectedLead.linkedin && !selectedLead.website && (
                    <span className="block text-xs mt-1 opacity-75">(Limited personalization)</span>
                  )}
                </Button>

                {cometPrompt && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Generated Comet Prompt:</p>
                    <p className="text-sm">{cometPrompt}</p>
                  </div>
                )}

                {/* Research Input Section - Always Visible */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-sm mb-3 text-blue-900">📋 Paste Your Research Findings</h4>
                  <p className="text-xs text-blue-700 mb-3">
                    Copy the research findings from your comet research tool and paste them below to generate personalized emails.
                  </p>
                  <Textarea
                    placeholder="Paste your research findings here... (e.g., company overview, pain points, personalization opportunities, etc.)"
                    value={cometContent}
                    onChange={(e) => setCometContent(e.target.value)}
                    rows={6}
                    className="mb-3"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={generateEmailsFromComet}
                      disabled={!cometContent.trim() || loading}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        `🚀 Generate ${campaignSettings.emailSequenceLength} Emails from Research`
                      )}
                    </Button>
                    <Button
                      onClick={() => setCometContent('')}
                      variant="outline"
                      size="sm"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Target className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Select a lead to generate campaign prompts</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Campaign Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Settings</CardTitle>
            <CardDescription>Configure your email campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Customer Type</label>
              <Select 
                value={campaignSettings.customerType} 
                onValueChange={(value) => setCampaignSettings(prev => ({ ...prev, customerType: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home-care-agency">Home Care Agency</SelectItem>
                  <SelectItem value="adult-care-homes">Adult Care Homes</SelectItem>
                  <SelectItem value="ccrc">CCRC</SelectItem>
                  <SelectItem value="alf">ALF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Email Sequence Length</label>
              <Select 
                value={campaignSettings.emailSequenceLength.toString()} 
                onValueChange={(value) => setCampaignSettings(prev => ({ ...prev, emailSequenceLength: parseInt(value) }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Email</SelectItem>
                  <SelectItem value="2">2 Emails</SelectItem>
                  <SelectItem value="3">3 Emails</SelectItem>
                  <SelectItem value="4">4 Emails</SelectItem>
                  <SelectItem value="5">5 Emails</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={generateEmails}
                disabled={!selectedLead || loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Emails with Comet Research'
                )}
              </Button>
              
              <Button 
                onClick={generateEmailsWithGemini}
                disabled={!selectedLead || loading}
                variant="outline"
                className="w-full"
              >
                Generate Emails with Gemini Directly
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated Emails */}
      {Object.keys(emails).length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generated Emails</CardTitle>
                <CardDescription>Review and send your personalized emails</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">View Mode:</label>
                <Select 
                  value={emailViewMode} 
                  onValueChange={(value: 'text' | 'react' | 'html') => setEmailViewMode(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Plain Text</SelectItem>
                    <SelectItem value="react">React Email</SelectItem>
                    <SelectItem value="html">HTML Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(emails).map(([emailKey, emailData]) => (
              <div key={emailKey} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{emailKey}</h3>
                    <p className="text-sm text-gray-600">Subject: {emailData.subject}</p>
                  </div>
                  <Badge variant="outline">{emailKey.toLowerCase().replace(' ', '_')}</Badge>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Subject:</label>
                    <Input 
                      value={emailData.subject}
                      onChange={(e) => setEmails(prev => ({
                        ...prev,
                        [emailKey]: { ...prev[emailKey], subject: e.target.value }
                      }))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Email Content:</label>
                    {emailViewMode === 'text' && (
                      <Textarea 
                        value={emailData.body}
                        onChange={(e) => setEmails(prev => ({
                          ...prev,
                          [emailKey]: { ...prev[emailKey], body: e.target.value }
                        }))}
                        className="mt-1 min-h-[200px]"
                      />
                    )}
                    {emailViewMode === 'react' && (
                      <div className="mt-1 p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">React Email Component</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigator.clipboard.writeText(generateReactEmailComponent(emailKey, selectedLead?.name || '', selectedLead?.company || '', campaignSettings.customerType, emailData.body))}
                          >
                            Copy Code
                          </Button>
                        </div>
                        <pre className="text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap">
                          {generateReactEmailComponent(emailKey, selectedLead?.name || '', selectedLead?.company || '', campaignSettings.customerType, emailData.body)}
                        </pre>
                      </div>
                    )}
                    {emailViewMode === 'html' && (
                      <div className="mt-1 space-y-4">
                        {/* HTML View Toggle */}
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium">HTML View:</label>
                          <Select 
                            value={htmlViewMode} 
                            onValueChange={(value: 'preview' | 'code') => setHtmlViewMode(value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="preview">Preview</SelectItem>
                              <SelectItem value="code">Code</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* HTML Preview */}
                        {htmlViewMode === 'preview' && (
                          <div className="p-4 bg-white rounded-lg border">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-gray-700">📧 Email Preview</span>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const newWindow = window.open('', '_blank')
                                    if (newWindow) {
                                      newWindow.document.write(emailData.html || '')
                                      newWindow.document.close()
                                    }
                                  }}
                                >
                                  Open in New Tab
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigator.clipboard.writeText(emailData.html || '')}
                                >
                                  Copy HTML
                                </Button>
                              </div>
                            </div>
                            <div className="border rounded-lg overflow-hidden">
                              <iframe
                                srcDoc={emailData.html || ''}
                                className="w-full h-96 border-0"
                                title="Email Preview"
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* HTML Code */}
                        {htmlViewMode === 'code' && (
                          <div className="p-4 bg-gray-50 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">HTML Code</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigator.clipboard.writeText(emailData.html || '')}
                              >
                                Copy Code
                              </Button>
                            </div>
                            <div className="text-xs text-gray-600 overflow-x-auto">
                              <pre className="whitespace-pre-wrap">{emailData.html || 'HTML not available'}</pre>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {/* Scheduling Options */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Schedule:</label>
                      <Select 
                        value={emailSchedules[emailKey] || 'now'} 
                        onValueChange={(value) => setEmailSchedules(prev => ({ ...prev, [emailKey]: value }))}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="now">Send Now</SelectItem>
                          <SelectItem value="in 1 hour">In 1 Hour</SelectItem>
                          <SelectItem value="in 2 hours">In 2 Hours</SelectItem>
                          <SelectItem value="in 4 hours">In 4 Hours</SelectItem>
                          <SelectItem value="in 1 day">In 1 Day</SelectItem>
                          <SelectItem value="in 2 days">In 2 Days</SelectItem>
                          <SelectItem value="in 1 week">In 1 Week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => postEmail(emailKey)}
                        size="sm"
                        variant="outline"
                      >
                        Post to Firestore Only
                      </Button>
                      
                      <Button 
                        onClick={() => sendEmailDirectly(emailKey)}
                        size="sm"
                        disabled={sendingEmails[emailKey]}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {sendingEmails[emailKey] ? 'Sending...' : 'Send via Resend'}
                      </Button>
                      
                      <Button 
                        onClick={() => {
                          console.log('🧪 Testing email data for:', emailKey)
                          console.log('📧 Email data:', emails[emailKey])
                          console.log('👤 Selected lead:', selectedLead)
                          console.log('⚙️ Campaign settings:', campaignSettings)
                        }}
                        size="sm"
                        variant="outline"
                      >
                        🧪 Debug
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t space-y-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Default Schedule for All:</label>
                <Select 
                  value={emailSchedules['all'] || 'now'} 
                  onValueChange={(value) => {
                    const newSchedules: { [key: string]: string } = {}
                    Object.keys(emails).forEach(key => {
                      newSchedules[key] = value
                    })
                    setEmailSchedules(prev => ({ ...prev, ...newSchedules, all: value }))
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Send Now</SelectItem>
                    <SelectItem value="in 1 hour">In 1 Hour</SelectItem>
                    <SelectItem value="in 2 hours">In 2 Hours</SelectItem>
                    <SelectItem value="in 4 hours">In 4 Hours</SelectItem>
                    <SelectItem value="in 1 day">In 1 Day</SelectItem>
                    <SelectItem value="in 2 days">In 2 Days</SelectItem>
                    <SelectItem value="in 1 week">In 1 Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={postAllEmails}
                  className="flex-1"
                  size="lg"
                  variant="outline"
                >
                  🚀 Post All to Firestore Only
                </Button>
                
                <Button 
                  onClick={async () => {
                    // Check if any emails are scheduled for delays
                    const hasDelays = Object.values(emailSchedules).some(schedule => schedule !== 'now')
                    
                    if (hasDelays) {
                      const confirmSend = window.confirm(
                        `You have scheduled delays for some emails. This will send:\n` +
                        Object.entries(emailSchedules).map(([key, schedule]) => 
                          `• ${key}: ${schedule}`
                        ).join('\n') +
                        `\n\nContinue with scheduled sending?`
                      )
                      if (!confirmSend) return
                    }
                    
                    for (const emailKey of Object.keys(emails)) {
                      await sendEmailDirectly(emailKey)
                      // Small delay between API calls
                      await new Promise(resolve => setTimeout(resolve, 1000))
                    }
                  }}
                  className="flex-1"
                  size="lg"
                  disabled={loading || Object.keys(emails).length === 0}
                >
                  📧 Send All via Resend
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Generate Comet Prompt</h2>
              <Button
                onClick={() => setShowCampaignModal(false)}
                variant="ghost"
                size="sm"
              >
                ✕
              </Button>
            </div>

            {selectedLead && (
              <div className="space-y-6">
                {/* Lead Information */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Selected Lead</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {selectedLead.name}
                    </div>
                    <div>
                      <span className="font-medium">Company:</span> {selectedLead.company}
                    </div>
                    <div>
                      <span className="font-medium">Position:</span> {selectedLead.position || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {selectedLead.type || selectedLead.facility_type || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Campaign Configuration */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Campaign Duration</label>
                    <Select 
                      value={campaignDays.toString()} 
                      onValueChange={(value) => setCampaignDays(parseInt(value))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3-Day Campaign</SelectItem>
                        <SelectItem value="5">5-Day Campaign</SelectItem>
                        <SelectItem value="7">7-Day Campaign</SelectItem>
                        <SelectItem value="10">10-Day Campaign</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Research Instructions</label>
                    <Textarea
                      placeholder="Add specific research instructions or focus areas for this lead..."
                      value={researchPrompt}
                      onChange={(e) => setResearchPrompt(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={generateCometPrompt}
                      disabled={generatingCometPrompt}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      {generatingCometPrompt ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          🚀 Generate Comet Prompt
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => setShowCampaignModal(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>

                {/* Generated Comet Prompt Display */}
                {cometPrompt && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">Generated Comet Prompt</h3>
                    <div className="bg-white p-3 rounded border text-sm text-gray-700 whitespace-pre-wrap">
                      {cometPrompt}
                    </div>
                    <div className="mt-3 text-xs text-blue-600">
                      💡 Use this prompt with your research tools to gather personalized information about the lead's LinkedIn and company.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      {showLeadDetail && selectedLeadDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Lead Details - {selectedLeadDetail.name}</h2>
              <Button
                onClick={() => setShowLeadDetail(false)}
                variant="ghost"
                size="sm"
              >
                ✕
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Panel - Contact Details */}
              <div className="space-y-6">
                {/* Contact Header */}
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">
                      {selectedLeadDetail.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold">{selectedLeadDetail.name}</h3>
                  <p className="text-gray-600">{selectedLeadDetail.position}</p>
                  <p className="text-blue-600 font-medium">{selectedLeadDetail.company}</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="flex flex-col items-center py-3">
                    <Mail className="h-5 w-5 mb-1" />
                    <span className="text-xs">Email</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center py-3">
                    <Calendar className="h-5 w-5 mb-1" />
                    <span className="text-xs">Meeting</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center py-3">
                    <Building className="h-5 w-5 mb-1" />
                    <span className="text-xs">Research</span>
                  </Button>
                </div>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About this contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedLeadDetail.email || '--'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedLeadDetail.website || '--'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedLeadDetail.assigned_to || '--'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedLeadDetail.created_at ? new Date(selectedLeadDetail.created_at).toLocaleDateString() : '--'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {selectedLeadDetail.type || selectedLeadDetail.facility_type}
                      </Badge>
                    </div>
                    {selectedLeadDetail.status && (
                      <div className="flex items-center gap-3">
                        <Badge variant="default" className="text-xs">
                          {selectedLeadDetail.status}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel - Activity Timeline & Campaign Metrics */}
              <div className="space-y-6">
                {/* Campaign Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Campaign Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Funnel Chart */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">ENROLLED</span>
                        <span className="text-sm text-gray-600">{campaignMetrics.enrolled}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-purple-600 h-3 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">OPENED</span>
                        <span className="text-sm text-gray-600">{campaignMetrics.opened}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-purple-600 h-3 rounded-full" style={{ width: `${(campaignMetrics.opened / campaignMetrics.enrolled) * 100}%` }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">CLICKED</span>
                        <span className="text-sm text-gray-600">{campaignMetrics.clicked}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-purple-600 h-3 rounded-full" style={{ width: `${(campaignMetrics.clicked / campaignMetrics.enrolled) * 100}%` }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">REPLIED</span>
                        <span className="text-sm text-gray-600">{campaignMetrics.replied}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-purple-600 h-3 rounded-full" style={{ width: `${(campaignMetrics.replied / campaignMetrics.enrolled) * 100}%` }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">MEETINGS</span>
                        <span className="text-sm text-gray-600">{campaignMetrics.meetings}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-purple-600 h-3 rounded-full" style={{ width: `${(campaignMetrics.meetings / campaignMetrics.enrolled) * 100}%` }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Activity Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Sample Activities - Replace with real data */}
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Email sent</p>
                          <p className="text-xs text-gray-500">Campaign email #1 sent via Resend</p>
                          <p className="text-xs text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Email opened</p>
                          <p className="text-xs text-gray-500">Lead opened the email</p>
                          <p className="text-xs text-gray-400">1 hour ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Campaign created</p>
                          <p className="text-xs text-gray-500">3-day email sequence created</p>
                          <p className="text-xs text-gray-400">3 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
