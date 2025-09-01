import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, html_content, lead_name, lead_company, lead_id, scheduled_time, firestore_id } = body

    if (!to || !subject || !html_content) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html_content' },
        { status: 400 }
      )
    }

    console.log('📧 Email sending request:', {
      to,
      subject,
      lead_name,
      lead_company,
      lead_id,
      scheduled_time,
      firestore_id
    })

    // Check if we have Resend API key
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY not configured')
      return NextResponse.json(
        { error: 'Resend API key not configured' },
        { status: 500 }
      )
    }

    // Prepare email data for Resend
    const emailData: any = {
      from: 'nolan@addiscare.ai', // Your verified domain
      to: [to],
      subject: subject,
      html: html_content,
      // Add custom headers for tracking
      headers: {
        'X-Lead-Name': lead_name || '',
        'X-Lead-Company': lead_company || '',
        'X-Lead-ID': lead_id || '',
        'X-Email-Type': 'outreach'
      }
    }

    // If scheduling is requested, add it
    if (scheduled_time && scheduled_time !== 'now') {
      emailData.scheduled_time = scheduled_time
    }

    console.log('📤 Sending to Resend:', {
      ...emailData,
      html_content_length: html_content.length
    })

    // Send email via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    })

    console.log('📥 Resend API response status:', resendResponse.status)

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text()
      console.error('❌ Resend API error:', errorText)
      
      try {
        const error = JSON.parse(errorText)
        return NextResponse.json(
          { error: `Resend API error: ${error.message || error.error || 'Unknown error'}` },
          { status: resendResponse.status }
        )
      } catch {
        return NextResponse.json(
          { error: `Resend API error: ${resendResponse.status} ${resendResponse.statusText}` },
          { status: resendResponse.status }
        )
      }
    }

    const resendResult = await resendResponse.json()
    console.log('✅ Resend API success:', resendResult)

    // Return success with Resend's email ID
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully via Resend',
      email_id: resendResult.id || `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      scheduled: !!scheduled_time,
      scheduled_time: scheduled_time || null,
      resend_id: resendResult.id
    })

  } catch (error) {
    console.error('❌ Error sending email:', error)
    return NextResponse.json(
      { error: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

