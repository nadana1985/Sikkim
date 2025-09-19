import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Edit, Trash, Eye } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { Monastery } from "@shared/schema";

export default function MonasteryList() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: monasteries = [], isLoading } = useQuery({
    queryKey: ["/api/monasteries"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/monasteries/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/monasteries"] });
    },
  });

  const filteredMonasteries = (monasteries as any[]).filter((monastery: any) =>
    monastery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    monastery.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Monasteries</h1>
          <p className="text-muted-foreground">Manage monastery profiles and content</p>
        </div>
        <Button asChild data-testid="button-add-monastery">
          <Link href="/admin/monasteries/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Monastery
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search monasteries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monasteries Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Monasteries ({filteredMonasteries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading monasteries...</div>
          ) : filteredMonasteries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "No monasteries match your search." : "No monasteries found."}
              </p>
              {!searchTerm && (
                <Button asChild>
                  <Link href="/admin/monasteries/new">Add First Monastery</Link>
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Virtual Tour</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMonasteries.map((monastery: any) => (
                  <TableRow key={monastery.id}>
                    <TableCell className="font-medium">
                      {monastery.name}
                    </TableCell>
                    <TableCell>{monastery.district}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{monastery.monasticTradition || 'Unknown'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={monastery.isActive ? "default" : "secondary"}>
                        {monastery.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={monastery.hasVirtualTour ? "default" : "outline"}>
                        {monastery.hasVirtualTour ? "Available" : "None"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" data-testid={`actions-${monastery.id}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/monasteries/${monastery.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/monasteries/${monastery.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(monastery.id, monastery.name)}
                            className="text-destructive"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}