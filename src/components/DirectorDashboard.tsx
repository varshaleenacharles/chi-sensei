import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Users, 
  FileText, 
  MessageSquare,
  Bell,
  BarChart3,
  Target,
  Search,
  Filter,
  Plus,
  Send,
  Eye,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Zap,
  User,
  Settings,
  X
} from "lucide-react";
import DashboardHeader from "./DashboardHeader";
import CommentThread from "./CommentThread";
import { Document, Comment } from "./DocumentCard";
import ProjectTimeline from "./ProjectTimeline";
import TimelineAnalytics from "./TimelineAnalytics";

interface ComplianceDeadline {
  id: string;
  title: string;
  department: string;
  dueDate: string;
  status: 'upcoming' | 'due_soon' | 'overdue' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  assignedTo: string;
}

interface KPIMetric {
  department: string;
  metric: string;
  value: string;
  target: string;
  status: 'on_track' | 'at_risk' | 'behind';
  trend: 'up' | 'down' | 'stable';
  chartData: number[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  department: string;
  createdBy: string;
}

interface Escalation {
  id: string;
  title: string;
  description: string;
  fromDepartment: string;
  toExecutive: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_review' | 'resolved';
  createdAt: string;
  dueDate: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'new_upload' | 'comment' | 'deadline' | 'escalation';
  isRead: boolean;
  timestamp: string;
  department: string;
  actionRequired: boolean;
}

interface DirectorDashboardProps {
  currentRole: string;
  onBackToRoleSelection: () => void;
}

const DirectorDashboard = ({ currentRole, onBackToRoleSelection }: DirectorDashboardProps) => {
  const [complianceDeadlines, setComplianceDeadlines] = useState<ComplianceDeadline[]>([]);
  const [kpiMetrics, setKpiMetrics] = useState<KPIMetric[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [projects, setProjects] = useState<any[]>([]);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isNewComplianceOpen, setIsNewComplianceOpen] = useState(false);
  const [isDocumentViewOpen, setIsDocumentViewOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    priority: "medium" as const,
    department: ""
  });
  const [newCompliance, setNewCompliance] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium" as const,
    department: "",
    assignedTo: ""
  });
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Mock data initialization
  useEffect(() => {
    // Compliance Deadlines
    setComplianceDeadlines([
      {
        id: "1",
        title: "Q4 Financial Audit",
        department: "Finance",
        dueDate: "2025-12-31",
        status: "upcoming",
        priority: "high",
        description: "Annual financial audit preparation and documentation",
        assignedTo: "Finance Manager"
      },
      {
        id: "2",
        title: "Safety Drill - Station A",
        department: "Health & Safety",
        dueDate: "2025-10-15",
        status: "due_soon",
        priority: "urgent",
        description: "Monthly safety evacuation drill",
        assignedTo: "Safety Director"
      },
      {
        id: "3",
        title: "Project Phase 2 Review",
        department: "Projects",
        dueDate: "2025-09-30",
        status: "overdue",
        priority: "high",
        description: "Review construction progress and budget allocation",
        assignedTo: "Projects Director"
      }
    ]);

    // KPI Metrics
    setKpiMetrics([
      {
        department: "Finance",
        metric: "Budget Utilization",
        value: "78%",
        target: "85%",
        status: "on_track",
        trend: "up",
        chartData: [65, 70, 75, 78]
      },
      {
        department: "Finance",
        metric: "Overdue Invoices",
        value: "12",
        target: "< 10",
        status: "at_risk",
        trend: "up",
        chartData: [8, 10, 11, 12]
      },
      {
        department: "Projects",
        metric: "Phase Completion",
        value: "65%",
        target: "70%",
        status: "at_risk",
        trend: "stable",
        chartData: [50, 55, 60, 65]
      },
      {
        department: "Operations",
        metric: "Service Reliability",
        value: "98.5%",
        target: "99%",
        status: "on_track",
        trend: "up",
        chartData: [97, 97.5, 98, 98.5]
      }
    ]);

    // Tasks
    setTasks([
      {
        id: "1",
        title: "Review Q3 Budget Report",
        description: "Analyze budget performance and prepare recommendations",
        assignedTo: "Finance Manager",
        dueDate: "2025-10-20",
        priority: "high",
        status: "pending",
        department: "Finance",
        createdBy: "Director"
      },
      {
        id: "2",
        title: "Safety Protocol Update",
        description: "Update safety protocols based on recent incidents",
        assignedTo: "Safety Director",
        dueDate: "2025-10-25",
        priority: "urgent",
        status: "in_progress",
        department: "Health & Safety",
        createdBy: "Director"
      }
    ]);

    // Escalations
    setEscalations([
      {
        id: "1",
        title: "Budget Overrun - Phase 2",
        description: "Construction costs exceeded allocated budget by 15%",
        fromDepartment: "Projects",
        toExecutive: "Executive",
        priority: "high",
        status: "pending",
        createdAt: "2025-09-15",
        dueDate: "2025-10-01"
      }
    ]);

    // Notifications
    setNotifications([
      {
        id: "1",
        title: "Urgent Document Upload",
        message: "Safety incident report requires immediate review",
        type: "urgent",
        isRead: false,
        timestamp: "2025-09-20 14:30",
        department: "Health & Safety",
        actionRequired: true
      },
      {
        id: "2",
        title: "New Comment on Project Document",
        message: "Projects Director commented on Phase 2 proposal",
        type: "comment",
        isRead: false,
        timestamp: "2025-09-20 13:45",
        department: "Projects",
        actionRequired: false
      }
    ]);

    // Documents
    setDocuments([
      {
        id: "1",
        title: "Q3 Financial Report",
        domain: "Finance",
        status: "Under Review",
        summary: "Quarterly financial performance analysis",
        nextResponsible: "Finance Manager",
        deadline: "2025-10-15",
        uploadedBy: "Finance Director",
        uploadedAt: "2025-09-20",
        allowedDepartments: ["Finance", "Legal"],
        commentsResolved: false,
        comments: [
          {
            id: "1",
            departmentName: "Finance",
            author: "Finance Manager",
            message: "This invoice requires immediate attention. The amount exceeds our standard approval threshold.",
            timestamp: "2025-09-20 10:30",
            parentId: undefined
          },
          {
            id: "2",
            departmentName: "Legal",
            author: "Legal Director",
            message: "I've reviewed the contract terms. Everything looks compliant with our legal requirements.",
            timestamp: "2025-09-20 11:15",
            parentId: undefined
          },
          {
            id: "3",
            departmentName: "Finance",
            author: "Finance Manager",
            message: "Thank you for the legal review. I'll proceed with the approval process.",
            timestamp: "2025-09-20 11:45",
            parentId: "2"
          }
        ]
      },
      {
        id: "2",
        title: "Safety Protocol Update",
        domain: "Health & Safety",
        status: "Under Review",
        summary: "Updated safety protocols following recent incident analysis and regulatory changes",
        nextResponsible: "Safety Manager",
        deadline: "2025-10-05",
        uploadedBy: "Safety Director",
        uploadedAt: "2025-09-19",
        allowedDepartments: ["Health & Safety", "Legal"],
        commentsResolved: false,
        comments: [
          {
            id: "4",
            departmentName: "Health & Safety",
            author: "Safety Manager",
            message: "The new protocols look comprehensive. I've identified a few areas that need clarification.",
            timestamp: "2025-09-19 15:20",
            parentId: undefined
          },
          {
            id: "5",
            departmentName: "Legal",
            author: "Legal Director",
            message: "I've reviewed the legal implications. These protocols align well with current regulations.",
            timestamp: "2025-09-19 16:45",
            parentId: undefined
          }
        ]
      },
      {
        id: "3",
        title: "Project Phase 2 Budget Approval",
        domain: "Projects",
        status: "Pending",
        summary: "Budget proposal for Phase 2 of the metro extension project requiring executive approval",
        nextResponsible: "Executive",
        deadline: "2025-09-25",
        uploadedBy: "Projects Director",
        uploadedAt: "2025-09-18",
        allowedDepartments: ["Projects", "Finance"],
        commentsResolved: false,
        comments: [
          {
            id: "6",
            departmentName: "Projects",
            author: "Projects Director",
            message: "This budget includes all necessary contingencies for Phase 2. Ready for review.",
            timestamp: "2025-09-18 14:30",
            parentId: undefined
          },
          {
            id: "7",
            departmentName: "Finance",
            author: "Finance Manager",
            message: "I've verified the financial projections. The budget looks realistic and well-planned.",
            timestamp: "2025-09-18 16:15",
            parentId: undefined
          }
        ]
      }
    ]);

    // Mock projects data for timeline
    const mockProjects = [
      {
        id: '1',
        name: 'Kakkanad Metro Extension',
        description: 'Extension of metro line to Kakkanad IT hub',
        startDate: '2025-01-01',
        endDate: '2027-12-31',
        status: 'active',
        totalProgress: 35,
        budget: 12000000000,
        actualCost: 4200000000,
        riskLevel: 'medium',
        phases: []
      }
    ];
    setProjects(mockProjects);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'in_progress': return 'bg-blue-500 text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'overdue': return 'bg-red-500 text-white';
      case 'due_soon': return 'bg-orange-500 text-white';
      case 'upcoming': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDomainColor = (domain: string) => {
    const colors = {
      'Finance': 'bg-blue-500',
      'Projects': 'bg-green-500',
      'Systems & Operations': 'bg-orange-500',
      'Legal': 'bg-purple-500',
      'Health & Safety': 'bg-red-500'
    };
    return colors[domain as keyof typeof colors] || 'bg-gray-500';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <div className="h-4 w-4 bg-gray-500 rounded-full" />;
      default: return null;
    }
  };

  const handleCreateTask = () => {
    if (newTask.title && newTask.assignedTo && newTask.dueDate) {
      const task: Task = {
        id: Date.now().toString(),
        ...newTask,
        status: 'pending',
        createdBy: 'Director'
      };
      setTasks(prev => [...prev, task]);
      setNewTask({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        priority: "medium",
        department: ""
      });
      setIsNewTaskOpen(false);
    }
  };

  const handleCreateCompliance = () => {
    if (newCompliance.title && newCompliance.dueDate) {
      const compliance: ComplianceDeadline = {
        id: Date.now().toString(),
        ...newCompliance,
        status: 'upcoming'
      };
      setComplianceDeadlines(prev => [...prev, compliance]);
      setNewCompliance({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        department: "",
        assignedTo: ""
      });
      setIsNewComplianceOpen(false);
    }
  };

  const handleEscalate = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const escalation: Escalation = {
        id: Date.now().toString(),
        title: `Escalated: ${task.title}`,
        description: task.description,
        fromDepartment: task.department,
        toExecutive: "Executive",
        priority: task.priority,
        status: "pending",
        createdAt: new Date().toISOString().split('T')[0],
        dueDate: task.dueDate
      };
      setEscalations(prev => [...prev, escalation]);
    }
  };

  const handleRejectDocument = (document: Document) => {
    const reason = prompt(`Please provide a reason for rejecting "${document.title}":`);
    if (reason && reason.trim()) {
      // Update document status to rejected
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === document.id ? { 
            ...doc, 
            status: 'Rejected' as Document['status'],
            summary: `❌ REJECTED: ${reason}\n\nOriginal Summary: ${doc.summary}`,
            nextResponsible: "Returned to Originator"
          } : doc
        )
      );
      
      // Show confirmation
      alert(`Document "${document.title}" has been rejected.`);
    }
  };

  const handleAddComment = (documentId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString()
    };

    setDocuments(prev => 
      prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, comments: [...(doc.comments || []), newComment] }
          : doc
      )
    );
  };

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsDocumentViewOpen(true);
  };

  const handleAddCommentClick = (document: Document) => {
    setSelectedDocument(document);
    setIsCommentDialogOpen(true);
  };

  const handleSubmitComment = () => {
    if (selectedDocument && newComment.trim()) {
      const comment: Omit<Comment, 'id' | 'timestamp'> = {
        message: newComment,
        author: currentRole,
        departmentName: "Director"
      };
      handleAddComment(selectedDocument.id, comment);
      setNewComment("");
      setIsCommentDialogOpen(false);
    }
  };

  const handleMarkNotificationRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        currentRole={currentRole} 
        userName="Director Name"
        onNotificationsClick={() => setIsNotificationsOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onLogoutClick={() => {
          if (confirm("Are you sure you want to logout?")) {
            onBackToRoleSelection();
          }
        }}
      />
      
      <div className="container mx-auto px-6 py-6">
        {/* Header with Notifications */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Director Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive oversight and management tools</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="relative"
              onClick={() => setIsNotificationsOpen(true)}
            >
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
            <TabsTrigger value="kpis">KPIs</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-orange-800">
                    <span className="text-sm font-medium">Pending Tasks</span>
                    <Clock className="h-5 w-5" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-900">
                    {tasks.filter(t => t.status === 'pending').length}
                  </div>
                  <p className="text-xs text-orange-700 mt-1">Require immediate attention</p>
                  <div className="mt-2 text-xs text-orange-600">
                    {tasks.filter(t => t.priority === 'urgent' && t.status === 'pending').length} urgent
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-red-800">
                    <span className="text-sm font-medium">Due Soon</span>
                    <AlertTriangle className="h-5 w-5" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-900">
                    {complianceDeadlines.filter(c => c.status === 'due_soon').length}
                  </div>
                  <p className="text-xs text-red-700 mt-1">Compliance deadlines</p>
                  <div className="mt-2 text-xs text-red-600">
                    {complianceDeadlines.filter(c => c.status === 'overdue').length} overdue
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-blue-800">
                    <span className="text-sm font-medium">Active Escalations</span>
                    <ArrowUp className="h-5 w-5" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900">
                    {escalations.filter(e => e.status === 'pending').length}
                  </div>
                  <p className="text-xs text-blue-700 mt-1">Awaiting resolution</p>
                  <div className="mt-2 text-xs text-blue-600">
                    {escalations.filter(e => e.priority === 'urgent' && e.status === 'pending').length} urgent
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-purple-800">
                    <span className="text-sm font-medium">Unread Alerts</span>
                    <Bell className="h-5 w-5" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900">
                    {unreadNotifications}
                  </div>
                  <p className="text-xs text-purple-700 mt-1">New notifications</p>
                  <div className="mt-2 text-xs text-purple-600">
                    {notifications.filter(n => n.actionRequired && !n.isRead).length} require action
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Department Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Department Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {['Finance', 'Projects', 'Health & Safety', 'Legal', 'Systems & Operations'].map(dept => {
                    const deptTasks = tasks.filter(t => t.department === dept);
                    const deptCompliance = complianceDeadlines.filter(c => c.department === dept);
                    const deptDocuments = documents.filter(d => d.domain === dept);
                    const deptNotifications = notifications.filter(n => n.department === dept);
                    
                    return (
                      <div key={dept} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-lg">{dept}</h3>
                          <Badge className={`text-xs ${getDomainColor(dept)}`}>
                            {dept}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Active Tasks:</span>
                            <span className="font-medium">{deptTasks.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Compliance Items:</span>
                            <span className="font-medium">{deptCompliance.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Documents:</span>
                            <span className="font-medium">{deptDocuments.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Notifications:</span>
                            <span className="font-medium">{deptNotifications.length}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Pending Tasks:</span>
                            <span className="text-orange-600 font-medium">
                              {deptTasks.filter(t => t.status === 'pending').length}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Due Soon:</span>
                            <span className="text-red-600 font-medium">
                              {deptCompliance.filter(c => c.status === 'due_soon').length}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* KPI Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  KPI Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {kpiMetrics.map((metric, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{metric.metric}</h3>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(metric.trend)}
                          <Badge className={
                            metric.status === 'on_track' ? 'bg-green-500' :
                            metric.status === 'at_risk' ? 'bg-yellow-500' : 'bg-red-500'
                          }>
                            {metric.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">{metric.value}</span>
                          <span className="text-sm text-muted-foreground">Target: {metric.target}</span>
                        </div>
                        
                        <div className="w-full bg-muted rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              metric.status === 'on_track' ? 'bg-green-500' :
                              metric.status === 'at_risk' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(parseInt(metric.value), 100)}%` }}
                          />
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          Department: {metric.department}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.slice(0, 5).map(notification => (
                      <div key={notification.id} className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        notification.isRead ? 'bg-muted/50' : 'bg-background hover:bg-muted/30'
                      }`}
                      onClick={() => handleMarkNotificationRead(notification.id)}>
                      <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{notification.title}</p>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                              {notification.actionRequired && (
                                <Badge className="bg-red-500 text-white text-xs">
                                  Action Required
                                </Badge>
                              )}
                        </div>
                            <p className="text-xs text-muted-foreground mb-1">{notification.message}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{notification.timestamp}</span>
                        <Badge variant="outline" className="text-xs">
                          {notification.department}
                        </Badge>
                            </div>
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
                    <FileText className="h-5 w-5" />
                    Recent Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documents.slice(0, 5).map(document => (
                      <div key={document.id} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-sm mb-1">{document.title}</h3>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{document.summary}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge className={`text-xs ${getDomainColor(document.domain)}`}>
                                {document.domain}
                              </Badge>
                              <Badge className={getStatusColor(document.status)}>
                                {document.status}
                              </Badge>
                              <span>{document.uploadedAt}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-16 flex flex-col items-center gap-2 hover:bg-orange-50 hover:border-orange-300 transition-colors"
                    onClick={() => setIsNewTaskOpen(true)}
                  >
                    <Plus className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium">Assign Task</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-16 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    onClick={() => setIsNewComplianceOpen(true)}
                  >
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Add Compliance</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-16 flex flex-col items-center gap-2 hover:bg-green-50 hover:border-green-300 transition-colors"
                    onClick={() => {
                      setActiveTab("timeline");
                      // Add notification
                      const newNotification = {
                        id: Date.now().toString(),
                        title: "Quick Action",
                        message: "Switched to Project Timeline view",
                        type: "urgent" as const,
                        isRead: false,
                        timestamp: new Date().toLocaleString(),
                        department: "Director",
                        actionRequired: false
                      };
                      setNotifications(prev => [newNotification, ...prev]);
                    }}
                  >
                    <Target className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">View Timeline</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-16 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-300 transition-colors"
                    onClick={() => {
                      setActiveTab("analytics");
                      // Add notification
                      const newNotification = {
                        id: Date.now().toString(),
                        title: "Quick Action",
                        message: "Switched to Analytics view",
                        type: "urgent" as const,
                        isRead: false,
                        timestamp: new Date().toLocaleString(),
                        department: "Director",
                        actionRequired: false
                      };
                      setNotifications(prev => [newNotification, ...prev]);
                    }}
                  >
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium">View Analytics</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-16 flex flex-col items-center gap-2 hover:bg-red-50 hover:border-red-300 transition-colors"
                    onClick={() => {
                      setActiveTab("compliance");
                      // Add notification
                      const newNotification = {
                        id: Date.now().toString(),
                        title: "Quick Action",
                        message: "Switched to Compliance view",
                        type: "urgent" as const,
                        isRead: false,
                        timestamp: new Date().toLocaleString(),
                        department: "Director",
                        actionRequired: false
                      };
                      setNotifications(prev => [newNotification, ...prev]);
                    }}
                  >
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium">Compliance</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-16 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    onClick={() => {
                      setActiveTab("collaboration");
                      // Add notification
                      const newNotification = {
                        id: Date.now().toString(),
                        title: "Quick Action",
                        message: "Switched to Collaboration view",
                        type: "urgent" as const,
                        isRead: false,
                        timestamp: new Date().toLocaleString(),
                        department: "Director",
                        actionRequired: false
                      };
                      setNotifications(prev => [newNotification, ...prev]);
                    }}
                  >
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Collaboration</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-16 flex flex-col items-center gap-2 hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
                    onClick={() => {
                      setActiveTab("kpis");
                      // Add notification
                      const newNotification = {
                        id: Date.now().toString(),
                        title: "Quick Action",
                        message: "Switched to KPIs view",
                        type: "urgent" as const,
                        isRead: false,
                        timestamp: new Date().toLocaleString(),
                        department: "Director",
                        actionRequired: false
                      };
                      setNotifications(prev => [newNotification, ...prev]);
                    }}
                  >
                    <TrendingUp className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium">View KPIs</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-16 flex flex-col items-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    onClick={() => {
                      setActiveTab("tasks");
                      // Add notification
                      const newNotification = {
                        id: Date.now().toString(),
                        title: "Quick Action",
                        message: "Switched to Tasks view",
                        type: "urgent" as const,
                        isRead: false,
                        timestamp: new Date().toLocaleString(),
                        department: "Director",
                        actionRequired: false
                      };
                      setNotifications(prev => [newNotification, ...prev]);
                    }}
                  >
                    <CheckCircle className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium">View Tasks</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <ProjectTimeline 
              currentRole={currentRole}
              projects={projects}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <TimelineAnalytics 
              currentRole={currentRole}
              projects={projects}
            />
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Compliance & Deadlines</h2>
              <Button onClick={() => setIsNewComplianceOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Compliance
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complianceDeadlines.map(deadline => (
                <Card key={deadline.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{deadline.title}</CardTitle>
                      <Badge className={`text-xs ${getPriorityColor(deadline.priority)}`}>
                        {deadline.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{deadline.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Department:</span>
                        <span>{deadline.department}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Due Date:</span>
                        <span>{deadline.dueDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Assigned To:</span>
                        <span>{deadline.assignedTo}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={`text-xs ${getStatusColor(deadline.status)}`}>
                          {deadline.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Collaboration Tab */}
          <TabsContent value="collaboration" className="space-y-6">
            <h2 className="text-2xl font-bold">Inter-Department Collaboration</h2>
            
            <div className="space-y-6">
              {documents.map(document => (
                <Card key={document.id} className="shadow-card hover:shadow-elevated transition-all duration-300 border-l-4 border-l-primary/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* Document Title and Icon */}
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-foreground leading-tight mb-2">
                              {document.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge className={`text-xs px-2 py-1 ${getDomainColor(document.domain)}`}>
                                {document.domain}
                              </Badge>
                              <Badge className={`text-xs px-2 py-1 ${getStatusColor(document.status)}`}>
                                {document.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      {/* Document Summary */}
                      <div className="bg-gradient-to-r from-muted/30 to-muted/10 p-5 rounded-lg border-l-4 border-primary">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                            Document Summary
                          </h4>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">
                          {document.summary}
                        </p>
                      </div>
                      
                      {/* Document Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-background/50 p-4 rounded-lg border">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Deadline</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground">{document.deadline}</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-lg border">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Uploaded By</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground">{document.uploadedBy}</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-lg border">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Upload Date</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground">{document.uploadedAt}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Comments Section */}
                  <div className="border-t border-border/50">
                    <CommentThread
                      documentId={document.id}
                      comments={document.comments || []}
                      userRole={currentRole}
                      userDepartment="Director"
                      allowedDepartments={document.allowedDepartments}
                      commentsResolved={document.commentsResolved}
                      onAddComment={handleAddComment}
                      onResolve={(documentId) => {
                        setDocuments(prev => 
                          prev.map(doc => 
                            doc.id === documentId 
                              ? { ...doc, commentsResolved: true }
                              : doc
                          )
                        );
                      }}
                      onReply={(documentId, parentId, message, userRole, userDepartment) => {
                        const replyComment = {
                          message,
                          author: userRole,
                          departmentName: userDepartment,
                          parentId
                        };
                        handleAddComment(documentId, replyComment);
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* KPIs Tab */}
          <TabsContent value="kpis" className="space-y-6">
            <h2 className="text-2xl font-bold">KPIs & Metrics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {kpiMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{metric.metric}</span>
                      {getTrendIcon(metric.trend)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{metric.department}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{metric.value}</span>
                        <span className="text-sm text-muted-foreground">Target: {metric.target}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            metric.status === 'on_track' ? 'bg-green-500' :
                            metric.status === 'at_risk' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${parseInt(metric.value)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={
                          metric.status === 'on_track' ? 'bg-green-500' :
                          metric.status === 'at_risk' ? 'bg-yellow-500' : 'bg-red-500'
                        }>
                          {metric.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Task & Escalation Management</h2>
              <Button onClick={() => setIsNewTaskOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Assign Task
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasks.map(task => (
                      <div key={task.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{task.title}</h3>
                          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span>Assigned to: {task.assignedTo}</span>
                          <span>Due: {task.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.replace('_', ' ')}
                          </Badge>
                          <Button size="sm" variant="outline" onClick={() => handleEscalate(task.id)}>
                            <ArrowUp className="h-3 w-3 mr-1" />
                            Escalate
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Escalations */}
              <Card>
                <CardHeader>
                  <CardTitle>Escalations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {escalations.map(escalation => (
                      <div key={escalation.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{escalation.title}</h3>
                          <Badge className={`text-xs ${getPriorityColor(escalation.priority)}`}>
                            {escalation.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{escalation.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span>From: {escalation.fromDepartment}</span>
                          <span>To: {escalation.toExecutive}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge className={getStatusColor(escalation.status)}>
                            {escalation.status.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Created: {escalation.createdAt}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Knowledge Tab */}
          <TabsContent value="knowledge" className="space-y-6">
            <h2 className="text-2xl font-bold">Knowledge Hub</h2>
            
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Departments</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Projects">Projects</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                  <SelectItem value="Health & Safety">Health & Safety</SelectItem>
                  <SelectItem value="Systems & Operations">Systems & Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {documents
                .filter(doc => 
                  (selectedDepartment === "All" || doc.domain === selectedDepartment) &&
                  (searchQuery === "" || 
                   doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   doc.summary.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map(document => (
                <Card key={document.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {document.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{document.domain}</Badge>
                      <Badge className={getStatusColor(document.status)}>
                        {document.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{document.summary}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Uploaded by: {document.uploadedBy}</span>
                      <span>Deadline: {document.deadline}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDocument(document)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Full Document
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAddCommentClick(document)}
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Add Comment
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRejectDocument(document)}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* New Task Dialog */}
        <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Assign to"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask(prev => ({ ...prev, assignedTo: e.target.value }))}
                />
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select value={newTask.priority} onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value as any }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={newTask.department} onValueChange={(value) => setNewTask(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Projects">Projects</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                    <SelectItem value="Health & Safety">Health & Safety</SelectItem>
                    <SelectItem value="Systems & Operations">Systems & Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateTask} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Assign Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* New Compliance Dialog */}
        <Dialog open={isNewComplianceOpen} onOpenChange={setIsNewComplianceOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Compliance Deadline</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Compliance title"
                value={newCompliance.title}
                onChange={(e) => setNewCompliance(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="Description"
                value={newCompliance.description}
                onChange={(e) => setNewCompliance(prev => ({ ...prev, description: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={newCompliance.dueDate}
                  onChange={(e) => setNewCompliance(prev => ({ ...prev, dueDate: e.target.value }))}
                />
                <Select value={newCompliance.priority} onValueChange={(value) => setNewCompliance(prev => ({ ...prev, priority: value as any }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select value={newCompliance.department} onValueChange={(value) => setNewCompliance(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Projects">Projects</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                    <SelectItem value="Health & Safety">Health & Safety</SelectItem>
                    <SelectItem value="Systems & Operations">Systems & Operations</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Assign to"
                  value={newCompliance.assignedTo}
                  onChange={(e) => setNewCompliance(prev => ({ ...prev, assignedTo: e.target.value }))}
                />
              </div>
              <Button onClick={handleCreateCompliance} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Compliance
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Document View Dialog */}
        <Dialog open={isDocumentViewOpen} onOpenChange={setIsDocumentViewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {selectedDocument?.title}
              </DialogTitle>
            </DialogHeader>
            {selectedDocument && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Domain</h3>
                    <Badge className={`text-xs ${getDomainColor(selectedDocument.domain)}`}>
                      {selectedDocument.domain}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
                    <Badge className={getStatusColor(selectedDocument.status)}>
                      {selectedDocument.status}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Uploaded By</h3>
                    <p className="text-sm">{selectedDocument.uploadedBy}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Deadline</h3>
                    <p className="text-sm">{selectedDocument.deadline}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Summary</h3>
                  <p className="text-sm bg-muted/50 p-4 rounded-lg">{selectedDocument.summary}</p>
                </div>

                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Full Document Content</h3>
                  <div className="bg-muted/30 p-4 rounded-lg border-2 border-dashed border-muted-foreground/20">
                    <p className="text-sm text-muted-foreground text-center">
                      This is a mock document view. In a real application, this would display the actual document content, 
                      PDF viewer, or file preview based on the document type.
                    </p>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Document ID: {selectedDocument.id} | Uploaded: {selectedDocument.uploadedAt}
                    </p>
                  </div>
                </div>

                {selectedDocument.comments && selectedDocument.comments.length > 0 && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Comments</h3>
                    <div className="space-y-2">
                      {selectedDocument.comments.map(comment => (
                        <div key={comment.id} className="bg-muted/30 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">({comment.departmentName})</span>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm">{comment.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Comment Dialog */}
        <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Comment to {selectedDocument?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
              />
              <div className="flex gap-2">
                <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Post Comment
                </Button>
                <Button variant="outline" onClick={() => {
                  setNewComment("");
                  setIsCommentDialogOpen(false);
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Notifications Dialog */}
        <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                All Notifications
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {notifications.map(notification => (
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
                        <Badge variant="outline" className="text-xs">
                          {notification.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Department: {notification.department}</span>
                        <span>{notification.timestamp}</span>
                        {notification.actionRequired && (
                          <Badge className="bg-red-500 text-white text-xs">
                            Action Required
                          </Badge>
                        )}
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
                Director Profile
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Director Name</h3>
                <p className="text-muted-foreground">{currentRole}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="text-sm">director@kmrl.org</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Department:</span>
                  <span className="text-sm">Executive</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Login:</span>
                  <span className="text-sm">Today, 8:45 AM</span>
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
                Director Settings
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Notification Preferences</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Email notifications</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Push notifications</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">SMS notifications</span>
                  </label>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Display Preferences</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="theme" defaultChecked className="rounded" />
                    <span className="text-sm">Light theme</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="theme" className="rounded" />
                    <span className="text-sm">Dark theme</span>
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
      </div>
    </div>
  );
};

export default DirectorDashboard;
