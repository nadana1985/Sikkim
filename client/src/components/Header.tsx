import { Button } from "@/components/ui/button";
import { Calendar, Home, Map, Mountain, Settings, User } from "lucide-react";
import { Link, useLocation } from "wouter";

interface HeaderProps {
  isAuthenticated?: boolean;
  isAdmin?: boolean;
}

export default function Header({ isAuthenticated = false, isAdmin = false }: HeaderProps) {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-2 hover-elevate rounded-md px-2 py-1">
            <Mountain className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
              <span className="font-serif text-xl font-semibold text-foreground">Monastery360</span>
              <span className="text-xs text-muted-foreground">Sacred Heritage of Sikkim</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Button
              variant={location === "/" ? "secondary" : "ghost"}
              size="sm"
              asChild
              data-testid="nav-home"
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            <Button
              variant={location === "/monasteries" ? "secondary" : "ghost"}
              size="sm"
              asChild
              data-testid="nav-monasteries"
            >
              <Link href="/monasteries">
                <Mountain className="h-4 w-4 mr-2" />
                Monasteries
              </Link>
            </Button>
            <Button
              variant={location === "/map" ? "secondary" : "ghost"}
              size="sm"
              asChild
              data-testid="nav-map"
            >
              <Link href="/map">
                <Map className="h-4 w-4 mr-2" />
                Map
              </Link>
            </Button>
            <Button
              variant={location === "/festivals" ? "secondary" : "ghost"}
              size="sm"
              asChild
              data-testid="nav-festivals"
            >
              <Link href="/festivals">
                <Calendar className="h-4 w-4 mr-2" />
                Festivals
              </Link>
            </Button>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Button variant="outline" size="sm" asChild data-testid="nav-admin">
                    <Link href="/admin">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild data-testid="nav-profile">
                  <Link href="/profile">
                    <User className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = "/api/logout"}
                  data-testid="button-logout"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-login"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}