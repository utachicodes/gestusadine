import { Router, Request, Response } from 'express';
import { logger } from '../../../../shared/logger.js';

const router = Router();

// In-memory storage for demo (replace with actual database)
const books: unknown[] = [];

/**
 * GET /api/library
 * Get all digital books
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, language, format, search } = req.query;

    let filtered = [...books];

    // Filter by category
    if (category && category !== 'all') {
      filtered = filtered.filter(book => book.category === category);
    }

    // Filter by language
    if (language && language !== 'all') {
      filtered = filtered.filter(book => book.language === language);
    }

    // Filter by format
    if (format && format !== 'all') {
      filtered = filtered.filter(book => book.format === format);
    }

    // Search in title, author, description
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.description.toLowerCase().includes(searchLower)
      );
    }

    logger.info(`Retrieved ${filtered.length} books`);
    res.json({ success: true, books: filtered, count: filtered.length });
  } catch (error) {
    logger.error('Failed to retrieve books', { error });
    res.status(500).json({ success: false, error: 'Failed to retrieve books' });
  }
});

/**
 * GET /api/library/:id
 * Get a specific book by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = books.find(b => b.id === id);

    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }

    res.json({ success: true, book });
  } catch (error) {
    logger.error('Failed to retrieve book', { error });
    res.status(500).json({ success: false, error: 'Failed to retrieve book' });
  }
});

/**
 * POST /api/library
 * Create a new book
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const bookData = req.body;

    // Validate required fields
    if (!bookData.title || !bookData.author || !bookData.category || !bookData.language || !bookData.format || !bookData.file_url) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, author, category, language, format, file_url'
      });
    }

    const newBook = {
      id: `book-${Date.now()}`,
      ...bookData,
      downloads: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    books.push(newBook);
    logger.info(`Created new book: ${newBook.title}`);

    res.status(201).json({ success: true, book: newBook });
  } catch (error) {
    logger.error('Failed to create book', { error });
    res.status(500).json({ success: false, error: 'Failed to create book' });
  }
});

/**
 * PUT /api/library/:id
 * Update an existing book
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const bookIndex = books.findIndex(b => b.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }

    books[bookIndex] = {
      ...books[bookIndex],
      ...updates,
      id, // Preserve original ID
      updated_at: new Date().toISOString(),
    };

    logger.info(`Updated book: ${books[bookIndex].title}`);
    res.json({ success: true, book: books[bookIndex] });
  } catch (error) {
    logger.error('Failed to update book', { error });
    res.status(500).json({ success: false, error: 'Failed to update book' });
  }
});

/**
 * DELETE /api/library/:id
 * Delete a book
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bookIndex = books.findIndex(b => b.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }

    const deletedBook = books[bookIndex];
    books.splice(bookIndex, 1);

    logger.info(`Deleted book: ${deletedBook.title}`);
    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    logger.error('Failed to delete book', { error });
    res.status(500).json({ success: false, error: 'Failed to delete book' });
  }
});

/**
 * POST /api/library/:id/download
 * Track book download
 */
router.post('/:id/download', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bookIndex = books.findIndex(b => b.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }

    books[bookIndex].downloads = (books[bookIndex].downloads || 0) + 1;

    logger.info(`Download tracked for book: ${books[bookIndex].title}`);
    res.json({ success: true, downloads: books[bookIndex].downloads });
  } catch (error) {
    logger.error('Failed to track download', { error });
    res.status(500).json({ success: false, error: 'Failed to track download' });
  }
});

/**
 * PATCH /api/library/:id/featured
 * Toggle featured status
 */
router.patch('/:id/featured', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    const bookIndex = books.findIndex(b => b.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }

    books[bookIndex].featured = featured;
    books[bookIndex].updated_at = new Date().toISOString();

    logger.info(`Toggled featured status for book: ${books[bookIndex].title} to ${featured}`);
    res.json({ success: true, book: books[bookIndex] });
  } catch (error) {
    logger.error('Failed to toggle featured status', { error });
    res.status(500).json({ success: false, error: 'Failed to toggle featured status' });
  }
});

export default router;

