import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Shield, Users, User, Settings } from "lucide-react";

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

const RoleSelector = ({ onSelectRole }: RoleSelectorProps) => {
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
    {
      id: 'staff',
      name: 'Staff/Officer',
      description: 'Execute tasks, upload documents',
      permissions: ['Upload Documents', 'Execute Tasks', 'View Assignments'],
      icon: <User className="h-6 w-6" />
    }
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
      case 'staff':
        return 'border-systems bg-systems/5';
      default:
        return 'border-muted bg-muted/5';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6 flex items-center justify-center">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">KMRL AI Agent</h1>
          <p className="text-xl text-muted-foreground mb-2">Document Management & Workflow System</p>
          <Badge variant="outline" className="text-sm">
            Kochi Metro Rail Limited
          </Badge>
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
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;