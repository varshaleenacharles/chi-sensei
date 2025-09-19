import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, FileText, AlertTriangle, CheckCircle, Eye, MessageSquare, ArrowUp, X } from "lucide-react";

export interface Comment {
  id: string;
  departmentName: string;
  author: string;
  message: string;
  timestamp: string;
  parentId?: string;
}

export interface Document {
  id: string;
  title: string;
  domain: 'Finance' | 'Projects' | 'Systems & Operations' | 'Legal' | 'Health & Safety';
  status: 'Urgent' | 'Pending' | 'Completed' | 'Under Review' | 'Rejected';
  summary: string;
  nextResponsible: string;
  deadline: string;
  uploadedBy: string;
  uploadedAt: string;
  comments?: Comment[];
  allowedDepartments?: Array<'Finance' | 'Projects' | 'Systems & Operations' | 'Legal' | 'Health & Safety' | 'Executive'>;
  commentsResolved?: boolean;
}

interface DocumentCardProps {
  document: Document;
  userRole: string;
  onViewDocument: (id: string) => void;
  onUpdateStatus?: (id: string, status: string) => void;
  onStartUpdate?: (id: string, currentStatus: string) => void;
  onViewFullDocument?: (document: Document) => void;
  onAddComment?: (document: Document) => void;
  onEscalate?: (document: Document) => void;
  onReject?: (document: Document) => void;
  isExecutiveView?: boolean;
}

const DocumentCard = ({ document, userRole, onViewDocument, onUpdateStatus, onStartUpdate, onViewFullDocument, onAddComment, onEscalate, onReject, isExecutiveView = false }: DocumentCardProps) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Urgent':
        return <AlertTriangle className="h-3 w-3" />;
      case 'Completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'Pending':
        return <Clock className="h-3 w-3" />;
      case 'Under Review':
        return <Eye className="h-3 w-3" />;
      case 'Rejected':
        return <X className="h-3 w-3" />;
      default:
        return <Eye className="h-3 w-3" />;
    }
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

  const canUpdateStatus = () => {
    return userRole === 'Manager' || userRole === 'Director' || userRole === 'System Admin';
  };

  return (
    <Card className="shadow-card hover:shadow-elevated transition-smooth">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground truncate">{document.title}</h3>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`text-xs ${getDomainColor(document.domain)}`}>
                {document.domain}
              </Badge>
              <Badge className={`text-xs flex items-center gap-1 ${getStatusColor(document.status)}`}>
                {getStatusIcon(document.status)}
                {document.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="bg-muted/50 p-3 rounded-md">
            <h4 className="text-xs font-medium text-muted-foreground mb-1">
              AI Summary ({getUrgencySymbol(document.status)} {document.status})
            </h4>
            <p className="text-sm text-foreground">{document.summary}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Next Responsible:</span>
              <p className="font-medium text-foreground">{document.nextResponsible}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Deadline:</span>
              <p className="font-medium text-foreground">{document.deadline}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              Uploaded by {document.uploadedBy} • {document.uploadedAt}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onViewDocument(document.id)}>
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              {onViewFullDocument && (
                <Button size="sm" variant="outline" onClick={() => onViewFullDocument(document)}>
                  <Eye className="h-3 w-3 mr-1" />
                  Full View
                </Button>
              )}
              {onAddComment && (
                <Button size="sm" variant="outline" onClick={() => onAddComment(document)}>
                  <FileText className="h-3 w-3 mr-1" />
                  Comment
                </Button>
              )}
              {canUpdateStatus() && (
                <Button
                  size="sm"
                  onClick={() => {
                    if (onStartUpdate) {
                      onStartUpdate(document.id, document.status);
                    } else if (onUpdateStatus) {
                      onUpdateStatus(document.id, 'Under Review');
                    }
                  }}
                >
                  Update
                </Button>
              )}
              {onEscalate && (
                <Button size="sm" variant="outline" onClick={() => onEscalate(document)}>
                  <ArrowUp className="h-3 w-3 mr-1" />
                  Escalate
                </Button>
              )}
              {onReject && (
                <Button size="sm" variant="outline" onClick={() => onReject(document)}>
                  <X className="h-3 w-3 mr-1" />
                  Reject
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;