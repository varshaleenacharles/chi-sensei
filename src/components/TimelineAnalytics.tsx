import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  IndianRupee,
  Activity,
  Zap,
  Bell,
  FileText,
  LineChart,
  RefreshCw
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
    totalPhases: number;
    completedPhases: number;
    pendingPhases: number;
    overduePhases: number;
    budgetAllocated: number;
    budgetUsed: number;
    efficiency: number;
    lastActivity: string;
    teamSize: number;
    performanceTrend: 'improving' | 'stable' | 'declining';
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
  const [isDeadlinesOpen, setIsDeadlinesOpen] = useState(false);
  const [isOverdueOpen, setIsOverdueOpen] = useState(false);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<TimelinePhase[]>([]);
  const [overdueItems, setOverdueItems] = useState<TimelinePhase[]>([]);


  // Calculate analytics data from projects
  useEffect(() => {
    const allPhases = projects.flatMap(p => p.phases);
    const completedPhases = allPhases.filter(p => p.status === 'completed');
    const overduePhases = allPhases.filter(p => {
      const endDate = new Date(p.endDate);
      return endDate < new Date() && p.status !== 'completed';
    });
    const urgentPhases = allPhases.filter(p => p.status === 'urgent');
    
    // Calculate completion rate
    const completionRate = allPhases.length > 0 ? Math.round((completedPhases.length / allPhases.length) * 100 * 100) / 100 : 0;
    
    // Calculate average delay
    const delayedPhases = allPhases.filter(p => {
      const endDate = new Date(p.endDate);
      return endDate < new Date() && p.status !== 'completed';
    });
    const averageDelay = delayedPhases.length > 0 ? 
      Math.round(delayedPhases.reduce((sum, p) => {
        const endDate = new Date(p.endDate);
        const now = new Date();
        return sum + Math.max(0, Math.floor((now.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24)));
      }, 0) / delayedPhases.length) : 0;
    
    // Calculate budget variance
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    const totalActualCost = projects.reduce((sum, p) => sum + p.actualCost, 0);
    const budgetVariance = totalBudget > 0 ? Math.round(((totalActualCost - totalBudget) / totalBudget) * 100 * 10) / 10 : 0;
    
    // Calculate risk score
    const riskScore = Math.min(10, Math.max(1, (overduePhases.length * 2 + urgentPhases.length * 1.5) / Math.max(allPhases.length, 1) * 10));
    
    // Calculate department performance
    const departmentStats = new Map<string, { completed: number, total: number, delays: number }>();
    
    allPhases.forEach(phase => {
      const dept = phase.department;
      if (!departmentStats.has(dept)) {
        departmentStats.set(dept, { completed: 0, total: 0, delays: 0 });
      }
      const stats = departmentStats.get(dept)!;
      stats.total++;
      if (phase.status === 'completed') stats.completed++;
      if (phase.status === 'delayed' || (new Date(phase.endDate) < new Date() && phase.status !== 'completed')) {
        stats.delays++;
      }
    });
    
    const departmentPerformance = Array.from(departmentStats.entries()).map(([dept, stats]) => {
      const deptPhases = allPhases.filter(phase => phase.department === dept);
      const completedPhases = deptPhases.filter(phase => phase.status === 'completed');
      const pendingPhases = deptPhases.filter(phase => phase.status === 'not_started' || phase.status === 'in_progress');
      const overduePhases = deptPhases.filter(phase => {
        const phaseEnd = new Date(phase.endDate);
        return phaseEnd < new Date() && phase.status !== 'completed';
      });
      
      const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100 * 100) / 100 : 0;
      const averageDelay = Math.round(stats.delays / stats.total * 10 * 100) / 100;
      const efficiency = Math.round((completionRate / Math.max(averageDelay, 1)) * 100) / 100;
      
      // Calculate budget allocation (simulate based on department)
      const budgetAllocated = dept === 'Finance' ? 1500000000 : 
                             dept === 'Projects' ? 8000000000 : 
                             dept === 'Health & Safety' ? 500000000 :
                             dept === 'Legal' ? 300000000 : 200000000;
      
      const budgetUsed = Math.round(budgetAllocated * (completionRate / 100) * (0.7 + Math.random() * 0.3));
      
      // Determine performance trend based on recent activity
      const recentPhases = deptPhases.filter(phase => {
        const phaseDate = new Date(phase.startDate);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return phaseDate >= thirtyDaysAgo;
      });
      
      const recentCompletionRate = recentPhases.length > 0 ? 
        (recentPhases.filter(p => p.status === 'completed').length / recentPhases.length) * 100 : 0;
      
      const performanceTrend = recentCompletionRate > completionRate ? 'improving' as const :
                              recentCompletionRate < completionRate - 10 ? 'declining' as const : 'stable' as const;
      
      // Simulate team size based on department
      const teamSize = dept === 'Projects' ? 45 : 
                      dept === 'Finance' ? 25 : 
                      dept === 'Health & Safety' ? 15 :
                      dept === 'Legal' ? 8 : 12;
      
      // Simulate last activity
      const lastActivity = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString();
      
      return {
        department: dept,
        completionRate,
        averageDelay,
        riskLevel: stats.delays / stats.total > 0.3 ? 'high' as const : 
                  stats.delays / stats.total > 0.1 ? 'medium' as const : 'low' as const,
        totalPhases: stats.total,
        completedPhases: stats.completed,
        pendingPhases: pendingPhases.length,
        overduePhases: overduePhases.length,
        budgetAllocated,
        budgetUsed,
        efficiency: Math.min(100, Math.max(0, efficiency)),
        lastActivity,
        teamSize,
        performanceTrend
      };
    });
    
    // Calculate upcoming deadlines (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const upcomingDeadlinesList = allPhases.filter(phase => {
      const endDate = new Date(phase.endDate);
      return endDate > new Date() && endDate <= thirtyDaysFromNow && phase.status !== 'completed';
    });
    const upcomingDeadlines = upcomingDeadlinesList.length;
    
    // Calculate overdue items
    const overdueItemsList = allPhases.filter(phase => {
      const endDate = new Date(phase.endDate);
      return endDate < new Date() && phase.status !== 'completed';
    });
    const overdueItems = overdueItemsList.length;
    
    const mockData: AnalyticsData = {
      completionRate,
      averageDelay,
      budgetVariance,
      riskScore: Math.round(riskScore * 10) / 10,
      upcomingDeadlines,
      overdueItems: overduePhases.length,
      departmentPerformance,
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
    setUpcomingDeadlines(upcomingDeadlinesList);
    setOverdueItems(overdueItemsList);
  }, [projects]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleSetReminders = () => {
    if (upcomingDeadlines.length === 0) {
      alert('No upcoming deadlines to set reminders for');
      return;
    }
    setIsDeadlinesOpen(true);
  };

  const handleTakeAction = () => {
    if (overdueItems.length === 0) {
      alert('No overdue items to take action on');
      return;
    }
    setIsOverdueOpen(true);
  };

  const handleSendReminder = (phase: TimelinePhase) => {
    const subject = `Reminder: ${phase.name} - Due Soon`;
    const body = `
Phase: ${phase.name}
Project: ${projects.find(p => p.phases?.some(ph => ph.id === phase.id))?.name || 'Unknown Project'}
Due Date: ${new Date(phase.endDate).toLocaleDateString()}
Status: ${phase.status}
Priority: Medium

This phase is due within the next 30 days. Please ensure all tasks are completed on time.

Current Role: ${currentRole}
    `.trim();

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const handleEscalateOverdue = (phase: TimelinePhase) => {
    const subject = `URGENT: Overdue Phase - ${phase.name}`;
    const body = `
Phase: ${phase.name}
Project: ${projects.find(p => p.phases?.some(ph => ph.id === phase.id))?.name || 'Unknown Project'}
Due Date: ${new Date(phase.endDate).toLocaleDateString()} (OVERDUE)
Status: ${phase.status}
Priority: High

This phase is overdue and requires immediate attention. Please take necessary action to resolve the delay.

Current Role: ${currentRole}
    `.trim();

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const getPerformanceColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <div className="h-4 w-4 bg-gray-500 rounded-full" />;
      default: return null;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600 bg-green-100';
      case 'declining': return 'text-red-600 bg-red-100';
      case 'stable': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  };

  if (!analyticsData) return null;

  return (
    <div className="space-y-6">
      {/* Enhanced Key Metrics Overview */}
      <div className="space-y-6">
        {/* Primary Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4" />
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">{analyticsData.completionRate.toFixed(2)}%</div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                  style={{ width: `${analyticsData.completionRate}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Overall project progress</span>
                <span className="font-medium">{analyticsData.completionRate >= 80 ? 'Excellent' : 
                  analyticsData.completionRate >= 60 ? 'Good' : 'Needs Attention'}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Average Delay
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500 mb-2">{analyticsData.averageDelay.toFixed(2)} days</div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${analyticsData.averageDelay > 10 ? 'bg-red-500' : 
                  analyticsData.averageDelay > 5 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                <span className="text-xs text-muted-foreground">
                  {analyticsData.averageDelay > 10 ? 'Critical' : 
                   analyticsData.averageDelay > 5 ? 'Moderate' : 'Low'} Impact
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Behind schedule</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                Budget Variance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold mb-2 ${analyticsData.budgetVariance < 0 ? 'text-red-500' : 'text-green-500'}`}>
                {analyticsData.budgetVariance > 0 ? '+' : ''}{analyticsData.budgetVariance.toFixed(2)}%
              </div>
              <div className="flex items-center gap-2 mb-2">
                {analyticsData.budgetVariance < 0 ? 
                  <TrendingDown className="h-4 w-4 text-red-500" /> : 
                  <TrendingUp className="h-4 w-4 text-green-500" />
                }
                <span className="text-xs text-muted-foreground">
                  {analyticsData.budgetVariance < 0 ? 'Over Budget' : 'Under Budget'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">From planned budget</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Risk Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold mb-2 ${
                analyticsData.riskScore >= 7 ? 'text-red-500' : 
                analyticsData.riskScore >= 5 ? 'text-yellow-500' : 'text-green-500'
              }`}>
                {analyticsData.riskScore.toFixed(2)}/10
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full ${
                    analyticsData.riskScore >= 7 ? 'bg-red-500' : 
                    analyticsData.riskScore >= 5 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${analyticsData.riskScore * 10}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.riskScore >= 7 ? 'High Risk' : 
                 analyticsData.riskScore >= 5 ? 'Medium Risk' : 'Low Risk'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500 mb-2">{analyticsData.upcomingDeadlines}</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Next 30 days</span>
              </div>
              <p className="text-xs text-muted-foreground">Items requiring attention</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Overdue Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500 mb-2">{analyticsData.overdueItems}</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Past due date</span>
              </div>
              <p className="text-xs text-muted-foreground">Immediate action required</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500 mb-2">{projects.length}</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Currently running</span>
              </div>
              <p className="text-xs text-muted-foreground">Total active projects</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                Departments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500 mb-2">{analyticsData.departmentPerformance.length}</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Active departments</span>
              </div>
              <p className="text-xs text-muted-foreground">Participating teams</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Project Summary Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <BarChart3 className="h-5 w-5" />
            Project Summary Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-700">Project Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Projects:</span>
                  <span className="font-medium">{projects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Projects:</span>
                  <span className="font-medium text-green-600">{projects.filter(p => p.status === 'active').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completed Projects:</span>
                  <span className="font-medium text-blue-600">{projects.filter(p => p.status === 'completed').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">On Hold:</span>
                  <span className="font-medium text-yellow-600">{projects.filter(p => p.status === 'on_hold').length}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-700">Budget Overview</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Budget:</span>
                  <span className="font-medium">₹{projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Spent:</span>
                  <span className="font-medium">₹{projects.reduce((sum, p) => sum + p.actualCost, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Remaining:</span>
                  <span className="font-medium text-green-600">
                    ₹{(projects.reduce((sum, p) => sum + p.budget, 0) - projects.reduce((sum, p) => sum + p.actualCost, 0)).toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Utilization:</span>
                  <span className="font-medium">
                    {projects.length > 0 ? ((projects.reduce((sum, p) => sum + p.actualCost, 0) / projects.reduce((sum, p) => sum + p.budget, 0)) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-700">Risk Assessment</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">High Risk Projects:</span>
                  <span className="font-medium text-red-600">{projects.filter(p => p.riskLevel === 'high').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Medium Risk:</span>
                  <span className="font-medium text-yellow-600">{projects.filter(p => p.riskLevel === 'medium').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Low Risk:</span>
                  <span className="font-medium text-green-600">{projects.filter(p => p.riskLevel === 'low').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Progress:</span>
                  <span className="font-medium">
                    {projects.length > 0 ? (projects.reduce((sum, p) => sum + p.totalProgress, 0) / projects.length).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Department Performance Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">Comprehensive performance metrics, insights, and comparative analysis across all departments</p>
        </CardHeader>
        <CardContent>
          {/* Department Performance Summary */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">Performance Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {analyticsData.departmentPerformance.length}
                </div>
                <div className="text-sm text-blue-700 font-medium">Active Departments</div>
                <div className="text-xs text-blue-600 mt-1">Participating in projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {analyticsData.departmentPerformance.reduce((sum, dept) => sum + dept.completedPhases, 0)}
                </div>
                <div className="text-sm text-green-700 font-medium">Total Completed</div>
                <div className="text-xs text-green-600 mt-1">Phases across all depts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {analyticsData.departmentPerformance.reduce((sum, dept) => sum + dept.pendingPhases, 0)}
                </div>
                <div className="text-sm text-yellow-700 font-medium">In Progress</div>
                <div className="text-xs text-yellow-600 mt-1">Active phases</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {analyticsData.departmentPerformance.reduce((sum, dept) => sum + dept.overduePhases, 0)}
                </div>
                <div className="text-sm text-red-700 font-medium">Overdue</div>
                <div className="text-xs text-red-600 mt-1">Require attention</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {analyticsData.departmentPerformance.map((dept, index) => {
              // Calculate department ranking
              const sortedDepts = [...analyticsData.departmentPerformance].sort((a, b) => b.completionRate - a.completionRate);
              const rank = sortedDepts.findIndex(d => d.department === dept.department) + 1;
              const totalDepts = analyticsData.departmentPerformance.length;
              
              // Calculate performance insights
              const budgetUtilization = (dept.budgetUsed / dept.budgetAllocated) * 100;
              const avgCompletionRate = analyticsData.departmentPerformance.reduce((sum, d) => sum + d.completionRate, 0) / analyticsData.departmentPerformance.length;
              const performanceVsAvg = dept.completionRate - avgCompletionRate;
              
              return (
                <div key={index} className="p-6 border rounded-lg hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-background to-muted/20">
                  {/* Department Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          #{rank}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">{dept.department}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-muted-foreground">Team Size: {dept.teamSize} members</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">Last Activity: {dept.lastActivity}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className={`text-sm font-medium ${performanceVsAvg >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {performanceVsAvg >= 0 ? '+' : ''}{performanceVsAvg.toFixed(1)}% vs avg
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${getTrendColor(dept.performanceTrend)} px-3 py-1 flex items-center gap-1`}>
                        {getTrendIcon(dept.performanceTrend)}
                        {dept.performanceTrend.toUpperCase()}
                      </Badge>
                      <Badge className={`${getRiskColor(dept.riskLevel)} px-3 py-1`}>
                        {dept.riskLevel.toUpperCase()} RISK
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {/* Completion Rate */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Completion Rate</span>
                        <div className="text-right">
                          <span className={`font-bold text-xl ${getPerformanceColor(dept.completionRate)}`}>
                            {dept.completionRate.toFixed(1)}%
                          </span>
                          <div className="text-xs text-muted-foreground">
                            Rank #{rank} of {totalDepts}
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-700 ${
                            dept.completionRate >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                            dept.completionRate >= 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                            'bg-gradient-to-r from-red-500 to-red-600'
                          }`}
                          style={{ width: `${dept.completionRate}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          dept.completionRate >= 80 ? 'bg-green-500' :
                          dept.completionRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-xs text-muted-foreground">
                          {dept.completionRate >= 80 ? 'Excellent Performance' :
                           dept.completionRate >= 60 ? 'Good Performance' : 'Needs Improvement'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Average Delay */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Average Delay</span>
                        <div className="text-right">
                          <span className={`font-bold text-xl ${dept.averageDelay > 10 ? 'text-red-500' : 
                            dept.averageDelay > 5 ? 'text-yellow-500' : 'text-green-500'}`}>
                            {dept.averageDelay.toFixed(1)} days
                          </span>
                          <div className="text-xs text-muted-foreground">
                            {dept.averageDelay > 10 ? 'Critical' : dept.averageDelay > 5 ? 'Moderate' : 'Good'}
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-700 ${
                            dept.averageDelay > 10 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                            dept.averageDelay > 5 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                            'bg-gradient-to-r from-green-500 to-green-600'
                          }`}
                          style={{ width: `${Math.min(dept.averageDelay * 10, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          dept.averageDelay > 10 ? 'bg-red-500' :
                          dept.averageDelay > 5 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <span className="text-xs text-muted-foreground">
                          {dept.averageDelay > 10 ? 'Critical Delays' :
                           dept.averageDelay > 5 ? 'Moderate Delays' : 'On Schedule'}
                        </span>
                      </div>
                    </div>

                    {/* Efficiency Score */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Efficiency Score</span>
                        <div className="text-right">
                          <span className={`font-bold text-xl ${getPerformanceColor(dept.efficiency)}`}>
                            {dept.efficiency.toFixed(1)}%
                          </span>
                          <div className="text-xs text-muted-foreground">
                            {dept.efficiency >= 80 ? 'Excellent' : dept.efficiency >= 60 ? 'Good' : 'Poor'}
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-700 ${
                            dept.efficiency >= 80 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                            dept.efficiency >= 60 ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 
                            'bg-gradient-to-r from-orange-500 to-orange-600'
                          }`}
                          style={{ width: `${dept.efficiency}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          dept.efficiency >= 80 ? 'bg-blue-500' :
                          dept.efficiency >= 60 ? 'bg-purple-500' : 'bg-orange-500'
                        }`}></div>
                        <span className="text-xs text-muted-foreground">
                          {dept.efficiency >= 80 ? 'Highly Efficient' :
                           dept.efficiency >= 60 ? 'Moderately Efficient' : 'Low Efficiency'}
                        </span>
                      </div>
                    </div>

                    {/* Budget Utilization */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Budget Used</span>
                        <div className="text-right">
                          <span className="font-bold text-xl text-indigo-600">
                            {formatCurrency(dept.budgetUsed)}
                          </span>
                          <div className="text-xs text-muted-foreground">
                            {budgetUtilization.toFixed(1)}% utilized
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-700 ${
                            budgetUtilization >= 90 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                            budgetUtilization >= 70 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                            'bg-gradient-to-r from-indigo-500 to-indigo-600'
                          }`}
                          style={{ width: `${budgetUtilization}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          budgetUtilization >= 90 ? 'bg-red-500' :
                          budgetUtilization >= 70 ? 'bg-yellow-500' : 'bg-indigo-500'
                        }`}></div>
                        <span className="text-xs text-muted-foreground">
                          of {formatCurrency(dept.budgetAllocated)} allocated
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Phase Status Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Completed</span>
                      </div>
                      <div className="text-2xl font-bold text-green-700">{dept.completedPhases}</div>
                      <div className="text-xs text-green-600">of {dept.totalPhases} phases</div>
                      <div className="text-xs text-green-600 mt-1">
                        {dept.totalPhases > 0 ? ((dept.completedPhases / dept.totalPhases) * 100).toFixed(1) : 0}% completion
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Pending</span>
                      </div>
                      <div className="text-2xl font-bold text-yellow-700">{dept.pendingPhases}</div>
                      <div className="text-xs text-yellow-600">in progress</div>
                      <div className="text-xs text-yellow-600 mt-1">
                        {dept.totalPhases > 0 ? ((dept.pendingPhases / dept.totalPhases) * 100).toFixed(1) : 0}% pending
                      </div>
                    </div>
                    
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">Overdue</span>
                      </div>
                      <div className="text-2xl font-bold text-red-700">{dept.overduePhases}</div>
                      <div className="text-xs text-red-600">need attention</div>
                      <div className="text-xs text-red-600 mt-1">
                        {dept.totalPhases > 0 ? ((dept.overduePhases / dept.totalPhases) * 100).toFixed(1) : 0}% overdue
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Total</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-700">{dept.totalPhases}</div>
                      <div className="text-xs text-blue-600">phases assigned</div>
                      <div className="text-xs text-blue-600 mt-1">
                        {dept.teamSize} members avg
                      </div>
                    </div>
                  </div>

                  {/* Performance Insights */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Performance Insights
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Performance Ranking:</span>
                          <span className="font-medium">
                            #{rank} of {totalDepts} departments
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Budget Efficiency:</span>
                          <span className={`font-medium ${budgetUtilization >= 90 ? 'text-red-600' : budgetUtilization >= 70 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {budgetUtilization.toFixed(1)}% utilized
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Team Productivity:</span>
                          <span className="font-medium">
                            {(dept.completedPhases / dept.teamSize).toFixed(1)} phases/member
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">vs Average Performance:</span>
                          <span className={`font-medium ${performanceVsAvg >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {performanceVsAvg >= 0 ? '+' : ''}{performanceVsAvg.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Risk Level:</span>
                          <span className={`font-medium ${dept.riskLevel === 'high' ? 'text-red-600' : dept.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                            {dept.riskLevel.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Trend Direction:</span>
                          <span className={`font-medium ${dept.performanceTrend === 'improving' ? 'text-green-600' : dept.performanceTrend === 'declining' ? 'text-red-600' : 'text-gray-600'}`}>
                            {dept.performanceTrend.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-border/50">
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Send Alert
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Set Goals
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              );
            })}
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

      {/* Quick Actions & Alerts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Quick Actions & Alerts</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-lg transition-shadow border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Calendar className="h-5 w-5" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-500 mb-3">
                {analyticsData.upcomingDeadlines}
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Items due in next 30 days</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {upcomingDeadlines.length > 0 ? 
                    `${upcomingDeadlines.length} phases require attention` : 
                    'No upcoming deadlines'
                  }
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleSetReminders}
                disabled={upcomingDeadlines.length === 0}
              >
                <Bell className="h-4 w-4 mr-2" />
                {upcomingDeadlines.length === 0 ? 'No Deadlines' : 'Set Reminders'}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                Overdue Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-500 mb-3">
                {analyticsData.overdueItems}
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Items past due date</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {overdueItems.length > 0 ? 
                    `${overdueItems.length} phases need immediate action` : 
                    'All items on schedule'
                  }
                </div>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full"
                onClick={handleTakeAction}
                disabled={overdueItems.length === 0}
              >
                <Activity className="h-4 w-4 mr-2" />
                {overdueItems.length === 0 ? 'All On Track' : 'Take Action'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TimelineAnalytics;
