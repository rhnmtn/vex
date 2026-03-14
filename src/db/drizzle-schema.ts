import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar
 } from 'drizzle-orm/pg-core';
 import { relations, sql } from 'drizzle-orm';
 import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
 
 // Enums
 export const userRoleEnum = pgEnum('user_role', [
  'ADMIN',
  'MANAGER',
  'USER',
  'GUEST'
 ]);

 // Companies (user'dan önce tanımlanmalı - user.companyId FK için)
 export const companies = pgTable(
  'companies',
  {
    id: serial('id').primaryKey(),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
    createdByAuthId: text('created_by_auth_id'),
    updatedByAuthId: text('updated_by_auth_id'),
    name: varchar('name', { length: 255 }).notNull(),
    shortName: varchar('short_name', { length: 50 }).notNull(),
    taxOffice: varchar('tax_office', { length: 100 }).notNull(),
    taxNumber: varchar('tax_number', { length: 20 }).notNull(),
    address: varchar('address', { length: 1000 }),
    city: varchar('city', { length: 100 }),
    district: varchar('district', { length: 100 }),
    phone: varchar('phone', { length: 20 }),
    mobile: varchar('mobile', { length: 20 }),
    email: varchar('email', { length: 255 }),
    website: varchar('website', { length: 255 }),
    logo: varchar('logo', { length: 255 }),
    logoAlt: varchar('logo_alt', { length: 255 }),
    logoLightMediaId: integer('logo_light_media_id').references(
      (): import('drizzle-orm/pg-core').AnyPgColumn => media.id,
      { onDelete: 'set null' }
    ),
    logoDarkMediaId: integer('logo_dark_media_id').references(
      (): import('drizzle-orm/pg-core').AnyPgColumn => media.id,
      { onDelete: 'set null' }
    ),
    heroImageMediaId: integer('hero_image_media_id').references(
      (): import('drizzle-orm/pg-core').AnyPgColumn => media.id,
      { onDelete: 'set null' }
    ),
    heroText: varchar('hero_text', { length: 255 }),
    heroSubtitle: varchar('hero_subtitle', { length: 500 }),
    description: varchar('description', { length: 1000 })
  },
  (table) => ({
    taxNumberDeletedAtIdx: uniqueIndex(
      'companies_tax_number_deleted_at_idx'
    ).on(table.taxNumber, table.deletedAt),
    // email: NULL olan şirketlerde unique ihlali yok (PostgreSQL NULL'ları distinct sayar)
    emailDeletedAtIdx: uniqueIndex('companies_email_deleted_at_idx').on(
      table.email,
      table.deletedAt
    ),
    createdByAuthIdIdx: index('companies_created_by_auth_id_idx').on(
      table.createdByAuthId
    ),
    updatedByAuthIdIdx: index('companies_updated_by_auth_id_idx').on(
      table.updatedByAuthId
    ),
    deletedAtNullIdx: index('companies_deleted_at_null_idx')
      .on(table.id)
      .where(sql`${table.deletedAt} IS NULL`)
  })
 );
 
 export type Company = InferSelectModel<typeof companies>;
 export type NewCompany = InferInsertModel<typeof companies>;
 
 // Better Auth - Core Schema (role app tarafında genişletildi)
 export const user = pgTable(
  'user',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('emailVerified').notNull().default(false),
    image: text('image'),
    avatarMediaId: integer('avatar_media_id').references(
      (): import('drizzle-orm/pg-core').AnyPgColumn => media.id,
      { onDelete: 'set null' }
    ),
    role: userRoleEnum('role').default('USER'),
    title: text('title'),
    phone: varchar('phone', { length: 20 }),
    isActive: boolean('isActive').notNull().default(true),
    companyId: integer('company_id').references(() => companies.id, {
      onDelete: 'set null'
    }),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow()
  },
  (table) => ({
    companyIdIdx: index('user_company_id_idx').on(table.companyId)
  })
 );
 
 export type User = InferSelectModel<typeof user>;
 export type NewUser = InferInsertModel<typeof user>;
 
 export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expiresAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow()
 });
 
 export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  idToken: text('idToken'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow()
 });
 
 export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow()
 });
 
 // Customers
 export const customers = pgTable(
  'customers',
  {
    id: serial('id').primaryKey(),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
    createdByAuthId: text('created_by_auth_id')
      .notNull()
      .references(() => user.id),
    updatedByAuthId: text('updated_by_auth_id')
      .notNull()
      .references(() => user.id),
    companyId: integer('company_id')
      .notNull()
      .references(() => companies.id),
    name: varchar('name', { length: 255 }).notNull(),
    contactName: varchar('contact_name', { length: 255 }),
    mobile: varchar('mobile', { length: 20 }),
    email: varchar('email', { length: 255 }),
    city: varchar('city', { length: 100 }),
    district: varchar('district', { length: 100 }),
    address: varchar('address', { length: 1000 }),
    taxOffice: varchar('tax_office', { length: 100 }),
    taxNumber: varchar('tax_number', { length: 20 }),
    description: varchar('description', { length: 1000 })
  },
  (table) => ({
    emailCompanyDeletedAtIdx: uniqueIndex(
      'customers_email_company_deleted_at_idx'
    ).on(table.email, table.companyId, table.deletedAt),
    mobileCompanyDeletedAtIdx: uniqueIndex(
      'customers_mobile_company_deleted_at_idx'
    ).on(table.mobile, table.companyId, table.deletedAt),
    taxNumberCompanyDeletedAtIdx: uniqueIndex(
      'customers_tax_number_company_deleted_at_idx'
    ).on(table.taxNumber, table.companyId, table.deletedAt),
    createdByAuthIdIdx: index('customers_created_by_auth_id_idx').on(
      table.createdByAuthId
    ),
    updatedByAuthIdIdx: index('customers_updated_by_auth_id_idx').on(
      table.updatedByAuthId
    ),
    companyIdIdx: index('customers_company_id_idx').on(table.companyId),
    companyIdDeletedAtNullIdx: index(
      'customers_company_id_deleted_at_null_idx'
    )
      .on(table.companyId)
      .where(sql`${table.deletedAt} IS NULL`)
  })
 );
 
 export type Customer = InferSelectModel<typeof customers>;
 export type NewCustomer = InferInsertModel<typeof customers>;
 
 // Media: Görsel/dosya metadata (şirket kapsamlı, Cloudinary)
 export const media = pgTable(
  'media',
  {
    id: serial('id').primaryKey(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
    createdByAuthId: text('created_by_auth_id').references(() => user.id),
    companyId: integer('company_id')
      .notNull()
      .references(() => companies.id),
    publicId: varchar('public_id', { length: 255 }),
    path: text('path').notNull(),
    filename: varchar('filename', { length: 255 }).notNull(),
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    size: integer('size').notNull(),
    alt: varchar('alt', { length: 255 }),
    width: integer('width'),
    height: integer('height')
  },
  (table) => ({
    companyIdIdx: index('media_company_id_idx').on(table.companyId),
    createdByAuthIdIdx: index('media_created_by_auth_id_idx').on(
      table.createdByAuthId
    ),
    publicIdCompanyIdx: uniqueIndex('media_public_id_company_idx')
      .on(table.publicId, table.companyId)
      .where(sql`${table.publicId} IS NOT NULL`)
  })
 );
 
 export type Media = InferSelectModel<typeof media>;
 export type NewMedia = InferInsertModel<typeof media>;
 
 // Blog: Kategoriler (şirket kapsamlı)
 // content: kategori sayfası zengin içeriği | meta: SEO alanları
 export const postCategories = pgTable(
  'post_categories',
  {
    id: serial('id').primaryKey(),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
    createdByAuthId: text('created_by_auth_id').references(() => user.id),
    updatedByAuthId: text('updated_by_auth_id').references(() => user.id),
    companyId: integer('company_id')
      .notNull()
      .references(() => companies.id),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    bannerImageId: integer('banner_image_id').references(() => media.id),
    content: text('content'),
    metaTitle: varchar('meta_title', { length: 255 }),
    metaDescription: varchar('meta_description', { length: 500 })
  },
  (table) => ({
    companyIdIdx: index('post_categories_company_id_idx').on(table.companyId),
    slugCompanyDeletedAtIdx: uniqueIndex(
      'post_categories_slug_company_deleted_at_idx'
    ).on(table.slug, table.companyId, table.deletedAt),
    createdByAuthIdIdx: index('post_categories_created_by_auth_id_idx').on(
      table.createdByAuthId
    ),
    companyIdDeletedAtNullIdx: index(
      'post_categories_company_id_deleted_at_null_idx'
    )
      .on(table.companyId)
      .where(sql`${table.deletedAt} IS NULL`)
  })
 );
 
 export type PostCategory = InferSelectModel<typeof postCategories>;
 export type NewPostCategory = InferInsertModel<typeof postCategories>;
 
 // Blog: Yazılar (şirket kapsamlı, kategoriler ayrı tabloda)
 // excerpt: liste özeti | content: ana içerik | meta: SEO alanları
 export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
    deletedAt: timestamp('deleted_at', { mode: 'date' }),
    createdByAuthId: text('created_by_auth_id')
      .notNull()
      .references(() => user.id),
    updatedByAuthId: text('updated_by_auth_id')
      .notNull()
      .references(() => user.id),
    companyId: integer('company_id')
      .notNull()
      .references(() => companies.id),
    title: varchar('title', { length: 500 }).notNull(),
    slug: varchar('slug', { length: 500 }).notNull(),
    excerpt: text('excerpt'),
    featuredImageId: integer('featured_image_id').references(() => media.id),
    content: text('content'),
    metaTitle: varchar('meta_title', { length: 255 }),
    metaDescription: varchar('meta_description', { length: 500 }),
    publishedAt: timestamp('published_at', { mode: 'date' }),
    isSticky: boolean('is_sticky').default(false)
  },
  (table) => ({
    companyIdIdx: index('posts_company_id_idx').on(table.companyId),
    companyIdPublishedAtIdx: index('posts_company_id_published_at_idx').on(
      table.companyId,
      table.publishedAt
    ),
    slugCompanyDeletedAtIdx: uniqueIndex(
      'posts_slug_company_deleted_at_idx'
    ).on(table.slug, table.companyId, table.deletedAt),
    createdByAuthIdIdx: index('posts_created_by_auth_id_idx').on(
      table.createdByAuthId
    ),
    companyIdDeletedAtNullIdx: index(
      'posts_company_id_deleted_at_null_idx'
    )
      .on(table.companyId)
      .where(sql`${table.deletedAt} IS NULL`)
  })
 );
 
 export type Post = InferSelectModel<typeof posts>;
 export type NewPost = InferInsertModel<typeof posts>;
 
 // Blog: Yazı-Kategori ilişkisi (many-to-many)
 export const postCategoryAssignments = pgTable(
  'post_category_assignments',
  {
    postId: integer('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    categoryId: integer('category_id')
      .notNull()
      .references(() => postCategories.id, { onDelete: 'cascade' })
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.categoryId] })
  })
 );
 
 export type PostCategoryAssignment = InferSelectModel<
  typeof postCategoryAssignments
 >;
 export type NewPostCategoryAssignment = InferInsertModel<
  typeof postCategoryAssignments
 >;

 // Header menü öğeleri
 export const companyHeaderMenuItems = pgTable(
  'company_header_menu_items',
  {
    id: serial('id').primaryKey(),
    companyId: integer('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    label: varchar('label', { length: 100 }).notNull(),
    href: varchar('href', { length: 500 }).notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
    deletedAt: timestamp('deleted_at', { mode: 'date' })
  },
  (table) => ({
    companyIdIdx: index(
      'company_header_menu_items_company_id_idx'
    ).on(table.companyId),
    deletedAtNullIdx: index(
      'company_header_menu_items_deleted_at_null_idx'
    )
      .on(table.id)
      .where(sql`${table.deletedAt} IS NULL`)
  })
 );

 export type CompanyHeaderMenuItem = InferSelectModel<
  typeof companyHeaderMenuItems
 >;
 export type NewCompanyHeaderMenuItem = InferInsertModel<
  typeof companyHeaderMenuItems
 >;

 // Footer menü öğeleri
 export const companyFooterMenuItems = pgTable(
  'company_footer_menu_items',
  {
    id: serial('id').primaryKey(),
    companyId: integer('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    label: varchar('label', { length: 100 }).notNull(),
    href: varchar('href', { length: 500 }).notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
    deletedAt: timestamp('deleted_at', { mode: 'date' })
  },
  (table) => ({
    companyIdIdx: index(
      'company_footer_menu_items_company_id_idx'
    ).on(table.companyId),
    deletedAtNullIdx: index(
      'company_footer_menu_items_deleted_at_null_idx'
    )
      .on(table.id)
      .where(sql`${table.deletedAt} IS NULL`)
  })
 );

 export type CompanyFooterMenuItem = InferSelectModel<
  typeof companyFooterMenuItems
 >;
 export type NewCompanyFooterMenuItem = InferInsertModel<
  typeof companyFooterMenuItems
 >;
 
 // Relations
 export const companiesRelations = relations(companies, ({ one, many }) => ({
  users: many(user),
  customers: many(customers),
  media: many(media),
  logoLightMedia: one(media, {
    fields: [companies.logoLightMediaId],
    references: [media.id],
    relationName: 'companyLogoLight'
  }),
  logoDarkMedia: one(media, {
    fields: [companies.logoDarkMediaId],
    references: [media.id],
    relationName: 'companyLogoDark'
  }),
  heroImageMedia: one(media, {
    fields: [companies.heroImageMediaId],
    references: [media.id],
    relationName: 'companyHeroImage'
  }),
  postCategories: many(postCategories),
  posts: many(posts),
  headerMenuItems: many(companyHeaderMenuItems),
  footerMenuItems: many(companyFooterMenuItems),
  createdBy: one(user, {
    fields: [companies.createdByAuthId],
    references: [user.id],
    relationName: 'companyCreatedBy'
  }),
  updatedBy: one(user, {
    fields: [companies.updatedByAuthId],
    references: [user.id],
    relationName: 'companyUpdatedBy'
  })
 }));
 
export const userRelations = relations(user, ({ one, many }) => ({
  company: one(companies),
  avatarMedia: one(media, {
    fields: [user.avatarMediaId],
    references: [media.id],
    relationName: 'userAvatar'
  }),
  sessions: many(session),
  accounts: many(account),
  customers: many(customers),
  media: many(media),
  postCategories: many(postCategories),
  posts: many(posts)
}));
 
 export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user)
 }));
 
 export const accountRelations = relations(account, ({ one }) => ({
  user: one(user)
 }));
 
 export const customersRelations = relations(customers, ({ one }) => ({
  company: one(companies),
  createdBy: one(user, {
    fields: [customers.createdByAuthId],
    references: [user.id],
    relationName: 'customerCreatedBy'
  }),
  updatedBy: one(user, {
    fields: [customers.updatedByAuthId],
    references: [user.id],
    relationName: 'customerUpdatedBy'
  })
 }));
 
 export const mediaRelations = relations(media, ({ one }) => ({
  company: one(companies),
  createdBy: one(user)
 }));
 
 export const postCategoriesRelations = relations(
  postCategories,
  ({ one, many }) => ({
    company: one(companies),
    bannerImage: one(media),
    createdBy: one(user, {
      fields: [postCategories.createdByAuthId],
      references: [user.id],
      relationName: 'postCategoryCreatedBy'
    }),
    updatedBy: one(user, {
      fields: [postCategories.updatedByAuthId],
      references: [user.id],
      relationName: 'postCategoryUpdatedBy'
    }),
    postCategoryAssignments: many(postCategoryAssignments)
  })
 );
 
 export const postsRelations = relations(posts, ({ one, many }) => ({
  company: one(companies),
  featuredImage: one(media),
  createdBy: one(user, {
    fields: [posts.createdByAuthId],
    references: [user.id],
    relationName: 'postCreatedBy'
  }),
  updatedBy: one(user, {
    fields: [posts.updatedByAuthId],
    references: [user.id],
    relationName: 'postUpdatedBy'
  }),
  postCategoryAssignments: many(postCategoryAssignments)
 }));
 
 export const postCategoryAssignmentsRelations = relations(
  postCategoryAssignments,
  ({ one }) => ({
    post: one(posts),
    category: one(postCategories)
  })
 );

 export const companyHeaderMenuItemsRelations = relations(
  companyHeaderMenuItems,
  ({ one }) => ({
    company: one(companies)
  })
 );

 export const companyFooterMenuItemsRelations = relations(
  companyFooterMenuItems,
  ({ one }) => ({
    company: one(companies)
  })
 );
 
 