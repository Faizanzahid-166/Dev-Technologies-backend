import Comment from '../../models/blog/Comment.model.js';
import Blog from '../../models/blog/Blog.models.js';

// @desc  Get comments for a blog
// @route GET /api/comments/:blogId
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      blog: req.params.blogId,
      approved: true,
      parent: null,
    })
      .sort('-createdAt')
      .limit(50);

    res.json({ success: true, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Add comment
// @route POST /api/comments/:blogId
export const addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    const comment = await Comment.create({
      blog: req.params.blogId,

      author: {
        name: req.body.name,
        email: req.body.email,
        avatar: req.body.avatar || '',
      },

      content: req.body.content,
      parent: req.body.parent || null,
    });

    res.status(201).json({
      success: true,
      data: comment,
      message: 'Comment added successfully',
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc  Delete comment (admin)
// @route DELETE /api/comments/:id
export const deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};