const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');

// All Authors Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name !== null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i');   // 'i': means case insensitive
    }
    try{
        const authors = await Author.find(searchOptions);
        res.render('authors/index', { 
            authors: authors, 
            searchOptions:req.query 
        });
    }catch{
        res.redirect('/');
    }
});

// New Author Route 000
router.get('/new', (req, res) => {
    res.render('authors/new', {author: new Author()});
});

// CREATE Author Route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    });
    try {
        const newAuthor = await author.save();
        res.redirect(`authors/${newAuthor.id}`)
        // res.redirect(`authors`);
    } catch (error) {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
});

// SHOW
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const books = await Book.find({author: author.id }).limit(6).exec();
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        });
    } catch (error) {
        // console.log(error);
        res.redirect('/');
    }
    // res.send(`Show Author ` + req.params.id);
});

// EDIT
router.get('/:id/edit', async (req, res) => {
    // res.send(`Edit Author ` + req.params.id);
    try {
        const author = await Author.findById(req.params.id);
        res.render('authors/edit', {author: author});
    } catch (error) {
        res.redirect('/authors');
    }    
});

// UPDATE
router.put('/:id', async (req, res) => {
    // res.send(`Update Author ` + req.params.id);
    let author;
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        res.redirect(`/authors/${author.id}`);          // /authors : means this is from the root  ;...;  authors: means this url is relative
    } catch (error) {
        if (author == null) {
            res.redirect('/');
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error Updating Author'
            })
        }
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    // res.send('Delete Author ' + req.params.id);

    let author;
    try {
        author = await Author.findById(req.params.id);
        await author.remove();
        res.redirect(`/authors`);          // /authors : means this is from the root  ;...;  authors: means this url is relative
    } catch (error) {
        if (author == null) {
            res.redirect('/');
        } else {
            res.redirect(`/authors/${author.id}`);
        }
    }
});

module.exports = router;