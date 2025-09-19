import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Settings, User, LogOut } from "lucide-react";

interface DashboardHeaderProps {
  currentRole: string;
  userName: string;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

const DashboardHeader = ({ 
  currentRole, 
  userName, 
  onNotificationsClick, 
  onProfileClick, 
  onSettingsClick, 
  onLogoutClick 
}: DashboardHeaderProps) => {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "System Admin":
        return "bg-primary text-primary-foreground";
      case "Executive":
        return "bg-safety text-white";
      case "Director":
        return "bg-legal text-white";
      case "Manager":
        return "bg-projects text-white";
      default:
        return "bg-systems text-white";
    }
  };

  const handleNotificationsClick = () => {
    if (onNotificationsClick) {
      onNotificationsClick();
    } else {
      console.log("Notifications button clicked");
    }
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      console.log("Profile button clicked");
    }
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      console.log("Settings button clicked");
    }
  };

  const handleLogoutClick = () => {
    if (onLogoutClick) {
      onLogoutClick();
    } else {
      console.log("Logout button clicked");
    }
  };

  return (
    <header className="h-16 border-b bg-card shadow-card">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">K</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">KMRL AI Agent</h1>
              <p className="text-xs text-muted-foreground">Document Management & Workflow</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative" onClick={handleNotificationsClick}>
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-status-urgent rounded-full"></span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{userName}</p>
              <Badge className={`text-xs ${getRoleBadgeColor(currentRole)}`}>
                {currentRole}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={handleProfileClick}>
              <User className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleSettingsClick}>
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={handleLogoutClick}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;