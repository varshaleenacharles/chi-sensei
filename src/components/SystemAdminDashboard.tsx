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
  employeeId?: string;
  phone?: string;
  position?: string;
  manager?: string;
  startDate?: string;
  accessLevel?: 'Standard' | 'Elevated' | 'Administrative';
  twoFactorEnabled?: boolean;
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
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userFilterRole, setUserFilterRole] = useState<string>("All");
  const [userFilterStatus, setUserFilterStatus] = useState<string>("All");
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState<User | null>(null);
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
    permissions: [] as string[],
    phone: "",
    employeeId: "",
    position: "",
    manager: "",
    startDate: "",
    status: "Active" as "Active" | "Inactive",
    accessLevel: "Standard" as "Standard" | "Elevated" | "Administrative",
    twoFactorEnabled: false,
    password: "",
    confirmPassword: ""
  });
  const [userFormErrors, setUserFormErrors] = useState<Record<string, string>>({});
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

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
        permissions: ["view", "upload", "approve", "comment"],
        employeeId: "EMP001",
        position: "Senior Manager",
        manager: "Executive Director",
        startDate: "2020-03-15",
        accessLevel: "Elevated",
        twoFactorEnabled: true
      },
      {
        id: "2", 
        name: "Priya Nair",
        email: "priya.nair@kmrl.gov.in",
        role: "Projects Director",
        department: "Projects", 
        status: "Active",
        lastLogin: "2025-09-19 09:15",
        permissions: ["view", "upload", "approve", "comment", "delete"],
        employeeId: "EMP002",
        position: "Director",
        manager: "CEO",
        startDate: "2019-08-20",
        accessLevel: "Administrative",
        twoFactorEnabled: true
      },
      {
        id: "3",
        name: "Suresh Menon",
        email: "suresh.menon@kmrl.gov.in", 
        role: "Safety Inspector",
        department: "Health & Safety",
        status: "Active",
        lastLogin: "2025-09-18 16:45",
        permissions: ["view", "upload", "comment"],
        employeeId: "EMP003",
        position: "Senior Inspector",
        manager: "Safety Manager",
        startDate: "2021-01-10",
        accessLevel: "Standard",
        twoFactorEnabled: false
      },
      {
        id: "4",
        name: "Asha Thomas",
        email: "asha.thomas@kmrl.gov.in",
        role: "Legal Officer",
        department: "Legal",
        status: "Inactive",
        lastLogin: "2025-09-16 11:20",
        permissions: ["view", "upload"],
        employeeId: "EMP004",
        position: "Legal Counsel",
        manager: "Legal Director",
        startDate: "2020-11-05",
        accessLevel: "Elevated",
        twoFactorEnabled: true
      },
      {
        id: "5",
        name: "Vikram Singh",
        email: "vikram.singh@kmrl.gov.in",
        role: "IT Manager",
        department: "Systems & Operations",
        status: "Active",
        lastLogin: "2025-09-19 08:30",
        permissions: ["view", "upload", "approve", "comment", "delete", "admin"],
        employeeId: "EMP005",
        position: "IT Manager",
        manager: "CTO",
        startDate: "2018-06-01",
        accessLevel: "Administrative",
        twoFactorEnabled: true
      },
      {
        id: "6",
        name: "Meera Patel",
        email: "meera.patel@kmrl.gov.in",
        role: "Executive Assistant",
        department: "Executive",
        status: "Active",
        lastLogin: "2025-09-19 10:15",
        permissions: ["view", "upload", "comment"],
        employeeId: "EMP006",
        position: "Executive Assistant",
        manager: "CEO",
        startDate: "2022-02-14",
        accessLevel: "Elevated",
        twoFactorEnabled: false
      },
      {
        id: "7",
        name: "Arjun Sharma",
        email: "arjun.sharma@kmrl.gov.in",
        role: "Project Engineer",
        department: "Projects",
        status: "Active",
        lastLogin: "2025-09-18 15:20",
        permissions: ["view", "upload", "comment"],
        employeeId: "EMP007",
        position: "Senior Engineer",
        manager: "Projects Director",
        startDate: "2021-09-01",
        accessLevel: "Standard",
        twoFactorEnabled: true
      },
      {
        id: "8",
        name: "Deepa Krishnan",
        email: "deepa.krishnan@kmrl.gov.in",
        role: "Accountant",
        department: "Finance",
        status: "Active",
        lastLogin: "2025-09-19 11:45",
        permissions: ["view", "upload"],
        employeeId: "EMP008",
        position: "Senior Accountant",
        manager: "Finance Manager",
        startDate: "2020-04-01",
        accessLevel: "Standard",
        twoFactorEnabled: false
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
      securityAlerts: auditLogs.filter(log => log.status === 'Failed').length,
      systemUptime: systemHealth.uptime
    };
  };

  const stats = getSystemStats();


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

  const validateUserForm = () => {
    const errors: Record<string, string> = {};
    
    if (!newUser.name.trim()) {
      errors.name = "Full name is required";
    }
    
    if (!newUser.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!newUser.role) {
      errors.role = "Role is required";
    }
    
    if (!newUser.department) {
      errors.department = "Department is required";
    }
    
    if (!newUser.employeeId.trim()) {
      errors.employeeId = "Employee ID is required";
    }
    
    if (!newUser.position.trim()) {
      errors.position = "Position is required";
    }
    
    if (!isEditingUser) {
      if (!newUser.password) {
        errors.password = "Password is required";
      } else if (newUser.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
      
      if (newUser.password !== newUser.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }
    
    if (!newUser.startDate) {
      errors.startDate = "Start date is required";
    }
    
    setUserFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUser = () => {
    if (validateUserForm()) {
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        status: newUser.status,
        lastLogin: 'Never',
        permissions: newUser.permissions
      };
      setUsers(prev => [...prev, user]);
      resetUserForm();
      setIsAddUserOpen(false);
    }
  };

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setNewUser({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        permissions: user.permissions,
        phone: "",
        employeeId: "",
        position: "",
        manager: "",
        startDate: "",
        status: user.status,
        accessLevel: "Standard",
        twoFactorEnabled: false,
        password: "",
        confirmPassword: ""
      });
      setIsEditingUser(true);
      setEditingUserId(userId);
      setIsAddUserOpen(true);
    }
  };

  const handleUpdateUser = () => {
    if (validateUserForm() && editingUserId) {
      setUsers(prev => prev.map(user => 
        user.id === editingUserId 
          ? { 
              ...user, 
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
              department: newUser.department,
              status: newUser.status,
              permissions: newUser.permissions
            }
          : user
      ));
      resetUserForm();
      setIsAddUserOpen(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const resetUserForm = () => {
    setNewUser({
      name: "",
      email: "",
      role: "",
      department: "",
      permissions: [],
      phone: "",
      employeeId: "",
      position: "",
      manager: "",
      startDate: "",
      status: "Active",
      accessLevel: "Standard",
      twoFactorEnabled: false,
      password: "",
      confirmPassword: ""
    });
    setUserFormErrors({});
    setIsEditingUser(false);
    setEditingUserId(null);
  };

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedUsers.length === 0) {
      alert("Please select users to perform bulk action");
      return;
    }

    const actionText = action === 'delete' ? 'delete' : action === 'activate' ? 'activate' : 'deactivate';
    if (confirm(`Are you sure you want to ${actionText} ${selectedUsers.length} selected users?`)) {
      if (action === 'delete') {
        setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
      } else {
        setUsers(prev => prev.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, status: action === 'activate' ? 'Active' : 'Inactive' }
            : user
        ));
      }
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAllUsers = () => {
    const filteredUsers = getFilteredUsers();
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const getFilteredUsers = () => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                           (user.employeeId && user.employeeId.toLowerCase().includes(userSearchTerm.toLowerCase()));
      const matchesRole = userFilterRole === "All" || user.role === userFilterRole;
      const matchesStatus = userFilterStatus === "All" || user.status === userFilterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });
  };

  const handleViewUserDetails = (user: User) => {
    setSelectedUserDetails(user);
    setIsUserDetailsOpen(true);
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="audit">
              <Shield className="h-4 w-4 mr-2" />
              Audit Logs
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Header */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">System Analytics</h3>
                <p className="text-sm text-muted-foreground">Overview of system performance and usage metrics</p>
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
                <Button 
                  variant="outline" 
                  onClick={() => handleExportAnalytics('pdf')}
                  disabled={isExporting}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export PDF'}
                </Button>
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Sessions</span>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">1,245</div>
                  <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">Documents Processed</span>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">2,340</div>
                  <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">Avg Response Time</span>
                    <Timer className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">1.2s</div>
                  <p className="text-xs text-muted-foreground mt-1">-15% improvement</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">System Uptime</span>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-status-completed">99.9%</div>
                  <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
                </CardContent>
              </Card>
            </div>

            {/* Department Performance */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Department Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">Finance</h4>
                    <div className="text-3xl font-bold text-primary mb-2">95%</div>
                    <p className="text-sm text-muted-foreground">Compliance Rate</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      450 documents processed
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">Projects</h4>
                    <div className="text-3xl font-bold text-blue-600 mb-2">88%</div>
                    <p className="text-sm text-muted-foreground">Compliance Rate</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      680 documents processed
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">Health & Safety</h4>
                    <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                    <p className="text-sm text-muted-foreground">Compliance Rate</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      320 documents processed
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Status</span>
                      <Badge className="bg-green-500 text-white">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database</span>
                      <Badge className="bg-green-500 text-white">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Storage</span>
                      <Badge className="bg-yellow-500 text-white">Warning</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Network</span>
                      <Badge className="bg-green-500 text-white">Operational</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Document uploads today</span>
                      <span className="font-semibold">45</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Comments posted</span>
                      <span className="font-semibold">23</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Approvals given</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Active users</span>
                      <span className="font-semibold text-green-600">28</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* User Management Header */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">User Management</h3>
                <p className="text-sm text-muted-foreground">Comprehensive user administration, role management, and access control</p>
              </div>
              <Button onClick={() => {
                resetUserForm();
                setIsAddUserOpen(true);
              }}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>

            {/* User Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Users</span>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{users.length}</div>
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
                  <div className="text-2xl font-bold text-status-completed">
                    {users.filter(u => u.status === 'Active').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((users.filter(u => u.status === 'Active').length / users.length) * 100).toFixed(1)}% of total
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">Departments</span>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {new Set(users.map(u => u.department)).size}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Unique departments</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">Roles</span>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {new Set(users.map(u => u.role)).size}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Different roles</p>
                </CardContent>
              </Card>
            </div>

            {/* Department & Role Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Department Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      users.reduce((acc, user) => {
                        acc[user.department] = (acc[user.department] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    )
                      .sort(([,a], [,b]) => b - a)
                      .map(([dept, count]) => (
                        <div key={dept} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <span className="text-sm font-medium">{dept}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{count} users</span>
                            <Badge variant="outline" className="text-xs">
                              {((count / users.length) * 100).toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Role Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      users.reduce((acc, user) => {
                        acc[user.role] = (acc[user.role] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    )
                      .sort(([,a], [,b]) => b - a)
                      .map(([role, count]) => (
                        <div key={role} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getRoleColor(role).replace('text-white', 'bg-primary')}`}></div>
                            <span className="text-sm font-medium">{role}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{count} users</span>
                            <Badge variant="outline" className="text-xs">
                              {((count / users.length) * 100).toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent User Activity */}
            <Card className="shadow-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent User Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users
                    .sort((a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime())
                    .slice(0, 5)
                    .map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{user.name}</h4>
                            <p className="text-xs text-muted-foreground">{user.role} • {user.department}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Last Login</p>
                          <p className="text-sm font-medium">{user.lastLogin}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Search users..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Select value={userFilterRole} onValueChange={setUserFilterRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Roles</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="System Admin">System Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={userFilterStatus} onValueChange={setUserFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('activate')}
                  disabled={selectedUsers.length === 0}
                >
                  Activate
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('deactivate')}
                  disabled={selectedUsers.length === 0}
                >
                  Deactivate
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                  disabled={selectedUsers.length === 0}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>

            {/* User List Header */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === getFilteredUsers().length && getFilteredUsers().length > 0}
                  onChange={handleSelectAllUsers}
                  className="rounded"
                />
                <span className="text-sm font-medium">
                  {selectedUsers.length > 0 ? `${selectedUsers.length} selected` : `Select all (${getFilteredUsers().length})`}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Showing {getFilteredUsers().length} of {users.length} users
              </div>
            </div>

            {/* Enhanced User List */}
            <div className="space-y-4">
              {getFilteredUsers().map((user) => (
                <Card key={user.id} className={`shadow-card transition-all duration-200 ${selectedUsers.includes(user.id) ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-lg'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="rounded mt-1"
                        />
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-foreground text-lg">{user.name}</h4>
                            <Badge 
                              variant={user.status === 'Active' ? 'default' : 'secondary'}
                              className={`text-xs ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                            >
                              {user.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{user.email}</p>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                              {user.role}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {user.department}
                            </Badge>
                            {user.employeeId && (
                              <Badge variant="outline" className="text-xs">
                                ID: {user.employeeId}
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Last Login:</span>
                              <p className="font-medium">{user.lastLogin}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Permissions:</span>
                              <p className="font-medium">{user.permissions.length} assigned</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Access Level:</span>
                              <p className="font-medium">{user.accessLevel || 'Standard'}</p>
                            </div>
                          </div>

                          {user.permissions.length > 0 && (
                            <div className="mt-3">
                              <span className="text-xs text-muted-foreground">Permissions:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {user.permissions.slice(0, 4).map((permission) => (
                                  <Badge key={permission} variant="outline" className="text-xs">
                                    {permission}
                                  </Badge>
                                ))}
                                {user.permissions.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{user.permissions.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewUserDetails(user)}
                          className="hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditUser(user.id)}
                          className="hover:bg-green-50 hover:text-green-700"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeactivateUser(user.id)}
                          className={`hover:bg-orange-50 hover:text-orange-700 ${
                            user.status === 'Active' ? 'text-orange-600' : 'text-green-600'
                          }`}
                        >
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {getFilteredUsers().length === 0 && (
                <Card className="shadow-card">
                  <CardContent className="p-12 text-center">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">No users found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {userSearchTerm || userFilterRole !== "All" || userFilterStatus !== "All" 
                        ? "Try adjusting your search criteria or filters"
                        : "No users have been added yet"
                      }
                    </p>
                    {!userSearchTerm && userFilterRole === "All" && userFilterStatus === "All" && (
                      <Button onClick={() => {
                        resetUserForm();
                        setIsAddUserOpen(true);
                      }}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add First User
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>



          <TabsContent value="audit" className="space-y-6">
            {/* Audit Logs Header */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Security & Audit Logs</h3>
                <p className="text-sm text-muted-foreground">Comprehensive security monitoring, user activity tracking, and system audit trails</p>
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
                <Button 
                  variant="outline" 
                  onClick={() => handleExportAnalytics('csv')}
                  disabled={isExporting}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export Logs'}
                </Button>
              </div>
            </div>

            {/* Audit Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Events</span>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{auditLogs.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">All audit events</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">Successful</span>
                    <CheckCircle className="h-4 w-4 text-status-completed" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-status-completed">
                    {auditLogs.filter(log => log.status === 'Success').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((auditLogs.filter(log => log.status === 'Success').length / auditLogs.length) * 100).toFixed(1)}% success rate
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">Failed Events</span>
                    <AlertTriangle className="h-4 w-4 text-status-urgent" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-status-urgent">
                    {auditLogs.filter(log => log.status === 'Failed').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Security alerts</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">Unique Users</span>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {new Set(auditLogs.map(log => log.user)).size}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Active users</p>
                </CardContent>
              </Card>
            </div>

            {/* Activity Trends */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Activity Trends & Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Most Active Users */}
                  <div>
                    <h4 className="font-semibold mb-3 text-sm">Most Active Users</h4>
                    <div className="space-y-2">
                      {Object.entries(
                        auditLogs.reduce((acc, log) => {
                          acc[log.user] = (acc[log.user] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      )
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([user, count]) => (
                          <div key={user} className="flex items-center justify-between text-sm">
                            <span className="truncate">{user}</span>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Action Types */}
                  <div>
                    <h4 className="font-semibold mb-3 text-sm">Action Types</h4>
                    <div className="space-y-2">
                      {Object.entries(
                        auditLogs.reduce((acc, log) => {
                          acc[log.action] = (acc[log.action] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      )
                        .sort(([,a], [,b]) => b - a)
                        .map(([action, count]) => (
                          <div key={action} className="flex items-center justify-between text-sm">
                            <span className="truncate">{action}</span>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Resource Access */}
                  <div>
                    <h4 className="font-semibold mb-3 text-sm">Most Accessed Resources</h4>
                    <div className="space-y-2">
                      {Object.entries(
                        auditLogs.reduce((acc, log) => {
                          acc[log.resource] = (acc[log.resource] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      )
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([resource, count]) => (
                          <div key={resource} className="flex items-center justify-between text-sm">
                            <span className="truncate">{resource}</span>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Alerts */}
            <Card className="shadow-card border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Security Alerts & Failed Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLogs.filter(log => log.status === 'Failed').map((log) => (
                    <div key={log.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <div>
                            <h4 className="font-medium text-red-800">{log.action}</h4>
                            <p className="text-sm text-red-600">
                              {log.user} • {log.resource}
                            </p>
                            <p className="text-xs text-red-500 mt-1">
                              Potential security threat detected
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive" className="text-xs">
                            {log.status}
                          </Badge>
                          <p className="text-xs text-red-600 mt-1">{log.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {auditLogs.filter(log => log.status === 'Failed').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <p>No security alerts in the selected time period</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Audit Logs */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Detailed Audit Trail
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Complete chronological record of all system activities and user actions
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`h-3 w-3 rounded-full ${
                            log.status === 'Success' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-foreground">{log.action}</h4>
                              <Badge 
                                variant={log.status === 'Success' ? 'default' : 'destructive'}
                                className="text-xs"
                              >
                                {log.status}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {log.user}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              <strong>Resource:</strong> {log.resource}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {log.timestamp}
                              </span>
                              <span className="flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                Event ID: {log.id}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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

        {/* Add/Edit User Dialog */}
        <Dialog open={isAddUserOpen} onOpenChange={(open) => {
          if (!open) {
            resetUserForm();
          }
          setIsAddUserOpen(open);
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                {isEditingUser ? 'Edit User' : 'Add New User'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name *</label>
                    <Input
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                      className={userFormErrors.name ? "border-red-500" : ""}
                    />
                    {userFormErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{userFormErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email Address *</label>
                    <Input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                      className={userFormErrors.email ? "border-red-500" : ""}
                    />
                    {userFormErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{userFormErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Employee ID *</label>
                    <Input
                      value={newUser.employeeId}
                      onChange={(e) => setNewUser(prev => ({ ...prev, employeeId: e.target.value }))}
                      placeholder="Enter employee ID"
                      className={userFormErrors.employeeId ? "border-red-500" : ""}
                    />
                    {userFormErrors.employeeId && (
                      <p className="text-red-500 text-xs mt-1">{userFormErrors.employeeId}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input
                      value={newUser.phone}
                      onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Role & Department */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Role & Department</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Role *</label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger className={userFormErrors.role ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Executive">Executive</SelectItem>
                        <SelectItem value="Director">Director</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                        <SelectItem value="System Admin">System Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {userFormErrors.role && (
                      <p className="text-red-500 text-xs mt-1">{userFormErrors.role}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Department *</label>
                    <Select value={newUser.department} onValueChange={(value) => setNewUser(prev => ({ ...prev, department: value }))}>
                      <SelectTrigger className={userFormErrors.department ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Projects">Projects</SelectItem>
                        <SelectItem value="Legal">Legal</SelectItem>
                        <SelectItem value="Health & Safety">Health & Safety</SelectItem>
                        <SelectItem value="Systems & Operations">Systems & Operations</SelectItem>
                        <SelectItem value="Executive">Executive</SelectItem>
                        <SelectItem value="IT Administration">IT Administration</SelectItem>
                      </SelectContent>
                    </Select>
                    {userFormErrors.department && (
                      <p className="text-red-500 text-xs mt-1">{userFormErrors.department}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Position *</label>
                    <Input
                      value={newUser.position}
                      onChange={(e) => setNewUser(prev => ({ ...prev, position: e.target.value }))}
                      placeholder="Enter job position"
                      className={userFormErrors.position ? "border-red-500" : ""}
                    />
                    {userFormErrors.position && (
                      <p className="text-red-500 text-xs mt-1">{userFormErrors.position}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Manager</label>
                    <Input
                      value={newUser.manager}
                      onChange={(e) => setNewUser(prev => ({ ...prev, manager: e.target.value }))}
                      placeholder="Enter manager name"
                    />
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Start Date *</label>
                    <Input
                      type="date"
                      value={newUser.startDate}
                      onChange={(e) => setNewUser(prev => ({ ...prev, startDate: e.target.value }))}
                      className={userFormErrors.startDate ? "border-red-500" : ""}
                    />
                    {userFormErrors.startDate && (
                      <p className="text-red-500 text-xs mt-1">{userFormErrors.startDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select value={newUser.status} onValueChange={(value: "Active" | "Inactive") => setNewUser(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Access Level</label>
                    <Select value={newUser.accessLevel} onValueChange={(value: "Standard" | "Elevated" | "Administrative") => setNewUser(prev => ({ ...prev, accessLevel: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Elevated">Elevated</SelectItem>
                        <SelectItem value="Administrative">Administrative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newUser.twoFactorEnabled}
                      onCheckedChange={(checked) => setNewUser(prev => ({ ...prev, twoFactorEnabled: checked }))}
                    />
                    <label className="text-sm font-medium">Enable Two-Factor Authentication</label>
                  </div>
                </div>
              </div>

              {/* Password Section (only for new users) */}
              {!isEditingUser && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Password *</label>
                      <Input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter password"
                        className={userFormErrors.password ? "border-red-500" : ""}
                      />
                      {userFormErrors.password && (
                        <p className="text-red-500 text-xs mt-1">{userFormErrors.password}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium">Confirm Password *</label>
                      <Input
                        type="password"
                        value={newUser.confirmPassword}
                        onChange={(e) => setNewUser(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm password"
                        className={userFormErrors.confirmPassword ? "border-red-500" : ""}
                      />
                      {userFormErrors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{userFormErrors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Permissions */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Permissions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['view', 'upload', 'comment', 'approve', 'delete', 'admin'].map((permission) => (
                    <label key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={newUser.permissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewUser(prev => ({ ...prev, permissions: [...prev.permissions, permission] }));
                          } else {
                            setNewUser(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== permission) }));
                          }
                        }}
                      />
                      <span className="text-sm capitalize">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => {
                  resetUserForm();
                  setIsAddUserOpen(false);
                }}>
                  Cancel
                </Button>
                <Button onClick={isEditingUser ? handleUpdateUser : handleAddUser}>
                  {isEditingUser ? 'Update User' : 'Add User'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>


        {/* User Details Dialog */}
        <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Details
              </DialogTitle>
            </DialogHeader>
            {selectedUserDetails && (
              <div className="space-y-6">
                {/* User Header */}
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedUserDetails.name}</h3>
                    <p className="text-muted-foreground">{selectedUserDetails.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`text-xs ${getRoleColor(selectedUserDetails.role)}`}>
                        {selectedUserDetails.role}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {selectedUserDetails.department}
                      </Badge>
                      <Badge 
                        variant={selectedUserDetails.status === 'Active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {selectedUserDetails.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* User Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Basic Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Employee ID:</span>
                        <span className="text-sm">{selectedUserDetails.employeeId || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Position:</span>
                        <span className="text-sm">{selectedUserDetails.position || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Manager:</span>
                        <span className="text-sm">{selectedUserDetails.manager || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Phone:</span>
                        <span className="text-sm">{selectedUserDetails.phone || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Account Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Start Date:</span>
                        <span className="text-sm">{selectedUserDetails.startDate || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Last Login:</span>
                        <span className="text-sm">{selectedUserDetails.lastLogin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Access Level:</span>
                        <span className="text-sm">{selectedUserDetails.accessLevel || 'Standard'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">2FA Enabled:</span>
                        <span className="text-sm">{selectedUserDetails.twoFactorEnabled ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <h4 className="font-semibold mb-3">Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUserDetails.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                    {selectedUserDetails.permissions.length === 0 && (
                      <span className="text-sm text-muted-foreground">No permissions assigned</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsUserDetailsOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    handleEditUser(selectedUserDetails.id);
                    setIsUserDetailsOpen(false);
                  }}>
                    Edit User
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default SystemAdminDashboard;