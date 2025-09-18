import { useState, useEffect } from "react";
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
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
        comments: []
      }
    ];
    
    setDocuments(mockDocuments);
    setFilteredDocuments(mockDocuments);
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
    console.log(`Viewing document: ${id}`);
    // In real implementation, open document detail view
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id ? { ...doc, status: newStatus as Document['status'] } : doc
      )
    );
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

  const domains = ["All", "Finance", "Projects", "Systems & Operations", "Legal", "Health & Safety"];
  const statuses = ["All", "Urgent", "Pending", "Completed", "Under Review"];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader currentRole={currentRole} userName="Rajesh Kumar" />
      
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
            
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
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
              />
              
              <CommentThread
                documentId={document.id}
                comments={document.comments || []}
                userRole={currentRole}
                userDepartment={getUserDepartment()}
                onAddComment={handleAddComment}
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
    </div>
  );
};

export default MainDashboard;