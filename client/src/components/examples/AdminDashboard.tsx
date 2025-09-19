import AdminDashboard from '../AdminDashboard'

export default function AdminDashboardExample() {
  //todo: remove mock functionality
  const mockStats = {
    totalMonasteries: 47,
    totalFestivals: 23,
    totalImages: 342,
    totalUsers: 1247,
    recentActivity: [
      {
        id: "1",
        action: "Added",
        target: "Rumtek Monastery 360° tour",
        timestamp: "2 hours ago"
      },
      {
        id: "2", 
        action: "Updated",
        target: "Losar Festival details",
        timestamp: "4 hours ago"
      },
      {
        id: "3",
        action: "Uploaded",
        target: "12 new monastery images",
        timestamp: "6 hours ago"
      },
      {
        id: "4",
        action: "Created",
        target: "Pemayangtse Monastery profile",
        timestamp: "1 day ago"
      },
      {
        id: "5",
        action: "Modified",
        target: "Festival calendar settings",
        timestamp: "2 days ago"
      }
    ]
  }

  return <AdminDashboard stats={mockStats} />
}