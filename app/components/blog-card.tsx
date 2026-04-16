import Link from "next/link";
import type { BlogEntryMeta } from "@/lib/blog";
import { formatBlogCategoryLabel, formatBlogPlatformLabel } from "@/lib/blog-ui";

type BlogCardProps = {
  entry: BlogEntryMeta;
  href?: string;
  featured?: boolean;
};

export function BlogCard({ entry, href, featured = false }: BlogCardProps) {
  const target = href ?? `/updates/${entry.slug}`;

  return (
    <Link
      href={target}
      className={`blog-card ${featured ? "blog-card-featured" : ""}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="blog-card-kickers">
        <span className="blog-chip blog-chip-primary">
          {formatBlogCategoryLabel(entry.category)}
        </span>
        <span className="blog-chip">{formatBlogPlatformLabel(entry.platform)}</span>
        {entry.evergreen ? <span className="blog-chip blog-chip-success">Evergreen</span> : null}
      </div>

      <h3 className="blog-card-title">{entry.title}</h3>
      <p className="blog-card-excerpt">{entry.excerpt}</p>

      <div className="blog-card-meta">
        <span>Published: {entry.publishedAt}</span>
        <span>Last reviewed: {entry.updatedAt}</span>
        <span>{entry.readingTimeMinutes} min read</span>
      </div>

      <div className="blog-card-tags">
        {entry.tags.map((tag) => (
          <span key={tag} className="blog-tag">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
