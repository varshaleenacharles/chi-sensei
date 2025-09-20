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
  X,
  RefreshCw,
  Upload
} from "lucide-react";
import DashboardHeader from "./DashboardHeader";
import CommentThread from "./CommentThread";
import { Document, Comment } from "./DocumentCard";
import { KnowledgeHubDocument } from "@/types/mongodb";
import MongoService from "@/services/mongoService";

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
  estimatedHours?: number;
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

interface Escalation {
  id: string;
  title: string;
  description: string;
  fromDepartment: string;
  toDirector: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_review' | 'resolved';
  createdAt: string;
  dueDate: string;
  reason: string;
}

interface ManagerDashboardProps {
  currentRole: string;
  onBackToRoleSelection: () => void;
}

const ManagerDashboard = ({ currentRole, onBackToRoleSelection }: ManagerDashboardProps) => {
  const [tasks, setTasks] = useState<ManagerTask[]>([]);
  const [staffActivities, setStaffActivities] = useState<StaffActivity[]>([]);
  const [notifications, setNotifications] = useState<ManagerNotification[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [knowledgeHubDocs, setKnowledgeHubDocs] = useState<KnowledgeHubDocument[]>([]);
  const [mongoService] = useState(() => MongoService.getInstance());
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
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
    taskType: "upload_invoice" as const,
    department: ""
  });


  // Task management state
  const [taskSearchTerm, setTaskSearchTerm] = useState("");
  const [taskFilterStatus, setTaskFilterStatus] = useState("all");
  const [taskFilterPriority, setTaskFilterPriority] = useState("all");
  const [taskFilterDepartment, setTaskFilterDepartment] = useState("all");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<ManagerTask | null>(null);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ManagerTask | null>(null);
  const [taskFormErrors, setTaskFormErrors] = useState<Record<string, string>>({});
  const [isEscalationDialogOpen, setIsEscalationDialogOpen] = useState(false);
  const [escalatingTask, setEscalatingTask] = useState<ManagerTask | null>(null);
  const [escalationReason, setEscalationReason] = useState("");
  const [escalationPriority, setEscalationPriority] = useState<"low" | "medium" | "high" | "urgent">("high");

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
        comments: [
          {
            id: "1",
            departmentName: "Finance",
            author: "Finance Manager",
            message: "This budget analysis looks thorough. I need to verify some of the projections before approval.",
            timestamp: "2025-09-20 09:15",
            parentId: undefined
          },
          {
            id: "2",
            departmentName: "Projects",
            author: "Projects Manager",
            message: "The timeline seems realistic. I'll coordinate with the construction team to ensure feasibility.",
            timestamp: "2025-09-20 10:30",
            parentId: undefined
          }
        ]
      }
    ]);


    // Load MongoDB documents for Knowledge Hub
    loadKnowledgeHubDocuments();
  }, []);

  // Load MongoDB documents dynamically
  const loadKnowledgeHubDocuments = async () => {
    try {
      await mongoService.connectAndFetchDocuments();
      const docs = mongoService.getDocuments();
      setKnowledgeHubDocs(docs);
      console.log(`Loaded ${docs.length} summarized documents from MongoDB`);
    } catch (error) {
      console.error('Error loading MongoDB documents:', error);
    }
  };

  // Set up real-time updates
  useEffect(() => {
    const handleNewDocuments = (newDocs: KnowledgeHubDocument[]) => {
      setKnowledgeHubDocs(prev => [...newDocs, ...prev]);
      console.log(`New documents received: ${newDocs.length}`);
    };

    // Start real-time updates
    mongoService.startRealTimeUpdates(handleNewDocuments);

    // Cleanup on unmount
    return () => {
      // In a real implementation, this would stop the change stream
    };
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


  const getDomainColor = (domain: string) => {
    const colors = {
      'Finance': 'bg-blue-500 text-white',
      'Projects': 'bg-green-500 text-white',
      'Systems & Operations': 'bg-orange-500 text-white',
      'Legal': 'bg-purple-500 text-white',
      'Health & Safety': 'bg-red-500 text-white'
    };
    return colors[domain as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-600 text-white';
      case 'High': return 'bg-orange-500 text-white';
      case 'Medium': return 'bg-yellow-500 text-white';
      case 'Low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      // Knowledge Hub statuses
      case 'New': return 'bg-blue-500 text-white';
      case 'Under Review': return 'bg-yellow-500 text-white';
      case 'Approved': return 'bg-green-500 text-white';
      case 'Rejected': return 'bg-red-500 text-white';
      // Original task statuses
      case 'completed': return 'bg-green-500 text-white';
      case 'in_progress': return 'bg-blue-500 text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'overdue': return 'bg-red-500 text-white';
      case 'due_soon': return 'bg-orange-500 text-white';
      case 'upcoming': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Filter and search knowledge hub documents
  const filteredKnowledgeDocs = knowledgeHubDocs.filter(doc => {
    const matchesDepartment = selectedDepartment === 'All' || doc.departments.includes(selectedDepartment);
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.decisionSupport.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDepartment && matchesSearch;
  });

  const handleAssignDocument = (docId: string, assignedTo: string) => {
    mongoService.assignDocument(docId, assignedTo);
    setKnowledgeHubDocs([...mongoService.getDocuments()]);
  };

  const handleUpdateDocumentStatus = (docId: string, status: KnowledgeHubDocument['status']) => {
    mongoService.updateDocumentStatus(docId, status);
    setKnowledgeHubDocs([...mongoService.getDocuments()]);
  };

  // Simulate file upload and AI summarization workflow
  const handleSimulateFileUpload = async () => {
    const sampleFiles = [
      "Safety_Compliance_Report_Sept2025.pdf",
      "Financial_Budget_Approval_Q4.pdf", 
      "Environmental_Clearance_Application.pdf",
      "IT_Security_Audit_Report.pdf",
      "Vendor_Payment_Authorization.pdf",
      "Project_Status_Update_Report.pdf"
    ];
    
    const randomFile = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
    
    try {
      setIsUploadingFile(true);
      const newDoc = await mongoService.triggerFileUpload(randomFile);
      setKnowledgeHubDocs(prev => [newDoc, ...prev]);
      console.log('File upload simulation complete:', newDoc.title);
    } catch (error) {
      console.error('Error simulating file upload:', error);
    } finally {
      setIsUploadingFile(false);
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
      toDirector: "Director",
      priority: escalationPriority,
      status: "pending",
      createdAt: new Date().toISOString().split('T')[0],
      dueDate: escalatingTask.dueDate,
      reason: escalationReason
    };

    setEscalations(prev => [...prev, escalation]);
    
    // Add notification about escalation
    const notification: ManagerNotification = {
      id: Date.now().toString(),
      title: "Task Escalated",
      message: `Task "${escalatingTask.title}" has been escalated to Director with ${escalationPriority} priority.`,
      type: "escalation",
      isRead: false,
      timestamp: new Date().toLocaleString(),
      urgency: escalationPriority === 'urgent' ? 'critical' : escalationPriority === 'high' ? 'high' : 'medium',
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
    alert(`Task "${escalatingTask.title}" has been successfully escalated to Director.`);
  };

  const handleCancelEscalation = () => {
    setIsEscalationDialogOpen(false);
    setEscalatingTask(null);
    setEscalationReason("");
    setEscalationPriority("high");
  };

  // New task management functions
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
      const task: ManagerTask = {
        id: Date.now().toString(),
        ...newTask,
        assignedBy: "Manager",
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0]
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
      taskType: "upload_invoice",
      department: ""
    });
    setTaskFormErrors({});
  };

  const handleEditTask = (task: ManagerTask) => {
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
              ? { ...task, status: 'completed' as const, completedAt: new Date().toISOString().split('T')[0] }
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

  const handleViewTaskDetails = (task: ManagerTask) => {
    setSelectedTaskDetails(task);
    setIsTaskDetailsOpen(true);
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
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Task Allocation</TabsTrigger>
            <TabsTrigger value="coordination">Coordination</TabsTrigger>
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
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">{tasks.filter(t => t.status === 'in_progress').length}</div>
                  <p className="text-xs text-muted-foreground">Active tasks</p>
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
                              <span>To: {escalation.toDirector}</span>
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
          </TabsContent>



          {/* Task Allocation Tab */}
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
                          {task.estimatedHours && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Est. Hours:</span>
                              <span className="font-medium">{task.estimatedHours}h</span>
                            </div>
                          )}
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
                            onClick={() => handleReassignTask(task.id, "New Staff")}
                            className="text-xs"
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            Reassign
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEscalateTask(task.id)}
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


          {/* Inter-Department Coordination Tab */}
          <TabsContent value="coordination" className="space-y-6">
            <h2 className="text-2xl font-bold">Inter-Department Coordination</h2>
            
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
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewDocument(document)} className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          View Document
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleAddCommentClick(document)} className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Add Comment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Comments Section */}
                  <div className="border-t border-border/50">
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
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>


          {/* Knowledge Hub Tab */}
          <TabsContent value="knowledge" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Knowledge Hub</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {filteredKnowledgeDocs.length} Documents
                </Badge>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={loadKnowledgeHubDocuments}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSimulateFileUpload}
                  disabled={isUploadingFile}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Upload className={`h-4 w-4 mr-2 ${isUploadingFile ? 'animate-pulse' : ''}`} />
                  {isUploadingFile ? 'Processing...' : 'Simulate Upload'}
                </Button>
              </div>
            </div>
            
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search AI summaries, documents, or tags..."
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

            <div className="space-y-6">
              {filteredKnowledgeDocs.map(document => (
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
                              {document.departments.map(dept => (
                                <Badge key={dept} className={`text-xs px-2 py-1 ${getDomainColor(dept)}`}>
                                  {dept}
                                </Badge>
                              ))}
                              <Badge className={`text-xs px-2 py-1 ${getUrgencyColor(document.urgency)}`}>
                                {document.urgency} Priority
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
                      {/* AI Summary Section */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                            AI-Generated Summary
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {document.summary.map((summaryPoint, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-sm text-foreground leading-relaxed">
                                {summaryPoint}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Decision Support */}
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border-l-4 border-amber-500">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                            Decision Support
                          </h4>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">
                          {document.decisionSupport}
                        </p>
                      </div>
                      
                      {/* Document Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-background/50 p-4 rounded-lg border">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Created</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground">
                            {new Date(document.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-lg border">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">File</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground">{document.fileName}</p>
                          <p className="text-xs text-muted-foreground">{document.fileSize}</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-lg border">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Assigned To</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground">
                            {document.assignedTo || 'Unassigned'}
                          </p>
                        </div>
                      </div>

                      {/* Tags */}
                      {document.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {document.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        <Button size="sm" variant="outline" className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          View Document
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleAssignDocument(document.id, "Staff Member")}
                          className="flex items-center gap-2"
                        >
                          <UserPlus className="h-4 w-4" />
                          Assign
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleUpdateDocumentStatus(document.id, 'Under Review')}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Review
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleUpdateDocumentStatus(document.id, 'Approved')}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredKnowledgeDocs.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No documents found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search terms' : 'No documents match the selected department filter'}
                </p>
              </div>
            )}
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
                  <label className="text-sm font-medium">Task Type</label>
                  <Select value={newTask.taskType} onValueChange={(value) => setNewTask(prev => ({ ...prev, taskType: value as any }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select task type" />
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
                    <h3 className="font-medium text-sm text-muted-foreground">Type</h3>
                    <p className="text-sm">{selectedTaskDetails.taskType.replace('_', ' ')}</p>
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
                    <h3 className="font-medium text-sm text-muted-foreground">Created Date</h3>
                    <p className="text-sm">{selectedTaskDetails.createdAt}</p>
                  </div>
                  {selectedTaskDetails.completedAt && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Completed Date</h3>
                      <p className="text-sm">{selectedTaskDetails.completedAt}</p>
                    </div>
                  )}
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
                    onClick={() => handleReassignTask(selectedTaskDetails.id, "New Staff")}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Reassign
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleEscalateTask(selectedTaskDetails.id)}
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
                        <SelectItem value="reassigned">Reassigned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <label className="text-sm font-medium">Task Type</label>
                    <Select 
                      value={editingTask.taskType} 
                      onValueChange={(value) => setEditingTask(prev => prev ? { ...prev, taskType: value as any } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                Escalate Task to Director
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
                      placeholder="Please provide a detailed reason for escalating this task to Director..."
                      value={escalationReason}
                      onChange={(e) => setEscalationReason(e.target.value)}
                      rows={4}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Explain why this task needs to be escalated to Director level.
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
                          This task will be escalated to the Director level and marked as overdue. 
                          The Director will review and take appropriate action.
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
                    Escalate to Director
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

export default ManagerDashboard;
