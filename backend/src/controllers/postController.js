import prisma from '../config/prisma.js';

export const getPosts = async (req, res) => {
  try {
    const { category, subcategory, search, featured, authorId, page = 1, limit = 20 } = req.query;

    const where = { published: true };

    if (category && category !== 'All' && category !== 'Latest') {
      where.category = { equals: category };
    }

    if (subcategory) {
      where.subcategory = { equals: subcategory };
    }

    if (authorId) {
      where.authorId = parseInt(authorId, 10);
    }

    if (featured !== undefined) {
      where.featured = featured === 'true';
    }

    if (search && search.trim() !== '') {
      where.OR = [
        { title: { contains: search.trim() } },
        { subtitle: { contains: search.trim() } },
        { content: { contains: search.trim() } },
      ];
    }

    const take = parseInt(limit, 10) || 20;
    const skip = ((parseInt(page, 10) || 1) - 1) * take;

    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              role: true,
              bio: true,
            },
          },
          _count: {
            select: {
              likedBy: true,
              savedBy: true,
            },
          },
        },
      }),
    ]);

    return res.json({
      success: true,
      total,
      page: parseInt(page, 10) || 1,
      totalPages: Math.ceil(total / take),
      posts,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve posts.',
      error: error.message,
    });
  }
};

// GET /api/posts/my-posts - Author-isolated posts query
export const getMyPosts = async (req, res) => {
  try {
    const authorId = req.user.id;

    const posts = await prisma.post.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            bio: true,
          },
        },
        _count: {
          select: {
            likedBy: true,
            savedBy: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error('Error fetching author posts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve your dispatches.',
      error: error.message,
    });
  }
};

export const getSavedPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const posts = await prisma.post.findMany({
      where: {
        savedBy: {
          some: {
            id: userId,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            bio: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error('Error fetching saved posts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve your saved dispatches.',
      error: error.message,
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
      return res.status(400).json({ success: false, message: 'Invalid post ID.' });
    }

    const userId = req.user?.id; // Optional auth middleware may provide this

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            bio: true,
          },
        },
        _count: {
          select: {
            likedBy: true,
            savedBy: true,
          },
        },
        ...(userId && {
          likedBy: {
            where: { id: userId },
            select: { id: true },
          },
          savedBy: {
            where: { id: userId },
            select: { id: true },
          },
        }),
      },
    });

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    const hasLiked = userId ? post.likedBy.length > 0 : false;
    const hasSaved = userId ? post.savedBy.length > 0 : false;

    // Clean up payload so we don't send raw relations
    const formattedPost = {
      ...post,
      likesCount: post._count.likedBy,
      savesCount: post._count.savedBy,
      hasLiked,
      hasSaved,
    };
    delete formattedPost.likedBy;
    delete formattedPost.savedBy;
    delete formattedPost._count;

    return res.json({ success: true, post: formattedPost });
  } catch (error) {
    console.error('Error fetching post:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve post.',
      error: error.message,
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      category,
      subcategory,
      subcategoryDesc,
      bureau,
      issueNo,
      folioPage,
      content,
      summaryPoints,
      sections,
      imageUrl,
      caption,
      readTime,
      wordCount,
      featured,
      published,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required.',
      });
    }

    const authorUser = req.user;
    if (!authorUser) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to author an article.',
      });
    }

    const newPost = await prisma.post.create({
      data: {
        title: title.trim(),
        subtitle: subtitle ? subtitle.trim() : null,
        category: category || 'Engineering',
        subcategory: subcategory ? subcategory.trim() : null,
        subcategoryDesc: subcategoryDesc ? subcategoryDesc.trim() : null,
        bureau: bureau || `${authorUser.department || 'Systems'} Bureau`,
        issueNo: issueNo || `Dispatch No. 0${Math.floor(Math.random() * 90 + 10)}`,
        folioPage: folioPage || 'Page A1 • Broadsheet Edition',
        content,
        summaryPoints: summaryPoints || null,
        sections: sections || null,
        authorId: authorUser.id,
        authorName: authorUser.name,
        authorRole: authorUser.role,
        authorAvatar: authorUser.avatar,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
        caption: caption || null,
        readTime: readTime || '5 min read',
        wordCount: wordCount || `${content.split(/\s+/).length} words`,
        featured: Boolean(featured),
        published: published !== undefined ? Boolean(published) : true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Post syndicated successfully.',
      post: newPost,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create post.',
      error: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
      return res.status(400).json({ success: false, message: 'Invalid post ID.' });
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    // Ownership Authorization Check
    if (existingPost.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You are only permitted to edit your own dispatches.',
      });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...req.body,
        id: undefined, // prevent id overwrite
        authorId: undefined, // preserve original author
      },
    });

    return res.json({
      success: true,
      message: 'Post updated successfully.',
      post: updatedPost,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update post.',
      error: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
      return res.status(400).json({ success: false, message: 'Invalid post ID.' });
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    // Ownership Authorization Check
    if (existingPost.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You are only permitted to delete your own dispatches.',
      });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return res.json({
      success: true,
      message: 'Post deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete post.',
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.post.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
      where: { published: true },
    });

    return res.json({
      success: true,
      categories: categories.map((c) => ({
        name: c.category,
        count: c._count.category,
      })),
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories.',
      error: error.message,
    });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const postId = parseInt(id, 10);
    if (isNaN(postId)) return res.status(400).json({ success: false, message: 'Invalid ID' });

    const userId = req.user.id;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { likedBy: { where: { id: userId } } },
    });

    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const hasLiked = post.likedBy.length > 0;

    if (hasLiked) {
      await prisma.post.update({
        where: { id: postId },
        data: { likedBy: { disconnect: { id: userId } } },
      });
      return res.json({ success: true, liked: false });
    } else {
      await prisma.post.update({
        where: { id: postId },
        data: { likedBy: { connect: { id: userId } } },
      });
      return res.json({ success: true, liked: true });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return res.status(500).json({ success: false, message: 'Failed to toggle like' });
  }
};

export const toggleSave = async (req, res) => {
  try {
    const { id } = req.params;
    const postId = parseInt(id, 10);
    if (isNaN(postId)) return res.status(400).json({ success: false, message: 'Invalid ID' });

    const userId = req.user.id;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { savedBy: { where: { id: userId } } },
    });

    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const hasSaved = post.savedBy.length > 0;

    if (hasSaved) {
      await prisma.post.update({
        where: { id: postId },
        data: { savedBy: { disconnect: { id: userId } } },
      });
      return res.json({ success: true, saved: false });
    } else {
      await prisma.post.update({
        where: { id: postId },
        data: { savedBy: { connect: { id: userId } } },
      });
      return res.json({ success: true, saved: true });
    }
  } catch (error) {
    console.error('Error toggling save:', error);
    return res.status(500).json({ success: false, message: 'Failed to toggle save' });
  }
};
