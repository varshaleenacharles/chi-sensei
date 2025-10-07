import { useState } from "react";
import RoleSelector from "@/components/RoleSelector";
import MainDashboard from "@/components/MainDashboard";
import ExecutiveDashboard from "@/components/ExecutiveDashboard";
import DirectorDashboard from "@/components/DirectorDashboard";
import ManagerDashboard from "@/components/ManagerDashboard";
import SystemAdminDashboard from "@/components/SystemAdminDashboard";

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Create a default user profile for demo purposes
  const defaultUserProfile = {
    id: 'demo-user',
    user_id: 'demo-user',
    email: 'demo@kmrl.com',
    full_name: 'Demo User',
    role: 'Staff',
    department: 'IT',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
  };

  if (!selectedRole) {
    return <RoleSelector onSelectRole={handleRoleSelection} />;
  }

  // Role-based dashboard routing
  const systemAdminRoles = ['System Admin'];
  const executiveRoles = ['Chairman', 'MD', 'Chief Secretary', 'Executive'];
  const directorRoles = ['Director', 'Finance Director', 'Projects Director', 'Systems Director', 'Legal Director', 'Safety Director'];
  const managerRoles = ['Manager', 'Finance Manager', 'Projects Manager', 'Systems Manager', 'Legal Manager', 'Safety Manager'];
  
  if (systemAdminRoles.includes(selectedRole)) {
    return (
      <SystemAdminDashboard 
        currentRole={selectedRole} 
        onBackToRoleSelection={handleBackToRoleSelection}
      />
    );
  }

  if (executiveRoles.includes(selectedRole)) {
    return (
      <ExecutiveDashboard 
        currentRole={selectedRole} 
        onBackToRoleSelection={handleBackToRoleSelection}
      />
    );
  }

  if (directorRoles.includes(selectedRole)) {
    return (
      <DirectorDashboard 
        currentRole={selectedRole} 
        onBackToRoleSelection={handleBackToRoleSelection}
      />
    );
  }

  if (managerRoles.includes(selectedRole)) {
    return (
      <ManagerDashboard 
        currentRole={selectedRole} 
        onBackToRoleSelection={handleBackToRoleSelection}
      />
    );
  }

  return (
    <MainDashboard 
      currentRole={selectedRole} 
      onBackToRoleSelection={handleBackToRoleSelection}
    />
  );
};

export default Index;