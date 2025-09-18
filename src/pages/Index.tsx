import { useState } from "react";
import RoleSelector from "@/components/RoleSelector";
import MainDashboard from "@/components/MainDashboard";

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

  return (
    <MainDashboard 
      currentRole={selectedRole} 
      onBackToRoleSelection={handleBackToRoleSelection}
    />
  );
};

export default Index;
