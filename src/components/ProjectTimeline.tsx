import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Filter, 
  Download, 
  Share2, 
  ChevronRight, 
  ChevronDown,
  TrendingUp,
  BarChart3,
  FileText,
  Users,
  Settings,
  ArrowRight,
  ArrowDown,
  Target,
  Zap,
  Bell,
  ExternalLink
} from 'lucide-react';

// Timeline Phase Types
export interface TimelinePhase {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed' | 'urgent';
  progress: number; // 0-100
  color: 'blue' | 'green' | 'orange' | 'red';
  responsibleRole: string;
  department: string;
  subPhases?: TimelinePhase[];
  documents?: string[];
  complianceCheckpoints?: ComplianceCheckpoint[];
  dependencies?: string[];
}

export interface ComplianceCheckpoint {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  responsibleRole: string;
  documents: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  phases: TimelinePhase[];
  totalProgress: number;
  budget: number;
  actualCost: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface ProjectTimelineProps {
  currentRole: string;
  projects: Project[];
  onPhaseClick?: (phase: TimelinePhase) => void;
  onProjectSelect?: (project: Project) => void;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  currentRole,
  projects,
  onPhaseClick,
  onProjectSelect
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);
  const [viewMode, setViewMode] = useState<'horizontal' | 'vertical'>('horizontal');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [selectedPhase, setSelectedPhase] = useState<TimelinePhase | null>(null);
  const [isPhaseDetailOpen, setIsPhaseDetailOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Mock data for demonstration
  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'Kakkanad Metro Extension',
      description: 'Extension of metro line to Kakkanad IT hub',
      startDate: '2025-01-01',
      endDate: '2027-12-31',
      status: 'active',
      totalProgress: 35,
      budget: 12000000000, // 1200 Cr
      actualCost: 4200000000, // 420 Cr
      riskLevel: 'medium',
      phases: [
        {
          id: 'phase-1',
          name: 'Initiation',
          description: 'Project kickoff and initial planning',
          startDate: '2025-01-01',
          endDate: '2025-03-31',
          status: 'completed',
          progress: 100,
          color: 'blue',
          responsibleRole: 'Executive',
          department: 'Finance',
          documents: ['Project Charter', 'Initial Budget'],
          complianceCheckpoints: [
            {
              id: 'cp-1',
              title: 'Board Approval',
              dueDate: '2025-02-15',
              status: 'completed',
              priority: 'high',
              description: 'Board approval for project initiation',
              responsibleRole: 'Executive',
              documents: ['Board Resolution']
            }
          ]
        },
        {
          id: 'phase-2',
          name: 'Planning',
          description: 'Detailed project planning and design',
          startDate: '2025-02-01',
          endDate: '2025-06-30',
          status: 'in_progress',
          progress: 75,
          color: 'green',
          responsibleRole: 'Projects Director',
          department: 'Projects',
          documents: ['Design Plans', 'Technical Specifications'],
          subPhases: [
            {
              id: 'phase-2-1',
              name: 'Route Planning',
              description: 'Finalize metro route alignment',
              startDate: '2025-02-01',
              endDate: '2025-03-15',
              status: 'completed',
              progress: 100,
              color: 'green',
              responsibleRole: 'Project Engineer',
              department: 'Projects'
            },
            {
              id: 'phase-2-2',
              name: 'Station Design',
              description: 'Design metro stations and platforms',
              startDate: '2025-03-01',
              endDate: '2025-05-31',
              status: 'in_progress',
              progress: 60,
              color: 'green',
              responsibleRole: 'Design Manager',
              department: 'Projects'
            }
          ],
          complianceCheckpoints: [
            {
              id: 'cp-2',
              title: 'Environmental Clearance',
              dueDate: '2025-05-31',
              status: 'pending',
              priority: 'high',
              description: 'Environmental impact assessment approval',
              responsibleRole: 'Projects Director',
              documents: ['EIA Report', 'Clearance Certificate']
            }
          ]
        },
        {
          id: 'phase-3',
          name: 'Design',
          description: 'Detailed engineering design',
          startDate: '2025-05-01',
          endDate: '2025-09-30',
          status: 'not_started',
          progress: 0,
          color: 'green',
          responsibleRole: 'Design Director',
          department: 'Projects',
          dependencies: ['phase-2']
        },
        {
          id: 'phase-4',
          name: 'Procurement',
          description: 'Tender process and vendor selection',
          startDate: '2025-08-01',
          endDate: '2026-02-28',
          status: 'not_started',
          progress: 0,
          color: 'blue',
          responsibleRole: 'Finance Director',
          department: 'Finance',
          dependencies: ['phase-3']
        },
        {
          id: 'phase-5',
          name: 'Construction',
          description: 'Physical construction of metro line',
          startDate: '2026-01-01',
          endDate: '2027-06-30',
          status: 'not_started',
          progress: 0,
          color: 'green',
          responsibleRole: 'Construction Manager',
          department: 'Projects',
          dependencies: ['phase-4']
        },
        {
          id: 'phase-6',
          name: 'Testing & Commissioning',
          description: 'System testing and commissioning',
          startDate: '2027-04-01',
          endDate: '2027-09-30',
          status: 'not_started',
          progress: 0,
          color: 'orange',
          responsibleRole: 'Systems Director',
          department: 'Systems & Operations',
          dependencies: ['phase-5']
        },
        {
          id: 'phase-7',
          name: 'Handover',
          description: 'Project handover and operations start',
          startDate: '2027-08-01',
          endDate: '2027-12-31',
          status: 'not_started',
          progress: 0,
          color: 'orange',
          responsibleRole: 'Operations Director',
          department: 'Systems & Operations',
          dependencies: ['phase-6']
        }
      ]
    },
    {
      id: '2',
      name: 'Aluva Station Safety Upgrade',
      description: 'Critical safety system upgrades at Aluva Station',
      startDate: '2025-09-01',
      endDate: '2025-12-31',
      status: 'active',
      totalProgress: 20,
      budget: 50000000, // 50 Cr
      actualCost: 10000000, // 10 Cr
      riskLevel: 'high',
      phases: [
        {
          id: 'safety-1',
          name: 'Safety Assessment',
          description: 'Comprehensive safety audit and assessment',
          startDate: '2025-09-01',
          endDate: '2025-09-30',
          status: 'completed',
          progress: 100,
          color: 'red',
          responsibleRole: 'Safety Director',
          department: 'Health & Safety'
        },
        {
          id: 'safety-2',
          name: 'Emergency Upgrades',
          description: 'Immediate safety system upgrades',
          startDate: '2025-09-15',
          endDate: '2025-11-30',
          status: 'in_progress',
          progress: 30,
          color: 'red',
          responsibleRole: 'Safety Manager',
          department: 'Health & Safety',
          complianceCheckpoints: [
            {
              id: 'safety-cp-1',
              title: 'Fire Safety Certification',
              dueDate: '2025-10-15',
              status: 'pending',
              priority: 'urgent',
              description: 'Fire safety system certification required',
              responsibleRole: 'Safety Inspector',
              documents: ['Fire Safety Report', 'Certification']
            }
          ]
        }
      ]
    }
  ];

  const [projectData, setProjectData] = useState<Project[]>(mockProjects);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'delayed': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'urgent': return 'bg-red-500';
      case 'delayed': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getPhaseColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'orange': return 'bg-orange-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleSpecificView = () => {
    switch (currentRole) {
      case 'Executive':
      case 'Chairman':
      case 'MD':
      case 'Chief Secretary':
        return {
          showDetails: false,
          showSubPhases: false,
          showCompliance: true,
          showBudget: true,
          showRisk: true
        };
      case 'Director':
      case 'Finance Director':
      case 'Projects Director':
      case 'Systems Director':
        return {
          showDetails: true,
          showSubPhases: true,
          showCompliance: true,
          showBudget: true,
          showRisk: true
        };
      case 'Manager':
      case 'Finance Manager':
      case 'Projects Manager':
      case 'Systems Manager':
        return {
          showDetails: true,
          showSubPhases: true,
          showCompliance: true,
          showBudget: false,
          showRisk: false
        };
      default: // Staff
        return {
          showDetails: false,
          showSubPhases: false,
          showCompliance: false,
          showBudget: false,
          showRisk: false
        };
    }
  };

  const roleView = getRoleSpecificView();

  const togglePhaseExpansion = (phaseId: string) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(phaseId)) {
      newExpanded.delete(phaseId);
    } else {
      newExpanded.add(phaseId);
    }
    setExpandedPhases(newExpanded);
  };

  const handlePhaseClick = (phase: TimelinePhase) => {
    setSelectedPhase(phase);
    setIsPhaseDetailOpen(true);
    onPhaseClick?.(phase);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderPhase = (phase: TimelinePhase, level: number = 0) => {
    const isExpanded = expandedPhases.has(phase.id);
    const hasSubPhases = phase.subPhases && phase.subPhases.length > 0;
    const isOverdue = new Date(phase.endDate) < new Date() && phase.status !== 'completed';

    return (
      <div key={phase.id} className={`${level > 0 ? 'ml-6' : ''}`}>
        <div
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
            isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200'
          }`}
          onClick={() => handlePhaseClick(phase)}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {hasSubPhases && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePhaseExpansion(phase.id);
                  }}
                >
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              )}
              <h3 className="font-semibold text-lg">{phase.name}</h3>
              {getStatusIcon(phase.status)}
              <Badge className={`${getStatusColor(phase.status)} text-white`}>
                {phase.status.replace('_', ' ').toUpperCase()}
              </Badge>
              {isOverdue && (
                <Badge variant="destructive">OVERDUE</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${getPhaseColor(phase.color)} text-white`}>
                {phase.department}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {phase.progress}% Complete
              </span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">{phase.description}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Start: {new Date(phase.startDate).toLocaleDateString()}</span>
              <span>End: {new Date(phase.endDate).toLocaleDateString()}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getPhaseColor(phase.color)}`}
                style={{ width: `${phase.progress}%` }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Responsible: {phase.responsibleRole}</span>
              <span>{phase.documents?.length || 0} documents</span>
            </div>
          </div>

          {roleView.showCompliance && phase.complianceCheckpoints && phase.complianceCheckpoints.length > 0 && (
            <div className="mt-3 pt-3 border-t">
              <h4 className="text-sm font-medium mb-2">Compliance Checkpoints</h4>
              <div className="space-y-1">
                {phase.complianceCheckpoints.map(cp => (
                  <div key={cp.id} className="flex items-center justify-between text-xs">
                    <span className={cp.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                      {cp.title}
                    </span>
                    <Badge 
                      variant={cp.priority === 'urgent' ? 'destructive' : 'outline'}
                      className="text-xs"
                    >
                      {cp.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {hasSubPhases && isExpanded && (
          <div className="mt-2 space-y-2">
            {phase.subPhases?.map(subPhase => renderPhase(subPhase, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderHorizontalTimeline = () => {
    if (!selectedProject) return null;

    return (
      <div className="overflow-x-auto">
        <div className="min-w-max p-6">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gray-300 rounded-full" />
            
            <div className="flex justify-between">
              {selectedProject.phases.map((phase, index) => (
                <div key={phase.id} className="flex flex-col items-center relative">
                  {/* Phase node */}
                  <div
                    className={`w-16 h-16 rounded-full border-4 border-white shadow-lg cursor-pointer transition-all hover:scale-110 ${
                      getPhaseColor(phase.color)
                    } ${getStatusColor(phase.status)}`}
                    onClick={() => handlePhaseClick(phase)}
                  >
                    <div className="flex items-center justify-center h-full text-white font-bold">
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Phase info */}
                  <div className="mt-4 text-center max-w-32">
                    <h3 className="font-semibold text-sm">{phase.name}</h3>
                    <p className="text-xs text-muted-foreground">{phase.progress}%</p>
                    <Badge className={`text-xs ${getStatusColor(phase.status)} text-white`}>
                      {phase.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVerticalTimeline = () => {
    if (!selectedProject) return null;

    return (
      <div className="space-y-4">
        {selectedProject.phases.map(phase => renderPhase(phase))}
      </div>
    );
  };

  const renderExecutiveView = () => {
    if (!selectedProject) return null;

    return (
      <div className="space-y-6">
        {/* High-level project overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{selectedProject.totalProgress}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${selectedProject.totalProgress}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Budget Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {formatCurrency(selectedProject.actualCost)} / {formatCurrency(selectedProject.budget)}
              </div>
              <div className="text-xs text-muted-foreground">
                {Math.round((selectedProject.actualCost / selectedProject.budget) * 100)}% utilized
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Risk Level</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge 
                variant={selectedProject.riskLevel === 'high' ? 'destructive' : 
                        selectedProject.riskLevel === 'medium' ? 'default' : 'secondary'}
                className="text-lg px-3 py-1"
              >
                {selectedProject.riskLevel.toUpperCase()}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Urgent Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {selectedProject.phases.filter(p => p.status === 'urgent').length}
              </div>
              <div className="text-xs text-muted-foreground">Require attention</div>
            </CardContent>
          </Card>
        </div>

        {/* Simplified timeline for executives */}
        <Card>
          <CardHeader>
            <CardTitle>Project Timeline Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {renderHorizontalTimeline()}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Project Selection and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedProject?.id || ''} onValueChange={(value) => {
            const project = projectData.find(p => p.id === value);
            setSelectedProject(project || null);
            onProjectSelect?.(project || null);
          }}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              {projectData.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'horizontal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('horizontal')}
            >
              Horizontal
            </Button>
            <Button
              variant={viewMode === 'vertical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('vertical')}
            >
              Vertical
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsExportOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Projects">Projects</SelectItem>
            <SelectItem value="Systems & Operations">Systems & Operations</SelectItem>
            <SelectItem value="Health & Safety">Health & Safety</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Timeline Content */}
      {selectedProject && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedProject.name}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{selectedProject.status.toUpperCase()}</Badge>
                <Badge 
                  variant={selectedProject.riskLevel === 'high' ? 'destructive' : 'default'}
                >
                  {selectedProject.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>
            </CardTitle>
            <p className="text-muted-foreground">{selectedProject.description}</p>
          </CardHeader>
          <CardContent>
            {currentRole.includes('Executive') || currentRole.includes('Chairman') || currentRole.includes('MD') ? 
              renderExecutiveView() : 
              viewMode === 'horizontal' ? renderHorizontalTimeline() : renderVerticalTimeline()
            }
          </CardContent>
        </Card>
      )}

      {/* Phase Detail Dialog */}
      <Dialog open={isPhaseDetailOpen} onOpenChange={setIsPhaseDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedPhase && getStatusIcon(selectedPhase.status)}
              {selectedPhase?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedPhase && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
                  <Badge className={`${getStatusColor(selectedPhase.status)} text-white`}>
                    {selectedPhase.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Progress</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getPhaseColor(selectedPhase.color)}`}
                        style={{ width: `${selectedPhase.progress}%` }}
                      />
                    </div>
                    <span className="text-sm">{selectedPhase.progress}%</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Start Date</h3>
                  <p className="text-sm">{new Date(selectedPhase.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">End Date</h3>
                  <p className="text-sm">{new Date(selectedPhase.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Responsible Role</h3>
                  <p className="text-sm">{selectedPhase.responsibleRole}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Department</h3>
                  <Badge variant="outline" className={`${getPhaseColor(selectedPhase.color)} text-white`}>
                    {selectedPhase.department}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Description</h3>
                <p className="text-sm">{selectedPhase.description}</p>
              </div>

              {selectedPhase.documents && selectedPhase.documents.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Related Documents</h3>
                  <div className="space-y-1">
                    {selectedPhase.documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{doc}</span>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedPhase.complianceCheckpoints && selectedPhase.complianceCheckpoints.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Compliance Checkpoints</h3>
                  <div className="space-y-2">
                    {selectedPhase.complianceCheckpoints.map(cp => (
                      <div key={cp.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{cp.title}</h4>
                          <Badge 
                            variant={cp.priority === 'urgent' ? 'destructive' : 'outline'}
                            className="text-xs"
                          >
                            {cp.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{cp.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span>Due: {new Date(cp.dueDate).toLocaleDateString()}</span>
                          <span>Responsible: {cp.responsibleRole}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Timeline</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export as Excel
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Choose your preferred format to export the project timeline data.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectTimeline;
