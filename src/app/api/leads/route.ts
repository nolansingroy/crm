import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'

export async function GET() {
  try {
    const leadsRef = db.collection('leads')
    const snapshot = await leadsRef.get()
    
    const leads: any[] = []
    snapshot.forEach((doc) => {
      leads.push({
        id: doc.id,
        ...doc.data()
      })
    })

    return NextResponse.json({ leads })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}
