const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Book = require('../models/book');
const uploadPath = path.join('public', Book.coverImageBasePath);
const Author = require('../models/author');

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
});
// All Books Route
router.get('/', async (req, res) => {
    let query = Book.find();
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore );   // lte : less than or equal to
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter );   // lte : greater than or equal to
    }
    try {
        // const books = await Book.find({});
        const books = await query.exec();
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        });
    } catch (error) {
        res.redirect('/');
    }
});

// New Book Route
router.get('/new', async(req, res) => {
    
    renderNewPage(res, new Book());

    // try {
    //     const authors = await Author.find({});
    //     const book = new Book();
    //     res.render('books/new', {
    //         authors: authors,
    //         book: book
    //     });
    // } catch (error) {
    //     res.redirect('/books');
    // }
});

// Create Book Route
router.post('/', upload.single('cover'), async (req, res) => {
    console.log(req.file);
    console.log(req.file.filename);

    const fileName = req.file != null ? req.file.filename : null ;
    const book = new Book ({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description,
    });

    try{
        console.log(book);
        let newBook = await book.save();
        // let newBook = book.save();
        console.log("newBook newBook newBook");
        console.log(newBook);

        // res.redirect(`books/${newBook.id}`)
        res.redirect(`books`);
    } catch (error) {
        if (book.coverImageName != null) {
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true);
    }
});

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) params.errorMessage = 'Error Creating Book FATAL ERROR';
       
        res.render('books/new', params);

    } catch (error) {
        res.redirect('books');
    }
}

function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) {
            console.error(err);
        }
    });
}

module.exports = router;