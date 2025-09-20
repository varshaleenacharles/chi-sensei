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
  toManager: string;
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
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

  // Task management state
  const [taskSearchTerm, setTaskSearchTerm] = useState("");
  const [taskFilterStatus, setTaskFilterStatus] = useState("all");
  const [taskFilterPriority, setTaskFilterPriority] = useState("all");
  const [taskFilterDepartment, setTaskFilterDepartment] = useState("all");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<Task | null>(null);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskFormErrors, setTaskFormErrors] = useState<Record<string, string>>({});
  const [isEscalationDialogOpen, setIsEscalationDialogOpen] = useState(false);
  const [escalatingTask, setEscalatingTask] = useState<Task | null>(null);
  const [escalationReason, setEscalationReason] = useState("");
  const [escalationPriority, setEscalationPriority] = useState<"low" | "medium" | "high" | "urgent">("high");

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
        toManager: "Manager",
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


  // Task management functions
  const validateTaskForm = (taskData: any) => {
    const errors: Record<string, string> = {};
    
    if (!taskData.title.trim()) {
      errors.title = "Title is required";
    }
    if (!taskData.assignedTo.trim()) {
      errors.assignedTo = "Assignee is required";
    }
    if (!taskData.dueDate) {
      errors.dueDate = "Due date is required";
    } else if (new Date(taskData.dueDate) < new Date()) {
      errors.dueDate = "Due date cannot be in the past";
    }
    if (!taskData.department) {
      errors.department = "Department is required";
    }
    
    return errors;
  };

  const handleCreateTask = () => {
    const errors = validateTaskForm(newTask);
    setTaskFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      const task: Task = {
        id: Date.now().toString(),
        ...newTask,
        status: 'pending',
        createdBy: 'Director'
      };
      setTasks(prev => [...prev, task]);
      resetTaskForm();
      setIsNewTaskOpen(false);
    }
  };

  const resetTaskForm = () => {
    setNewTask({
      title: "",
      description: "",
      assignedTo: "",
      dueDate: "",
      priority: "medium",
      department: ""
    });
    setTaskFormErrors({});
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditTaskOpen(true);
  };

  const handleUpdateTask = () => {
    if (!editingTask) return;
    
    const errors = validateTaskForm(editingTask);
    setTaskFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setTasks(prev =>
        prev.map(task =>
          task.id === editingTask.id ? editingTask : task
        )
      );
      setEditingTask(null);
      setIsEditTaskOpen(false);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  const handleBulkTaskAction = (action: 'complete' | 'priority' | 'delete') => {
    if (selectedTasks.length === 0) return;
    
    switch (action) {
      case 'complete':
        setTasks(prev =>
          prev.map(task =>
            selectedTasks.includes(task.id)
              ? { ...task, status: 'completed' as const }
              : task
          )
        );
        break;
      case 'priority':
        const newPriority = prompt("Enter new priority (low, medium, high, urgent):");
        if (newPriority && ['low', 'medium', 'high', 'urgent'].includes(newPriority)) {
          setTasks(prev =>
            prev.map(task =>
              selectedTasks.includes(task.id)
                ? { ...task, priority: newPriority as any }
                : task
            )
          );
        }
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedTasks.length} task(s)?`)) {
          setTasks(prev => prev.filter(task => !selectedTasks.includes(task.id)));
        }
        break;
    }
    setSelectedTasks([]);
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAllTasks = () => {
    const filteredTasks = getFilteredTasks();
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map(task => task.id));
    }
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
                           task.assignedTo.toLowerCase().includes(taskSearchTerm.toLowerCase());
      const matchesStatus = taskFilterStatus === 'all' || task.status === taskFilterStatus;
      const matchesPriority = taskFilterPriority === 'all' || task.priority === taskFilterPriority;
      const matchesDepartment = taskFilterDepartment === 'all' || task.department === taskFilterDepartment;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesDepartment;
    });
  };

  const handleViewTaskDetails = (task: Task) => {
    setSelectedTaskDetails(task);
    setIsTaskDetailsOpen(true);
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
      setEscalatingTask(task);
      setEscalationReason("");
      setEscalationPriority("high");
      setIsEscalationDialogOpen(true);
    }
  };

  const handleConfirmEscalation = () => {
    if (!escalatingTask || !escalationReason.trim()) {
      alert("Please provide a reason for escalation.");
      return;
    }

    const escalation: Escalation = {
      id: Date.now().toString(),
      title: `Escalated: ${escalatingTask.title}`,
      description: `${escalatingTask.description}\n\nEscalation Reason: ${escalationReason}`,
      fromDepartment: escalatingTask.department,
      toManager: "Manager",
      priority: escalationPriority,
      status: "pending",
      createdAt: new Date().toISOString().split('T')[0],
      dueDate: escalatingTask.dueDate
    };

    setEscalations(prev => [...prev, escalation]);
    
    // Add notification about escalation
    const notification: Notification = {
      id: Date.now().toString(),
      title: "Task Escalated",
      message: `Task "${escalatingTask.title}" has been escalated to Manager with ${escalationPriority} priority.`,
      type: "escalation",
      isRead: false,
      timestamp: new Date().toLocaleString(),
      department: escalatingTask.department,
      actionRequired: true
    };
    setNotifications(prev => [notification, ...prev]);

    // Update task status to show it's been escalated
    setTasks(prev =>
      prev.map(task =>
        task.id === escalatingTask.id
          ? { ...task, status: 'overdue' as const } // Mark as overdue to indicate escalation
          : task
      )
    );

    // Close dialog and reset state
    setIsEscalationDialogOpen(false);
    setEscalatingTask(null);
    setEscalationReason("");
    setEscalationPriority("high");

    // Show success message
    alert(`Task "${escalatingTask.title}" has been successfully escalated to Manager.`);
  };

  const handleCancelEscalation = () => {
    setIsEscalationDialogOpen(false);
    setEscalatingTask(null);
    setEscalationReason("");
    setEscalationPriority("high");
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Task Assignment</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
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


            {/* Escalated Tasks */}
            {escalations.length > 0 && (
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <ArrowUp className="h-5 w-5" />
                    Escalated Tasks ({escalations.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {escalations.slice(0, 3).map(escalation => (
                      <div key={escalation.id} className="p-3 rounded-lg border border-orange-200 bg-orange-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-orange-900">{escalation.title}</h4>
                            <p className="text-sm text-orange-700 mt-1 line-clamp-2">{escalation.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-orange-600">
                              <span>From: {escalation.fromDepartment}</span>
                              <span>To: {escalation.toManager}</span>
                              <Badge className={`text-xs ${getPriorityColor(escalation.priority)}`}>
                                {escalation.priority}
                              </Badge>
                              <span>{escalation.createdAt}</span>
                            </div>
                          </div>
                          <Badge className={`text-xs ${getStatusColor(escalation.status)}`}>
                            {escalation.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {escalations.length > 3 && (
                      <p className="text-sm text-orange-600 text-center">
                        +{escalations.length - 3} more escalated tasks
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    className="h-16 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-300 transition-colors"
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
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium">Collaboration</span>
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


                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Task Assignment Tab */}
          <TabsContent value="tasks" className="space-y-6">
            {/* Task Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Tasks</p>
                      <p className="text-2xl font-bold text-blue-900">{tasks.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Completed</p>
                      <p className="text-2xl font-bold text-green-900">
                        {tasks.filter(t => t.status === 'completed').length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">In Progress</p>
                      <p className="text-2xl font-bold text-yellow-900">
                        {tasks.filter(t => t.status === 'in_progress').length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Overdue</p>
                      <p className="text-2xl font-bold text-red-900">
                        {tasks.filter(t => t.status === 'overdue').length}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search & Filter Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search tasks..."
                      value={taskSearchTerm}
                      onChange={(e) => setTaskSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={taskFilterStatus} onValueChange={setTaskFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={taskFilterPriority} onValueChange={setTaskFilterPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={taskFilterDepartment} onValueChange={setTaskFilterDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Projects">Projects</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Health & Safety">Health & Safety</SelectItem>
                      <SelectItem value="Systems & Operations">Systems & Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedTasks.length > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-blue-900">
                        {selectedTasks.length} task(s) selected
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleBulkTaskAction('complete')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Complete
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleBulkTaskAction('priority')}
                      >
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Change Priority
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleBulkTaskAction('delete')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Task List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Task List</h3>
                <Button onClick={() => setIsNewTaskOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Assign New Task
                </Button>
              </div>
              
              {getFilteredTasks().length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                    <p className="text-muted-foreground mb-4">
                      {taskSearchTerm || taskFilterStatus !== 'all' || taskFilterPriority !== 'all' || taskFilterDepartment !== 'all'
                        ? 'Try adjusting your search criteria'
                        : 'Get started by assigning your first task'
                      }
                    </p>
                    <Button onClick={() => setIsNewTaskOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Assign Task
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredTasks().map(task => (
                    <Card key={task.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              checked={selectedTasks.includes(task.id)}
                              onChange={() => handleSelectTask(task.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <CardTitle className="text-lg">{task.title}</CardTitle>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            </div>
                          </div>
                          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Assigned to:</span>
                            <span className="font-medium">{task.assignedTo}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Department:</span>
                            <span className="font-medium">{task.department}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Due Date:</span>
                            <span className="font-medium">{task.dueDate}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Status:</span>
                            <div className="flex items-center gap-2">
                              <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                                {task.status.replace('_', ' ')}
                              </Badge>
                              {task.status === 'overdue' && (
                                <Badge className="text-xs bg-orange-500 text-white">
                                  <ArrowUp className="h-3 w-3 mr-1" />
                                  Escalated
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewTaskDetails(task)}
                            className="text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditTask(task)}
                            className="text-xs"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEscalate(task.id)}
                            className="text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          >
                            <ArrowUp className="h-3 w-3 mr-1" />
                            Escalate
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
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



        </Tabs>

        {/* New Task Dialog */}
        <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Assign New Task
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  className={taskFormErrors.title ? "border-red-500" : ""}
                />
                {taskFormErrors.title && (
                  <p className="text-red-500 text-xs mt-1">{taskFormErrors.title}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Enter task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Assigned To *</label>
                  <Input
                    placeholder="Enter staff member name"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask(prev => ({ ...prev, assignedTo: e.target.value }))}
                    className={taskFormErrors.assignedTo ? "border-red-500" : ""}
                  />
                  {taskFormErrors.assignedTo && (
                    <p className="text-red-500 text-xs mt-1">{taskFormErrors.assignedTo}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Due Date *</label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    className={taskFormErrors.dueDate ? "border-red-500" : ""}
                  />
                  {taskFormErrors.dueDate && (
                    <p className="text-red-500 text-xs mt-1">{taskFormErrors.dueDate}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value as any }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Department *</label>
                  <Select 
                    value={newTask.department} 
                    onValueChange={(value) => setNewTask(prev => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger className={taskFormErrors.department ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Projects">Projects</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Health & Safety">Health & Safety</SelectItem>
                      <SelectItem value="Systems & Operations">Systems & Operations</SelectItem>
                    </SelectContent>
                  </Select>
                  {taskFormErrors.department && (
                    <p className="text-red-500 text-xs mt-1">{taskFormErrors.department}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateTask} className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Task
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    resetTaskForm();
                    setIsNewTaskOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
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

        {/* Task Details Dialog */}
        <Dialog open={isTaskDetailsOpen} onOpenChange={setIsTaskDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Task Details
              </DialogTitle>
            </DialogHeader>
            {selectedTaskDetails && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Title</h3>
                    <p className="text-sm font-semibold">{selectedTaskDetails.title}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getStatusColor(selectedTaskDetails.status)}`}>
                        {selectedTaskDetails.status.replace('_', ' ')}
                      </Badge>
                      {selectedTaskDetails.status === 'overdue' && (
                        <Badge className="text-xs bg-orange-500 text-white">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          Escalated
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Priority</h3>
                    <Badge className={`text-xs ${getPriorityColor(selectedTaskDetails.priority)}`}>
                      {selectedTaskDetails.priority}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Assigned To</h3>
                    <p className="text-sm">{selectedTaskDetails.assignedTo}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Department</h3>
                    <p className="text-sm">{selectedTaskDetails.department}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Due Date</h3>
                    <p className="text-sm">{selectedTaskDetails.dueDate}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Created By</h3>
                    <p className="text-sm">{selectedTaskDetails.createdBy}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Description</h3>
                  <p className="text-sm bg-muted/50 p-4 rounded-lg">{selectedTaskDetails.description}</p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      handleEditTask(selectedTaskDetails);
                      setIsTaskDetailsOpen(false);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Task
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleEscalate(selectedTaskDetails.id)}
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                  >
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Escalate
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      handleDeleteTask(selectedTaskDetails.id);
                      setIsTaskDetailsOpen(false);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Task Dialog */}
        <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Edit Task
              </DialogTitle>
            </DialogHeader>
            {editingTask && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={editingTask.title}
                    onChange={(e) => setEditingTask(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className={taskFormErrors.title ? "border-red-500" : ""}
                  />
                  {taskFormErrors.title && (
                    <p className="text-red-500 text-xs mt-1">{taskFormErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={editingTask.description}
                    onChange={(e) => setEditingTask(prev => prev ? { ...prev, description: e.target.value } : null)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Assigned To *</label>
                    <Input
                      value={editingTask.assignedTo}
                      onChange={(e) => setEditingTask(prev => prev ? { ...prev, assignedTo: e.target.value } : null)}
                      className={taskFormErrors.assignedTo ? "border-red-500" : ""}
                    />
                    {taskFormErrors.assignedTo && (
                      <p className="text-red-500 text-xs mt-1">{taskFormErrors.assignedTo}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Due Date *</label>
                    <Input
                      type="date"
                      value={editingTask.dueDate}
                      onChange={(e) => setEditingTask(prev => prev ? { ...prev, dueDate: e.target.value } : null)}
                      className={taskFormErrors.dueDate ? "border-red-500" : ""}
                    />
                    {taskFormErrors.dueDate && (
                      <p className="text-red-500 text-xs mt-1">{taskFormErrors.dueDate}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <Select 
                      value={editingTask.priority} 
                      onValueChange={(value) => setEditingTask(prev => prev ? { ...prev, priority: value as any } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select 
                      value={editingTask.status} 
                      onValueChange={(value) => setEditingTask(prev => prev ? { ...prev, status: value as any } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Department *</label>
                  <Select 
                    value={editingTask.department} 
                    onValueChange={(value) => setEditingTask(prev => prev ? { ...prev, department: value } : null)}
                  >
                    <SelectTrigger className={taskFormErrors.department ? "border-red-500" : ""}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Projects">Projects</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Health & Safety">Health & Safety</SelectItem>
                      <SelectItem value="Systems & Operations">Systems & Operations</SelectItem>
                    </SelectContent>
                  </Select>
                  {taskFormErrors.department && (
                    <p className="text-red-500 text-xs mt-1">{taskFormErrors.department}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleUpdateTask}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Update Task
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditingTask(null);
                      setIsEditTaskOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Escalation Dialog */}
        <Dialog open={isEscalationDialogOpen} onOpenChange={setIsEscalationDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ArrowUp className="h-5 w-5 text-orange-500" />
                Escalate Task to Manager
              </DialogTitle>
            </DialogHeader>
            {escalatingTask && (
              <div className="space-y-6">
                {/* Task Information */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">{escalatingTask.title}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Assigned to:</span>
                      <span className="ml-2 font-medium">{escalatingTask.assignedTo}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Department:</span>
                      <span className="ml-2 font-medium">{escalatingTask.department}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Due Date:</span>
                      <span className="ml-2 font-medium">{escalatingTask.dueDate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Current Priority:</span>
                      <Badge className={`ml-2 text-xs ${getPriorityColor(escalatingTask.priority)}`}>
                        {escalatingTask.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-muted-foreground text-sm">Description:</span>
                    <p className="text-sm mt-1">{escalatingTask.description}</p>
                  </div>
                </div>

                {/* Escalation Details */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Escalation Reason *</label>
                    <Textarea
                      placeholder="Please provide a detailed reason for escalating this task to Manager..."
                      value={escalationReason}
                      onChange={(e) => setEscalationReason(e.target.value)}
                      rows={4}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Explain why this task needs to be escalated to Manager level.
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Escalation Priority</label>
                    <Select 
                      value={escalationPriority} 
                      onValueChange={(value) => setEscalationPriority(value as any)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Standard escalation</SelectItem>
                        <SelectItem value="medium">Medium - Requires attention</SelectItem>
                        <SelectItem value="high">High - Urgent escalation</SelectItem>
                        <SelectItem value="urgent">Urgent - Critical escalation</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Select the priority level for this escalation.
                    </p>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-orange-900">Escalation Notice</h4>
                        <p className="text-sm text-orange-800 mt-1">
                          This task will be escalated to the Manager level and marked as overdue. 
                          The Manager will review and take appropriate action.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleConfirmEscalation}
                    disabled={!escalationReason.trim()}
                    className="flex-1"
                  >
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Escalate to Manager
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancelEscalation}
                  >
                    Cancel
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

export default DirectorDashboard;
