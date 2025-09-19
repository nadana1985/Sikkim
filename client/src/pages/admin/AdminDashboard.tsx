import { useQuery } from "@tanstack/react-query";
import AdminDashboardComponent from "@/components/AdminDashboard";

export default function AdminDashboard() {
  // Fetch real statistics from API
  const { data: monasteries = [] } = useQuery({
    queryKey: ["/api/monasteries"],
  });

  const { data: festivals = [] } = useQuery({
    queryKey: ["/api/festivals"],
  });

  const { data: media = [] } = useQuery({
    queryKey: ["/api/media"],
  });

  // Mock stats for now - will be replaced with real data
  const stats = {
    totalMonasteries: (monasteries as any[]).length,
    totalFestivals: (festivals as any[]).length,
    totalImages: (media as any[]).length,
    totalUsers: 0, // Will be implemented when user management is added
    recentActivity: [
      {
        id: "1",
        action: "Created",
        target: "Rumtek Monastery",
        timestamp: "2 hours ago",
      },
      {
        id: "2", 
        action: "Updated",
        target: "Losar Festival",
        timestamp: "5 hours ago",
      },
      {
        id: "3",
        action: "Uploaded",
        target: "Virtual tour media",
        timestamp: "1 day ago",
      },
    ],
  };

  return <AdminDashboardComponent stats={stats} />;
}