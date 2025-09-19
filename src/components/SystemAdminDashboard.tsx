import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DashboardHeader from "./DashboardHeader";
import { 
  Shield, 
  Users, 
  Settings, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Server,
  Wifi,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  AlertCircle,
  TrendingUp,
  Monitor
} from "lucide-react";
import heroImage from "@/assets/kmrl-hero.jpg";

interface SystemAdminDashboardProps {
  currentRole: string;
  onBackToRoleSelection: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  permissions: string[];
}

interface SystemRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  enabled: boolean;
}

const SystemAdminDashboard = ({ currentRole, onBackToRoleSelection }: SystemAdminDashboardProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [systemRules, setSystemRules] = useState<SystemRule[]>([]);
  const [systemHealth, setSystemHealth] = useState({
    api: 'Operational',
    database: 'Operational', 
    storage: 'Warning',
    uptime: '99.9%'
  });
  const [auditLogs, setAuditLogs] = useState<Array<{
    id: string;
    timestamp: string;
    user: string;
    action: string;
    resource: string;
    status: string;
  }>>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRoleSimulator, setIsRoleSimulator] = useState(false);
  const [simulatedRole, setSimulatedRole] = useState("Staff");

  useEffect(() => {
    // Mock system admin data
    const mockUsers: User[] = [
      {
        id: "1",
        name: "Rajesh Kumar",
        email: "rajesh.kumar@kmrl.gov.in",
        role: "Finance Manager", 
        department: "Finance",
        status: "Active",
        lastLogin: "2025-09-19 14:30",
        permissions: ["view", "upload", "approve", "comment"]
      },
      {
        id: "2", 
        name: "Priya Nair",
        email: "priya.nair@kmrl.gov.in",
        role: "Projects Director",
        department: "Projects", 
        status: "Active",
        lastLogin: "2025-09-19 09:15",
        permissions: ["view", "upload", "approve", "comment", "delete"]
      },
      {
        id: "3",
        name: "Suresh Menon",
        email: "suresh.menon@kmrl.gov.in", 
        role: "Safety Inspector",
        department: "Health & Safety",
        status: "Active",
        lastLogin: "2025-09-18 16:45",
        permissions: ["view", "upload", "comment"]
      },
      {
        id: "4",
        name: "Asha Thomas",
        email: "asha.thomas@kmrl.gov.in",
        role: "Legal Officer",
        department: "Legal",
        status: "Inactive",
        lastLogin: "2025-09-16 11:20",
        permissions: ["view", "upload"]
      }
    ];

    const mockRules: SystemRule[] = [
      {
        id: "1",
        name: "Auto-Escalate Overdue Documents",
        description: "Escalate documents to Urgent status after 7 days pending",
        trigger: "Pending > 7 days",
        action: "Update status to Urgent",
        enabled: true
      },
      {
        id: "2", 
        name: "Deadline Reminders",
        description: "Send notifications 3 days before compliance deadlines",
        trigger: "3 days before deadline",
        action: "Send email/push notification",
        enabled: true
      },
      {
        id: "3",
        name: "Auto-Tag by Department",
        description: "Automatically assign domain color based on file content",
        trigger: "Document upload",
        action: "Detect and tag domain",
        enabled: true
      }
    ];

    const mockAuditLogs = [
      {
        id: "1",
        timestamp: "2025-09-19 14:30:15",
        user: "Rajesh Kumar",
        action: "Document Upload", 
        resource: "Vendor Invoice #3482",
        status: "Success"
      },
      {
        id: "2",
        timestamp: "2025-09-19 13:45:22",
        user: "Priya Nair",
        action: "Status Update",
        resource: "Metro Line Extension", 
        status: "Success"
      },
      {
        id: "3",
        timestamp: "2025-09-19 12:15:18",
        user: "Unknown IP",
        action: "Failed Login",
        resource: "System Access",
        status: "Failed"
      }
    ];

    setUsers(mockUsers);
    setSystemRules(mockRules);
    setAuditLogs(mockAuditLogs);
  }, []);

  const getSystemStats = () => {
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'Active').length,
      totalRules: systemRules.length,
      activeRules: systemRules.filter(r => r.enabled).length,
      securityAlerts: auditLogs.filter(log => log.status === 'Failed').length,
      systemUptime: systemHealth.uptime
    };
  };

  const stats = getSystemStats();

  const handleToggleRule = (ruleId: string) => {
    setSystemRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const handleDeactivateUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } : user
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operational': return 'text-status-completed';
      case 'Warning': return 'text-status-pending';
      case 'Critical': return 'text-status-urgent';
      default: return 'text-muted-foreground';
    }
  };

  const getRoleColor = (role: string) => {
    if (role.includes('Director')) return 'bg-legal text-white';
    if (role.includes('Manager')) return 'bg-projects text-white'; 
    if (role.includes('Executive')) return 'bg-safety text-white';
    return 'bg-systems text-white';
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader currentRole={currentRole} userName="System Admin" />
      
      {/* Hero Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={heroImage} 
          alt="KMRL Metro Station" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/80 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-2">System Administration</h1>
            <p className="text-lg opacity-90">RBAC Management, System Health & Security</p>
            <Badge variant="secondary" className="mt-2">
              <Shield className="h-3 w-3 mr-1" />
              Administrator Access
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Users</span>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Users</span>
                <CheckCircle className="h-4 w-4 text-status-completed" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-completed">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently enabled</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Auto Rules</span>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.activeRules}</div>
              <p className="text-xs text-muted-foreground mt-1">Active automations</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Security Alerts</span>
                <AlertTriangle className="h-4 w-4 text-status-urgent" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-urgent">{stats.securityAlerts}</div>
              <p className="text-xs text-muted-foreground mt-1">Failed attempts</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">System Uptime</span>
                <TrendingUp className="h-4 w-4 text-status-completed" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-completed">{stats.systemUptime}</div>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium">Role Simulator</span>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Switch 
                checked={isRoleSimulator}
                onCheckedChange={setIsRoleSimulator}
              />
              <p className="text-xs text-muted-foreground mt-1">Preview mode</p>
            </CardContent>
          </Card>
        </div>

        {/* Role Simulator Alert */}
        {isRoleSimulator && (
          <Alert className="mb-6 border-primary bg-primary/10">
            <Monitor className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>Role Simulator Active - Viewing as: <strong>{simulatedRole}</strong></span>
                <Select value={simulatedRole} onValueChange={setSimulatedRole}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Executive">Executive</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="automation">
              <Settings className="h-4 w-4 mr-2" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="health">
              <Activity className="h-4 w-4 mr-2" />
              System Health
            </TabsTrigger>
            <TabsTrigger value="audit">
              <Shield className="h-4 w-4 mr-2" />
              Audit Logs
            </TabsTrigger>
            <TabsTrigger value="rbac">
              <AlertCircle className="h-4 w-4 mr-2" />
              RBAC
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">User Management</h3>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>

            <div className="grid gap-4">
              {users.map((user) => (
                <Card key={user.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                              {user.role}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {user.department}
                            </Badge>
                            <Badge 
                              variant={user.status === 'Active' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {user.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeactivateUser(user.id)}
                        >
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Last Login: {user.lastLogin}</span>
                        <span>Permissions: {user.permissions.join(', ')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Automation Rules</h3>
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                New Rule
              </Button>
            </div>

            <div className="grid gap-4">
              {systemRules.map((rule) => (
                <Card key={rule.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground flex items-center gap-2">
                          {rule.name}
                          <Badge variant={rule.enabled ? 'default' : 'secondary'} className="text-xs">
                            {rule.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span><strong>Trigger:</strong> {rule.trigger}</span>
                          <span><strong>Action:</strong> {rule.action}</span>
                        </div>
                      </div>
                      <Switch 
                        checked={rule.enabled}
                        onCheckedChange={() => handleToggleRule(rule.id)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <h3 className="text-lg font-semibold">System Health Panel</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">API Status</span>
                    <Server className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-lg font-bold ${getStatusColor(systemHealth.api)}`}>
                    {systemHealth.api}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Response time: 120ms</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">Database</span>
                    <Database className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-lg font-bold ${getStatusColor(systemHealth.database)}`}>
                    {systemHealth.database}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Query time: 45ms</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">Storage</span>
                    <Activity className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-lg font-bold ${getStatusColor(systemHealth.storage)}`}>
                    {systemHealth.storage}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">85% capacity</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">Network</span>
                    <Wifi className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-status-completed">Stable</div>
                  <p className="text-xs text-muted-foreground mt-1">Latency: 12ms</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <h3 className="text-lg font-semibold">Security & Audit Logs</h3>
            
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <Card key={log.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`h-2 w-2 rounded-full ${
                          log.status === 'Success' ? 'bg-status-completed' : 'bg-status-urgent'
                        }`}></div>
                        <div>
                          <h4 className="font-medium text-foreground">{log.action}</h4>
                          <p className="text-sm text-muted-foreground">
                            {log.user} • {log.resource}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={log.status === 'Success' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {log.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{log.timestamp}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rbac" className="space-y-6">
            <h3 className="text-lg font-semibold">Role-Based Access Control</h3>
            
            <div className="grid gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Role Hierarchy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium">Executive</span>
                      <Badge className="bg-safety text-white">Highest Priority</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium">Director</span>
                      <Badge className="bg-legal text-white">Department Head</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium">Manager</span>
                      <Badge className="bg-projects text-white">Team Lead</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="font-medium">Staff</span>
                      <Badge className="bg-systems text-white">Individual Contributor</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Permission Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Role</th>
                          <th className="text-center p-2">View</th>
                          <th className="text-center p-2">Upload</th>
                          <th className="text-center p-2">Comment</th>
                          <th className="text-center p-2">Approve</th>
                          <th className="text-center p-2">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Executive</td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Director</td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2">❌</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Manager</td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2">❌</td>
                          <td className="text-center p-2">❌</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-medium">Staff</td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2"><CheckCircle className="h-4 w-4 text-status-completed mx-auto" /></td>
                          <td className="text-center p-2">❌</td>
                          <td className="text-center p-2">❌</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

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

export default SystemAdminDashboard;