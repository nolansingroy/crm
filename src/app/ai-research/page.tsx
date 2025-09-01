'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-hot-toast'
import { Loader2, Search, Mail, Calendar, Building, Users, Filter } from 'lucide-react'

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
}

interface EmailData {
  subject: string
  body: string
}

interface CampaignSettings {
  customerType: string
  emailSequenceLength: number
}

const CLOUD_FUNCTION_URL = process.env.NEXT_PUBLIC_CLOUD_FUNCTION_URL || 'https://us-central1-your-project.cloudfunctions.net/post_email'

export default function AIResearchPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [hasEmailFilter, setHasEmailFilter] = useState('all')
  const [researchPrompt, setResearchPrompt] = useState('')
  const [cometContent, setCometContent] = useState('')
  const [emails, setEmails] = useState<{ [key: string]: EmailData }>({})
  const [emailSchedules, setEmailSchedules] = useState<{ [key: string]: string }>({})
  const [sendingEmails, setSendingEmails] = useState<{ [key: string]: boolean }>({})
  const [campaignSettings, setCampaignSettings] = useState<CampaignSettings>({
    customerType: 'home-care-agency',
    emailSequenceLength: 3
  })

  // Fetch leads on component mount
  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads')
      if (response.ok) {
        const data = await response.json()
        setLeads(data)
      } else {
        console.error('Failed to fetch leads')
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || lead.type === filterType || lead.facility_type === filterType
    
    const matchesEmailFilter = hasEmailFilter === 'all' || 
                              (hasEmailFilter === 'has-email' && lead.email) ||
                              (hasEmailFilter === 'no-email' && !lead.email)
    
    return matchesSearch && matchesType && matchesEmailFilter
  })

  const generateGeminiPrompt = (lead: Lead) => {
    const basePrompt = `You are a sales research specialist for Addis Care, a modern multilingual care training platform.

RESEARCH AND DRAFT COMPLETE EMAILS for this prospect:

Company: ${lead.company}
Contact: ${lead.name} (${lead.position})
Email: ${lead.email}
Type: ${lead.type || lead.facility_type}

Key Value Propositions for Home Care Agencies:
- More clients and growth
- Save 2-4 hours/day on administrative tasks
- Better compassionate care delivery
- HIPAA secure family communication to build trust
- Effective care plans and coordination
- Streamlined compliance and training

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
- Include personalized value propositions
- DO NOT use placeholder text - write complete emails
- Make each email build on the previous one

FORMAT YOUR RESPONSE AS:
Subject: [Email Subject]
[Complete email body with proper formatting]

Subject: [Email Subject]  
[Complete email body with proper formatting]

[Continue for all ${campaignSettings.emailSequenceLength} emails]`

    return basePrompt
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

  const sendEmailDirectly = async (emailKey: string) => {
    if (!selectedLead) {
      toast.error('Please select a lead first')
      return
    }

    if (!emails[emailKey]) {
      toast.error('No email content found')
      return
    }

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
      if (!confirmSend) {
        return
      }
    }

    setSendingEmails(prev => ({ ...prev, [emailKey]: true }))

    try {
      const emailData = emails[emailKey]
      const delaySetting = emailSchedules[emailKey] || 'now'
      
      // Use Resend's natural language scheduling
      let scheduledTime = null
      let isScheduled = false
      
      if (delaySetting !== 'now') {
        // Use the natural language strings directly for Resend
        scheduledTime = delaySetting
        isScheduled = true
      }
      
      // Step 1: Post to Firestore first
      const firestorePayload = {
        subject: emailData.subject,
        html_content: emailData.body,
        lead_email: selectedLead.email,
        lead_name: selectedLead.name,
        lead_company: selectedLead.company,
        lead_id: selectedLead.id,
        status: isScheduled ? 'scheduled' : 'sent',
        scheduled_time: scheduledTime,
        email_type: emailKey,
        created_at: new Date().toISOString()
      }

      const firestoreResponse = await fetch(CLOUD_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(firestorePayload)
      })

      if (!firestoreResponse.ok) {
        throw new Error('Failed to post to Firestore')
      }

      const firestoreResult = await firestoreResponse.json()
      
      // Step 2: Send via Resend
      const resendPayload = {
        to: selectedLead.email,
        subject: emailData.subject,
        html_content: emailData.body,
        lead_name: selectedLead.name,
        lead_company: selectedLead.company,
        lead_id: selectedLead.id,
        scheduled_time: scheduledTime,
        firestore_id: firestoreResult.email_id
      }

      console.log('📤 Sending to Resend API with scheduling:', {
        ...resendPayload,
        scheduled_time: scheduledTime,
        isScheduled: isScheduled,
        delaySetting: delaySetting
      })
      
      const resendResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resendPayload)
      })

      console.log('Resend response status:', resendResponse.status)

      if (resendResponse.ok) {
        const resendResult = await resendResponse.json()
        
        // Step 3: Create or update campaign tracking
        const campaignPayload = {
          name: `${selectedLead.company} - ${campaignSettings.customerType} Campaign`,
          customerType: campaignSettings.customerType,
          leads: [selectedLead],
          emailSequence: emails,
          settings: campaignSettings
        }
        
        const campaignResponse = await fetch('/api/campaigns', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(campaignPayload)
        })
        
        if (campaignResponse.ok) {
          const campaignResult = await campaignResponse.json()
          console.log('Campaign created:', campaignResult)
        }
        
        if (isScheduled) {
          toast.success(`${emailKey} scheduled ${scheduledTime} and campaign tracking created!`)
        } else {
          toast.success(`${emailKey} sent immediately and campaign tracking created!`)
        }
      } else {
        const error = await resendResponse.json()
        console.log('Resend error response:', error)
        toast.error(`Posted to Firestore but Resend failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error('Failed to send email')
    } finally {
      setSendingEmails(prev => ({ ...prev, [emailKey]: false }))
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
        <Badge variant="secondary" className="text-sm">
          {filteredLeads.length} leads
        </Badge>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              {filteredLeads.map((lead) => (
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
                        {lead.campaign_status && (
                          <Badge variant="default" className="text-xs">
                            {lead.campaign_status}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {lead.email && (
                      <Mail className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
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
            <CardTitle>Generated Emails</CardTitle>
            <CardDescription>Review and send your personalized emails</CardDescription>
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
                    <Textarea 
                      value={emailData.body}
                      onChange={(e) => setEmails(prev => ({
                        ...prev,
                        [emailKey]: { ...prev[emailKey], body: e.target.value }
                      }))}
                      className="mt-1 min-h-[200px]"
                    />
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
    </div>
  )
}
