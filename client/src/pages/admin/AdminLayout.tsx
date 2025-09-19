import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  Mountain,
  Calendar,
  Image,
  Settings,
  LogOut,
  User
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Monasteries",
    href: "/admin/monasteries",
    icon: Mountain,
  },
  {
    title: "Festivals",
    href: "/admin/festivals",
    icon: Calendar,
  },
  {
    title: "Media",
    href: "/admin/media",
    icon: Image,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  if (!user || !user.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">You need admin privileges to access this area.</p>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <Mountain className="h-8 w-8 text-primary" />
              <div>
                <h2 className="font-serif text-lg font-bold">Monastery360</h2>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </div>
          </div>
          
          <nav className="px-4 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = location === item.href || (item.href !== "/admin" && location.startsWith(item.href));
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                  data-testid={`nav-${item.title.toLowerCase()}`}
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.title}
                  </Link>
                </Button>
              );
            })}
          </nav>
          
          <div className="absolute bottom-0 left-0 right-0 w-64 p-4 border-t">
            <div className="flex items-center space-x-2 mb-3">
              <User className="h-4 w-4" />
              <div className="text-sm">
                <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full" data-testid="button-logout">
              <a href="/api/logout">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </a>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}