import { useState } from "react";
import RoleSelector from "@/components/RoleSelector";
import MainDashboard from "@/components/MainDashboard";
import ExecutiveDashboard from "@/components/ExecutiveDashboard";

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
  
  if (executiveRoles.includes(selectedRole)) {
    return (
      <ExecutiveDashboard 
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
