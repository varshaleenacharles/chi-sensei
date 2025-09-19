import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target,
  Calendar,
  Users,
  DollarSign,
  Activity,
  Zap,
  Bell,
  FileText
} from 'lucide-react';
import { Project, TimelinePhase } from './ProjectTimeline';

interface AnalyticsData {
  completionRate: number;
  averageDelay: number;
  budgetVariance: number;
  riskScore: number;
  upcomingDeadlines: number;
  overdueItems: number;
  departmentPerformance: {
    department: string;
    completionRate: number;
    averageDelay: number;
    riskLevel: 'low' | 'medium' | 'high';
  }[];
  historicalTrends: {
    month: string;
    completionRate: number;
    budgetUtilization: number;
    riskScore: number;
  }[];
  forecastData: {
    phase: string;
    predictedCompletion: string;
    confidence: number;
    riskFactors: string[];
  }[];
}

interface TimelineAnalyticsProps {
  projects: Project[];
  currentRole: string;
}

const TimelineAnalytics: React.FC<TimelineAnalyticsProps> = ({ projects, currentRole }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30d' | '90d' | '1y'>('90d');

  // Mock analytics data
  useEffect(() => {
    const mockData: AnalyticsData = {
      completionRate: 68,
      averageDelay: 12, // days
      budgetVariance: -5.2, // percentage
      riskScore: 6.5, // out of 10
      upcomingDeadlines: 8,
      overdueItems: 3,
      departmentPerformance: [
        {
          department: 'Finance',
          completionRate: 85,
          averageDelay: 5,
          riskLevel: 'low'
        },
        {
          department: 'Projects',
          completionRate: 72,
          averageDelay: 15,
          riskLevel: 'medium'
        },
        {
          department: 'Systems & Operations',
          completionRate: 60,
          averageDelay: 20,
          riskLevel: 'high'
        },
        {
          department: 'Health & Safety',
          completionRate: 90,
          averageDelay: 2,
          riskLevel: 'low'
        }
      ],
      historicalTrends: [
        { month: 'Jan', completionRate: 45, budgetUtilization: 15, riskScore: 7.2 },
        { month: 'Feb', completionRate: 52, budgetUtilization: 28, riskScore: 6.8 },
        { month: 'Mar', completionRate: 58, budgetUtilization: 35, riskScore: 6.5 },
        { month: 'Apr', completionRate: 62, budgetUtilization: 42, riskScore: 6.2 },
        { month: 'May', completionRate: 65, budgetUtilization: 48, riskScore: 6.0 },
        { month: 'Jun', completionRate: 68, budgetUtilization: 55, riskScore: 6.5 }
      ],
      forecastData: [
        {
          phase: 'Design Phase',
          predictedCompletion: '2025-10-15',
          confidence: 85,
          riskFactors: ['Resource availability', 'Weather conditions']
        },
        {
          phase: 'Procurement Phase',
          predictedCompletion: '2026-03-20',
          confidence: 72,
          riskFactors: ['Vendor delays', 'Market volatility']
        },
        {
          phase: 'Construction Phase',
          predictedCompletion: '2027-08-10',
          confidence: 65,
          riskFactors: ['Permit delays', 'Labor shortages', 'Material costs']
        }
      ]
    };
    setAnalyticsData(mockData);
  }, [selectedTimeframe]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPerformanceColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!analyticsData) return null;

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{analyticsData.completionRate}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${analyticsData.completionRate}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Overall project progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Average Delay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{analyticsData.averageDelay} days</div>
            <p className="text-xs text-muted-foreground mt-1">Behind schedule</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Budget Variance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${analyticsData.budgetVariance < 0 ? 'text-red-500' : 'text-green-500'}`}>
              {analyticsData.budgetVariance > 0 ? '+' : ''}{analyticsData.budgetVariance}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">From planned budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              analyticsData.riskScore >= 7 ? 'text-red-500' : 
              analyticsData.riskScore >= 5 ? 'text-yellow-500' : 'text-green-500'
            }`}>
              {analyticsData.riskScore}/10
            </div>
            <p className="text-xs text-muted-foreground mt-1">Project risk level</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Department Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.departmentPerformance.map((dept, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{dept.department}</h3>
                  <Badge className={getRiskColor(dept.riskLevel)}>
                    {dept.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span className={getPerformanceColor(dept.completionRate)}>
                        {dept.completionRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          dept.completionRate >= 80 ? 'bg-green-500' :
                          dept.completionRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${dept.completionRate}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Average Delay</span>
                      <span className={dept.averageDelay > 10 ? 'text-red-500' : 'text-green-500'}>
                        {dept.averageDelay} days
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {dept.averageDelay > 10 ? 'Needs attention' : 'On track'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historical Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Historical Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button
                variant={selectedTimeframe === '30d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeframe('30d')}
              >
                30 Days
              </Button>
              <Button
                variant={selectedTimeframe === '90d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeframe('90d')}
              >
                90 Days
              </Button>
              <Button
                variant={selectedTimeframe === '1y' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeframe('1y')}
              >
                1 Year
              </Button>
            </div>

            <div className="space-y-3">
              {analyticsData.historicalTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="font-medium w-12">{trend.month}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Completion:</span>
                      <span className={`font-medium ${getPerformanceColor(trend.completionRate)}`}>
                        {trend.completionRate}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Budget:</span>
                      <span className="font-medium">{trend.budgetUtilization}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Risk:</span>
                      <span className={`font-medium ${
                        trend.riskScore >= 7 ? 'text-red-500' : 
                        trend.riskScore >= 5 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {trend.riskScore}/10
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {index < analyticsData.historicalTrends.length - 1 && (
                      <>
                        {trend.completionRate < analyticsData.historicalTrends[index + 1].completionRate ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Forecasting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI-Powered Forecasting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.forecastData.map((forecast, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{forecast.phase}</h3>
                  <Badge variant={forecast.confidence >= 80 ? 'default' : 'secondary'}>
                    {forecast.confidence}% Confidence
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Predicted Completion:</span>
                    <p className="font-medium">{new Date(forecast.predictedCompletion).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Confidence Level:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            forecast.confidence >= 80 ? 'bg-green-500' :
                            forecast.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${forecast.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm">{forecast.confidence}%</span>
                    </div>
                  </div>
                </div>
                
                {forecast.riskFactors.length > 0 && (
                  <div>
                    <span className="text-sm text-muted-foreground">Risk Factors:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {forecast.riskFactors.map((factor, factorIndex) => (
                        <Badge key={factorIndex} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {analyticsData.upcomingDeadlines}
            </div>
            <p className="text-sm text-muted-foreground">Items due in next 30 days</p>
            <Button variant="outline" size="sm" className="mt-3">
              <Bell className="h-4 w-4 mr-2" />
              Set Reminders
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Overdue Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500 mb-2">
              {analyticsData.overdueItems}
            </div>
            <p className="text-sm text-muted-foreground">Items past due date</p>
            <Button variant="destructive" size="sm" className="mt-3">
              <Activity className="h-4 w-4 mr-2" />
              Take Action
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimelineAnalytics;
