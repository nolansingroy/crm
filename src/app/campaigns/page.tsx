'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Rocket, 
  Users, 
  Target, 
  Mail, 
  Calendar, 
  Settings,
  Upload,
  Globe,
  Database,
  CheckCircle,
  Circle
} from 'lucide-react'

interface CampaignType {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  beta?: boolean
}

const campaignTypes: CampaignType[] = [
  {
    id: 'precision-targeting',
    title: 'Precision Targeting',
    description: 'Customize your ideal customer profile with precision filters.',
    icon: <Target className="h-6 w-6" />
  },
  {
    id: 'linkedin-sales',
    title: 'LinkedIn Sales Navigator',
    description: 'Find leads using advanced LinkedIn filters.',
    icon: <Users className="h-6 w-6" />,
    beta: true
  },
  {
    id: 'upload-csv',
    title: '+ Upload CSV File',
    description: 'Upload a CSV file to streamline your process and import new leads.',
    icon: <Upload className="h-6 w-6" />
  },
  {
    id: 'website-traffic',
    title: 'Website Inbound Traffic',
    description: 'Identify and engage leads who visit your website.',
    icon: <Globe className="h-6 w-6" />
  },
  {
    id: 'crm',
    title: 'CRM',
    description: 'Fetch lead data from your CRM.',
    icon: <Database className="h-6 w-6" />
  }
]

const steps = [
  { id: 1, title: 'Define Your ICP', subtitle: 'Who are you selling to?', icon: <Users className="h-4 w-4" /> },
  { id: 2, title: 'Review Your Product Info', subtitle: 'What are you selling?', icon: <Target className="h-4 w-4" /> },
  { id: 3, title: 'Personalization', subtitle: 'Tailor your outreach for impact', icon: <Mail className="h-4 w-4" /> },
  { id: 4, title: 'Schedule Settings', subtitle: 'When and how to outreach?', icon: <Calendar className="h-4 w-4" /> }
]

export default function CampaignsPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedCampaignType, setSelectedCampaignType] = useState('precision-targeting')
  const [campaignName, setCampaignName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [excludeJobTitle, setExcludeJobTitle] = useState('')
  const [seniority, setSeniority] = useState('')
  const [companyNames, setCompanyNames] = useState('')

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveDraft = () => {
    // Save campaign as draft
    console.log('Saving draft...')
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveDraft}>
            Close & Save as Draft
          </Button>
          <Button onClick={handleNext}>
            Save & Next
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step.id === currentStep 
                    ? 'border-blue-600 bg-blue-600 text-white' 
                    : step.id < currentStep 
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {step.id < currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${
                    step.id === currentStep ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-400">{step.subtitle}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    step.id < currentStep ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Type Selection */}
      <Card className="mb-8">
        <CardHeader className="text-center">
          <CardTitle>Select Campaign Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaignTypes.map((type) => (
              <div
                key={type.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedCampaignType === type.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedCampaignType(type.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${
                    selectedCampaignType === type.id ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {type.icon}
                  </div>
                  {type.beta && (
                    <Badge variant="secondary" className="text-xs">BETA</Badge>
                  )}
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{type.title}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Details Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name*
            </label>
            <Input
              placeholder="Enter campaign name..."
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            />
          </div>

          {/* Filter Controls */}
          <div className="flex gap-3">
            <Button variant="outline">Load Filters</Button>
            <Button>Save Filters</Button>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Reset Filters
            </button>
          </div>

          {/* Sample Leads Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Sample Leads</h4>
            <p className="text-sm text-gray-600 mb-2">Previewing a subset of leads.</p>
            <p className="text-sm text-gray-500">0 leads found.</p>
          </div>

          {/* Targeting Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <Input
                placeholder="Type and select a suggestion (e.g., Sales Manager)"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exclude Job Titles
              </label>
              <Input
                placeholder="Type and select a suggestion (e.g., Growth)"
                value={excludeJobTitle}
                onChange={(e) => setExcludeJobTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seniority
              </label>
              <Input
                placeholder="Type and select a suggestion (e.g., Senior)"
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company/Domain Names
              </label>
              <Input
                placeholder="Enter company names or domains"
                value={companyNames}
                onChange={(e) => setCompanyNames(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentStep === 4}
        >
          {currentStep === 4 ? 'Create Campaign' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
