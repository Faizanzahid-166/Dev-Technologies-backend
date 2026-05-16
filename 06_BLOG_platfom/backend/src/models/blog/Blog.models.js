// src/models/blog/Blog.models.js
import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    coverImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    images: [
      {
        url: { type: String },
        publicId: { type: String },
        caption: { type: String },
      },
    ],
    video: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
      title: { type: String, default: '' },
    },
    pdf: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
      title: { type: String, default: '' },
      size: { type: Number, default: 0 },
    },
    author: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, required: true },
      avatar: { type: String, default: '' },
      bio: { type: String, default: '' },
    },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
    readTime: { type: Number, default: 1 }, // minutes
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      metaKeywords: [{ type: String }],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for likes count
blogSchema.virtual('likesCount').get(function () { 
  return this.likes ? this.likes.length : 0;
});

// Virtual for comments count
blogSchema.virtual('commentsCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'blog',
  count: true,
});

// Pre-save: generate slug, readTime, excerpt
blogSchema.pre('save', async function () {
  if (this.isModified('title')) {
    this.slug =
      slugify(this.title, { lower: true, strict: true }) +
      '-' +
      Date.now().toString().slice(-6);
  }

  if (this.isModified('content')) {
    // Calculate read time (avg 200 words/min)
    const words = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(words / 200));

    // Auto-generate excerpt if not provided
    if (!this.excerpt) {
      const plainText = this.content.replace(/<[^>]*>/g, '');
      this.excerpt = plainText.substring(0, 200) + '...';
    }
  }

  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
    this.status = 'published';
  }
});

// Indexes
blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ published: 1, createdAt: -1 });
blogSchema.index({ featured: 1 });
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });

export default mongoose.model('Blog', blogSchema);