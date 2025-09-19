import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Monasteries table
export const monasteries = pgTable("monasteries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  district: varchar("district").notNull(), // East, West, North, South Sikkim
  foundedYear: integer("founded_year").notNull(),
  history: text("history").notNull(),
  rituals: text("rituals").array().notNull().default(sql`'{}'::text[]`),
  architecture: text("architecture"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  altitude: integer("altitude"), // in meters
  mainImage: varchar("main_image"),
  imageGallery: text("image_gallery").array().default(sql`'{}'::text[]`),
  panoramicUrl: varchar("panoramic_url"), // for 360° tour
  significance: text("significance"),
  visitingHours: text("visiting_hours"),
  entryFee: decimal("entry_fee", { precision: 10, scale: 2 }).default('0'),
  accessibility: text("accessibility"),
  nearbyAttractions: text("nearby_attractions").array().default(sql`'{}'::text[]`),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Festivals table
export const festivals = pgTable("festivals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  monasteryId: varchar("monastery_id").references(() => monasteries.id).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  significance: text("significance").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  duration: varchar("duration"), // "1 day", "3 days", etc.
  festivalType: varchar("festival_type").notNull(), // "religious", "cultural", "seasonal"
  traditions: text("traditions").array().default(sql`'{}'::text[]`),
  rituals: text("rituals").array().default(sql`'{}'::text[]`),
  imageUrl: varchar("image_url"),
  isAnnual: boolean("is_annual").default(true),
  status: varchar("status").notNull().default('upcoming'), // "upcoming", "ongoing", "past"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Media table for monastery images, 360° content, etc.
export const media = pgTable("media", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  monasteryId: varchar("monastery_id").references(() => monasteries.id),
  festivalId: varchar("festival_id").references(() => festivals.id),
  type: varchar("type").notNull(), // "image", "panoramic", "video", "audio"
  url: varchar("url").notNull(),
  title: varchar("title"),
  description: text("description"),
  alt: varchar("alt"),
  category: varchar("category"), // "exterior", "interior", "ritual", "festival", "artifact"
  isMain: boolean("is_main").default(false), // featured image
  sortOrder: integer("sort_order").default(0),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type"),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Virtual tour hotspots for 360° experiences
export const tourHotspots = pgTable("tour_hotspots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  monasteryId: varchar("monastery_id").references(() => monasteries.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  type: varchar("type").notNull(), // "artifact", "ritual", "architecture", "history"
  xPosition: decimal("x_position", { precision: 5, scale: 2 }).notNull(), // percentage position
  yPosition: decimal("y_position", { precision: 5, scale: 2 }).notNull(), // percentage position
  linkedMediaId: varchar("linked_media_id").references(() => media.id),
  audioUrl: varchar("audio_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const monasteriesRelations = relations(monasteries, ({ many }) => ({
  festivals: many(festivals),
  media: many(media),
  hotspots: many(tourHotspots),
}));

export const festivalsRelations = relations(festivals, ({ one, many }) => ({
  monastery: one(monasteries, {
    fields: [festivals.monasteryId],
    references: [monasteries.id],
  }),
  media: many(media),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  monastery: one(monasteries, {
    fields: [media.monasteryId],
    references: [monasteries.id],
  }),
  festival: one(festivals, {
    fields: [media.festivalId],
    references: [festivals.id],
  }),
  uploader: one(users, {
    fields: [media.uploadedBy],
    references: [users.id],
  }),
}));

export const tourHotspotsRelations = relations(tourHotspots, ({ one }) => ({
  monastery: one(monasteries, {
    fields: [tourHotspots.monasteryId],
    references: [monasteries.id],
  }),
  linkedMedia: one(media, {
    fields: [tourHotspots.linkedMediaId],
    references: [media.id],
  }),
}));

// Zod schemas for validation
export const insertMonasterySchema = createInsertSchema(monasteries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFestivalSchema = createInsertSchema(festivals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true,
});

export const insertTourHotspotSchema = createInsertSchema(tourHotspots).omit({
  id: true,
  createdAt: true,
});

// User schemas (from Replit Auth integration)
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Export types
export type Monastery = typeof monasteries.$inferSelect;
export type InsertMonastery = z.infer<typeof insertMonasterySchema>;

export type Festival = typeof festivals.$inferSelect;
export type InsertFestival = z.infer<typeof insertFestivalSchema>;

export type Media = typeof media.$inferSelect;
export type InsertMedia = z.infer<typeof insertMediaSchema>;

export type TourHotspot = typeof tourHotspots.$inferSelect;
export type InsertTourHotspot = z.infer<typeof insertTourHotspotSchema>;
