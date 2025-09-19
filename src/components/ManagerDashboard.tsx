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
  UserPlus,
  Zap,
  Award,
  Activity,
  User,
  Settings,
  X
} from "lucide-react";
import DashboardHeader from "./DashboardHeader";
import CommentThread from "./CommentThread";
import { Document, Comment } from "./DocumentCard";

interface ManagerTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'reassigned';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  department: string;
  createdAt: string;
  completedAt?: string;
  taskType: 'upload_invoice' | 'update_job_card' | 'draft_report' | 'review_document' | 'compliance_check';
}

interface ComplianceEvent {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  responsible: string;
  department: string;
  status: 'upcoming' | 'due_soon' | 'overdue' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'financial_closing' | 'safety_drill' | 'project_approval' | 'audit' | 'inspection';
  reminderSent: boolean;
}

interface StaffActivity {
  id: string;
  staffName: string;
  department: string;
  action: 'uploaded' | 'delayed' | 'completed' | 'commented' | 'reviewed';
  documentTitle: string;
  timestamp: string;
  status: 'on_time' | 'late' | 'pending';
}

interface PerformanceMetric {
  department: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  complianceRate: number;
  avgCompletionTime: number;
}

interface ManagerNotification {
  id: string;
  title: string;
  message: string;
  type: 'new_upload' | 'approaching_deadline' | 'director_comment' | 'escalation' | 'staff_delay';
  isRead: boolean;
  timestamp: string;
  fromStaff?: string;
  documentId?: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  actionRequired: boolean;
}

interface ManagerDashboardProps {
  currentRole: string;
  onBackToRoleSelection: () => void;
}

const ManagerDashboard = ({ currentRole, onBackToRoleSelection }: ManagerDashboardProps) => {
  const [tasks, setTasks] = useState<ManagerTask[]>([]);
  const [complianceEvents, setComplianceEvents] = useState<ComplianceEvent[]>([]);
  const [staffActivities, setStaffActivities] = useState<StaffActivity[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [notifications, setNotifications] = useState<ManagerNotification[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
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
    taskType: "upload_invoice" as const
  });

  const [newCompliance, setNewCompliance] = useState({
    title: "",
    description: "",
    dueDate: "",
    responsible: "",
    priority: "medium" as const,
    type: "financial_closing" as const
  });

  // Mock data initialization
  useEffect(() => {
    // Manager Tasks
    setTasks([
      {
        id: "1",
        title: "Upload Q3 Budget Reports",
        description: "Prepare and upload quarterly budget analysis reports",
        assignedTo: "John Smith",
        assignedBy: "Manager",
        dueDate: "2025-09-25",
        status: "in_progress",
        priority: "high",
        department: "Finance",
        createdAt: "2025-09-18",
        taskType: "upload_invoice"
      },
      {
        id: "2",
        title: "Update Safety Job Cards",
        description: "Update all safety job cards for Station A maintenance",
        assignedTo: "Sarah Johnson",
        assignedBy: "Manager",
        dueDate: "2025-09-22",
        status: "pending",
        priority: "urgent",
        department: "Health & Safety",
        createdAt: "2025-09-19",
        taskType: "update_job_card"
      },
      {
        id: "3",
        title: "Draft Monthly Performance Report",
        description: "Create comprehensive monthly performance analysis",
        assignedTo: "Mike Wilson",
        assignedBy: "Manager",
        dueDate: "2025-09-30",
        status: "completed",
        priority: "medium",
        department: "Projects",
        createdAt: "2025-09-15",
        completedAt: "2025-09-20",
        taskType: "draft_report"
      }
    ]);

    // Compliance Events
    setComplianceEvents([
      {
        id: "1",
        title: "Q3 Financial Closing",
        description: "Complete Q3 financial statements and reports",
        dueDate: "2025-09-30",
        responsible: "Finance Team",
        department: "Finance",
        status: "due_soon",
        priority: "high",
        type: "financial_closing",
        reminderSent: true
      },
      {
        id: "2",
        title: "Monthly Safety Drill",
        description: "Conduct emergency evacuation drill at all stations",
        dueDate: "2025-10-15",
        responsible: "Safety Officers",
        department: "Health & Safety",
        status: "upcoming",
        priority: "urgent",
        type: "safety_drill",
        reminderSent: false
      },
      {
        id: "3",
        title: "Environmental Audit",
        description: "Annual environmental compliance audit",
        dueDate: "2025-10-20",
        responsible: "Compliance Team",
        department: "Legal",
        status: "upcoming",
        priority: "medium",
        type: "audit",
        reminderSent: false
      }
    ]);

    // Staff Activities
    setStaffActivities([
      {
        id: "1",
        staffName: "John Smith",
        department: "Finance",
        action: "uploaded",
        documentTitle: "Q3 Budget Report",
        timestamp: "2025-09-20 14:30",
        status: "on_time"
      },
      {
        id: "2",
        staffName: "Sarah Johnson",
        department: "Health & Safety",
        action: "delayed",
        documentTitle: "Safety Inspection Report",
        timestamp: "2025-09-20 16:45",
        status: "late"
      },
      {
        id: "3",
        staffName: "Mike Wilson",
        department: "Projects",
        action: "completed",
        documentTitle: "Project Timeline Update",
        timestamp: "2025-09-20 11:15",
        status: "on_time"
      }
    ]);

    // Performance Metrics
    setPerformanceMetrics([
      {
        department: "Finance",
        totalTasks: 25,
        completedTasks: 20,
        pendingTasks: 3,
        overdueTasks: 2,
        complianceRate: 85,
        avgCompletionTime: 3.2
      },
      {
        department: "Health & Safety",
        totalTasks: 18,
        completedTasks: 15,
        pendingTasks: 2,
        overdueTasks: 1,
        complianceRate: 92,
        avgCompletionTime: 2.8
      },
      {
        department: "Projects",
        totalTasks: 30,
        completedTasks: 25,
        pendingTasks: 4,
        overdueTasks: 1,
        complianceRate: 88,
        avgCompletionTime: 4.1
      }
    ]);

    // Notifications
    setNotifications([
      {
        id: "1",
        title: "New Staff Upload",
        message: "John Smith uploaded Q3 Budget Report for review",
        type: "new_upload",
        isRead: false,
        timestamp: "2025-09-20 14:30",
        fromStaff: "John Smith",
        documentId: "doc1",
        urgency: "medium",
        actionRequired: true
      },
      {
        id: "2",
        title: "Approaching Deadline",
        message: "Safety Job Cards update due in 2 days",
        type: "approaching_deadline",
        isRead: false,
        timestamp: "2025-09-20 09:00",
        urgency: "high",
        actionRequired: true
      },
      {
        id: "3",
        title: "Director Comment",
        message: "Director commented on Project Proposal - requires your attention",
        type: "director_comment",
        isRead: true,
        timestamp: "2025-09-19 16:20",
        urgency: "high",
        actionRequired: true
      }
    ]);

    // Documents
    setDocuments([
      {
        id: "1",
        title: "Q3 Budget Analysis",
        domain: "Finance",
        status: "Under Review",
        summary: "Comprehensive quarterly budget analysis with variance reports",
        nextResponsible: "Finance Manager",
        deadline: "2025-09-25",
        uploadedBy: "John Smith",
        uploadedAt: "2025-09-20",
        allowedDepartments: ["Finance", "Projects"],
        commentsResolved: false,
        comments: []
      }
    ]);
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

  const handleCreateTask = () => {
    if (newTask.title && newTask.assignedTo && newTask.dueDate) {
      const task: ManagerTask = {
        id: Date.now().toString(),
        ...newTask,
        assignedBy: "Manager",
        status: 'pending',
        department: "Finance",
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTasks(prev => [...prev, task]);
      setNewTask({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        priority: "medium",
        taskType: "upload_invoice"
      });
      setIsNewTaskOpen(false);
    }
  };

  const handleCreateCompliance = () => {
    if (newCompliance.title && newCompliance.dueDate && newCompliance.responsible) {
      const compliance: ComplianceEvent = {
        id: Date.now().toString(),
        ...newCompliance,
        department: "Finance",
        status: 'upcoming',
        reminderSent: false
      };
      setComplianceEvents(prev => [...prev, compliance]);
      setNewCompliance({
        title: "",
        description: "",
        dueDate: "",
        responsible: "",
        priority: "medium",
        type: "financial_closing"
      });
      setIsNewComplianceOpen(false);
    }
  };

  const handleReassignTask = (taskId: string, newAssignee: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, assignedTo: newAssignee, status: 'reassigned' as const }
          : task
      )
    );
  };

  const handleEscalateTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      // In real implementation, this would create an escalation to Director
      console.log(`Escalating task "${task.title}" to Director`);
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

  const handleSendReminder = (eventId: string) => {
    setComplianceEvents(prev =>
      prev.map(event =>
        event.id === eventId
          ? { ...event, reminderSent: true }
          : event
      )
    );
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
        departmentName: "Manager"
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

  const handleForwardNotification = (notificationId: string) => {
    // In real implementation, this would forward to staff
    console.log(`Forwarding notification ${notificationId} to staff`);
  };

  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overdueTasks = tasks.filter(t => t.status === 'overdue').length;
  const upcomingCompliance = complianceEvents.filter(e => e.status === 'upcoming' || e.status === 'due_soon').length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        currentRole={currentRole} 
        userName="Manager Name"
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
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manager Dashboard</h1>
            <p className="text-muted-foreground">Task allocation, compliance tracking, and team management</p>
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
            <Button variant="outline" onClick={onBackToRoleSelection}>
              Switch Role
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Task Allocation</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="coordination">Coordination</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Hub</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">{totalTasks}</div>
                  <p className="text-xs text-muted-foreground">Assigned to team</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{completedTasks}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{overdueTasks}</div>
                  <p className="text-xs text-muted-foreground">Require attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Compliance Due</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-500">{upcomingCompliance}</div>
                  <p className="text-xs text-muted-foreground">Upcoming events</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Staff Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {staffActivities.slice(0, 5).map(activity => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{activity.staffName}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.action} "{activity.documentTitle}" • {activity.timestamp}
                        </p>
                      </div>
                      <Badge className={
                        activity.status === 'on_time' ? 'bg-green-500' :
                        activity.status === 'late' ? 'bg-red-500' : 'bg-yellow-500'
                      }>
                        {activity.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Task Allocation Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Task Allocation</h2>
              <Button onClick={() => setIsNewTaskOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Assign Task
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map(task => (
                <Card key={task.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Assigned to:</span>
                        <span>{task.assignedTo}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Due Date:</span>
                        <span>{task.dueDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => handleReassignTask(task.id, "New Staff")}>
                        <UserPlus className="h-3 w-3 mr-1" />
                        Reassign
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEscalateTask(task.id)}>
                        <ArrowUp className="h-3 w-3 mr-1" />
                        Escalate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Compliance Tracking</h2>
              <Button onClick={() => setIsNewComplianceOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Compliance Event
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complianceEvents.map(event => (
                <Card key={event.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Badge className={`text-xs ${getPriorityColor(event.priority)}`}>
                        {event.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Responsible:</span>
                        <span>{event.responsible}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Due Date:</span>
                        <span>{event.dueDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                          {event.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Reminder:</span>
                        <span className={event.reminderSent ? 'text-green-600' : 'text-red-600'}>
                          {event.reminderSent ? 'Sent' : 'Not sent'}
                        </span>
                      </div>
                    </div>
                    
                    {!event.reminderSent && (
                      <Button 
                        size="sm" 
                        className="w-full mt-4"
                        onClick={() => handleSendReminder(event.id)}
                      >
                        <Bell className="h-3 w-3 mr-1" />
                        Send Reminder
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Inter-Department Coordination Tab */}
          <TabsContent value="coordination" className="space-y-6">
            <h2 className="text-2xl font-bold">Inter-Department Coordination</h2>
            
            <div className="space-y-6">
              {documents.map(document => (
                <div key={document.id} className="space-y-4">
                  <Card>
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
                      <div className="flex gap-2 mb-4">
                        <Button size="sm" variant="outline" onClick={() => handleViewDocument(document)}>
                          <Eye className="h-3 w-3 mr-1" />
                          View Document
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleAddCommentClick(document)}>
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Add Comment
                        </Button>
                      </div>
                      <CommentThread
                        documentId={document.id}
                        comments={document.comments || []}
                        userRole={currentRole}
                        userDepartment="Manager"
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
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Performance Metrics Tab */}
          <TabsContent value="performance" className="space-y-6">
            <h2 className="text-2xl font-bold">Performance Metrics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {performanceMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      {metric.department}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Tasks:</span>
                          <p className="font-medium">{metric.totalTasks}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Completed:</span>
                          <p className="font-medium text-green-600">{metric.completedTasks}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Pending:</span>
                          <p className="font-medium text-yellow-600">{metric.pendingTasks}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Overdue:</span>
                          <p className="font-medium text-red-600">{metric.overdueTasks}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Compliance Rate</span>
                          <span className="text-sm font-medium">{metric.complianceRate}%</span>
                        </div>
                        <Progress value={metric.complianceRate} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Avg. Completion Time:</span>
                        <span className="font-medium">{metric.avgCompletionTime} days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Staff Activity Log */}
            <Card>
              <CardHeader>
                <CardTitle>Staff Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {staffActivities.map(activity => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{activity.staffName} - {activity.department}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.action} "{activity.documentTitle}"
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                      <Badge className={
                        activity.status === 'on_time' ? 'bg-green-500' :
                        activity.status === 'late' ? 'bg-red-500' : 'bg-yellow-500'
                      }>
                        {activity.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knowledge Hub Tab */}
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
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <p className="text-sm"><strong>AI Summary:</strong> {document.summary}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Uploaded by: {document.uploadedBy}</span>
                      <span>Deadline: {document.deadline}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => handleViewDocument(document)}>
                        <Eye className="h-3 w-3 mr-1" />
                        View Full Document
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleAddCommentClick(document)}>
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Add Comment
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleRejectDocument(document)}>
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
                  placeholder="Assign to staff member"
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
                <Select value={newTask.taskType} onValueChange={(value) => setNewTask(prev => ({ ...prev, taskType: value as any }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Task Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upload_invoice">Upload Invoice</SelectItem>
                    <SelectItem value="update_job_card">Update Job Card</SelectItem>
                    <SelectItem value="draft_report">Draft Report</SelectItem>
                    <SelectItem value="review_document">Review Document</SelectItem>
                    <SelectItem value="compliance_check">Compliance Check</SelectItem>
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
              <DialogTitle>Add Compliance Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Compliance event title"
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
                  placeholder="Responsible person/team"
                  value={newCompliance.responsible}
                  onChange={(e) => setNewCompliance(prev => ({ ...prev, responsible: e.target.value }))}
                />
                <Input
                  type="date"
                  value={newCompliance.dueDate}
                  onChange={(e) => setNewCompliance(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <Select value={newCompliance.type} onValueChange={(value) => setNewCompliance(prev => ({ ...prev, type: value as any }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financial_closing">Financial Closing</SelectItem>
                    <SelectItem value="safety_drill">Safety Drill</SelectItem>
                    <SelectItem value="project_approval">Project Approval</SelectItem>
                    <SelectItem value="audit">Audit</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateCompliance} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Compliance Event
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
                    <Badge variant="outline">{selectedDocument.domain}</Badge>
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
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">AI Summary</h3>
                  <p className="text-sm bg-blue-50 p-4 rounded-lg">{selectedDocument.summary}</p>
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
                Manager Notifications
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
                        <Badge className={
                          notification.urgency === 'critical' ? 'bg-red-500' :
                          notification.urgency === 'high' ? 'bg-orange-500' :
                          notification.urgency === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }>
                          {notification.urgency}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {notification.fromStaff && <span>From: {notification.fromStaff}</span>}
                        <span>{notification.timestamp}</span>
                        {notification.actionRequired && (
                          <Badge className="bg-red-500 text-white text-xs">
                            Action Required
                          </Badge>
                        )}
                      </div>
                      {notification.actionRequired && (
                        <Button 
                          size="sm" 
                          className="mt-2"
                          onClick={() => handleForwardNotification(notification.id)}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Forward to Staff
                        </Button>
                      )}
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
                Manager Profile
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Manager Name</h3>
                <p className="text-muted-foreground">{currentRole}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="text-sm">manager@kmrl.org</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Department:</span>
                  <span className="text-sm">Management</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Login:</span>
                  <span className="text-sm">Today, 9:15 AM</span>
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
                Manager Settings
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

export default ManagerDashboard;
