'use server';

import { db } from '@/db';
import {
  companies,
  media,
  postCategories,
  postCategoryAssignments,
  posts
} from '@/db/drizzle-schema';
import { and, asc, desc, eq, inArray, lte, sql } from 'drizzle-orm';

export type PublicPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: Date | null;
  featuredImagePath: string | null;
};

export type PublicCategoryWithPosts = {
  id: number;
  name: string;
  slug: string;
  bannerImagePath: string | null;
  posts: PublicPost[];
};

/** Yayınlanmış blog yazılarını kategorilere göre döner. Auth gerekmez. */
export async function getPublicBlogData(): Promise<{
  categories: PublicCategoryWithPosts[];
  totalPosts: number;
}> {
  const [firstCompany] = await db
    .select({ id: companies.id })
    .from(companies)
    .where(sql`${companies.deletedAt} IS NULL`)
    .limit(1);

  if (!firstCompany) {
    return { categories: [], totalPosts: 0 };
  }

  const companyId = firstCompany.id;
  const now = new Date();

  const activeCategories = await db
    .select({
      id: postCategories.id,
      name: postCategories.name,
      slug: postCategories.slug,
      bannerImagePath: media.path
    })
    .from(postCategories)
    .leftJoin(media, eq(postCategories.bannerImageId, media.id))
    .where(
      and(
        eq(postCategories.companyId, companyId),
        eq(postCategories.isActive, true),
        sql`${postCategories.deletedAt} IS NULL`
      )
    )
    .orderBy(asc(postCategories.name));

  const publishedPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      publishedAt: posts.publishedAt,
      featuredImagePath: media.path
    })
    .from(posts)
    .leftJoin(media, eq(posts.featuredImageId, media.id))
    .where(
      and(
        eq(posts.companyId, companyId),
        eq(posts.isActive, true),
        lte(posts.publishedAt, now),
        sql`${posts.deletedAt} IS NULL`
      )
    )
    .orderBy(desc(posts.isSticky), desc(posts.publishedAt));

  const postCategoryMap = new Map<number, number[]>();
  if (publishedPosts.length > 0) {
    const postIds = publishedPosts.map((p) => p.id);
    const assignments = await db
      .select({
        postId: postCategoryAssignments.postId,
        categoryId: postCategoryAssignments.categoryId
      })
      .from(postCategoryAssignments)
      .where(inArray(postCategoryAssignments.postId, postIds));

    for (const a of assignments) {
      if (!postCategoryMap.has(a.postId)) {
        postCategoryMap.set(a.postId, []);
      }
      postCategoryMap.get(a.postId)!.push(a.categoryId);
    }
  }

  const postMap = new Map(
    publishedPosts.map((p) => [
      p.id,
      {
        ...p,
        excerpt: p.excerpt ?? null,
        publishedAt: p.publishedAt ?? null,
        featuredImagePath: p.featuredImagePath ?? null
      }
    ])
  );

  const categories: PublicCategoryWithPosts[] = activeCategories.map((cat) => {
    const catPosts = publishedPosts.filter((p) =>
      (postCategoryMap.get(p.id) ?? []).includes(cat.id)
    );
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      bannerImagePath: cat.bannerImagePath ?? null,
      posts: catPosts.map((p) => postMap.get(p.id)!)
    };
  });

  const uncategorized = publishedPosts.filter(
    (p) => !(postCategoryMap.get(p.id) ?? []).length
  );
  if (uncategorized.length > 0) {
    categories.push({
      id: -1,
      name: 'Genel',
      slug: 'genel',
      bannerImagePath: null,
      posts: uncategorized.map((p) => postMap.get(p.id)!)
    });
  }

  return {
    categories: categories.filter((c) => c.posts.length > 0),
    totalPosts: publishedPosts.length
  };
}

/** Slug ile tek bir yayınlanmış blog yazısı döner. Auth gerekmez. */
export async function getPublicPostBySlug(slug: string) {
  const [firstCompany] = await db
    .select({ id: companies.id })
    .from(companies)
    .where(sql`${companies.deletedAt} IS NULL`)
    .limit(1);

  if (!firstCompany) return null;

  const now = new Date();
  const [row] = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      content: posts.content,
      publishedAt: posts.publishedAt,
      featuredImagePath: media.path
    })
    .from(posts)
    .leftJoin(media, eq(posts.featuredImageId, media.id))
    .where(
      and(
        eq(posts.companyId, firstCompany.id),
        eq(posts.slug, slug),
        eq(posts.isActive, true),
        lte(posts.publishedAt, now),
        sql`${posts.deletedAt} IS NULL`
      )
    )
    .limit(1);

  return row
    ? {
        ...row,
        excerpt: row.excerpt ?? null,
        content: row.content ?? null,
        publishedAt: row.publishedAt ?? null,
        featuredImagePath: row.featuredImagePath ?? null
      }
    : null;
}
