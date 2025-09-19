import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  Mountain,
  Calendar,
  Image,
  Users,
  BarChart3,
  Settings,
  Upload
} from "lucide-react";
import { Link } from "wouter";

interface AdminDashboardProps {
  stats: {
    totalMonasteries: number;
    totalFestivals: number;
    totalImages: number;
    totalUsers: number;
    recentActivity: Array<{
      id: string;
      action: string;
      target: string;
      timestamp: string;
    }>;
  };
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage monastery content and system settings</p>
        </div>
        <div className="flex gap-2">
          <Button asChild data-testid="button-add-monastery">
            <Link href="/admin/monastery/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Monastery
            </Link>
          </Button>
          <Button asChild variant="outline" data-testid="button-add-festival">
            <Link href="/admin/festival/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Festival
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Monasteries</CardTitle>
            <Mountain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-monasteries">{stats.totalMonasteries}</div>
            <p className="text-xs text-muted-foreground">Active monastery profiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Festival Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-festivals">{stats.totalFestivals}</div>
            <p className="text-xs text-muted-foreground">Scheduled cultural events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Media Assets</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-images">{stats.totalImages}</div>
            <p className="text-xs text-muted-foreground">Images and 360° content</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-users">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Platform users</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start" data-testid="action-manage-monasteries">
                <Link href="/admin/monasteries">
                  <Mountain className="h-4 w-4 mr-2" />
                  Manage Monasteries
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start" data-testid="action-manage-festivals">
                <Link href="/admin/festivals">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Festivals
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start" data-testid="action-media-library">
                <Link href="/admin/media">
                  <Upload className="h-4 w-4 mr-2" />
                  Media Library
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start" data-testid="action-analytics">
                <Link href="/admin/analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start" data-testid="action-settings">
                <Link href="/admin/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">
                          {activity.action} <span className="text-muted-foreground">{activity.target}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.action.split(' ')[0]}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}