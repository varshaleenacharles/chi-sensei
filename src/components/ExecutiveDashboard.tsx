import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Document, Comment } from "./DocumentCard";
import CommentThread from "./CommentThread";
import DashboardHeader from "./DashboardHeader";
import ProjectTimeline from "./ProjectTimeline";
import TimelineAnalytics from "./TimelineAnalytics";
import { KnowledgeHubDocument } from "@/types/mongodb";
import MongoService from "@/services/mongoService";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Filter,
  Eye,
  Bell,
  User,
  Settings,
  LogOut,
  RefreshCw,
  Calendar,
  UserPlus,
  Edit,
  X,
  Upload,
  Target,
  BarChart3,
  Zap
} from "lucide-react";
import heroImage from "@/assets/kmrl-hero.jpg";

interface ExecutiveDashboardProps {
  currentRole: string;
  onBackToRoleSelection: () => void;
}

const ExecutiveDashboard = ({ currentRole, onBackToRoleSelection }: ExecutiveDashboardProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [projects, setProjects] = useState<any[]>([]);
  const [knowledgeHubDocs, setKnowledgeHubDocs] = useState<KnowledgeHubDocument[]>([]);
  const [mongoService] = useState(() => MongoService.getInstance());
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [isDocumentViewOpen, setIsDocumentViewOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<KnowledgeHubDocument | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [documentToAssign, setDocumentToAssign] = useState<string | null>(null);
  const [processingDocument, setProcessingDocument] = useState<string | null>(null);
  const [recentlyProcessed, setRecentlyProcessed] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<string>("documents");
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }>>([]);

  // Mock executive data - only processed summaries
  useEffect(() => {
    const mockExecutiveDocuments: Document[] = [
      {
        id: "1",
        title: "Vendor Invoice #3482 - Track Materials",
        domain: "Finance",
        status: "Urgent",
        summary: "🔴 EXECUTIVE DECISION REQUIRED: Vendor XYZ invoice ₹2.5 Cr for track materials. Finance Manager recommends approval with 5% late penalty waiver. Approve/Reject by 20 Sep to avoid contract complications.",
        nextResponsible: "Executive Approval",
        deadline: "20 Sep 2025",
        uploadedBy: "Finance Manager",
        uploadedAt: "18 Sep 2025",
        allowedDepartments: ["Finance", "Executive"],
        commentsResolved: false,
        comments: [
          {
            id: "1",
            departmentName: "Finance",
            author: "Finance Manager",
            message: "This vendor has been reliable in the past. The 5% penalty waiver is justified given the circumstances.",
            timestamp: "2025-09-18 14:30",
            parentId: undefined
          },
          {
            id: "2",
            departmentName: "Executive",
            author: "Executive Assistant",
            message: "I've reviewed the contract terms. The late penalty waiver is within acceptable limits.",
            timestamp: "2025-09-18 16:45",
            parentId: undefined
          }
        ]
      },
      {
        id: "2",
        title: "Safety Audit Report - Aluva Station", 
        domain: "Health & Safety",
        status: "Urgent",
        summary: "🔴 CRITICAL: Safety Director escalates Aluva Station violations. ₹50L immediate investment needed for fire safety upgrade. Public safety risk if delayed beyond 19 Sep. Recommends emergency approval.",
        nextResponsible: "Executive Decision",
        deadline: "19 Sep 2025",
        uploadedBy: "Safety Director",
        uploadedAt: "17 Sep 2025",
        allowedDepartments: ["Health & Safety", "Executive"],
        commentsResolved: false,
        comments: [
          {
            id: "3",
            departmentName: "Health & Safety",
            author: "Safety Director",
            message: "This is a critical safety issue that requires immediate attention. The fire safety upgrade cannot be delayed.",
            timestamp: "2025-09-17 10:15",
            parentId: undefined
          },
          {
            id: "4",
            departmentName: "Executive",
            author: "Executive Assistant",
            message: "I've verified the safety regulations. This upgrade is indeed mandatory for compliance.",
            timestamp: "2025-09-17 15:30",
            parentId: undefined
          }
        ]
      },
      {
        id: "3",
        title: "Metro Line Extension Proposal",
        domain: "Projects", 
        status: "Pending",
        summary: "🟡 STRATEGIC DECISION: Kakkanad extension proposal ₹1200 Cr investment. Projects Director recommends approval pending environmental clearance. ROI projected at 15% over 10 years. Board decision required.",
        nextResponsible: "Board Approval",
        deadline: "30 Sep 2025",
        uploadedBy: "Projects Director", 
        uploadedAt: "15 Sep 2025",
        allowedDepartments: ["Projects", "Executive"],
        commentsResolved: false,
        comments: [
          {
            id: "5",
            departmentName: "Projects",
            author: "Projects Director",
            message: "This extension will significantly improve connectivity to the IT hub. The ROI projections are conservative and achievable.",
            timestamp: "2025-09-15 11:20",
            parentId: undefined
          },
          {
            id: "6",
            departmentName: "Executive",
            author: "Executive Assistant",
            message: "The environmental clearance timeline looks realistic. This aligns with our long-term strategic goals.",
            timestamp: "2025-09-15 14:45",
            parentId: undefined
          }
        ]
      },
      {
        id: "4",
        title: "Signaling System Contract Amendment",
        domain: "Legal",
        status: "Completed",
        summary: "✅ APPROVED: Legal Director cleared signaling contract amendment. Penalty clauses modified as requested. Contract value remains ₹85 Cr. Ready for executive signature.",
        nextResponsible: "Executive Signature",
        deadline: "25 Sep 2025", 
        uploadedBy: "Legal Director",
        uploadedAt: "16 Sep 2025"
      },
      {
        id: "5",
        title: "IT Infrastructure Upgrade Plan",
        domain: "Systems & Operations",
        status: "Under Review",
        summary: "🟣 UNDER REVIEW: Systems Manager proposes ₹25 Cr IT upgrade including cloud migration and cybersecurity. Recommends phased implementation over 18 months. Cost-benefit analysis attached.",
        nextResponsible: "Executive Review",
        deadline: "28 Sep 2025",
        uploadedBy: "Systems Manager",
        uploadedAt: "18 Sep 2025"
      }
    ];
    
    // Sort by urgency - Urgent items first
    const sortedDocs = mockExecutiveDocuments.sort((a, b) => {
      if (a.status === 'Urgent' && b.status !== 'Urgent') return -1;
      if (b.status === 'Urgent' && a.status !== 'Urgent') return 1;
      return 0;
    });
    
    setDocuments(sortedDocs);
    setFilteredDocuments(sortedDocs);

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

    // Load MongoDB documents for Knowledge Hub
    loadKnowledgeHubDocuments();

    // Mock notifications data
    const mockNotifications = [
      {
        id: "1",
        title: "Urgent Approval Required",
        message: "Vendor invoice #3482 requires immediate executive approval",
        timestamp: "2025-09-20 14:30",
        isRead: false,
        priority: "urgent" as const
      },
      {
        id: "2",
        title: "Safety Audit Complete",
        message: "Aluva Station safety audit has been completed and requires review",
        timestamp: "2025-09-20 10:15",
        isRead: false,
        priority: "high" as const
      },
      {
        id: "3",
        title: "Budget Review Meeting",
        message: "Q3 budget review meeting scheduled for tomorrow at 2 PM",
        timestamp: "2025-09-19 16:45",
        isRead: true,
        priority: "medium" as const
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  // Load MongoDB documents dynamically
  const loadKnowledgeHubDocuments = async () => {
    try {
      setIsLoadingDocs(true);
      await mongoService.connectAndFetchDocuments();
      const docs = mongoService.getDocuments();
      setKnowledgeHubDocs(docs);
      setLastUpdateTime(new Date());
      console.log(`Loaded ${docs.length} summarized documents from MongoDB`);
    } catch (error) {
      console.error('Error loading MongoDB documents:', error);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  // Set up real-time updates
  useEffect(() => {
    const handleNewDocuments = (newDocs: KnowledgeHubDocument[]) => {
      setKnowledgeHubDocs(prev => [...newDocs, ...prev]);
      setLastUpdateTime(new Date());
      console.log(`New documents received: ${newDocs.length}`);
    };

    // Start real-time updates
    mongoService.startRealTimeUpdates(handleNewDocuments);

    // Cleanup on unmount
    return () => {
      // In a real implementation, this would stop the change stream
    };
  }, []);

  // Filter documents based on domain and status
  useEffect(() => {
    let filtered = documents;

    if (selectedDomain !== "All") {
      filtered = filtered.filter(doc => doc.domain === selectedDomain);
    }

    if (selectedStatus !== "All") {
      filtered = filtered.filter(doc => doc.status === selectedStatus);
    }

    setFilteredDocuments(filtered);
  }, [selectedDomain, selectedStatus, documents]);

  const getStatsForExecutive = () => {
    const stats = {
      total: documents.length,
      urgent: documents.filter(d => d.status === "Urgent").length,
      pending: documents.filter(d => d.status === "Pending").length,
      completed: documents.filter(d => d.status === "Completed").length,
      underReview: documents.filter(d => d.status === "Under Review").length,
      rejected: documents.filter(d => d.status === "Rejected").length
    };
    return stats;
  };

  const stats = getStatsForExecutive();

  const getDomainColor = (domain: string) => {
    const colors = {
      'Finance': 'bg-finance text-white',
      'Projects': 'bg-projects text-white',
      'Systems & Operations': 'bg-systems text-white', 
      'Legal': 'bg-legal text-white',
      'Health & Safety': 'bg-safety text-white'
    };
    return colors[domain as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Urgent': 'bg-status-urgent text-white',
      'Pending': 'bg-status-pending text-white',
      'Completed': 'bg-status-completed text-white',
      'Under Review': 'bg-status-review text-white',
      'Rejected': 'bg-red-600 text-white'
    };
    return colors[status as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  const getUrgencySymbol = (status: string) => {
    const symbols = {
      'Urgent': '🔴',
      'Pending': '🟡',
      'Completed': '✅', 
      'Under Review': '🟣',
      'Rejected': '❌'
    };
    return symbols[status as keyof typeof symbols] || '⚪';
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

  const getKnowledgeStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-500 text-white';
      case 'Under Review': return 'bg-yellow-500 text-white';
      case 'Approved': return 'bg-green-500 text-white';
      case 'Rejected': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Filter and search knowledge hub documents
  const filteredKnowledgeDocs = knowledgeHubDocs.filter(doc => {
    const matchesDomain = selectedDomain === 'All' || doc.departments.includes(selectedDomain);
    const matchesStatus = selectedStatus === 'All' || doc.status === selectedStatus;
    
    return matchesDomain && matchesStatus;
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
      setLastUpdateTime(new Date());
      console.log('File upload simulation complete:', newDoc.title);
    } catch (error) {
      console.error('Error simulating file upload:', error);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleApprove = (id: string) => {
    console.log(`Executive approved document: ${id}`);
    // Update document status
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id ? { ...doc, status: 'Completed' as Document['status'] } : doc
      )
    );
  };

  const handleReject = (id: string) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason && reason.trim()) {
      // Update document status to rejected
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === id ? { 
            ...doc, 
            status: 'Rejected' as Document['status'],
            summary: `❌ REJECTED: ${reason}\n\nOriginal Summary: ${doc.summary}`,
            nextResponsible: "Returned to Originator"
          } : doc
        )
      );
      
      // Show confirmation
      alert(`Document "${documents.find(d => d.id === id)?.title}" has been rejected.`);
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

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      onBackToRoleSelection();
    }
  };

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

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

  // Handle View Document functionality
  const handleViewDocument = (document: KnowledgeHubDocument) => {
    setSelectedDocument(document);
    setIsDocumentViewOpen(true);
  };

  // Handle Assign to Director functionality
  const handleAssignToDirector = (documentId: string) => {
    setDocumentToAssign(documentId);
    setIsAssignDialogOpen(true);
  };

  const confirmAssignToDirector = () => {
    if (documentToAssign) {
      // Update the document assignment
      handleAssignDocument(documentToAssign, "Director");
      
      // Update local state to reflect the change
      setKnowledgeHubDocs(prev => 
        prev.map(doc => 
          doc.id === documentToAssign 
            ? { ...doc, assignedTo: "Director" }
            : doc
        )
      );
      
      // Add notification
      const newNotification = {
        id: Date.now().toString(),
        title: "Document Assigned",
        message: `Document has been assigned to Director for review`,
        timestamp: new Date().toLocaleString(),
        isRead: false,
        priority: 'medium' as const
      };
      setNotifications(prev => [newNotification, ...prev]);
      
      // Show success toast
      toast({
        title: "Document Assigned",
        description: "Document has been successfully assigned to Director for review.",
        variant: "default",
      });
      
      // Add to recently processed
      setRecentlyProcessed(prev => new Set([...prev, documentToAssign]));
      setTimeout(() => {
        setRecentlyProcessed(prev => {
          const newSet = new Set(prev);
          newSet.delete(documentToAssign);
          return newSet;
        });
      }, 3000);
      
      console.log(`Document ${documentToAssign} assigned to Director`);
      
      setIsAssignDialogOpen(false);
      setDocumentToAssign(null);
    }
  };

  // Handle Mark for Review functionality
  const handleMarkForReview = async (documentId: string) => {
    setProcessingDocument(documentId);
    
    try {
      // Update the document status
      await handleUpdateDocumentStatus(documentId, 'Under Review');
      
      // Update local state to reflect the change
      setKnowledgeHubDocs(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, status: 'Under Review' as KnowledgeHubDocument['status'] }
            : doc
        )
      );
      
      // Add notification
      const newNotification = {
        id: Date.now().toString(),
        title: "Document Marked for Review",
        message: `Document has been marked for review`,
        timestamp: new Date().toLocaleString(),
        isRead: false,
        priority: 'medium' as const
      };
      setNotifications(prev => [newNotification, ...prev]);
      
      // Show success toast
      toast({
        title: "Document Marked for Review",
        description: "Document has been successfully marked for review.",
        variant: "default",
      });
      
      // Add to recently processed
      setRecentlyProcessed(prev => new Set([...prev, documentId]));
      setTimeout(() => {
        setRecentlyProcessed(prev => {
          const newSet = new Set(prev);
          newSet.delete(documentId);
          return newSet;
        });
      }, 3000);
      
      console.log(`Document ${documentId} marked for review`);
    } catch (error) {
      console.error('Error marking document for review:', error);
      toast({
        title: "Error",
        description: "Failed to mark document for review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingDocument(null);
    }
  };

  const domains = ["All", "Finance", "Projects", "Systems & Operations", "Legal", "Health & Safety"];
  const statuses = ["All", "Urgent", "Pending", "Completed", "Under Review", "Rejected"];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        currentRole={currentRole} 
        userName="Executive"
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
            <h1 className="text-3xl font-bold mb-2">Executive Central Dashboard</h1>
            <p className="text-lg opacity-90">AI-Processed Summaries & Decision Points Only</p>
            <Badge variant="secondary" className="mt-2">
              {currentRole} - Summary View
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Executive Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Items</span>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Processed summaries</p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">🔴 Urgent</span>
                <AlertTriangle className="h-4 w-4 text-status-urgent" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-urgent">{stats.urgent}</div>
              <p className="text-xs text-muted-foreground mt-1">Immediate decisions</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">🟡 Pending</span>
                <Clock className="h-4 w-4 text-status-pending" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-pending">{stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">🟣 Review</span>
                <Eye className="h-4 w-4 text-status-review" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-review">{stats.underReview}</div>
              <p className="text-xs text-muted-foreground mt-1">Under analysis</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">✅ Completed</span>
                <CheckCircle className="h-4 w-4 text-status-completed" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-completed">{stats.completed}</div>
              <p className="text-xs text-muted-foreground mt-1">Decisions made</p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">❌ Rejected</span>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground mt-1">Items rejected</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Hub</TabsTrigger>
            <TabsTrigger value="timeline">Project Timeline</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            {/* Filters for Executive View */}
            <div className="flex gap-4 mb-6">
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-background"
              >
                {domains.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-background"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAdvancedFiltersOpen(true)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>

            {/* Executive Summary Cards */}
            <div className="space-y-6">
              {filteredDocuments.map((document) => (
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
                                {getUrgencySymbol(document.status)} {document.status}
                              </Badge>
                              {document.status === 'Urgent' && (
                                <Badge variant="destructive" className="text-xs px-2 py-1 animate-pulse">
                                  PRIORITY
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      {/* Executive Summary */}
                      <div className="bg-gradient-to-r from-muted/30 to-muted/10 p-5 rounded-lg border-l-4 border-primary">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                            Executive Summary
                          </h4>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed font-medium">
                          {document.summary}
                        </p>
                      </div>
                      
                      {/* Key Information Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-background/50 p-4 rounded-lg border">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Decision Required By</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground">{document.nextResponsible}</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-lg border">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Deadline</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground">{document.deadline}</p>
                        </div>
                      </div>
                      
                      {/* Action Bar */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border/50">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>Escalated by {document.uploadedBy}</span>
                          </div>
                          <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{document.uploadedAt}</span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleReject(document.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          >
                            Reject
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleApprove(document.id)}
                            className="bg-status-completed hover:bg-status-completed/90 text-white"
                          >
                            Approve
                          </Button>
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
                      userDepartment="Executive"
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

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No items for review</h3>
                <p className="text-muted-foreground">All current matters have been processed</p>
              </div>
            )}
          </TabsContent>

          {/* Knowledge Hub Tab */}
          <TabsContent value="knowledge" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Knowledge Hub - AI Processed Documents</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {filteredKnowledgeDocs.length} Documents
                </Badge>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={loadKnowledgeHubDocuments}
                  disabled={isLoadingDocs}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingDocs ? 'animate-spin' : ''}`} />
                  {isLoadingDocs ? 'Loading...' : 'Refresh'}
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
                {lastUpdateTime && (
                  <div className="text-xs text-muted-foreground">
                    Last updated: {lastUpdateTime.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>

            {/* Document Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Documents</p>
                      <p className="text-2xl font-bold text-blue-700">{knowledgeHubDocs.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Critical Priority</p>
                      <p className="text-2xl font-bold text-red-700">
                        {knowledgeHubDocs.filter(d => d.urgency === 'Critical').length}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">High Priority</p>
                      <p className="text-2xl font-bold text-orange-700">
                        {knowledgeHubDocs.filter(d => d.urgency === 'High').length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">New Documents</p>
                      <p className="text-2xl font-bold text-green-700">
                        {knowledgeHubDocs.filter(d => d.status === 'New').length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex gap-4 mb-6">
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-background"
              >
                {domains.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-background"
              >
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="space-y-6">
              {filteredKnowledgeDocs.map(document => (
                <Card 
                  key={document.id} 
                  className={`shadow-card hover:shadow-elevated transition-all duration-300 border-l-4 ${
                    recentlyProcessed.has(document.id) 
                      ? 'border-l-green-500 bg-green-50/30' 
                      : 'border-l-primary/20'
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* Document Title and Icon */}
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-foreground leading-tight">
                                {document.title}
                              </h3>
                              {recentlyProcessed.has(document.id) && (
                                <div className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="text-xs font-medium">Processed</span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              {document.departments.map(dept => (
                                <Badge key={dept} className={`text-xs px-2 py-1 ${getDomainColor(dept)}`}>
                                  {dept}
                                </Badge>
                              ))}
                              <Badge className={`text-xs px-2 py-1 ${getUrgencyColor(document.urgency)}`}>
                                {document.urgency} Priority
                              </Badge>
                              <Badge className={`text-xs px-2 py-1 ${getKnowledgeStatusColor(document.status)}`}>
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
                            AI-Generated Executive Summary
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
                            Executive Decision Support
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
                      
                      {/* Executive Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewDocument(document)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Document
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleAssignToDirector(document.id)}
                          disabled={processingDocument === document.id}
                          className="flex items-center gap-2"
                        >
                          <UserPlus className="h-4 w-4" />
                          {processingDocument === document.id ? 'Processing...' : 'Assign to Director'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleMarkForReview(document.id)}
                          disabled={processingDocument === document.id}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          {processingDocument === document.id ? 'Processing...' : 'Mark for Review'}
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateDocumentStatus(document.id, 'Approved')}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUpdateDocumentStatus(document.id, 'Rejected')}
                          className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                        >
                          <X className="h-4 w-4" />
                          Reject
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
                <h3 className="text-lg font-medium text-foreground mb-2">No AI-processed documents found</h3>
                <p className="text-muted-foreground">
                  No documents match the selected filters. Try adjusting your domain or status filter.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <ProjectTimeline 
              currentRole={currentRole}
              projects={projects}
              onPhaseClick={(phase) => {
                console.log('Phase clicked:', phase.name);
                // Add notification for phase interaction
                const newNotification = {
                  id: Date.now().toString(),
                  title: "Phase Viewed",
                  message: `Viewed phase: ${phase.name}`,
                  timestamp: new Date().toLocaleString(),
                  isRead: false,
                  priority: 'low' as const
                };
                setNotifications(prev => [newNotification, ...prev]);
              }}
              onProjectSelect={(project) => {
                console.log('Project selected:', project?.name);
                // Add notification for project selection
                if (project) {
                  const newNotification = {
                    id: Date.now().toString(),
                    title: "Project Selected",
                    message: `Selected project: ${project.name}`,
                    timestamp: new Date().toLocaleString(),
                    isRead: false,
                    priority: 'low' as const
                  };
                  setNotifications(prev => [newNotification, ...prev]);
                }
              }}
              onPhaseUpdate={(phaseId, updates) => {
                console.log('Phase updated:', phaseId, updates);
                // Add notification for phase update
                const newNotification = {
                  id: Date.now().toString(),
                  title: "Phase Updated",
                  message: `Phase ${phaseId} has been updated`,
                  timestamp: new Date().toLocaleString(),
                  isRead: false,
                  priority: 'medium' as const
                };
                setNotifications(prev => [newNotification, ...prev]);
              }}
              onProjectUpdate={(projectId, updates) => {
                console.log('Project updated:', projectId, updates);
                // Add notification for project update
                const newNotification = {
                  id: Date.now().toString(),
                  title: "Project Updated",
                  message: `Project ${projectId} has been updated`,
                  timestamp: new Date().toLocaleString(),
                  isRead: false,
                  priority: 'medium' as const
                };
                setNotifications(prev => [newNotification, ...prev]);
              }}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <TimelineAnalytics 
              currentRole={currentRole}
              projects={projects}
            />
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="space-y-6">
              {/* Executive Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-blue-800">
                      <span className="text-sm font-medium">Active Projects</span>
                      <Target className="h-5 w-5" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-900">{projects.length}</div>
                    <p className="text-xs text-blue-700 mt-1">Currently in progress</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-green-800">
                      <span className="text-sm font-medium">Total Budget</span>
                      <TrendingUp className="h-5 w-5" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-900">
                      ₹{projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr
                    </div>
                    <p className="text-xs text-green-700 mt-1">Allocated across projects</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-orange-800">
                      <span className="text-sm font-medium">High Risk</span>
                      <AlertTriangle className="h-5 w-5" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-900">
                      {projects.filter(p => p.riskLevel === 'high').length}
                    </div>
                    <p className="text-xs text-orange-700 mt-1">Projects requiring attention</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-purple-800">
                      <span className="text-sm font-medium">Avg Progress</span>
                      <BarChart3 className="h-5 w-5" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-900">
                      {Math.round(projects.reduce((sum, p) => sum + p.totalProgress, 0) / projects.length)}%
                    </div>
                    <p className="text-xs text-purple-700 mt-1">Overall completion rate</p>
                  </CardContent>
                </Card>
              </div>

              {/* Project Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Project Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map(project => (
                      <div key={project.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{project.name}</h3>
                            <p className="text-sm text-muted-foreground">{project.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{project.status.toUpperCase()}</Badge>
                            <Badge 
                              variant={project.riskLevel === 'high' ? 'destructive' : 
                                      project.riskLevel === 'medium' ? 'default' : 'secondary'}
                            >
                              {project.riskLevel.toUpperCase()} RISK
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{project.totalProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-primary"
                                style={{ width: `${project.totalProgress}%` }}
                              />
                            </div>
                          </div>
                          
                          <div className="text-sm">
                            <div className="text-muted-foreground">Budget</div>
                            <div className="font-semibold">
                              ₹{project.budget.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr
                            </div>
                          </div>
                          
                          <div className="text-sm">
                            <div className="text-muted-foreground">Spent</div>
                            <div className="font-semibold">
                              ₹{project.actualCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

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
                      className="h-20 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      onClick={() => {
                        setActiveTab("timeline");
                        // Add notification
                        const newNotification = {
                          id: Date.now().toString(),
                          title: "Quick Action",
                          message: "Switched to Project Timeline view",
                          timestamp: new Date().toLocaleString(),
                          isRead: false,
                          priority: 'low' as const
                        };
                        setNotifications(prev => [newNotification, ...prev]);
                      }}
                    >
                      <Calendar className="h-6 w-6 text-blue-600" />
                      <span className="text-sm font-medium">View Timeline</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center gap-2 hover:bg-green-50 hover:border-green-300 transition-colors"
                      onClick={() => {
                        setActiveTab("analytics");
                        // Add notification
                        const newNotification = {
                          id: Date.now().toString(),
                          title: "Quick Action",
                          message: "Switched to Analytics view",
                          timestamp: new Date().toLocaleString(),
                          isRead: false,
                          priority: 'low' as const
                        };
                        setNotifications(prev => [newNotification, ...prev]);
                      }}
                    >
                      <BarChart3 className="h-6 w-6 text-green-600" />
                      <span className="text-sm font-medium">View Analytics</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-300 transition-colors"
                      onClick={() => {
                        setActiveTab("documents");
                        // Add notification
                        const newNotification = {
                          id: Date.now().toString(),
                          title: "Quick Action",
                          message: "Switched to Documents view",
                          timestamp: new Date().toLocaleString(),
                          isRead: false,
                          priority: 'low' as const
                        };
                        setNotifications(prev => [newNotification, ...prev]);
                      }}
                    >
                      <FileText className="h-6 w-6 text-purple-600" />
                      <span className="text-sm font-medium">Review Documents</span>
                    </Button>

                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center gap-2 hover:bg-orange-50 hover:border-orange-300 transition-colors"
                      onClick={() => {
                        setActiveTab("knowledge");
                        // Add notification
                        const newNotification = {
                          id: Date.now().toString(),
                          title: "Quick Action",
                          message: "Switched to Knowledge Hub view",
                          timestamp: new Date().toLocaleString(),
                          isRead: false,
                          priority: 'low' as const
                        };
                        setNotifications(prev => [newNotification, ...prev]);
                      }}
                    >
                      <FileText className="h-6 w-6 text-orange-600" />
                      <span className="text-sm font-medium">Knowledge Hub</span>
                    </Button>

                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center gap-2 hover:bg-red-50 hover:border-red-300 transition-colors"
                      onClick={() => {
                        setIsNotificationsOpen(true);
                        // Add notification
                        const newNotification = {
                          id: Date.now().toString(),
                          title: "Quick Action",
                          message: "Opened notifications panel",
                          timestamp: new Date().toLocaleString(),
                          isRead: false,
                          priority: 'low' as const
                        };
                        setNotifications(prev => [newNotification, ...prev]);
                      }}
                    >
                      <Bell className="h-6 w-6 text-red-600" />
                      <span className="text-sm font-medium">Notifications</span>
                    </Button>

                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                      onClick={() => {
                        setIsSettingsOpen(true);
                        // Add notification
                        const newNotification = {
                          id: Date.now().toString(),
                          title: "Quick Action",
                          message: "Opened settings panel",
                          timestamp: new Date().toLocaleString(),
                          isRead: false,
                          priority: 'low' as const
                        };
                        setNotifications(prev => [newNotification, ...prev]);
                      }}
                    >
                      <Settings className="h-6 w-6 text-gray-600" />
                      <span className="text-sm font-medium">Settings</span>
                    </Button>
                  </div>

                  {/* Executive-Specific Quick Actions */}
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-sm font-medium text-muted-foreground mb-4">Executive Actions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-16 flex flex-col items-center gap-2 hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
                        onClick={() => {
                          // Filter to show only urgent documents
                          setSelectedStatus("Urgent");
                          setActiveTab("documents");
                          // Add notification
                          const newNotification = {
                            id: Date.now().toString(),
                            title: "Executive Action",
                            message: "Filtered to urgent documents requiring attention",
                            timestamp: new Date().toLocaleString(),
                            isRead: false,
                            priority: 'high' as const
                          };
                          setNotifications(prev => [newNotification, ...prev]);
                        }}
                      >
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <span className="text-xs font-medium">Urgent Items</span>
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-16 flex flex-col items-center gap-2 hover:bg-green-50 hover:border-green-300 transition-colors"
                        onClick={() => {
                          // Filter to show only pending documents
                          setSelectedStatus("Pending");
                          setActiveTab("documents");
                          // Add notification
                          const newNotification = {
                            id: Date.now().toString(),
                            title: "Executive Action",
                            message: "Filtered to pending documents awaiting approval",
                            timestamp: new Date().toLocaleString(),
                            isRead: false,
                            priority: 'medium' as const
                          };
                          setNotifications(prev => [newNotification, ...prev]);
                        }}
                      >
                        <Clock className="h-5 w-5 text-green-600" />
                        <span className="text-xs font-medium">Pending Review</span>
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-16 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        onClick={() => {
                          // Show high-risk projects
                          setActiveTab("overview");
                          // Add notification
                          const newNotification = {
                            id: Date.now().toString(),
                            title: "Executive Action",
                            message: "Viewing high-risk projects overview",
                            timestamp: new Date().toLocaleString(),
                            isRead: false,
                            priority: 'medium' as const
                          };
                          setNotifications(prev => [newNotification, ...prev]);
                        }}
                      >
                        <Target className="h-5 w-5 text-blue-600" />
                        <span className="text-xs font-medium">High Risk</span>
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-16 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-300 transition-colors"
                        onClick={() => {
                          // Refresh all data
                          loadKnowledgeHubDocuments();
                          // Add notification
                          const newNotification = {
                            id: Date.now().toString(),
                            title: "Executive Action",
                            message: "Refreshed all dashboard data",
                            timestamp: new Date().toLocaleString(),
                            isRead: false,
                            priority: 'low' as const
                          };
                          setNotifications(prev => [newNotification, ...prev]);
                        }}
                      >
                        <RefreshCw className="h-5 w-5 text-purple-600" />
                        <span className="text-xs font-medium">Refresh Data</span>
                      </Button>
                    </div>
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
                Executive Notifications
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
                        <Badge className={
                          notification.priority === 'urgent' ? 'bg-red-500' :
                          notification.priority === 'high' ? 'bg-orange-500' :
                          notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }>
                          {notification.priority}
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
                Executive Profile
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Executive Name</h3>
                <p className="text-muted-foreground">{currentRole}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="text-sm">executive@kmrl.org</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Department:</span>
                  <span className="text-sm">Executive</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Login:</span>
                  <span className="text-sm">Today, 8:30 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Unread Notifications:</span>
                  <span className="text-sm font-medium text-red-500">{unreadNotifications}</span>
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
                Executive Settings
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
              <div>
                <h3 className="font-medium mb-2">Approval Settings</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Auto-escalate urgent documents</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Require confirmation for large amounts</span>
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

        {/* Advanced Filters Dialog */}
        <Dialog open={isAdvancedFiltersOpen} onOpenChange={setIsAdvancedFiltersOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Advanced Filters
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Filter by Date Range</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">From Date</label>
                    <input 
                      type="date" 
                      className="w-full p-2 border rounded-md"
                      defaultValue="2025-09-01"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">To Date</label>
                    <input 
                      type="date" 
                      className="w-full p-2 border rounded-md"
                      defaultValue="2025-09-30"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Filter by Amount</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Minimum Amount (₹)</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded-md"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Maximum Amount (₹)</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded-md"
                      placeholder="10000000"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Filter by Priority</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Urgent</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">High Priority</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Medium Priority</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Low Priority</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAdvancedFiltersOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAdvancedFiltersOpen(false)}>
                  Apply Filters
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
                Document Details
              </DialogTitle>
            </DialogHeader>
            {selectedDocument && (
              <div className="space-y-6">
                {/* Document Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{selectedDocument.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {selectedDocument.departments.map(dept => (
                        <Badge key={dept} className={`text-xs px-2 py-1 ${getDomainColor(dept)}`}>
                          {dept}
                        </Badge>
                      ))}
                      <Badge className={`text-xs px-2 py-1 ${getUrgencyColor(selectedDocument.urgency)}`}>
                        {selectedDocument.urgency} Priority
                      </Badge>
                      <Badge className={`text-xs px-2 py-1 ${getKnowledgeStatusColor(selectedDocument.status)}`}>
                        {selectedDocument.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* AI Summary Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                      AI-Generated Executive Summary
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {selectedDocument.summary.map((summaryPoint, index) => (
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
                      Executive Decision Support
                    </h4>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {selectedDocument.decisionSupport}
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
                      {new Date(selectedDocument.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-background/50 p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">File</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{selectedDocument.fileName}</p>
                    <p className="text-xs text-muted-foreground">{selectedDocument.fileSize}</p>
                  </div>
                  <div className="bg-background/50 p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Assigned To</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedDocument.assignedTo || 'Unassigned'}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                {selectedDocument.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDocument.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsDocumentViewOpen(false)}>
                    Close
                  </Button>
                  <Button 
                    onClick={() => {
                      handleAssignToDirector(selectedDocument.id);
                      setIsDocumentViewOpen(false);
                    }}
                    className="flex items-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Assign to Director
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Assign to Director Confirmation Dialog */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Assign Document to Director
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to assign this document to the Director for review? 
                The Director will be notified and can take appropriate action.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmAssignToDirector}>
                  Assign to Director
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default ExecutiveDashboard;