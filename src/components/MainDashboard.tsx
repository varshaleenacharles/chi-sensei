import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentCard, { Document, Comment } from "./DocumentCard";
import DashboardHeader from "./DashboardHeader";
import CommentThread from "./CommentThread";
import ChatbotHelpdesk from "./ChatbotHelpdesk";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Upload,
  Filter,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Eye,
  MessageSquare,
  ArrowUp,
  Send,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import heroImage from "@/assets/kmrl-hero.jpg";

interface MainDashboardProps {
  currentRole: string;
  onBackToRoleSelection: () => void;
}

const MainDashboard = ({ currentRole, onBackToRoleSelection }: MainDashboardProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [viewDocumentId, setViewDocumentId] = useState<string | null>(null);
  const [updateDocumentId, setUpdateDocumentId] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<string>("Pending");
  const [isDocumentViewOpen, setIsDocumentViewOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEscalateDialogOpen, setIsEscalateDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [newComment, setNewComment] = useState("");
  const [escalateReason, setEscalateReason] = useState("");
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    timestamp: string;
    department: string;
  }>>([]);

  // Mock data - in real implementation, this would come from an API
  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: "1",
        title: "Vendor Invoice #3482 - Track Materials",
        domain: "Finance",
        status: "Pending",
        summary: "Vendor XYZ submitted invoice for track materials worth ₹2.5 Cr. Requires Accounts verification by 20 Sep. Delay beyond deadline risks late payment penalties.",
        nextResponsible: "Finance Manager",
        deadline: "20 Sep 2025",
        uploadedBy: "Accounts Officer",
        uploadedAt: "18 Sep 2025",
        allowedDepartments: ['Finance', 'Projects'],
        commentsResolved: false,
        comments: [
          {
            id: "c1",
            departmentName: "Finance",
            author: "Finance Manager (Finance)",
            message: "Invoice verified. Vendor is approved with KMRL. Recommend processing.",
            timestamp: "18 Sep 2025, 2:30 PM"
          }
        ]
      },
      {
        id: "2",
        title: "Safety Audit Report - Aluva Station",
        domain: "Health & Safety",
        status: "Urgent",
        summary: "Critical safety violations identified at Aluva Station platform. Requires immediate corrective action for passenger safety. Fire safety systems need upgrade.",
        nextResponsible: "Safety Director",
        deadline: "19 Sep 2025",
        uploadedBy: "Safety Inspector",
        uploadedAt: "17 Sep 2025",
        allowedDepartments: ['Health & Safety', 'Projects'],
        commentsResolved: false,
        comments: [
          {
            id: "c2", 
            departmentName: "Health & Safety",
            author: "Safety Director (Health & Safety)",
            message: "Critical violations confirmed. Immediate action required for passenger safety.",
            timestamp: "17 Sep 2025, 4:45 PM"
          },
          {
            id: "c3",
            departmentName: "Projects",
            author: "Project Manager (Projects)", 
            message: "Fire safety upgrade can be fast-tracked. Design ready for implementation.",
            timestamp: "18 Sep 2025, 9:15 AM"
          }
        ]
      },
      {
        id: "3",
        title: "New Metro Line Extension Proposal",
        domain: "Projects",
        status: "Under Review",
        summary: "Proposal for extending metro line to Kakkanad IT hub. Investment requirement ₹1200 Cr. Requires environmental clearance and land acquisition approval.",
        nextResponsible: "Projects Director",
        deadline: "30 Sep 2025",
        uploadedBy: "Project Manager", 
        uploadedAt: "15 Sep 2025",
        allowedDepartments: ['Projects', 'Legal'],
        commentsResolved: false,
        comments: []
      },
      {
        id: "4",
        title: "Contract Amendment - Signaling System",
        domain: "Legal",
        status: "Completed",
        summary: "Legal review completed for signaling system contract amendment. All terms approved with minor modifications to penalty clauses.",
        nextResponsible: "Legal Director",
        deadline: "25 Sep 2025",
        uploadedBy: "Legal Officer",
        uploadedAt: "16 Sep 2025",
        allowedDepartments: ['Legal', 'Projects'],
        commentsResolved: false,
        comments: []
      },
      {
        id: "5",
        title: "IT Infrastructure Upgrade Plan",
        domain: "Systems & Operations",
        status: "Pending",
        summary: "Comprehensive plan for upgrading KMRL IT infrastructure. Includes cloud migration, cybersecurity enhancement, and passenger information systems.",
        nextResponsible: "Systems Manager",
        deadline: "28 Sep 2025",
        uploadedBy: "IT Officer",
        uploadedAt: "18 Sep 2025",
        allowedDepartments: ['Systems & Operations', 'Legal'],
        commentsResolved: false,
        comments: []
      }
    ];
    
    setDocuments(mockDocuments);
    setFilteredDocuments(mockDocuments);

    // Mock notifications data
    const mockNotifications = [
      {
        id: "1",
        title: "New Document Upload",
        message: "Safety Audit Report uploaded by Safety Inspector",
        type: "upload",
        isRead: false,
        timestamp: "2025-09-20 14:30",
        department: "Health & Safety"
      },
      {
        id: "2",
        title: "Approaching Deadline",
        message: "Vendor Invoice #3482 due for review tomorrow",
        type: "deadline",
        isRead: false,
        timestamp: "2025-09-19 09:00",
        department: "Finance"
      },
      {
        id: "3",
        title: "Comment Added",
        message: "New comment on Metro Line Extension Proposal",
        type: "comment",
        isRead: true,
        timestamp: "2025-09-18 16:20",
        department: "Projects"
      }
    ];
    
    setNotifications(mockNotifications);
  }, []);

  // Filter documents based on search and filters
  useEffect(() => {
    let filtered = documents;

    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDomain !== "All") {
      filtered = filtered.filter(doc => doc.domain === selectedDomain);
    }

    if (selectedStatus !== "All") {
      filtered = filtered.filter(doc => doc.status === selectedStatus);
    }

    setFilteredDocuments(filtered);
  }, [searchQuery, selectedDomain, selectedStatus, documents]);

  const getStatsForRole = () => {
    const stats = {
      total: documents.length,
      pending: documents.filter(d => d.status === "Pending").length,
      urgent: documents.filter(d => d.status === "Urgent").length,
      completed: documents.filter(d => d.status === "Completed").length
    };
    return stats;
  };

  const stats = getStatsForRole();

  const handleViewDocument = (id: string) => {
    setViewDocumentId(id);
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id ? { ...doc, status: newStatus as Document['status'] } : doc
      )
    );
  };

  const handleStartUpdate = (id: string, currentStatus: string) => {
    setUpdateDocumentId(id);
    setPendingStatus(currentStatus);
  };

  const handleSaveUpdate = () => {
    if (!updateDocumentId) return;
    handleUpdateStatus(updateDocumentId, pendingStatus);
    setUpdateDocumentId(null);
  };

  const getUserDepartment = () => {
    // Map roles to departments - in real implementation this would come from user data
    const roleDepartmentMap: { [key: string]: string } = {
      'Finance Manager': 'Finance',
      'Projects Director': 'Projects', 
      'Systems Manager': 'Systems & Operations',
      'Legal Officer': 'Legal',
      'Safety Director': 'Health & Safety',
      'Manager': 'Finance', // Default
      'Director': 'Projects', // Default
      'Staff': 'Finance' // Default
    };
    return roleDepartmentMap[currentRole] || 'Finance';
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const detectDomainFromFilename = (name: string): Document['domain'] => {
      const lower = name.toLowerCase();
      if (/(invoice|po|payment|bill|budget|finance)/.test(lower)) return 'Finance';
      if (/(project|design|proposal|extension|construction|tender)/.test(lower)) return 'Projects';
      if (/(system|it|infrastructure|operations|server|network)/.test(lower)) return 'Systems & Operations';
      if (/(legal|contract|agreement|amendment|policy)/.test(lower)) return 'Legal';
      if (/(safety|audit|incident|inspection|health|risk)/.test(lower)) return 'Health & Safety';
      return getUserDepartment() as Document['domain'];
    };

    const generateAISummary = (file: File): string => {
      const name = file.name.replace(/[_-]+/g, ' ');
      const sizeKb = Math.max(1, Math.round(file.size / 1024));
      return `Auto-processed '${name}'. Detected key content from upload (${sizeKb} KB). Ready for departmental review and next steps.`;
    };

    const formatDate = (date: Date) =>
      date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(',', '');

    const nextWeek = () => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      return formatDate(d);
    };

    const now = new Date();
    const newDocs: Document[] = Array.from(fileList).map((file, index) => {
      const domain = detectDomainFromFilename(file.name);
      return {
        id: `${now.getTime()}-${index}`,
        title: file.name,
        domain,
        status: 'Pending',
        summary: generateAISummary(file),
        nextResponsible: `${domain} Manager`,
        deadline: nextWeek(),
        uploadedBy: currentRole,
        uploadedAt: formatDate(now),
        comments: [],
        allowedDepartments: [domain, 'Legal'],
        commentsResolved: false
      };
    });

    setDocuments(prev => [...newDocs, ...prev]);
    // Route user to the detected domain to surface the new documents immediately
    if (newDocs.length > 0) {
      setSelectedDomain(newDocs[0].domain);
    }
    // Clear the input so selecting the same file again still triggers onChange
    event.target.value = '';
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

  const handleResolveComments = (documentId: string) => {
    setDocuments(prev => prev.map(doc => doc.id === documentId ? { ...doc, commentsResolved: true } : doc));
  };

  const handleReplyToComment = (documentId: string, parentId: string, replyMessage: string, userRoleForReply: string, userDepartmentForReply: string) => {
    const reply: Comment = {
      id: `${Date.now()}-r`,
      departmentName: userDepartmentForReply,
      author: `${userRoleForReply} (${userDepartmentForReply})`,
      message: replyMessage,
      timestamp: new Date().toLocaleString(),
      parentId
    };

    setDocuments(prev => prev.map(doc => {
      if (doc.id !== documentId) return doc;
      return { ...doc, comments: [...(doc.comments || []), reply] };
    }));
  };

  // New handlers for top right buttons and escalate functionality
  const handleViewFullDocument = (document: Document) => {
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
        departmentName: "User"
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

  const handleEscalateDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsEscalateDialogOpen(true);
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

  const handleSubmitEscalation = () => {
    if (selectedDocument && escalateReason.trim()) {
      // In real implementation, this would create an escalation
      console.log(`Escalating document "${selectedDocument.title}" with reason: ${escalateReason}`);
      
      // Add escalation notification
      const escalationNotification = {
        id: Date.now().toString(),
        title: "Document Escalated",
        message: `"${selectedDocument.title}" has been escalated to higher authority`,
        type: "escalation",
        isRead: false,
        timestamp: new Date().toLocaleString(),
        department: selectedDocument.domain
      };
      
      setNotifications(prev => [escalationNotification, ...prev]);
      setEscalateReason("");
      setIsEscalateDialogOpen(false);
    }
  };

  const handleProfileClick = () => {
    setIsProfileOpen(true);
  };

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleLogoutClick = () => {
    if (confirm("Are you sure you want to logout?")) {
      onBackToRoleSelection();
    }
  };

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Urgent': return 'bg-red-500 text-white';
      case 'Pending': return 'bg-yellow-500 text-white';
      case 'Completed': return 'bg-green-500 text-white';
      case 'Under Review': return 'bg-blue-500 text-white';
      case 'Rejected': return 'bg-red-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const domains = ["All", "Finance", "Projects", "Systems & Operations", "Legal", "Health & Safety"];
  const statuses = ["All", "Urgent", "Pending", "Completed", "Under Review", "Rejected"];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        currentRole={currentRole} 
        userName="Rajesh Kumar"
        onNotificationsClick={() => setIsNotificationsOpen(true)}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
        onLogoutClick={handleLogoutClick}
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
            <h1 className="text-3xl font-bold mb-2">Welcome to KMRL AI Agent</h1>
            <p className="text-lg opacity-90">Intelligent Document Management & Workflow Automation</p>
            <Badge variant="secondary" className="mt-2">
              {currentRole} Dashboard
            </Badge>
          </div>
        </div>
      </div>

      {/* Notification Bell - Fixed Position */}
      <div className="fixed top-20 right-6 z-50">
        <Button
          variant="outline"
          size="sm"
          className="relative bg-background shadow-lg"
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

      <div className="container mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Documents</span>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Active in system</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Pending Review</span>
                <Clock className="h-4 w-4 text-status-pending" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-pending">{stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting action</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Urgent Items</span>
                <AlertTriangle className="h-4 w-4 text-status-urgent" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-urgent">{stats.urgent}</div>
              <p className="text-xs text-muted-foreground mt-1">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Completed</span>
                <CheckCircle className="h-4 w-4 text-status-completed" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-completed">{stats.completed}</div>
              <p className="text-xs text-muted-foreground mt-1">Successfully processed</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
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
            
            <Button variant="outline" size="sm" onClick={handleUploadClick}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.xlsx,.ppt,.pptx,image/*,text/plain,application/json"
              onChange={handleFilesSelected}
            />
          </div>
        </div>

        {/* Document Grid */}
        <div className="space-y-6">
          {filteredDocuments.map((document) => (
            <div key={document.id} className="space-y-4">
              <DocumentCard
                document={document}
                userRole={currentRole}
                onViewDocument={handleViewDocument}
                onUpdateStatus={handleUpdateStatus}
                onStartUpdate={handleStartUpdate}
                onViewFullDocument={handleViewFullDocument}
                onAddComment={handleAddCommentClick}
                onEscalate={handleEscalateDocument}
                onReject={handleRejectDocument}
              />
              
              <CommentThread
                documentId={document.id}
                comments={document.comments || []}
                userRole={currentRole}
                userDepartment={getUserDepartment()}
                allowedDepartments={document.allowedDepartments}
                commentsResolved={document.commentsResolved}
                onAddComment={handleAddComment}
                onResolve={handleResolveComments}
                onReply={handleReplyToComment}
              />
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No documents found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Back to Role Selection */}
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={onBackToRoleSelection}>
            Switch Role
          </Button>
        </div>
      </div>

      {/* Chatbot Helpdesk */}
      <ChatbotHelpdesk 
        isOpen={isChatbotOpen} 
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)} 
      />

      {/* View Document Dialog */}
      <Dialog open={!!viewDocumentId} onOpenChange={(open) => !open && setViewDocumentId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
          </DialogHeader>
          {viewDocumentId && (
            <div className="space-y-2">
              {(() => {
                const doc = documents.find(d => d.id === viewDocumentId);
                if (!doc) return null;
                return (
                  <div className="space-y-2 text-sm">
                    <div><span className="text-muted-foreground">Title:</span> <span className="text-foreground">{doc.title}</span></div>
                    <div><span className="text-muted-foreground">Domain:</span> <span className="text-foreground">{doc.domain}</span></div>
                    <div><span className="text-muted-foreground">Status:</span> <span className="text-foreground">{doc.status}</span></div>
                    <div><span className="text-muted-foreground">Uploaded:</span> <span className="text-foreground">{doc.uploadedBy} • {doc.uploadedAt}</span></div>
                    <div>
                      <span className="text-muted-foreground">Summary:</span>
                      <p className="text-foreground mt-1">{doc.summary}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={!!updateDocumentId} onOpenChange={(open) => !open && setUpdateDocumentId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Document Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <label className="text-sm text-muted-foreground">Select status</label>
            <select
              className="px-3 py-2 border rounded-md text-sm bg-background w-full"
              value={pendingStatus}
              onChange={(e) => setPendingStatus(e.target.value)}
            >
              {statuses.filter(s => s !== 'All').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setUpdateDocumentId(null)}>Cancel</Button>
              <Button onClick={handleSaveUpdate}>Save</Button>
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

      {/* Escalate Document Dialog */}
      <Dialog open={isEscalateDialogOpen} onOpenChange={setIsEscalateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowUp className="h-5 w-5" />
              Escalate Document
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">Document to Escalate</h3>
              <p className="text-sm font-medium">{selectedDocument?.title}</p>
              <p className="text-xs text-muted-foreground">{selectedDocument?.domain} • {selectedDocument?.status}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Reason for Escalation</label>
              <Textarea
                placeholder="Please provide a detailed reason for escalating this document..."
                value={escalateReason}
                onChange={(e) => setEscalateReason(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmitEscalation} disabled={!escalateReason.trim()}>
                <ArrowUp className="h-4 w-4 mr-2" />
                Escalate Document
              </Button>
              <Button variant="outline" onClick={() => {
                setEscalateReason("");
                setIsEscalateDialogOpen(false);
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
              Notifications
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
                        {notification.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{notification.department}</span>
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
              User Profile
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Rajesh Kumar</h3>
              <p className="text-muted-foreground">{currentRole}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="text-sm">rajesh.kumar@kmrl.org</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Department:</span>
                <span className="text-sm">Finance</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Login:</span>
                <span className="text-sm">Today, 9:30 AM</span>
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
              Settings
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
  );
};

export default MainDashboard;