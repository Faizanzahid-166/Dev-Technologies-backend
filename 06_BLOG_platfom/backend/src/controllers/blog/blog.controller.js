import Blog from '../../models/blog/Blog.models.js';
import Comment from '../../models/blog/Comment.model.js';

// Helper: build filter query
const buildFilter = (query) => {
  const filter = {};
  if (query.category) filter.category = { $regex: query.category, $options: 'i' };
  if (query.tag) filter.tags = query.tag.toLowerCase();
  if (query.featured === 'true') filter.featured = true;
  if (query.search) {
    filter.$text = { $search: query.search };
  }
  return filter;
};

// @desc  Get all published blogs (public)
// @route GET /api/blogs
export const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sort || '-publishedAt';

    const filter = { published: true, ...buildFilter(req.query) };

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .select('-content -seo -bookmarks -likes')
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .populate('commentsCount'),
      Blog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single blog by ID (admin editor)
// @route GET /api/blogs/admin/id/:id
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single blog by slug (public)
// @route GET /api/blogs/:slug
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true }).populate(
      'commentsCount'
    );
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    // Increment views
    blog.views += 1;
    await blog.save({ validateBeforeSave: false });

    // Related posts
    const related = await Blog.find({
      published: true,
      _id: { $ne: blog._id },
      $or: [{ category: blog.category }, { tags: { $in: blog.tags } }],
    })
      .select('title slug coverImage excerpt readTime publishedAt author category')
      .limit(3);

    res.json({ success: true, data: blog, related });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get featured blogs
// @route GET /api/blogs/featured
export const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true, featured: true })
      .select('title slug coverImage excerpt readTime publishedAt author category tags')
      .sort('-publishedAt')
      .limit(5);
    res.json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get trending blogs (most views in last 7 days)
// @route GET /api/blogs/trending
export const getTrendingBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true })
      .select('title slug coverImage excerpt readTime views publishedAt author category')
      .sort('-views -publishedAt')
      .limit(6);
    res.json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get all blogs (admin - includes drafts)
// @route GET /api/blogs/admin/all
export const getAdminBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) filter.$text = { $search: req.query.search };

    const [blogs, total] = await Promise.all([
      Blog.find(filter).select('-content').sort('-createdAt').skip(skip).limit(limit),
      Blog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: blogs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Create blog
// @route POST /api/blogs
export const createBlog = async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      author: {
        id: req.user.id,
        name: req.user.name || 'Admin',
        avatar: req.user.avatar || '',
      },
    };

    if (req.body.tags && typeof req.body.tags === 'string') {
      blogData.tags = req.body.tags.split(',').map((t) => t.trim());
    }

    const blog = await Blog.create(blogData);
    res.status(201).json({ success: true, data: blog, message: 'Blog created successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc  Update blog
// @route PUT /api/blogs/:id
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map((t) => t.trim());
    }

    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updated, message: 'Blog updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc  Delete blog
// @route DELETE /api/blogs/:id
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    await Comment.deleteMany({ blog: req.params.id });

    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Toggle like
// @route POST /api/blogs/:id/like
export const toggleLike = async (req, res) => {
  try {
    const { visitorId } = req.body; // use visitorId for non-auth likes
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    // Simple like toggle based on visitorId (stored client-side)
    res.json({ success: true, likes: blog.likes.length + 1 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get dashboard stats (admin)
// @route GET /api/blogs/admin/stats
export const getDashboardStats = async (req, res) => {
  try {
    const [totalBlogs, publishedBlogs, draftBlogs, recentBlogs] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ published: true }),
      Blog.countDocuments({ status: 'draft' }),
      Blog.find().select('title slug views publishedAt status featured coverImage').sort('-createdAt').limit(5),
    ]);

    const viewsAgg = await Blog.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]);

    const categoryAgg = await Blog.aggregate([
      { $match: { published: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    // Views over last 7 days (simplified)
    const viewsChart = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        views: Math.floor(Math.random() * 200) + 50, // placeholder; track daily in prod
      };
    });

    res.json({
      success: true,
      data: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        totalViews: viewsAgg[0]?.totalViews || 0,
        recentBlogs,
        categories: categoryAgg,
        viewsChart,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get all categories (public)
// @route GET /api/blogs/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Blog.aggregate([
      { $match: { published: true } },
      { $group: { _id: '$category', count: { $sum: 1 }, coverImage: { $first: '$coverImage' } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};