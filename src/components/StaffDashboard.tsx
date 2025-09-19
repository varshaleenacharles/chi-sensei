import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  MessageSquare,
  Bell,
  Search,
  Filter,
  Plus,
  Send,
  Eye,
  Edit,
  User,
  Calendar,
  Target,
  TrendingUp,
  BarChart3,
  History,
  Star,
  Flag,
  Settings,
  X
} from "lucide-react";
import DashboardHeader from "./DashboardHeader";
import CommentThread from "./CommentThread";
import { Document, Comment } from "./DocumentCard";
import ProjectTimeline from "./ProjectTimeline";
import TimelineAnalytics from "./TimelineAnalytics";

interface StaffTask {
  id: string;
  title: string;
  description: string;
  assignedBy: string;
  assignedAt: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'completed' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  domain: string;
  attachments?: string[];
  notes?: string;
  feedback?: string;
  completedAt?: string;
}

interface StaffNotification {
  id: string;
  title: string;
  message: string;
  type: 'new_task' | 'deadline' | 'status_change' | 'comment' | 'feedback';
  isRead: boolean;
  timestamp: string;
  taskId?: string;
  documentId?: string;
  fromManager: string;
}

interface StaffPerformance {
  month: string;
  tasksCompleted: number;
  tasksPending: number;
  tasksOverdue: number;
  documentsUploaded: number;
  averageCompletionTime: number; // in days
  complianceRate: number; // percentage
}

interface StaffDashboardProps {
  currentRole: string;
  onBackToRoleSelection: () => void;
}

const StaffDashboard = ({ currentRole, onBackToRoleSelection }: StaffDashboardProps) => {
  const [tasks, setTasks] = useState<StaffTask[]>([]);
  const [notifications, setNotifications] = useState<StaffNotification[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [performance, setPerformance] = useState<StaffPerformance | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [isDocumentViewOpen, setIsDocumentViewOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<StaffTask | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newUpload, setNewUpload] = useState({
    title: "",
    description: "",
    domain: "",
    notes: "",
    file: null as File | null
  });

  // Mock data initialization
  useEffect(() => {
    // Staff Tasks
    setTasks([
      {
        id: "1",
        title: "Upload Q3 Financial Report",
        description: "Prepare and upload quarterly financial report for review",
        assignedBy: "Finance Manager",
        assignedAt: "2025-09-15",
        dueDate: "2025-09-30",
        status: "pending",
        priority: "high",
        domain: "Finance",
        notes: "Include all supporting documents"
      },
      {
        id: "2",
        title: "Update Safety Job Cards",
        description: "Update job cards for Station A safety inspection",
        assignedBy: "Safety Manager",
        assignedAt: "2025-09-18",
        dueDate: "2025-09-25",
        status: "in_progress",
        priority: "urgent",
        domain: "Health & Safety",
        notes: "Focus on electrical safety protocols"
      },
      {
        id: "3",
        title: "Draft Project Status Report",
        description: "Create monthly project status report for Phase 2",
        assignedBy: "Projects Manager",
        assignedAt: "2025-09-10",
        dueDate: "2025-09-20",
        status: "submitted",
        priority: "medium",
        domain: "Projects",
        feedback: "Good work, please add more details on budget allocation"
      }
    ]);

    // Notifications
    setNotifications([
      {
        id: "1",
        title: "New Task Assigned",
        message: "Finance Manager assigned you a new task: Upload Q3 Financial Report",
        type: "new_task",
        isRead: false,
        timestamp: "2025-09-20 09:30",
        taskId: "1",
        fromManager: "Finance Manager"
      },
      {
        id: "2",
        title: "Deadline Approaching",
        message: "Safety Job Cards update due in 2 days",
        type: "deadline",
        isRead: false,
        timestamp: "2025-09-20 14:15",
        taskId: "2",
        fromManager: "Safety Manager"
      },
      {
        id: "3",
        title: "Status Update",
        message: "Your Project Status Report is now Under Review",
        type: "status_change",
        isRead: true,
        timestamp: "2025-09-19 16:45",
        taskId: "3",
        fromManager: "Projects Manager"
      }
    ]);

    // Documents (filtered for staff)
    setDocuments([
      {
        id: "1",
        title: "Q3 Financial Report Template",
        domain: "Finance",
        status: "Under Review",
        summary: "Template for quarterly financial reporting",
        nextResponsible: "Finance Manager",
        deadline: "2025-09-30",
        uploadedBy: "Finance Staff",
        uploadedAt: "2025-09-15",
        allowedDepartments: ["Finance"],
        commentsResolved: false,
        comments: [
          {
            id: "1",
            departmentName: "Finance",
            author: "Finance Staff",
            message: "I've prepared the template as requested. Please review and let me know if any changes are needed.",
            timestamp: "2025-09-15 14:20",
            parentId: undefined
          },
          {
            id: "2",
            departmentName: "Finance",
            author: "Finance Manager",
            message: "Good work on the template. I've made a few minor adjustments. Please use this version going forward.",
            timestamp: "2025-09-15 16:45",
            parentId: undefined
          }
        ]
      }
    ]);

    // Performance Data
    setPerformance({
      month: "September 2025",
      tasksCompleted: 8,
      tasksPending: 2,
      tasksOverdue: 0,
      documentsUploaded: 12,
      averageCompletionTime: 3.5,
      complianceRate: 90
    });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'submitted': return 'bg-blue-500 text-white';
      case 'in_progress': return 'bg-yellow-500 text-white';
      case 'pending': return 'bg-gray-500 text-white';
      case 'urgent': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'submitted': return '🟣';
      case 'in_progress': return '🟡';
      case 'pending': return '🟡';
      case 'urgent': return '🔴';
      default: return '🟡';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
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

  const handleTaskStatusChange = (taskId: string, newStatus: StaffTask['status']) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: newStatus,
              completedAt: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : task.completedAt
            }
          : task
      )
    );
  };

  const handleUpload = () => {
    if (newUpload.title && newUpload.domain) {
      const document: Document = {
        id: Date.now().toString(),
        title: newUpload.title,
        domain: newUpload.domain as 'Finance' | 'Projects' | 'Systems & Operations' | 'Legal' | 'Health & Safety',
        status: "Pending",
        summary: newUpload.description,
        nextResponsible: "Manager",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        uploadedBy: "Staff Member",
        uploadedAt: new Date().toISOString().split('T')[0],
        allowedDepartments: [newUpload.domain as 'Finance' | 'Projects' | 'Systems & Operations' | 'Legal' | 'Health & Safety'],
        commentsResolved: false,
        comments: []
      };
      
      setDocuments(prev => [document, ...prev]);
      setNewUpload({
        title: "",
        description: "",
        domain: "",
        notes: "",
        file: null
      });
      setIsUploadOpen(false);
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
        departmentName: "Staff"
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

  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'completed' || t.status === 'submitted') return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        currentRole={currentRole} 
        userName="Staff Member"
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
            <h1 className="text-3xl font-bold text-foreground">Staff Dashboard</h1>
            <p className="text-muted-foreground">Your tasks, documents, and performance overview</p>
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
            <Button onClick={() => setIsUploadOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="tasks">My Tasks</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">
                    {pendingTasks}
                  </div>
                  <p className="text-xs text-muted-foreground">Pending & In Progress</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">
                    {completedTasks}
                  </div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">
                    {overdueTasks}
                  </div>
                  <p className="text-xs text-muted-foreground">Require attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-500">
                    {unreadNotifications}
                  </div>
                  <p className="text-xs text-muted-foreground">Unread alerts</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Overview */}
            {performance && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Overview - {performance.month}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Compliance Rate</span>
                        <span className="text-sm text-muted-foreground">{performance.complianceRate}%</span>
                      </div>
                      <Progress value={performance.complianceRate} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Avg. Completion Time</span>
                        <span className="text-sm text-muted-foreground">{performance.averageCompletionTime} days</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Documents Uploaded</span>
                        <span className="text-sm text-muted-foreground">{performance.documentsUploaded}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Notifications */}
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
                    <div key={notification.id} className={`p-3 rounded-lg border ${notification.isRead ? 'bg-muted/50' : 'bg-background'}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {notification.fromManager}
                        </Badge>
                      </div>
                    </div>
                  ))}
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

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Tasks</h2>
              <div className="flex gap-2">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Tasks</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks
                .filter(task => selectedStatus === "All" || task.status === selectedStatus)
                .map(task => (
                <Card key={task.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getStatusIcon(task.status)}</span>
                        <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Assigned by:</span>
                        <span>{task.assignedBy}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Due Date:</span>
                        <span>{task.dueDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Domain:</span>
                        <Badge className={`text-xs ${getDomainColor(task.domain)}`}>
                          {task.domain}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      {task.feedback && (
                        <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                          <strong>Feedback:</strong> {task.feedback}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      {task.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleTaskStatusChange(task.id, 'in_progress')}
                          className="flex-1"
                        >
                          Start Task
                        </Button>
                      )}
                      {task.status === 'in_progress' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleTaskStatusChange(task.id, 'submitted')}
                          className="flex-1"
                        >
                          Mark as Submitted
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsTaskDetailOpen(true);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <h2 className="text-2xl font-bold">My Documents</h2>
            
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-background/50 p-4 rounded-lg border">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Deadline</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground">{document.deadline}</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-lg border">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Uploaded</span>
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
                      userDepartment="Staff"
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

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <h2 className="text-2xl font-bold">Performance & Tracking</h2>
            
            {performance && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Monthly Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Tasks Completed</span>
                        <span className="text-2xl font-bold text-green-500">{performance.tasksCompleted}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Tasks Pending</span>
                        <span className="text-2xl font-bold text-yellow-500">{performance.tasksPending}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Tasks Overdue</span>
                        <span className="text-2xl font-bold text-red-500">{performance.tasksOverdue}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Documents Uploaded</span>
                        <span className="text-2xl font-bold text-blue-500">{performance.documentsUploaded}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Compliance Rate</span>
                          <span className="text-sm text-muted-foreground">{performance.complianceRate}%</span>
                        </div>
                        <Progress value={performance.complianceRate} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Average Completion Time</span>
                          <span className="text-sm text-muted-foreground">{performance.averageCompletionTime} days</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Task History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recent Task History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.slice(0, 5).map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Assigned by {task.assignedBy} • Due {task.dueDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getStatusIcon(task.status)}</span>
                        <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
            </div>

            <div className="space-y-4">
              {documents
                .filter(doc => 
                  searchQuery === "" || 
                  doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  doc.summary.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(document => (
                <Card key={document.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {document.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getDomainColor(document.domain)}`}>
                        {document.domain}
                      </Badge>
                      <Badge className={getStatusColor(document.status)}>
                        {document.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{document.summary}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Uploaded: {document.uploadedAt}</span>
                      <span>Deadline: {document.deadline}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDocument(document)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Document
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

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <h2 className="text-2xl font-bold">All Notifications</h2>
            
            <div className="space-y-4">
              {notifications.map(notification => (
                <Card key={notification.id} className={`${notification.isRead ? 'bg-muted/50' : 'bg-background'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{notification.title}</h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>From: {notification.fromManager}</span>
                          <span>{notification.timestamp}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {notification.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Upload Document Dialog */}
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Document title"
                value={newUpload.title}
                onChange={(e) => setNewUpload(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="Document description"
                value={newUpload.description}
                onChange={(e) => setNewUpload(prev => ({ ...prev, description: e.target.value }))}
              />
              <Select value={newUpload.domain} onValueChange={(value) => setNewUpload(prev => ({ ...prev, domain: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Projects">Projects</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                  <SelectItem value="Health & Safety">Health & Safety</SelectItem>
                  <SelectItem value="Systems & Operations">Systems & Operations</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Additional notes (optional)"
                value={newUpload.notes}
                onChange={(e) => setNewUpload(prev => ({ ...prev, notes: e.target.value }))}
              />
              <Button onClick={handleUpload} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Task Detail Dialog */}
        <Dialog open={isTaskDetailOpen} onOpenChange={setIsTaskDetailOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Task Details</DialogTitle>
            </DialogHeader>
            {selectedTask && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">{selectedTask.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Assigned by:</span>
                    <p className="font-medium">{selectedTask.assignedBy}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Due Date:</span>
                    <p className="font-medium">{selectedTask.dueDate}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Priority:</span>
                    <Badge className={`text-xs ${getPriorityColor(selectedTask.priority)}`}>
                      {selectedTask.priority}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Domain:</span>
                    <Badge className={`text-xs ${getDomainColor(selectedTask.domain)}`}>
                      {selectedTask.domain}
                    </Badge>
                  </div>
                </div>
                {selectedTask.notes && (
                  <div>
                    <span className="text-muted-foreground text-sm">Notes:</span>
                    <p className="text-sm">{selectedTask.notes}</p>
                  </div>
                )}
                {selectedTask.feedback && (
                  <div>
                    <span className="text-muted-foreground text-sm">Feedback:</span>
                    <p className="text-sm bg-muted/50 p-2 rounded">{selectedTask.feedback}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  {selectedTask.status === 'pending' && (
                    <Button onClick={() => {
                      handleTaskStatusChange(selectedTask.id, 'in_progress');
                      setIsTaskDetailOpen(false);
                    }}>
                      Start Task
                    </Button>
                  )}
                  {selectedTask.status === 'in_progress' && (
                    <Button onClick={() => {
                      handleTaskStatusChange(selectedTask.id, 'submitted');
                      setIsTaskDetailOpen(false);
                    }}>
                      Mark as Submitted
                    </Button>
                  )}
                </div>
              </div>
            )}
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
                        <span>From: {notification.fromManager}</span>
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
                Staff Profile
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Staff Member</h3>
                <p className="text-muted-foreground">{currentRole}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="text-sm">staff@kmrl.org</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Department:</span>
                  <span className="text-sm">Operations</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Login:</span>
                  <span className="text-sm">Today, 10:30 AM</span>
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
                Staff Settings
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

export default StaffDashboard;
