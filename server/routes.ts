import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import {
  insertMonasterySchema,
  insertFestivalSchema,
  insertMediaSchema,
  insertTourHotspotSchema,
} from "@shared/schema";

// Middleware to check admin access
function requireAdmin(req: any, res: any, next: any) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Monastery routes
  app.get("/api/monasteries", async (req, res) => {
    try {
      const filters = {
        district: req.query.district as string,
        hasVirtualTour: req.query.hasVirtualTour === "true",
        isActive: req.query.isActive !== "false",
        search: req.query.search as string,
      };

      // Clean up undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters] === undefined) {
          delete filters[key as keyof typeof filters];
        }
      });

      const monasteries = await storage.getMonasteries(filters);
      res.json(monasteries);
    } catch (error) {
      console.error("Error fetching monasteries:", error);
      res.status(500).json({ error: "Failed to fetch monasteries" });
    }
  });

  app.get("/api/monasteries/:id", async (req, res) => {
    try {
      const monastery = await storage.getMonastery(req.params.id);
      if (!monastery) {
        return res.status(404).json({ error: "Monastery not found" });
      }
      res.json(monastery);
    } catch (error) {
      console.error("Error fetching monastery:", error);
      res.status(500).json({ error: "Failed to fetch monastery" });
    }
  });

  app.post("/api/monasteries", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertMonasterySchema.parse(req.body);
      const monastery = await storage.createMonastery(validatedData);
      res.status(201).json(monastery);
    } catch (error) {
      console.error("Error creating monastery:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(400).json({ error: "Failed to create monastery" });
    }
  });

  app.put("/api/monasteries/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertMonasterySchema.partial().parse(req.body);
      const monastery = await storage.updateMonastery(req.params.id, validatedData);
      res.json(monastery);
    } catch (error) {
      console.error("Error updating monastery:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(400).json({ error: "Failed to update monastery" });
    }
  });

  app.delete("/api/monasteries/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteMonastery(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting monastery:", error);
      res.status(500).json({ error: "Failed to delete monastery" });
    }
  });

  // Festival routes
  app.get("/api/festivals", async (req, res) => {
    try {
      const filters = {
        monasteryId: req.query.monasteryId as string,
        status: req.query.status as string,
        upcoming: req.query.upcoming === "true",
      };

      // Clean up undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters] === undefined) {
          delete filters[key as keyof typeof filters];
        }
      });

      const festivals = await storage.getFestivals(filters);
      res.json(festivals);
    } catch (error) {
      console.error("Error fetching festivals:", error);
      res.status(500).json({ error: "Failed to fetch festivals" });
    }
  });

  app.get("/api/festivals/:id", async (req, res) => {
    try {
      const festival = await storage.getFestival(req.params.id);
      if (!festival) {
        return res.status(404).json({ error: "Festival not found" });
      }
      res.json(festival);
    } catch (error) {
      console.error("Error fetching festival:", error);
      res.status(500).json({ error: "Failed to fetch festival" });
    }
  });

  app.post("/api/festivals", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertFestivalSchema.parse(req.body);
      const festival = await storage.createFestival(validatedData);
      res.status(201).json(festival);
    } catch (error) {
      console.error("Error creating festival:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(400).json({ error: "Failed to create festival" });
    }
  });

  app.put("/api/festivals/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertFestivalSchema.partial().parse(req.body);
      const festival = await storage.updateFestival(req.params.id, validatedData);
      res.json(festival);
    } catch (error) {
      console.error("Error updating festival:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(400).json({ error: "Failed to update festival" });
    }
  });

  app.delete("/api/festivals/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteFestival(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting festival:", error);
      res.status(500).json({ error: "Failed to delete festival" });
    }
  });

  // Media routes
  app.get("/api/media", async (req, res) => {
    try {
      const filters = {
        monasteryId: req.query.monasteryId as string,
        festivalId: req.query.festivalId as string,
        type: req.query.type as string,
        category: req.query.category as string,
      };

      // Clean up undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters] === undefined) {
          delete filters[key as keyof typeof filters];
        }
      });

      const media = await storage.getMedia(filters);
      res.json(media);
    } catch (error) {
      console.error("Error fetching media:", error);
      res.status(500).json({ error: "Failed to fetch media" });
    }
  });

  app.get("/api/media/:id", async (req, res) => {
    try {
      const media = await storage.getMediaItem(req.params.id);
      if (!media) {
        return res.status(404).json({ error: "Media not found" });
      }
      res.json(media);
    } catch (error) {
      console.error("Error fetching media:", error);
      res.status(500).json({ error: "Failed to fetch media" });
    }
  });

  app.post("/api/media", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertMediaSchema.parse(req.body);
      const media = await storage.createMedia(validatedData);
      res.status(201).json(media);
    } catch (error) {
      console.error("Error creating media:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(400).json({ error: "Failed to create media" });
    }
  });

  app.put("/api/media/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertMediaSchema.partial().parse(req.body);
      const media = await storage.updateMedia(req.params.id, validatedData);
      res.json(media);
    } catch (error) {
      console.error("Error updating media:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(400).json({ error: "Failed to update media" });
    }
  });

  app.delete("/api/media/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteMedia(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting media:", error);
      res.status(500).json({ error: "Failed to delete media" });
    }
  });

  // Tour hotspot routes
  app.get("/api/monasteries/:monasteryId/hotspots", async (req, res) => {
    try {
      const hotspots = await storage.getTourHotspots(req.params.monasteryId);
      res.json(hotspots);
    } catch (error) {
      console.error("Error fetching tour hotspots:", error);
      res.status(500).json({ error: "Failed to fetch tour hotspots" });
    }
  });

  app.post("/api/hotspots", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertTourHotspotSchema.parse(req.body);
      const hotspot = await storage.createTourHotspot(validatedData);
      res.status(201).json(hotspot);
    } catch (error) {
      console.error("Error creating tour hotspot:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(400).json({ error: "Failed to create tour hotspot" });
    }
  });

  app.put("/api/hotspots/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertTourHotspotSchema.partial().parse(req.body);
      const hotspot = await storage.updateTourHotspot(req.params.id, validatedData);
      res.json(hotspot);
    } catch (error) {
      console.error("Error updating tour hotspot:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(400).json({ error: "Failed to update tour hotspot" });
    }
  });

  app.delete("/api/hotspots/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteTourHotspot(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting tour hotspot:", error);
      res.status(500).json({ error: "Failed to delete tour hotspot" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
