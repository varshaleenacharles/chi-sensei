import { useState } from "react";
import RoleSelector from "@/components/RoleSelector";
import MainDashboard from "@/components/MainDashboard";
import ExecutiveDashboard from "@/components/ExecutiveDashboard";
import DirectorDashboard from "@/components/DirectorDashboard";
import ManagerDashboard from "@/components/ManagerDashboard";
import StaffDashboard from "@/components/StaffDashboard";

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
  };

  if (!selectedRole) {
    return <RoleSelector onSelectRole={handleRoleSelection} />;
  }

  // Executive roles get special dashboard with summary-only view
  const executiveRoles = ['Chairman', 'MD', 'Chief Secretary', 'Executive'];
  const directorRoles = ['Director'];
  const managerRoles = ['Manager'];
  const staffRoles = ['Staff/Officer'];
  
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

  if (staffRoles.includes(selectedRole)) {
    return (
      <StaffDashboard 
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
