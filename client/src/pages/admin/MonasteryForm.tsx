import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { insertMonasterySchema, type InsertMonastery } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Save } from "lucide-react";

interface MonasteryFormProps {
  monasteryId?: string;
}

const districts = [
  "East Sikkim",
  "West Sikkim", 
  "North Sikkim",
  "South Sikkim",
];

const traditions = [
  "Nyingma",
  "Kagyu",
  "Gelug",
  "Sakya",
  "Bon",
];

export default function MonasteryForm({ monasteryId }: MonasteryFormProps) {
  const [, navigate] = useLocation();
  const isEdit = !!monasteryId;

  // Fetch existing monastery data for editing
  const { data: monastery, isLoading } = useQuery({
    queryKey: ["/api/monasteries", monasteryId],
    enabled: isEdit,
  });

  const form = useForm<InsertMonastery>({
    resolver: zodResolver(insertMonasterySchema),
    defaultValues: {
      name: "",
      description: "",
      district: "",
      location: "",
      altitude: 0,
      foundedYear: new Date().getFullYear(),
      monasticTradition: "",
      headLama: "",
      significance: "",
      architecturalStyle: "",
      mainDeities: [],
      festivals: [],
      contactInfo: "",
      visitingHours: "",
      entryFee: "",
      nearbyAttractions: [],
      latitude: 0,
      longitude: 0,
      imageUrl: "",
      thumbnailUrl: "",
      virtualTourUrl: "",
      hasVirtualTour: false,
      isActive: true,
    },
    values: monastery ? {
      name: monastery.name,
      description: monastery.description,
      district: monastery.district,
      location: monastery.location,
      altitude: monastery.altitude,
      foundedYear: monastery.foundedYear,
      monasticTradition: monastery.monasticTradition,
      headLama: monastery.headLama || "",
      significance: monastery.significance || "",
      architecturalStyle: monastery.architecturalStyle || "",
      mainDeities: monastery.mainDeities || [],
      festivals: monastery.festivals || [],
      contactInfo: monastery.contactInfo || "",
      visitingHours: monastery.visitingHours || "",
      entryFee: monastery.entryFee || "",
      nearbyAttractions: monastery.nearbyAttractions || [],
      latitude: monastery.latitude,
      longitude: monastery.longitude,
      imageUrl: monastery.imageUrl || "",
      thumbnailUrl: monastery.thumbnailUrl || "",
      virtualTourUrl: monastery.virtualTourUrl || "",
      hasVirtualTour: monastery.hasVirtualTour,
      isActive: monastery.isActive,
    } : undefined,
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertMonastery) => apiRequest("/api/monasteries", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/monasteries"] });
      navigate("/admin/monasteries");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertMonastery) => apiRequest(`/api/monasteries/${monasteryId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/monasteries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/monasteries", monasteryId] });
      navigate("/admin/monasteries");
    },
  });

  const onSubmit = (data: InsertMonastery) => {
    // Convert string arrays to proper arrays
    const processedData = {
      ...data,
      mainDeities: typeof data.mainDeities === 'string' 
        ? data.mainDeities.split(',').map(s => s.trim()).filter(Boolean)
        : data.mainDeities,
      festivals: typeof data.festivals === 'string'
        ? data.festivals.split(',').map(s => s.trim()).filter(Boolean) 
        : data.festivals,
      nearbyAttractions: typeof data.nearbyAttractions === 'string'
        ? data.nearbyAttractions.split(',').map(s => s.trim()).filter(Boolean)
        : data.nearbyAttractions,
    };

    if (isEdit) {
      updateMutation.mutate(processedData);
    } else {
      createMutation.mutate(processedData);
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div>Loading monastery data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin/monasteries")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <div>
          <h1 className="font-serif text-3xl font-bold">
            {isEdit ? "Edit Monastery" : "Add New Monastery"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? "Update monastery information" : "Create a new monastery profile"}
          </p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monastery Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter monastery name" {...field} data-testid="input-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter monastery description"
                          className="min-h-[100px]"
                          {...field}
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-district">
                              <SelectValue placeholder="Select district" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {districts.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="monasticTradition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tradition *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-tradition">
                              <SelectValue placeholder="Select tradition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {traditions.map((tradition) => (
                              <SelectItem key={tradition} value={tradition}>
                                {tradition}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle>Location & Geography</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Description *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Near Gangtok, Sikkim" {...field} data-testid="input-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="altitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Altitude (m)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="2000"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            data-testid="input-altitude"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="any"
                            placeholder="27.3389"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            data-testid="input-latitude"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="any"
                            placeholder="88.6065"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            data-testid="input-longitude"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Historical & Cultural Information */}
          <Card>
            <CardHeader>
              <CardTitle>Historical & Cultural Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="foundedYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Founded Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="1705"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        data-testid="input-founded-year"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="headLama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Head Lama</FormLabel>
                    <FormControl>
                      <Input placeholder="Name of the head lama" {...field} data-testid="input-head-lama" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="significance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Historical Significance</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Historical and cultural significance"
                        {...field}
                        data-testid="input-significance"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="architecturalStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Architectural Style</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Description of architectural features"
                        {...field}
                        data-testid="input-architecture"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Media & Settings */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Media & Virtual Tour</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} data-testid="input-image-url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thumbnailUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/thumb.jpg" {...field} data-testid="input-thumbnail-url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="virtualTourUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Virtual Tour URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/tour.html" {...field} data-testid="input-virtual-tour-url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasVirtualTour"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Virtual Tour Available</FormLabel>
                        <FormDescription>
                          Enable if monastery has 360° virtual tour
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-virtual-tour"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status & Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Show this monastery on the public site
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-active"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visitingHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visiting Hours</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 6:00 AM - 6:00 PM"
                          {...field}
                          data-testid="input-visiting-hours"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="entryFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entry Fee</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Free / ₹50 per person"
                          {...field}
                          data-testid="input-entry-fee"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Information</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Phone, email, or other contact details"
                          {...field}
                          data-testid="input-contact"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/monasteries")}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-save"
            >
              <Save className="h-4 w-4 mr-2" />
              {createMutation.isPending || updateMutation.isPending 
                ? (isEdit ? "Updating..." : "Creating...")
                : (isEdit ? "Update Monastery" : "Create Monastery")
              }
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}