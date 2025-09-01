'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  Send, 
  Mail, 
  MessageSquare, 
  ThumbsUp,
  Download,
  ChevronDown,
  TrendingUp
} from 'lucide-react'

interface MetricCard {
  title: string
  value: string
  icon: React.ReactNode
  description?: string
}

const emailMetrics: MetricCard[] = [
  {
    title: 'Total Sent',
    value: '0',
    icon: <Send className="h-5 w-5" />
  },
  {
    title: 'Drafts Sent',
    value: '0',
    icon: <Mail className="h-5 w-5" />
  },
  {
    title: 'Open Rate',
    value: '0.00%',
    icon: <Mail className="h-5 w-5" />
  },
  {
    title: 'Reply Rate',
    value: '0.00%',
    icon: <MessageSquare className="h-5 w-5" />
  },
  {
    title: 'Interested/Inquiries',
    value: '0',
    icon: <ThumbsUp className="h-5 w-5" />
  }
]

const navigation = [
  { name: 'Overview', href: '#', icon: <BarChart3 className="h-4 w-4" />, active: false },
  { name: 'Outreach', href: '#', icon: <Send className="h-4 w-4" />, active: true },
  { name: 'Enrichment', href: '#', icon: <TrendingUp className="h-4 w-4" />, active: false },
  { name: 'CRM Pushes', href: '#', icon: <TrendingUp className="h-4 w-4" />, active: false }
]

export default function OutreachPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 4 weeks')
  const [activeTab, setActiveTab] = useState('email')

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Outreach</h1>
          <p className="text-gray-600">Email and LinkedIn outreach performance metrics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            {selectedPeriod}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
        {navigation.map((item) => (
          <button
            key={item.name}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              item.active
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {item.icon}
            <span className="ml-2">{item.name}</span>
          </button>
        ))}
      </div>

      {/* Outreach Type Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
        <button
          onClick={() => setActiveTab('email')}
          className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'email'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Email Outreach
        </button>
        <button
          onClick={() => setActiveTab('linkedin')}
          className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'linkedin'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          LinkedIn Outreach
        </button>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {emailMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <div className="p-2 bg-gray-100 rounded-lg">
                  {metric.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Email Outreach Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Analytics Will Be Available Soon
            </h3>
            <p className="text-gray-600 max-w-md">
              Once your campaigns have been running for a while, you'll see detailed analytics here. 
              Start your first campaign to begin gathering insights.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
