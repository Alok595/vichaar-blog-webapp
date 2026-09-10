import { Router } from 'express';
import {
  getPosts,
  getMyPosts,
  getSavedPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getCategories,
  toggleLike,
  toggleSave
} from '../controllers/postController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { optionalAuthenticateToken } from '../middleware/optionalAuthMiddleware.js';

const router = Router();

router.get('/', getPosts);
router.get('/my-posts', authenticateToken, getMyPosts);
router.get('/saved', authenticateToken, getSavedPosts);
router.get('/categories', getCategories);
router.get('/:id', optionalAuthenticateToken, getPostById);
router.post('/', authenticateToken, createPost);
router.put('/:id', authenticateToken, updatePost);
router.delete('/:id', authenticateToken, deletePost);

router.post('/:id/like', authenticateToken, toggleLike);
router.post('/:id/save', authenticateToken, toggleSave);

export default router;
