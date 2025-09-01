import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Mail, TrendingUp, Calendar, Rocket, Send, Target } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your CRM dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              +180 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Rocket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>Latest leads added to your CRM</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Caring Hearts Home Care</p>
                  <p className="text-xs text-muted-foreground">Added 2 hours ago</p>
                </div>
                <Badge variant="secondary">New</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Michael Chen</p>
                  <p className="text-sm text-muted-foreground">Golden Path Adult Care</p>
                  <p className="text-xs text-muted-foreground">Added 1 day ago</p>
                </div>
                <Badge variant="outline">Contacted</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Emily Rodriguez</p>
                  <p className="text-sm text-muted-foreground">Compassionate Care Solutions</p>
                  <p className="text-xs text-muted-foreground">Added 3 days ago</p>
                </div>
                <Badge variant="outline">Qualified</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Rocket className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Create New Campaign</p>
                  <p className="text-xs text-muted-foreground">Set up targeted outreach</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">AI Research</p>
                  <p className="text-xs text-muted-foreground">Generate personalized emails</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Add New Lead</p>
                  <p className="text-xs text-muted-foreground">Import or manually add leads</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <Send className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">View Outreach</p>
                  <p className="text-xs text-muted-foreground">Check campaign performance</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
