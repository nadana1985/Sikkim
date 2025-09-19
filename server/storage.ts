import {
  users,
  monasteries,
  festivals,
  media,
  tourHotspots,
  type User,
  type UpsertUser,
  type Monastery,
  type InsertMonastery,
  type Festival,
  type InsertFestival,
  type Media,
  type InsertMedia,
  type TourHotspot,
  type InsertTourHotspot,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql, ilike, or } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT - mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Monastery operations
  getMonasteries(filters?: {
    district?: string;
    hasVirtualTour?: boolean;
    isActive?: boolean;
    search?: string;
  }): Promise<Monastery[]>;
  getMonastery(id: string): Promise<Monastery | undefined>;
  createMonastery(monastery: InsertMonastery): Promise<Monastery>;
  updateMonastery(id: string, monastery: Partial<InsertMonastery>): Promise<Monastery>;
  deleteMonastery(id: string): Promise<void>;
  
  // Festival operations
  getFestivals(filters?: {
    monasteryId?: string;
    status?: string;
    upcoming?: boolean;
  }): Promise<Festival[]>;
  getFestival(id: string): Promise<Festival | undefined>;
  createFestival(festival: InsertFestival): Promise<Festival>;
  updateFestival(id: string, festival: Partial<InsertFestival>): Promise<Festival>;
  deleteFestival(id: string): Promise<void>;
  
  // Media operations
  getMedia(filters?: {
    monasteryId?: string;
    festivalId?: string;
    type?: string;
    category?: string;
  }): Promise<Media[]>;
  getMediaItem(id: string): Promise<Media | undefined>;
  createMedia(media: InsertMedia): Promise<Media>;
  updateMedia(id: string, media: Partial<InsertMedia>): Promise<Media>;
  deleteMedia(id: string): Promise<void>;
  
  // Tour hotspot operations
  getTourHotspots(monasteryId: string): Promise<TourHotspot[]>;
  createTourHotspot(hotspot: InsertTourHotspot): Promise<TourHotspot>;
  updateTourHotspot(id: string, hotspot: Partial<InsertTourHotspot>): Promise<TourHotspot>;
  deleteTourHotspot(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT - mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Monastery operations
  async getMonasteries(filters?: {
    district?: string;
    hasVirtualTour?: boolean;
    isActive?: boolean;
    search?: string;
  }): Promise<Monastery[]> {
    let query = db.select().from(monasteries);
    
    const conditions = [];
    
    if (filters?.district) {
      conditions.push(eq(monasteries.district, filters.district));
    }
    
    if (filters?.hasVirtualTour !== undefined) {
      if (filters.hasVirtualTour) {
        conditions.push(sql`${monasteries.panoramicUrl} IS NOT NULL`);
      } else {
        conditions.push(sql`${monasteries.panoramicUrl} IS NULL`);
      }
    }
    
    if (filters?.isActive !== undefined) {
      conditions.push(eq(monasteries.isActive, filters.isActive));
    }
    
    if (filters?.search) {
      conditions.push(
        or(
          ilike(monasteries.name, `%${filters.search}%`),
          ilike(monasteries.location, `%${filters.search}%`),
          ilike(monasteries.history, `%${filters.search}%`)
        )
      );
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(asc(monasteries.name));
  }

  async getMonastery(id: string): Promise<Monastery | undefined> {
    const [monastery] = await db.select().from(monasteries).where(eq(monasteries.id, id));
    return monastery;
  }

  async createMonastery(monastery: InsertMonastery): Promise<Monastery> {
    const [created] = await db
      .insert(monasteries)
      .values(monastery)
      .returning();
    return created;
  }

  async updateMonastery(id: string, monastery: Partial<InsertMonastery>): Promise<Monastery> {
    const [updated] = await db
      .update(monasteries)
      .set({ ...monastery, updatedAt: new Date() })
      .where(eq(monasteries.id, id))
      .returning();
    return updated;
  }

  async deleteMonastery(id: string): Promise<void> {
    await db.delete(monasteries).where(eq(monasteries.id, id));
  }

  // Festival operations
  async getFestivals(filters?: {
    monasteryId?: string;
    status?: string;
    upcoming?: boolean;
  }): Promise<Festival[]> {
    let query = db.select().from(festivals);
    
    const conditions = [];
    
    if (filters?.monasteryId) {
      conditions.push(eq(festivals.monasteryId, filters.monasteryId));
    }
    
    if (filters?.status) {
      conditions.push(eq(festivals.status, filters.status));
    }
    
    if (filters?.upcoming) {
      conditions.push(sql`${festivals.startDate} > NOW()`);
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(asc(festivals.startDate));
  }

  async getFestival(id: string): Promise<Festival | undefined> {
    const [festival] = await db.select().from(festivals).where(eq(festivals.id, id));
    return festival;
  }

  async createFestival(festival: InsertFestival): Promise<Festival> {
    const [created] = await db
      .insert(festivals)
      .values(festival)
      .returning();
    return created;
  }

  async updateFestival(id: string, festival: Partial<InsertFestival>): Promise<Festival> {
    const [updated] = await db
      .update(festivals)
      .set({ ...festival, updatedAt: new Date() })
      .where(eq(festivals.id, id))
      .returning();
    return updated;
  }

  async deleteFestival(id: string): Promise<void> {
    await db.delete(festivals).where(eq(festivals.id, id));
  }

  // Media operations
  async getMedia(filters?: {
    monasteryId?: string;
    festivalId?: string;
    type?: string;
    category?: string;
  }): Promise<Media[]> {
    let query = db.select().from(media);
    
    const conditions = [];
    
    if (filters?.monasteryId) {
      conditions.push(eq(media.monasteryId, filters.monasteryId));
    }
    
    if (filters?.festivalId) {
      conditions.push(eq(media.festivalId, filters.festivalId));
    }
    
    if (filters?.type) {
      conditions.push(eq(media.type, filters.type));
    }
    
    if (filters?.category) {
      conditions.push(eq(media.category, filters.category));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(media.isMain), asc(media.sortOrder));
  }

  async getMediaItem(id: string): Promise<Media | undefined> {
    const [mediaItem] = await db.select().from(media).where(eq(media.id, id));
    return mediaItem;
  }

  async createMedia(mediaData: InsertMedia): Promise<Media> {
    const [created] = await db
      .insert(media)
      .values(mediaData)
      .returning();
    return created;
  }

  async updateMedia(id: string, mediaData: Partial<InsertMedia>): Promise<Media> {
    const [updated] = await db
      .update(media)
      .set(mediaData)
      .where(eq(media.id, id))
      .returning();
    return updated;
  }

  async deleteMedia(id: string): Promise<void> {
    await db.delete(media).where(eq(media.id, id));
  }

  // Tour hotspot operations
  async getTourHotspots(monasteryId: string): Promise<TourHotspot[]> {
    return await db
      .select()
      .from(tourHotspots)
      .where(and(eq(tourHotspots.monasteryId, monasteryId), eq(tourHotspots.isActive, true)))
      .orderBy(asc(tourHotspots.xPosition));
  }

  async createTourHotspot(hotspot: InsertTourHotspot): Promise<TourHotspot> {
    const [created] = await db
      .insert(tourHotspots)
      .values(hotspot)
      .returning();
    return created;
  }

  async updateTourHotspot(id: string, hotspot: Partial<InsertTourHotspot>): Promise<TourHotspot> {
    const [updated] = await db
      .update(tourHotspots)
      .set(hotspot)
      .where(eq(tourHotspots.id, id))
      .returning();
    return updated;
  }

  async deleteTourHotspot(id: string): Promise<void> {
    await db.delete(tourHotspots).where(eq(tourHotspots.id, id));
  }
}

export const storage = new DatabaseStorage();
