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
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  Send,
  X
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

export interface PhaseReminder {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  reminderDate: string;
  reminderTime: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  recipients: string[];
}

export interface PhaseAction {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  actionType: 'escalate' | 'delegate' | 'approve' | 'reject' | 'modify' | 'review';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo: string;
  dueDate: string;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
  notes?: string;
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
  onPhaseUpdate?: (phaseId: string, updates: Partial<TimelinePhase>) => void;
  onProjectUpdate?: (projectId: string, updates: Partial<Project>) => void;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  currentRole,
  projects,
  onPhaseClick,
  onProjectSelect,
  onPhaseUpdate,
  onProjectUpdate
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);
  const [viewMode, setViewMode] = useState<'horizontal' | 'vertical'>('horizontal');
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [selectedPhase, setSelectedPhase] = useState<TimelinePhase | null>(null);
  const [isPhaseDetailOpen, setIsPhaseDetailOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isUpdatingPhase, setIsUpdatingPhase] = useState<string | null>(null);
  const [phaseUpdates, setPhaseUpdates] = useState<Map<string, Partial<TimelinePhase>>>(new Map());
  const [shareUrl, setShareUrl] = useState<string>('');
  const [shareMessage, setShareMessage] = useState<string>('');
  const [reminders, setReminders] = useState<PhaseReminder[]>([]);
  const [actions, setActions] = useState<PhaseAction[]>([]);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [isCreatingReminder, setIsCreatingReminder] = useState(false);
  const [isCreatingAction, setIsCreatingAction] = useState(false);
  const [newReminder, setNewReminder] = useState<{
    title: string;
    description: string;
    reminderDate: string;
    reminderTime: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    recipients: string[];
  }>({
    title: '',
    description: '',
    reminderDate: '',
    reminderTime: '',
    priority: 'medium',
    recipients: []
  });
  const [newAction, setNewAction] = useState<{
    title: string;
    description: string;
    actionType: 'escalate' | 'delegate' | 'approve' | 'reject' | 'modify' | 'review';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignedTo: string;
    dueDate: string;
    notes: string;
  }>({
    title: '',
    description: '',
    actionType: 'review',
    priority: 'medium',
    assignedTo: '',
    dueDate: '',
    notes: ''
  });

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

  const handlePhaseUpdate = async (phaseId: string, updates: Partial<TimelinePhase>) => {
    setIsUpdatingPhase(phaseId);
    
    try {
      // Update local state
      setProjectData(prev => 
        prev.map(project => ({
          ...project,
          phases: project.phases.map(phase => 
            phase.id === phaseId ? { ...phase, ...updates } : phase
          )
        }))
      );

      // Call parent update handler
      onPhaseUpdate?.(phaseId, updates);
      
      // Update selected project if it's the current one
      if (selectedProject) {
        const updatedProject = projectData.find(p => p.id === selectedProject.id);
        if (updatedProject) {
          setSelectedProject(updatedProject);
        }
      }

      console.log(`Phase ${phaseId} updated:`, updates);
    } catch (error) {
      console.error('Error updating phase:', error);
    } finally {
      setIsUpdatingPhase(null);
    }
  };

  const handleProjectUpdate = async (projectId: string, updates: Partial<Project>) => {
    try {
      // Update local state
      setProjectData(prev => 
        prev.map(project => 
          project.id === projectId ? { ...project, ...updates } : project
        )
      );

      // Call parent update handler
      onProjectUpdate?.(projectId, updates);

      // Update selected project if it's the current one
      if (selectedProject?.id === projectId) {
        setSelectedProject(prev => prev ? { ...prev, ...updates } : null);
      }

      console.log(`Project ${projectId} updated:`, updates);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    if (!selectedProject) return;

    const exportData = {
      project: selectedProject,
      phases: selectedProject.phases,
      exportDate: new Date().toISOString(),
      exportedBy: currentRole
    };

    if (format === 'pdf') {
      // Simulate PDF export
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedProject.name}_timeline.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'excel') {
      // Simulate Excel export
      const csvContent = [
        ['Phase Name', 'Status', 'Progress', 'Start Date', 'End Date', 'Department', 'Responsible Role'],
        ...selectedProject.phases.map(phase => [
          phase.name,
          phase.status,
          `${phase.progress}%`,
          new Date(phase.startDate).toLocaleDateString(),
          new Date(phase.endDate).toLocaleDateString(),
          phase.department,
          phase.responsibleRole
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedProject.name}_timeline.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    console.log(`Exported ${selectedProject.name} timeline as ${format.toUpperCase()}`);
  };

  const handleShare = () => {
    if (!selectedProject) return;

    // Generate a shareable URL (in a real app, this would be a proper URL)
    const baseUrl = window.location.origin;
    const projectUrl = `${baseUrl}/timeline/${selectedProject.id}`;
    setShareUrl(projectUrl);

    // Generate a default share message
    const message = `Check out the project timeline for "${selectedProject.name}" - ${selectedProject.totalProgress}% complete. View details: ${projectUrl}`;
    setShareMessage(message);

    setIsShareOpen(true);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Copied to clipboard:', text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const shareViaEmail = () => {
    const subject = `Project Timeline: ${selectedProject?.name}`;
    const body = shareMessage;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const shareViaWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareViaLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedinUrl, '_blank');
  };

  const shareViaTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;
    window.open(twitterUrl, '_blank');
  };

  // Reminder functions
  const handleCreateReminder = async () => {
    if (!selectedPhase) {
      alert('Please select a phase first');
      return;
    }

    if (!newReminder.title.trim()) {
      alert('Please enter a reminder title');
      return;
    }

    if (!newReminder.reminderDate) {
      alert('Please select a reminder date');
      return;
    }

    if (!newReminder.reminderTime) {
      alert('Please select a reminder time');
      return;
    }

    // Validate date is not in the past
    const reminderDateTime = new Date(`${newReminder.reminderDate}T${newReminder.reminderTime}`);
    if (reminderDateTime <= new Date()) {
      alert('Reminder date and time must be in the future');
      return;
    }

    // Validate email format for recipients
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = newReminder.recipients.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      alert(`Invalid email format: ${invalidEmails.join(', ')}`);
      return;
    }

    // Check for duplicate reminder titles for the same phase
    const existingReminder = reminders.find(r => 
      r.phaseId === selectedPhase.id && 
      r.title.toLowerCase() === newReminder.title.trim().toLowerCase() &&
      r.status === 'active'
    );
    if (existingReminder) {
      alert('A reminder with this title already exists for this phase');
      return;
    }

    setIsCreatingReminder(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const reminder: PhaseReminder = {
        id: Date.now().toString(),
        phaseId: selectedPhase.id,
        title: newReminder.title.trim(),
        description: newReminder.description.trim(),
        reminderDate: newReminder.reminderDate,
        reminderTime: newReminder.reminderTime,
        priority: newReminder.priority,
        status: 'active',
        createdBy: currentRole,
        createdAt: new Date().toISOString(),
        recipients: newReminder.recipients
      };

      setReminders(prev => [...prev, reminder]);
      
      // Reset form
      setNewReminder({
        title: '',
        description: '',
        reminderDate: '',
        reminderTime: '',
        priority: 'medium',
        recipients: []
      });
      
      setIsReminderDialogOpen(false);
      
      // Show success message
      alert(`Reminder "${reminder.title}" has been created successfully!`);
      console.log('Reminder created:', reminder);
    } catch (error) {
      console.error('Error creating reminder:', error);
      alert('Failed to create reminder. Please try again.');
    } finally {
      setIsCreatingReminder(false);
    }
  };

  const handleCreateAction = async () => {
    if (!selectedPhase) {
      alert('Please select a phase first');
      return;
    }

    if (!newAction.title.trim()) {
      alert('Please enter an action title');
      return;
    }

    if (!newAction.assignedTo.trim()) {
      alert('Please enter who this action is assigned to');
      return;
    }

    if (!newAction.dueDate) {
      alert('Please select a due date');
      return;
    }

    // Validate due date is not in the past
    const dueDateTime = new Date(newAction.dueDate);
    if (dueDateTime <= new Date()) {
      alert('Due date must be in the future');
      return;
    }

    // Check for duplicate action titles for the same phase
    const existingAction = actions.find(a => 
      a.phaseId === selectedPhase.id && 
      a.title.toLowerCase() === newAction.title.trim().toLowerCase() &&
      a.status === 'pending'
    );
    if (existingAction) {
      alert('An action with this title already exists for this phase');
      return;
    }

    setIsCreatingAction(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const action: PhaseAction = {
        id: Date.now().toString(),
        phaseId: selectedPhase.id,
        title: newAction.title.trim(),
        description: newAction.description.trim(),
        actionType: newAction.actionType,
        priority: newAction.priority,
        status: 'pending',
        assignedTo: newAction.assignedTo.trim(),
        dueDate: newAction.dueDate,
        createdBy: currentRole,
        createdAt: new Date().toISOString(),
        notes: newAction.notes?.trim() || ''
      };

      setActions(prev => [...prev, action]);
      
      // Reset form
      setNewAction({
        title: '',
        description: '',
        actionType: 'review',
        priority: 'medium',
        assignedTo: '',
        dueDate: '',
        notes: ''
      });
      
      setIsActionDialogOpen(false);
      
      // Show success message
      alert(`Action "${action.title}" has been created successfully!`);
      console.log('Action created:', action);
    } catch (error) {
      console.error('Error creating action:', error);
      alert('Failed to create action. Please try again.');
    } finally {
      setIsCreatingAction(false);
    }
  };

  const handleCompleteAction = (actionId: string) => {
    setActions(prev => 
      prev.map(action => 
        action.id === actionId 
          ? { ...action, status: 'completed' as const, completedAt: new Date().toISOString() }
          : action
      )
    );
    console.log('Action completed:', actionId);
  };

  const handleCancelReminder = (reminderId: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === reminderId 
          ? { ...reminder, status: 'cancelled' as const }
          : reminder
      )
    );
    console.log('Reminder cancelled:', reminderId);
  };

  const handleSendReminderNotification = (reminder: PhaseReminder) => {
    if (reminder.recipients.length === 0) {
      alert('No recipients specified for this reminder');
      return;
    }

    const subject = `Reminder: ${reminder.title}`;
    const body = `
Phase: ${selectedPhase?.name}
Reminder: ${reminder.title}
Description: ${reminder.description}
Date: ${new Date(reminder.reminderDate).toLocaleDateString()}
Time: ${reminder.reminderTime}
Priority: ${reminder.priority.toUpperCase()}

Created by: ${reminder.createdBy}
    `.trim();

    const mailtoUrl = `mailto:${reminder.recipients.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const handleSendActionNotification = (action: PhaseAction) => {
    const subject = `Action Required: ${action.title}`;
    const body = `
Phase: ${selectedPhase?.name}
Action: ${action.title}
Description: ${action.description}
Action Type: ${action.actionType.toUpperCase()}
Priority: ${action.priority.toUpperCase()}
Due Date: ${new Date(action.dueDate).toLocaleDateString()}
Assigned To: ${action.assignedTo}
${action.notes ? `Notes: ${action.notes}` : ''}

Created by: ${action.createdBy}
    `.trim();

    const mailtoUrl = `mailto:${action.assignedTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const getPhaseReminders = (phaseId: string) => {
    return reminders.filter(reminder => reminder.phaseId === phaseId && reminder.status === 'active');
  };

  const getPhaseActions = (phaseId: string) => {
    return actions.filter(action => action.phaseId === phaseId);
  };

  const renderPhase = (phase: TimelinePhase, level: number = 0, isVertical: boolean = false) => {
    const isExpanded = expandedPhases.has(phase.id);
    const hasSubPhases = phase.subPhases && phase.subPhases.length > 0;
    const isOverdue = new Date(phase.endDate) < new Date() && phase.status !== 'completed';

    return (
      <div key={phase.id} className={`${level > 0 ? 'ml-6' : ''}`}>
        <div
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
            isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200'
          } ${isVertical ? 'ml-0' : ''}`}
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
      <div className="space-y-6">
        {selectedProject.phases.map((phase, index) => (
          <div key={phase.id} className="relative">
            {/* Timeline line connector */}
            {index < selectedProject.phases.length - 1 && (
              <div className="absolute left-6 top-16 w-0.5 h-6 bg-gray-300" />
            )}
            
            {/* Phase card */}
            <div className="flex items-start gap-4">
              {/* Timeline node */}
              <div className={`w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm ${getPhaseColor(phase.color)} ${getStatusColor(phase.status)}`}>
                {index + 1}
              </div>
              
              {/* Phase content */}
              <div className="flex-1">
                {renderPhase(phase, 0, true)}
              </div>
            </div>
          </div>
        ))}
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
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
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

              {/* Reminders and Actions Section */}
              <div className="pt-4 border-t">
                <h3 className="font-medium text-sm text-muted-foreground mb-3">Phase Management</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsReminderDialogOpen(true)}
                    disabled={!selectedPhase}
                    className="flex items-center gap-2"
                  >
                    <Bell className="h-4 w-4" />
                    Set Reminders
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsActionDialogOpen(true)}
                    disabled={!selectedPhase}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Take Action
                  </Button>
                </div>

                {/* Active Reminders */}
                {getPhaseReminders(selectedPhase.id).length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Active Reminders</h4>
                    <div className="space-y-2">
                      {getPhaseReminders(selectedPhase.id).map(reminder => (
                        <div key={reminder.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-sm">{reminder.title}</h5>
                              <p className="text-xs text-muted-foreground">{reminder.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(reminder.reminderDate).toLocaleDateString()} at {reminder.reminderTime}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {reminder.priority}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSendReminderNotification(reminder)}
                                title="Send notification"
                              >
                                <Send className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCancelReminder(reminder.id)}
                                title="Cancel reminder"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Actions */}
                {getPhaseActions(selectedPhase.id).length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Active Actions</h4>
                    <div className="space-y-2">
                      {getPhaseActions(selectedPhase.id).map(action => (
                        <div key={action.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-sm">{action.title}</h5>
                              <p className="text-xs text-muted-foreground">{action.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">
                                  Assigned to: {action.assignedTo}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Due: {new Date(action.dueDate).toLocaleDateString()}
                                </span>
                                <Badge 
                                  variant={action.priority === 'urgent' ? 'destructive' : 'outline'} 
                                  className="text-xs"
                                >
                                  {action.priority}
                                </Badge>
                                <Badge 
                                  variant={action.status === 'completed' ? 'default' : 'secondary'} 
                                  className="text-xs"
                                >
                                  {action.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSendActionNotification(action)}
                                title="Send notification"
                              >
                                <Send className="h-3 w-3" />
                              </Button>
                              {action.status === 'pending' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCompleteAction(action.id)}
                                  title="Mark as complete"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Complete
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Executive Action Buttons */}
              {(currentRole.includes('Executive') || currentRole.includes('Chairman') || currentRole.includes('MD')) && (
                <div className="pt-4 border-t">
                  <h3 className="font-medium text-sm text-muted-foreground mb-3">Executive Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePhaseUpdate(selectedPhase.id, { status: 'in_progress' })}
                      disabled={isUpdatingPhase === selectedPhase.id || selectedPhase.status === 'in_progress'}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Start Phase
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePhaseUpdate(selectedPhase.id, { status: 'completed' })}
                      disabled={isUpdatingPhase === selectedPhase.id || selectedPhase.status === 'completed'}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Phase
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePhaseUpdate(selectedPhase.id, { status: 'urgent' })}
                      disabled={isUpdatingPhase === selectedPhase.id || selectedPhase.status === 'urgent'}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Mark Urgent
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePhaseUpdate(selectedPhase.id, { status: 'delayed' })}
                      disabled={isUpdatingPhase === selectedPhase.id || selectedPhase.status === 'delayed'}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Mark Delayed
                    </Button>
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
              <Button 
                variant="outline"
                onClick={() => handleExport('pdf')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleExport('excel')}
              >
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

      {/* Share Dialog */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share Project Timeline
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Project Info */}
            {selectedProject && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold text-lg">{selectedProject.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{selectedProject.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span>Progress: <strong>{selectedProject.totalProgress}%</strong></span>
                  <span>Status: <strong>{selectedProject.status.toUpperCase()}</strong></span>
                  <span>Risk: <strong>{selectedProject.riskLevel.toUpperCase()}</strong></span>
                </div>
              </div>
            )}

            {/* Share Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Share Message</label>
              <textarea
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                className="w-full p-3 border rounded-md resize-none"
                rows={3}
                placeholder="Enter your share message..."
              />
            </div>

            {/* Share URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Share URL</label>
              <div className="flex gap-2">
                <input
                  value={shareUrl}
                  readOnly
                  className="flex-1 p-2 border rounded-md bg-muted/50 text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(shareUrl)}
                >
                  Copy
                </Button>
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Share via</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-16"
                  onClick={shareViaEmail}
                >
                  <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">
                    @
                  </div>
                  <span className="text-xs">Email</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-16"
                  onClick={shareViaWhatsApp}
                >
                  <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">
                    W
                  </div>
                  <span className="text-xs">WhatsApp</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-16"
                  onClick={shareViaLinkedIn}
                >
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    in
                  </div>
                  <span className="text-xs">LinkedIn</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-16"
                  onClick={shareViaTwitter}
                >
                  <div className="w-6 h-6 bg-sky-500 rounded flex items-center justify-center text-white text-xs font-bold">
                    𝕏
                  </div>
                  <span className="text-xs">Twitter</span>
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(shareMessage)}
              >
                Copy Message
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsShareOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  copyToClipboard(shareMessage);
                  setIsShareOpen(false);
                }}>
                  Copy & Close
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Set Reminder Dialog */}
      <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Set Reminder for {selectedPhase?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Reminder Title</label>
                <Input
                  value={newReminder.title}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter reminder title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={newReminder.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => 
                    setNewReminder(prev => ({ ...prev, priority: value }))
                  }
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
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={newReminder.description}
                onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border rounded-md resize-none"
                rows={3}
                placeholder="Enter reminder description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Reminder Date</label>
                <Input
                  type="date"
                  value={newReminder.reminderDate}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, reminderDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Reminder Time</label>
                <Input
                  type="time"
                  value={newReminder.reminderTime}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, reminderTime: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Recipients (comma-separated emails)</label>
              <Input
                value={newReminder.recipients.join(', ')}
                onChange={(e) => setNewReminder(prev => ({ 
                  ...prev, 
                  recipients: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                }))}
                placeholder="Enter email addresses separated by commas"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsReminderDialogOpen(false)}
                disabled={isCreatingReminder}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateReminder}
                disabled={isCreatingReminder}
              >
                <Bell className={`h-4 w-4 mr-2 ${isCreatingReminder ? 'animate-spin' : ''}`} />
                {isCreatingReminder ? 'Creating...' : 'Set Reminder'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Take Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Take Action for {selectedPhase?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Action Title</label>
                <Input
                  value={newAction.title}
                  onChange={(e) => setNewAction(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter action title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Action Type</label>
                <Select
                  value={newAction.actionType}
                  onValueChange={(value: 'escalate' | 'delegate' | 'approve' | 'reject' | 'modify' | 'review') => 
                    setNewAction(prev => ({ ...prev, actionType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="escalate">Escalate</SelectItem>
                    <SelectItem value="delegate">Delegate</SelectItem>
                    <SelectItem value="approve">Approve</SelectItem>
                    <SelectItem value="reject">Reject</SelectItem>
                    <SelectItem value="modify">Modify</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={newAction.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => 
                    setNewAction(prev => ({ ...prev, priority: value }))
                  }
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
                <label className="text-sm font-medium">Assigned To</label>
                <Input
                  value={newAction.assignedTo}
                  onChange={(e) => setNewAction(prev => ({ ...prev, assignedTo: e.target.value }))}
                  placeholder="Enter assignee name or role"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={newAction.description}
                onChange={(e) => setNewAction(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border rounded-md resize-none"
                rows={3}
                placeholder="Enter action description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <Input
                  type="date"
                  value={newAction.dueDate}
                  onChange={(e) => setNewAction(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Notes (Optional)</label>
                <Input
                  value={newAction.notes}
                  onChange={(e) => setNewAction(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsActionDialogOpen(false)}
                disabled={isCreatingAction}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateAction}
                disabled={isCreatingAction}
              >
                <Send className={`h-4 w-4 mr-2 ${isCreatingAction ? 'animate-spin' : ''}`} />
                {isCreatingAction ? 'Creating...' : 'Create Action'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectTimeline;
