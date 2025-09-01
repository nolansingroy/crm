import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { prompt, lead, campaignDays } = await request.json()

    // Here you would integrate with your Gemini API
    // For now, we'll return a structured prompt that can be used for research
    
    const cometPrompt = `RESEARCH TASK: ${lead.company} - ${lead.name}

CAMPAIGN DURATION: ${campaignDays} days

RESEARCH OBJECTIVES:
1. Company Research:
   - Visit ${lead.company}'s website
   - Research their services, mission, and values
   - Identify their target market and positioning
   - Look for any recent news, press releases, or updates

2. LinkedIn Research:
   - Research ${lead.name}'s LinkedIn profile
   - Understand their role, responsibilities, and background
   - Look for their professional interests and connections
   - Identify any shared connections or mutual interests

3. Industry Research:
   - Research the ${lead.type || lead.facility_type} industry
   - Identify common challenges and pain points
   - Look for industry trends and opportunities
   - Research competitors and market positioning

4. Personalization Opportunities:
   - Find specific details about their company culture
   - Look for any multilingual or cultural focus
   - Identify potential pain points from their services
   - Find any recent achievements or milestones

RESEARCH INSTRUCTIONS:
${prompt}

OUTPUT FORMAT:
Please provide a comprehensive research summary including:
- Company overview and key services
- Lead's role and responsibilities
- Industry challenges and opportunities
- Specific personalization opportunities
- Recommended outreach angles
- Any relevant news or updates

This research will be used to create ${campaignDays} personalized emails for a multi-day outreach campaign.`

    return NextResponse.json({ 
      cometPrompt,
      success: true 
    })

  } catch (error) {
    console.error('Error generating comet prompt:', error)
    return NextResponse.json(
      { error: 'Failed to generate comet prompt' },
      { status: 500 }
    )
  }
}
