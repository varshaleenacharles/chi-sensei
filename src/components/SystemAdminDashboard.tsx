import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DashboardHeader from "./DashboardHeader";
import { 
  Shield, 
  Users, 
  Settings, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Server,
  Wifi,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  AlertCircle,
  TrendingUp,
  Monitor,
  BarChart3,
  Download,
  Filter,
  Calendar,
  Target,
  Zap,
  FileText,
  MessageSquare,
  Upload,
  TrendingDown,
  PieChart,
  LineChart,
  MapPin,
  Timer,
  AlertCircle as AlertCircleIcon,
  RefreshCw,
  Bell,
  User,
  LogOut
} from "lucide-react";
import heroImage from "@/assets/kmrl-hero.jpg";

interface SystemAdminDashboardProps {
  currentRole: string;
  onBackToRoleSelection: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  permissions: string[];
}

interface SystemRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  enabled: boolean;
}

interface RoleUsageData {
  role: string;
  department: string;
  activeUsers: number;
  totalSessions: number;
  avgSessionDuration: number;
  documentsViewed: number;
  documentsUploaded: number;
  commentsPosted: number;
  approvalsGiven: number;
  lastActivity: string;
  efficiencyScore: number;
}

interface WorkflowAnalytics {
  stage: string;
  totalDocuments: number;
  avgProcessingTime: number;
  bottleneckScore: number;
  successRate: number;
  commonDelays: string[];
}

interface DepartmentMetrics {
  department: string;
  totalUsers: number;
  activeUsers: number;
  documentsProcessed: number;
  avgProcessingTime: number;
  complianceRate: number;
  bottleneckStages: string[];
  topPerformers: string[];
}

interface SystemAnalytics {
  roleUsage: RoleUsageData[];
  workflowAnalytics: WorkflowAnalytics[];
  departmentMetrics: DepartmentMetrics[];
  peakUsageHours: { hour: number; users: number }[];
  featureUsage: { feature: string; usage: number; trend: 'up' | 'down' | 'stable' }[];
  errorRates: { component: string; errorRate: number; trend: 'up' | 'down' | 'stable' }[];
}

const SystemAdminDashboard = ({ currentRole, onBackToRoleSelection }: SystemAdminDashboardProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [systemRules, setSystemRules] = useState<SystemRule[]>([]);
  const [systemHealth, setSystemHealth] = useState({
    api: 'Operational',
    database: 'Operational', 
    storage: 'Warning',
    uptime: '99.9%'
  });
  const [auditLogs, setAuditLogs] = useState<Array<{
    id: string;
    timestamp: string;
    user: string;
    action: string;
    resource: string;
    status: string;
  }>>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRoleSimulator, setIsRoleSimulator] = useState(false);
  const [simulatedRole, setSimulatedRole] = useState("Staff");
  const [systemAnalytics, setSystemAnalytics] = useState<SystemAnalytics | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [isExporting, setIsExporting] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isNewRuleOpen, setIsNewRuleOpen] = useState(false);
  const [adminNotifications, setAdminNotifications] = useState<Array<{
    id: string;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    type: 'system' | 'security' | 'user' | 'performance';
  }>>([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    permissions: [] as string[]
  });
  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    trigger: "",
    action: "",
    enabled: true
  });

  useEffect(() => {
    // Mock system admin data
    const mockUsers: User[] = [
      {
        id: "1",
        name: "Rajesh Kumar",
        email: "rajesh.kumar@kmrl.gov.in",
        role: "Finance Manager", 
        department: "Finance",
        status: "Active",
        lastLogin: "2025-09-19 14:30",
        permissions: ["view", "upload", "approve", "comment"]
      },
      {
        id: "2", 
        name: "Priya Nair",
        email: "priya.nair@kmrl.gov.in",
        role: "Projects Director",
        department: "Projects", 
        status: "Active",
        lastLogin: "2025-09-19 09:15",
        permissions: ["view", "upload", "approve", "comment", "delete"]
      },
      {
        id: "3",
        name: "Suresh Menon",
        email: "suresh.menon@kmrl.gov.in", 
        role: "Safety Inspector",
        department: "Health & Safety",
        status: "Active",
        lastLogin: "2025-09-18 16:45",
        permissions: ["view", "upload", "comment"]
      },
      {
        id: "4",
        name: "Asha Thomas",
        email: "asha.thomas@kmrl.gov.in",
        role: "Legal Officer",
        department: "Legal",
        status: "Inactive",
        lastLogin: "2025-09-16 11:20",
        permissions: ["view", "upload"]
      }
    ];

    const mockRules: SystemRule[] = [
      {
        id: "1",
        name: "Auto-Escalate Overdue Documents",
        description: "Escalate documents to Urgent status after 7 days pending",
        trigger: "Pending > 7 days",
        action: "Update status to Urgent",
        enabled: true
      },
      {
        id: "2", 
        name: "Deadline Reminders",
        description: "Send notifications 3 days before compliance deadlines",
        trigger: "3 days before deadline",
        action: "Send email/push notification",
        enabled: true
      },
      {
        id: "3",
        name: "Auto-Tag by Department",
        description: "Automatically assign domain color based on file content",
        trigger: "Document upload",
        action: "Detect and tag domain",
        enabled: true
      }
    ];

    const mockAuditLogs = [
      {
        id: "1",
        timestamp: "2025-09-19 14:30:15",
        user: "Rajesh Kumar",
        action: "Document Upload", 
        resource: "Vendor Invoice #3482",
        status: "Success"
      },
      {
        id: "2",
        timestamp: "2025-09-19 13:45:22",
        user: "Priya Nair",
        action: "Status Update",
        resource: "Metro Line Extension", 
        status: "Success"
      },
      {
        id: "3",
        timestamp: "2025-09-19 12:15:18",
        user: "Unknown IP",
        action: "Failed Login",
        resource: "System Access",
        status: "Failed"
      }
    ];

    setUsers(mockUsers);
    setSystemRules(mockRules);
    setAuditLogs(mockAuditLogs);

    // Mock analytics data
    const mockAnalytics: SystemAnalytics = {
      roleUsage: [
        {
          role: "Executive",
          department: "Executive",
          activeUsers: 3,
          totalSessions: 45,
          avgSessionDuration: 25,
          documentsViewed: 120,
          documentsUploaded: 8,
          commentsPosted: 15,
          approvalsGiven: 35,
          lastActivity: "2025-09-19 14:30",
          efficiencyScore: 92
        },
        {
          role: "Director",
          department: "Projects",
          activeUsers: 5,
          totalSessions: 180,
          avgSessionDuration: 45,
          documentsViewed: 450,
          documentsUploaded: 25,
          commentsPosted: 120,
          approvalsGiven: 85,
          lastActivity: "2025-09-19 13:45",
          efficiencyScore: 88
        },
        {
          role: "Manager",
          department: "Finance",
          activeUsers: 8,
          totalSessions: 320,
          avgSessionDuration: 35,
          documentsViewed: 680,
          documentsUploaded: 45,
          commentsPosted: 200,
          approvalsGiven: 0,
          lastActivity: "2025-09-19 12:20",
          efficiencyScore: 85
        },
        {
          role: "Staff",
          department: "Health & Safety",
          activeUsers: 15,
          totalSessions: 450,
          avgSessionDuration: 20,
          documentsViewed: 890,
          documentsUploaded: 120,
          commentsPosted: 180,
          approvalsGiven: 0,
          lastActivity: "2025-09-19 11:15",
          efficiencyScore: 78
        }
      ],
      workflowAnalytics: [
        {
          stage: "Upload",
          totalDocuments: 1200,
          avgProcessingTime: 0.5,
          bottleneckScore: 15,
          successRate: 98,
          commonDelays: ["File size validation", "Virus scanning"]
        },
        {
          stage: "Review",
          totalDocuments: 1150,
          avgProcessingTime: 2.5,
          bottleneckScore: 45,
          successRate: 85,
          commonDelays: ["Manager availability", "Document complexity"]
        },
        {
          stage: "Approval",
          totalDocuments: 980,
          avgProcessingTime: 1.8,
          bottleneckScore: 25,
          successRate: 92,
          commonDelays: ["Director workload", "Compliance checks"]
        },
        {
          stage: "Archive",
          totalDocuments: 900,
          avgProcessingTime: 0.3,
          bottleneckScore: 5,
          successRate: 99,
          commonDelays: ["Storage optimization"]
        }
      ],
      departmentMetrics: [
        {
          department: "Finance",
          totalUsers: 12,
          activeUsers: 10,
          documentsProcessed: 450,
          avgProcessingTime: 1.8,
          complianceRate: 95,
          bottleneckStages: ["Review", "Approval"],
          topPerformers: ["Rajesh Kumar", "Priya Nair"]
        },
        {
          department: "Projects",
          totalUsers: 18,
          activeUsers: 15,
          documentsProcessed: 680,
          avgProcessingTime: 2.2,
          complianceRate: 88,
          bottleneckStages: ["Design Review", "Compliance Check"],
          topPerformers: ["Suresh Menon", "Asha Thomas"]
        },
        {
          department: "Health & Safety",
          totalUsers: 8,
          activeUsers: 7,
          documentsProcessed: 320,
          avgProcessingTime: 1.5,
          complianceRate: 98,
          bottleneckStages: ["Safety Audit"],
          topPerformers: ["Safety Inspector Team"]
        }
      ],
      peakUsageHours: [
        { hour: 9, users: 45 },
        { hour: 10, users: 52 },
        { hour: 11, users: 48 },
        { hour: 14, users: 38 },
        { hour: 15, users: 41 },
        { hour: 16, users: 35 }
      ],
      featureUsage: [
        { feature: "Document Upload", usage: 1200, trend: 'up' },
        { feature: "Comment System", usage: 850, trend: 'stable' },
        { feature: "Analytics Dashboard", usage: 320, trend: 'up' },
        { feature: "Mobile App", usage: 180, trend: 'down' },
        { feature: "Export Functions", usage: 95, trend: 'stable' }
      ],
      errorRates: [
        { component: "API Gateway", errorRate: 0.2, trend: 'down' },
        { component: "Database", errorRate: 0.1, trend: 'stable' },
        { component: "File Storage", errorRate: 0.8, trend: 'up' },
        { component: "Notification Service", errorRate: 0.3, trend: 'down' }
      ]
    };

    setSystemAnalytics(mockAnalytics);

    // Mock admin notifications
    const mockAdminNotifications = [
      {
        id: "1",
        title: "System Performance Alert",
        message: "Database query response time exceeded 2 seconds",
        timestamp: "2025-09-20 14:30",
        isRead: false,
        priority: "high" as const,
        type: "performance" as const
      },
      {
        id: "2",
        title: "Security Alert",
        message: "Multiple failed login attempts detected from IP 192.168.1.100",
        timestamp: "2025-09-20 13:45",
        isRead: false,
        priority: "urgent" as const,
        type: "security" as const
      },
      {
        id: "3",
        title: "User Management",
        message: "New user registration requires approval",
        timestamp: "2025-09-20 10:15",
        isRead: true,
        priority: "medium" as const,
        type: "user" as const
      },
      {
        id: "4",
        title: "System Update",
        message: "Scheduled maintenance completed successfully",
        timestamp: "2025-09-19 16:30",
        isRead: true,
        priority: "low" as const,
        type: "system" as const
      }
    ];
    setAdminNotifications(mockAdminNotifications);
  }, []);

  const getSystemStats = () => {
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'Active').length,
      totalRules: systemRules.length,
      activeRules: systemRules.filter(r => r.enabled).length,
      securityAlerts: auditLogs.filter(log => log.status === 'Failed').length,
      systemUptime: systemHealth.uptime
    };
  };

  const stats = getSystemStats();

  const handleToggleRule = (ruleId: string) => {
    setSystemRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const handleDeactivateUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } : user
    ));
  };

  const handleExportAnalytics = async (format: 'pdf' | 'csv') => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      alert(`Analytics exported as ${format.toUpperCase()}`);
    }, 2000);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getEfficiencyColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBottleneckColor = (score: number) => {
    if (score >= 40) return 'text-red-600';
    if (score >= 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleMarkNotificationRead = (notificationId: string) => {
    setAdminNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      onBackToRoleSelection();
    }
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.role && newUser.department) {
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        status: 'Active',
        lastLogin: 'Never',
        permissions: newUser.permissions
      };
      setUsers(prev => [...prev, user]);
      setNewUser({
        name: "",
        email: "",
        role: "",
        department: "",
        permissions: []
      });
      setIsAddUserOpen(false);
    }
  };

  const handleAddRule = () => {
    if (newRule.name && newRule.description && newRule.trigger && newRule.action) {
      const rule: SystemRule = {
        id: Date.now().toString(),
        name: newRule.name,
        description: newRule.description,
        trigger: newRule.trigger,
        action: newRule.action,
        enabled: newRule.enabled
      };
      setSystemRules(prev => [...prev, rule]);
      setNewRule({
        name: "",
        description: "",
        trigger: "",
        action: "",
        enabled: true
      });
      setIsNewRuleOpen(false);
    }
  };

  const unreadAdminNotifications = adminNotifications.filter(n => !n.isRead).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operational': return 'text-status-completed';
      case 'Warning': return 'text-status-pending';
      case 'Critical': return 'text-status-urgent';
      default: return 'text-muted-foreground';
    }
  };

  const getRoleColor = (role: string) => {
    if (role.includes('Director')) return 'bg-legal text-white';
    if (role.includes('Manager')) return 'bg-projects text-white'; 
    if (role.includes('Executive')) return 'bg-safety text-white';
    return 'bg-systems text-white';
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        currentRole={currentRole} 
        userName="System Admin"
        onNotificationsClick={() => setIsNotificationsOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onLogoutClick={handleLogout}
      />
      
      {/* Hero Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={heroImage} 
          alt="KMRL Metro Station" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/80 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-2">System Administration</h1>
            <p className="text-lg opacity-90">RBAC Management, System Health & Security</p>
            <Badge variant="secondary" className="mt-2">
              <Shield className="h-3 w-3 mr-1" />
              Administrator Access
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Users</span>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Users</span>
                <CheckCircle className="h-4 w-4 text-status-completed" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-completed">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently enabled</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Auto Rules</span>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.activeRules}</div>
              <p className="text-xs text-muted-foreground mt-1">Active automations</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Security Alerts</span>
                <AlertTriangle className="h-4 w-4 text-status-urgent" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-urgent">{stats.securityAlerts}</div>
              <p className="text-xs text-muted-foreground mt-1">Failed attempts</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">System Uptime</span>
                <TrendingUp className="h-4 w-4 text-status-completed" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-completed">{stats.systemUptime}</div>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Role Simulator</span>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Switch 
                checked={isRoleSimulator}
                onCheckedChange={setIsRoleSimulator}
              />
              <p className="text-xs text-muted-foreground mt-1">Preview mode</p>
            </CardContent>
          </Card>
        </div>

        {/* Role Simulator Alert */}
        {isRoleSimulator && (
          <Alert className="mb-6 border-primary bg-primary/10">
            <Monitor className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>Role Simulator Active - Viewing as: <strong>{simulatedRole}</strong></span>
                <Select value={simulatedRole} onValueChange={setSimulatedRole}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Executive">Executive</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="automation">
              <Settings className="h-4 w-4 mr-2" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="health">
              <Activity className="h-4 w-4 mr-2" />
              System Health
            </TabsTrigger>
            <TabsTrigger value="audit">
              <Shield className="h-4 w-4 mr-2" />
              Audit Logs
            </TabsTrigger>
            <TabsTrigger value="rbac">
              <AlertCircle className="h-4 w-4 mr-2" />
              RBAC
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Header */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Advanced Analytics & Role Usage Reports</h3>
                <p className="text-sm text-muted-foreground">Comprehensive insights into system usage, role performance, and workflow analytics</p>
              </div>
              <div className="flex gap-2">
                <Select value={selectedTimeRange} onValueChange={(value: any) => setSelectedTimeRange(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Departments</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Projects">Projects</SelectItem>
                    <SelectItem value="Health & Safety">Health & Safety</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                    <SelectItem value="Systems & Operations">Systems & Operations</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  onClick={() => handleExportAnalytics('pdf')}
                  disabled={isExporting}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export PDF'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleExportAnalytics('csv')}
                  disabled={isExporting}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export CSV'}
                </Button>
              </div>
            </div>

            {systemAnalytics && (
              <>
                {/* Role Usage Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Role Usage Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {systemAnalytics.roleUsage
                        .filter(role => selectedDepartment === 'All' || role.department === selectedDepartment)
                        .map((roleData, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-lg">{roleData.role}</h4>
                              <p className="text-sm text-muted-foreground">{roleData.department} • {roleData.activeUsers} active users</p>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${getEfficiencyColor(roleData.efficiencyScore)}`}>
                                {roleData.efficiencyScore}%
                              </div>
                              <p className="text-xs text-muted-foreground">Efficiency Score</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-primary">{roleData.totalSessions}</div>
                              <p className="text-xs text-muted-foreground">Total Sessions</p>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-blue-600">{roleData.avgSessionDuration}min</div>
                              <p className="text-xs text-muted-foreground">Avg Session</p>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-green-600">{roleData.documentsViewed}</div>
                              <p className="text-xs text-muted-foreground">Documents Viewed</p>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-orange-600">{roleData.documentsUploaded}</div>
                              <p className="text-xs text-muted-foreground">Documents Uploaded</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                {roleData.commentsPosted} comments
                              </span>
                              <span className="flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                {roleData.approvalsGiven} approvals
                              </span>
                            </div>
                            <span className="text-muted-foreground">Last activity: {roleData.lastActivity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Workflow Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Workflow Bottleneck Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {systemAnalytics.workflowAnalytics.map((workflow, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-lg">{workflow.stage}</h4>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={workflow.bottleneckScore >= 40 ? 'destructive' : 
                                        workflow.bottleneckScore >= 20 ? 'default' : 'secondary'}
                              >
                                Bottleneck Score: {workflow.bottleneckScore}%
                              </Badge>
                              <Badge variant="outline">
                                {workflow.successRate}% Success Rate
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div>
                              <div className="text-sm text-muted-foreground">Total Documents</div>
                              <div className="text-lg font-semibold">{workflow.totalDocuments}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Avg Processing Time</div>
                              <div className="text-lg font-semibold">{workflow.avgProcessingTime} days</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Common Delays</div>
                              <div className="text-sm">{workflow.commonDelays.join(', ')}</div>
                            </div>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                workflow.bottleneckScore >= 40 ? 'bg-red-500' :
                                workflow.bottleneckScore >= 20 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${workflow.bottleneckScore}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Department Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Department Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {systemAnalytics.departmentMetrics.map((dept, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{dept.department}</h4>
                              <Badge variant="outline">{dept.complianceRate}% Compliance</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Users: </span>
                                <span>{dept.activeUsers}/{dept.totalUsers}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Processed: </span>
                                <span>{dept.documentsProcessed}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Avg Time: </span>
                                <span>{dept.avgProcessingTime} days</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Bottlenecks: </span>
                                <span>{dept.bottleneckStages.join(', ')}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-5 w-5" />
                        Peak Usage Hours
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {systemAnalytics.peakUsageHours.map((hour, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{hour.hour}:00</span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full bg-primary"
                                  style={{ width: `${(hour.users / 60) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium w-8">{hour.users}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Feature Usage & Error Rates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Feature Usage Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {systemAnalytics.featureUsage.map((feature, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{feature.feature}</span>
                              {getTrendIcon(feature.trend)}
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{feature.usage}</div>
                              <div className="text-xs text-muted-foreground">uses</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircleIcon className="h-5 w-5" />
                        System Error Rates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {systemAnalytics.errorRates.map((error, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{error.component}</span>
                              {getTrendIcon(error.trend)}
                            </div>
                            <div className="text-right">
                              <div className={`font-semibold ${
                                error.errorRate > 0.5 ? 'text-red-600' : 
                                error.errorRate > 0.2 ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                {error.errorRate}%
                              </div>
                              <div className="text-xs text-muted-foreground">error rate</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">User Management</h3>
              <Button onClick={() => setIsAddUserOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>

            <div className="grid gap-4">
              {users.map((user) => (
                <Card key={user.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                              {user.role}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {user.department}
                            </Badge>
                            <Badge 
                              variant={user.status === 'Active' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {user.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeactivateUser(user.id)}
                        >
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Last Login: {user.lastLogin}</span>
                        <span>Permissions: {user.permissions.join(', ')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Automation Rules</h3>
              <Button onClick={() => setIsNewRuleOpen(true)}>
                <Settings className="h-4 w-4 mr-2" />
                New Rule
              </Button>
            </div>

            <div className="grid gap-4">
              {systemRules.map((rule) => (
                <Card key={rule.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground flex items-center gap-2">
                          {rule.name}
                          <Badge variant={rule.enabled ? 'default' : 'secondary'} className="text-xs">
                            {rule.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span><strong>Trigger:</strong> {rule.trigger}</span>
                          <span><strong>Action:</strong> {rule.action}</span>
                        </div>
                      </div>
                      <Switch 
                        checked={rule.enabled}
                        onCheckedChange={() => handleToggleRule(rule.id)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <h3 className="text-lg font-semibold">System Health Panel</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">API Status</span>
                    <Server className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-lg font-bold ${getStatusColor(systemHealth.api)}`}>
                    {systemHealth.api}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Response time: 120ms</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">Database</span>
                    <Database className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-lg font-bold ${getStatusColor(systemHealth.database)}`}>
                    {systemHealth.database}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Query time: 45ms</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">Storage</span>
                    <Activity className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-lg font-bold ${getStatusColor(systemHealth.storage)}`}>
                    {systemHealth.storage}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">85% capacity</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">Network</span>
                    <Wifi className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-status-completed">Stable</div>
                  <p className="text-xs text-muted-foreground mt-1">Latency: 12ms</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <h3 className="text-lg font-semibold">Security & Audit Logs</h3>
            
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <Card key={log.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`h-2 w-2 rounded-full ${
                          log.status === 'Success' ? 'bg-status-completed' : 'bg-status-urgent'
                        }`}></div>
                        <div>
                          <h4 className="font-medium text-foreground">{log.action}</h4>
                          <p className="text-sm text-muted-foreground">
                            {log.user} • {log.resource}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={log.status === 'Success' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {log.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{log.timestamp}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rbac" className="space-y-6">
            <h3 className="text-lg font-semibold">Role-Based Access Control</h3>
            
            <div className="grid gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Role Hierarchy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium">Executive</span>
                      <Badge className="bg-safety text-white">Highest Priority</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium">Director</span>
                      <Badge className="bg-legal text-white">Department Head</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium">Manager</span>
                      <Badge className="bg-projects text-white">Team Lead</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium">Staff</span>
                      <Badge className="bg-systems text-white">Individual Contributor</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Permission Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Role</th>
                          <th className="text-center p-2">View</th>
                          <th className="text-center p-2">Upload</th>
                          <th className="text-center p-2">Comment</th>
                          <th className="text-center p-2">Approve</th>
                          <th className="text-center p-2">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Executive</td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Director</td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2">❌</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Manager</td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2">❌</td>
                          <td className="text-center p-2">❌</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Staff</td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2">❌</td>
                          <td className="text-center p-2">❌</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Notifications Dialog */}
        <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                System Admin Notifications
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {adminNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    notification.isRead ? 'bg-muted/50' : 'bg-background hover:bg-muted/30'
                  }`}
                  onClick={() => handleMarkNotificationRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{notification.title}</h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        <Badge className={
                          notification.priority === 'urgent' ? 'bg-red-500' :
                          notification.priority === 'high' ? 'bg-orange-500' :
                          notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }>
                          {notification.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {notification.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{notification.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Profile Dialog */}
        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                System Admin Profile
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold">System Administrator</h3>
                <p className="text-muted-foreground">{currentRole}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="text-sm">admin@kmrl.org</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Department:</span>
                  <span className="text-sm">IT Administration</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Login:</span>
                  <span className="text-sm">Today, 7:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">System Alerts:</span>
                  <span className="text-sm font-medium text-red-500">{unreadAdminNotifications}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Users:</span>
                  <span className="text-sm font-medium">{users.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Users:</span>
                  <span className="text-sm font-medium text-green-500">{users.filter(u => u.status === 'Active').length}</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Admin Settings
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">System Monitoring</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Real-time performance monitoring</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Security alerts</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Automated backups</span>
                  </label>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">User Management</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Auto-approve new users</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Role-based access control</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Two-factor authentication</span>
                  </label>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Analytics & Reporting</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Daily analytics reports</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Performance metrics</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Predictive analytics</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsSettingsOpen(false)}>
                  Save Settings
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add User Dialog */}
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add New User
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-md"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newUser.role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                  >
                    <option value="">Select Role</option>
                    <option value="Executive">Executive</option>
                    <option value="Director">Director</option>
                    <option value="Manager">Manager</option>
                    <option value="Staff">Staff</option>
                    <option value="System Admin">System Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Department</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newUser.department}
                    onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
                  >
                    <option value="">Select Department</option>
                    <option value="Finance">Finance</option>
                    <option value="Projects">Projects</option>
                    <option value="Legal">Legal</option>
                    <option value="Health & Safety">Health & Safety</option>
                    <option value="Systems & Operations">Systems & Operations</option>
                    <option value="Executive">Executive</option>
                    <option value="IT Administration">IT Administration</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Permissions</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewUser(prev => ({ ...prev, permissions: [...prev.permissions, 'view'] }));
                        } else {
                          setNewUser(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== 'view') }));
                        }
                      }}
                    />
                    <span className="text-sm">View</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewUser(prev => ({ ...prev, permissions: [...prev.permissions, 'upload'] }));
                        } else {
                          setNewUser(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== 'upload') }));
                        }
                      }}
                    />
                    <span className="text-sm">Upload</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewUser(prev => ({ ...prev, permissions: [...prev.permissions, 'comment'] }));
                        } else {
                          setNewUser(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== 'comment') }));
                        }
                      }}
                    />
                    <span className="text-sm">Comment</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewUser(prev => ({ ...prev, permissions: [...prev.permissions, 'approve'] }));
                        } else {
                          setNewUser(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== 'approve') }));
                        }
                      }}
                    />
                    <span className="text-sm">Approve</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewUser(prev => ({ ...prev, permissions: [...prev.permissions, 'delete'] }));
                        } else {
                          setNewUser(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== 'delete') }));
                        }
                      }}
                    />
                    <span className="text-sm">Delete</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>
                  Add User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* New Rule Dialog */}
        <Dialog open={isNewRuleOpen} onOpenChange={setIsNewRuleOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Create New Automation Rule
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Rule Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={newRule.name}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter rule name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  value={newRule.description}
                  onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this rule does"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Trigger Condition</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newRule.trigger}
                  onChange={(e) => setNewRule(prev => ({ ...prev, trigger: e.target.value }))}
                >
                  <option value="">Select Trigger</option>
                  <option value="Document Upload">Document Upload</option>
                  <option value="Status Change">Status Change</option>
                  <option value="Deadline Approaching">Deadline Approaching</option>
                  <option value="User Login">User Login</option>
                  <option value="System Error">System Error</option>
                  <option value="Custom Condition">Custom Condition</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Action to Perform</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newRule.action}
                  onChange={(e) => setNewRule(prev => ({ ...prev, action: e.target.value }))}
                >
                  <option value="">Select Action</option>
                  <option value="Send Notification">Send Notification</option>
                  <option value="Update Status">Update Status</option>
                  <option value="Escalate to Manager">Escalate to Manager</option>
                  <option value="Auto-approve">Auto-approve</option>
                  <option value="Send Email">Send Email</option>
                  <option value="Create Task">Create Task</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={newRule.enabled}
                  onChange={(e) => setNewRule(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="enabled" className="text-sm">Enable this rule immediately</label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewRuleOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRule}>
                  Create Rule
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default SystemAdminDashboard;