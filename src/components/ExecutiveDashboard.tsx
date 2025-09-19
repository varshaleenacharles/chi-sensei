import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Document } from "./DocumentCard";
import DashboardHeader from "./DashboardHeader";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Filter,
  Eye
} from "lucide-react";
import heroImage from "@/assets/kmrl-hero.jpg";

interface ExecutiveDashboardProps {
  currentRole: string;
  onBackToRoleSelection: () => void;
}

const ExecutiveDashboard = ({ currentRole, onBackToRoleSelection }: ExecutiveDashboardProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

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
        uploadedAt: "18 Sep 2025"
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
        uploadedAt: "17 Sep 2025"
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
        uploadedAt: "15 Sep 2025"
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

  const domains = ["All", "Finance", "Projects", "Systems & Operations", "Legal", "Health & Safety"];
  const statuses = ["All", "Urgent", "Pending", "Completed", "Under Review", "Rejected"];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader currentRole={currentRole} userName="Executive" />
      
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

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </div>

        {/* Executive Summary Cards */}
        <div className="space-y-4">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="shadow-card hover:shadow-elevated transition-smooth">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold text-foreground">{document.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={`text-xs ${getDomainColor(document.domain)}`}>
                        {document.domain}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(document.status)}`}>
                        {getUrgencySymbol(document.status)} {document.status}
                      </Badge>
                      {document.status === 'Urgent' && (
                        <Badge variant="destructive" className="text-xs animate-pulse">
                          PRIORITY
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Executive Summary */}
                  <div className="bg-muted/50 p-4 rounded-md border-l-4 border-primary">
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      Executive Summary
                    </h4>
                    <p className="text-sm text-foreground leading-relaxed">{document.summary}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Decision Required By:</span>
                      <p className="font-medium text-foreground">{document.nextResponsible}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Deadline:</span>
                      <p className="font-medium text-foreground">{document.deadline}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-xs text-muted-foreground">
                      Escalated by {document.uploadedBy} • {document.uploadedAt}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleReject(document.id)}
                      >
                        Reject
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleApprove(document.id)}
                        className="bg-status-completed hover:bg-status-completed/90"
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
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

        {/* Back to Role Selection */}
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={onBackToRoleSelection}>
            Switch Role
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;