import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const id = searchParams.get('id')

    if (!email || !id) {
      return NextResponse.json(
        { error: 'Missing email or id parameter' },
        { status: 400 }
      )
    }

    // For now, just return a simple HTML page
    // This will be replaced with actual Firestore integration
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribed</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          .container { max-width: 500px; margin: 0 auto; }
          .success { color: #28a745; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="success">✅ Successfully Unsubscribed</h1>
          <p>You have been unsubscribed from our email list.</p>
          <p>If you change your mind, you can always contact us to resubscribe.</p>
        </div>
      </body>
      </html>
    `

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Error processing unsubscribe:', error)
    return NextResponse.json(
      { error: 'Failed to process unsubscribe request' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const id = searchParams.get('id')

    if (!email || !id) {
      return NextResponse.json(
        { error: 'Missing email or id parameter' },
        { status: 400 }
      )
    }

    // For now, just return 200 OK
    // This will be replaced with actual Firestore integration
    return new NextResponse('', { status: 200 })
  } catch (error) {
    console.error('Error processing unsubscribe POST:', error)
    return NextResponse.json(
      { error: 'Failed to process unsubscribe request' },
      { status: 500 }
    )
  }
}

