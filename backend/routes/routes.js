const express = require('express');
const { authenticatedToken, authenticatedAdmin, upload } = require('../middelware/middelware');
const { getBooks, getBookDetail, signup, addComment, login, getBookComment, getCategories, getUsers, getAllBooks, refresh, logout, updateBook, getUser, updateRole, updateFavorite, getFavoritesBooks, resetNotification, uploadBook, deleteBook, health } = require('../controllers/controllers');
const router = express.Router();
router.post('/books/upload', authenticatedToken, authenticatedAdmin,
    upload.fields([
        { name: 'cover', maxCount: 1 },
        { name: 'bookFile', maxCount: 1 }
    ]), uploadBook);
router.post('/signup', signup); // SIGNUP
router.post('/login', login); // LOGIN
router.get('/', getBooks); // GET ALL BOOKS

router.get('/books', getAllBooks); // GET ALL BOOKS

router.get('/user/favorites', authenticatedToken, getFavoritesBooks) // GET FAVORITE BOOKS
router.get('/books/:id', getBookDetail); // GET BOOK INFO
router.post('/books/:bookId/comments', authenticatedToken, addComment); // ADD COMMENT
router.get('/books/:bookId/comments', getBookComment); // GET COMMENTS FOR A BOOK
router.delete('/books/:id', authenticatedToken, authenticatedAdmin, deleteBook);
router.get('/categories', getCategories); // GET ALL CATEGORIES
router.get('/users', authenticatedToken, authenticatedAdmin, getUsers); // GET ALL USERS
router.post('/refresh', refresh); // REFRESH TOKEN
router.post('/logout', logout); // LOGOUT
router.put('/books/:id', authenticatedToken, authenticatedAdmin, updateBook); // UPDATE BOOK
router.get('/user/:id', authenticatedToken, getUser) // GET USER
router.put('/admin/:id', authenticatedToken, authenticatedAdmin, updateRole) // UPDATE ROLE
router.post('/books/:id/favorite', authenticatedToken, updateFavorite) // UPDATE FAVORITE
router.post('/notification/reset', authenticatedToken, resetNotification) // RESET NOTIFICATION
router.get('/health',health); // CHECK SERVER HEALTH
module.exports = router;