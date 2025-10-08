import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Crown, Shield, Users, User, Settings, Clock, CheckCircle, AlertTriangle, Eye, Calendar } from "lucide-react";
import { useState } from "react";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  icon: React.ReactNode;
}

interface RoleSelectorProps {
  onSelectRole: (role: string) => void;
}

interface TimelinePhase {
  id: string;
  name: string;
  domain: 'Finance' | 'Projects' | 'Systems & Operations' | 'Legal' | 'Health & Safety';
  status: 'Urgent' | 'Pending' | 'Completed' | 'Under Review';
  progress: number;
  startDate: string;
  endDate: string;
  responsibleRole: string;
}

const RoleSelector = ({ onSelectRole }: RoleSelectorProps) => {
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const timelinePhases: TimelinePhase[] = [
    {
      id: 'initiation',
      name: 'Initiation',
      domain: 'Finance',
      status: 'Completed',
      progress: 100,
      startDate: '01 Aug 2025',
      endDate: '15 Aug 2025',
      responsibleRole: 'Finance Manager'
    },
    {
      id: 'planning',
      name: 'Planning',
      domain: 'Projects',
      status: 'Completed',
      progress: 100,
      startDate: '16 Aug 2025',
      endDate: '31 Aug 2025',
      responsibleRole: 'Projects Director'
    },
    {
      id: 'design',
      name: 'Design',
      domain: 'Projects',
      status: 'Under Review',
      progress: 85,
      startDate: '01 Sep 2025',
      endDate: '20 Sep 2025',
      responsibleRole: 'Projects Director'
    },
    {
      id: 'procurement',
      name: 'Procurement',
      domain: 'Legal',
      status: 'Pending',
      progress: 30,
      startDate: '21 Sep 2025',
      endDate: '15 Oct 2025',
      responsibleRole: 'Legal Director'
    },
    {
      id: 'construction',
      name: 'Construction',
      domain: 'Projects',
      status: 'Pending',
      progress: 5,
      startDate: '16 Oct 2025',
      endDate: '30 Nov 2025',
      responsibleRole: 'Projects Director'
    },
    {
      id: 'testing',
      name: 'Testing & Commissioning',
      domain: 'Systems & Operations',
      status: 'Pending',
      progress: 0,
      startDate: '01 Dec 2025',
      endDate: '20 Dec 2025',
      responsibleRole: 'Systems Manager'
    },
    {
      id: 'handover',
      name: 'Handover',
      domain: 'Health & Safety',
      status: 'Pending',
      progress: 0,
      startDate: '21 Dec 2025',
      endDate: '31 Dec 2025',
      responsibleRole: 'Safety Director'
    }
  ];

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Urgent':
        return <AlertTriangle className="h-2.5 w-2.5 text-red-500" />;
      case 'Completed':
        return <CheckCircle className="h-2.5 w-2.5 text-green-500" />;
      case 'Pending':
        return <Clock className="h-2.5 w-2.5 text-yellow-500" />;
      case 'Under Review':
        return <Eye className="h-2.5 w-2.5 text-blue-500" />;
      default:
        return <Clock className="h-2.5 w-2.5 text-gray-500" />;
    }
  };

  const roles: Role[] = [
    {
      id: 'system-admin',
      name: 'System Admin',
      description: 'Configure permissions, color codes, and system settings',
      permissions: ['Full System Access', 'Configure Permissions', 'Manage Users'],
      icon: <Settings className="h-6 w-6" />
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Chairman, MD, Chief Secretary - Receive summaries and approvals',
      permissions: ['Automated Summaries', 'Urgent Escalations', 'Final Approvals'],
      icon: <Crown className="h-6 w-6" />
    },
    {
      id: 'director',
      name: 'Director',
      description: 'Domain-level governance, approve/reject documents',
      permissions: ['Domain Governance', 'Approve/Reject', 'Escalate Critical Cases'],
      icon: <Shield className="h-6 w-6" />
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Allocate staff access, update document status',
      permissions: ['Staff Allocation', 'Status Updates', 'Compliance Monitoring'],
      icon: <Users className="h-6 w-6" />
    },
  ];

  const getRoleColor = (roleId: string) => {
    switch (roleId) {
      case 'system-admin':
        return 'border-primary bg-primary/5';
      case 'executive':
        return 'border-safety bg-safety/5';
      case 'director':
        return 'border-legal bg-legal/5';
      case 'manager':
        return 'border-projects bg-projects/5';
      default:
        return 'border-muted bg-muted/5';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6 flex items-center justify-center">
      <div className="max-w-6xl w-full">
        {/* Header with Timeline Button */}
        <div className="relative mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">KMRL AI Agent</h1>
            <p className="text-xl text-muted-foreground mb-2">Document Management & Workflow System</p>
            <Badge variant="outline" className="text-sm">
              Kochi Metro Rail Limited
            </Badge>
          </div>
          
          {/* Timeline Button - Top Right */}
          <Button
            onClick={() => setIsTimelineOpen(true)}
            className="absolute top-0 right-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            size="sm"
          >
            <Calendar className="h-4 w-4 mr-2" />
            View Timeline
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {roles.map((role) => (
            <Card 
              key={role.id} 
              className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-elevated ${getRoleColor(role.id)}`}
              onClick={() => onSelectRole(role.name)}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    {role.icon}
                  </div>
                </div>
                <CardTitle className="text-lg font-semibold">{role.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  {role.description}
                </p>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-foreground">Permissions:</h4>
                  <div className="space-y-1">
                    {role.permissions.map((permission, index) => (
                      <div key={index} className="flex items-center text-xs">
                        <div className="w-1 h-1 rounded-full bg-primary mr-2"></div>
                        <span className="text-muted-foreground">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full mt-4" variant="outline" size="sm">
                  Select Role
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Select your role to access the appropriate dashboard and permissions
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <Link to="/contact" className="text-primary hover:underline">
              Contact Us
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/about" className="text-primary hover:underline">
              About Us
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/mission-vision" className="text-primary hover:underline">
              Mission & Vision
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/webhook" className="text-primary hover:underline">
              Webhook Upload
            </Link>
          </div>
        </div>
      </div>

      {/* Project Timeline Modal */}
      <Dialog open={isTimelineOpen} onOpenChange={setIsTimelineOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-foreground flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              Project Timeline Overview
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            </DialogTitle>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Track project phases and their current status across all departments
            </p>
          </DialogHeader>
          
          <div className="px-6 py-4">
            {/* Timeline Container - Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
              {timelinePhases.map((phase, index) => (
                <div key={phase.id} className="flex flex-col items-center relative bg-card rounded-lg p-4 shadow-md border">
                  {/* Phase Circle - No Overlap */}
                  <div className="relative mb-4 flex items-center justify-center">
                    <div 
                      className={`w-14 h-14 rounded-full ${getDomainColor(phase.domain)} flex items-center justify-center text-white text-lg font-bold relative z-10 shadow-lg`}
                    >
                      {phase.progress === 100 ? '✓' : index + 1}
                    </div>
                    {/* Status Icon - Separate from circle */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-background rounded-full flex items-center justify-center shadow-lg border-2 border-background z-20">
                      <div className="w-3 h-3 flex items-center justify-center">
                        {getStatusIcon(phase.status)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Phase Name */}
                  <div className="text-center mb-3 w-full">
                    <p className="text-sm font-bold text-foreground leading-tight mb-2">
                      {phase.name}
                    </p>
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted/30">
                      <div className={`w-2 h-2 rounded-full ${getDomainColor(phase.domain)}`}></div>
                      <p className="text-xs text-muted-foreground font-medium">{phase.domain}</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-4 bg-muted/30 rounded-full mb-3 overflow-hidden">
                    <div 
                      className={`h-4 rounded-full ${getDomainColor(phase.domain)} transition-all duration-500`}
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>
                  
                  {/* Progress Percentage */}
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <p className={`text-lg font-bold ${
                      phase.progress === 100 ? 'text-green-600' : 
                      phase.progress > 50 ? 'text-blue-600' : 
                      phase.progress > 0 ? 'text-yellow-600' : 'text-muted-foreground'
                    }`}>
                      {phase.progress}%
                    </p>
                    {phase.progress === 100 && <CheckCircle className="h-5 w-5 text-green-600" />}
                  </div>
                  
                  {/* Date Range */}
                  <div className="text-center mb-3 w-full">
                    <div className="bg-muted/20 rounded-lg px-3 py-2">
                      <p className="text-xs text-muted-foreground font-medium">
                        📅 {phase.startDate}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">
                        📅 {phase.endDate}
                      </p>
                    </div>
                  </div>
                  
                  {/* Responsible Role */}
                  <div className="text-center w-full">
                    <div className="bg-primary/10 rounded-lg px-3 py-2">
                      <p className="text-xs text-primary font-semibold">
                        👤 {phase.responsibleRole}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-muted/50">
              <div className="flex flex-wrap justify-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-muted-foreground">Finance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-muted-foreground">Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-muted-foreground">Systems & Ops</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-muted-foreground">Legal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-muted-foreground">Health & Safety</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleSelector;