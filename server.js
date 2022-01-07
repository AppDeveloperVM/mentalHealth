const dev = process.env.NODE_ENV !== 'production';
const next = require('next');
const app = next({ dev });
const handle = app.getRequestHandler();
const express = require('express');
const { parse } = require('url');
const { createServer } = require('http');

app.prepare().then(() => {
    const server = express(); // server
    const bcrypt = require('bcrypt');
    const passport = require('passport');
    const flash = require('express-flash')
    const session = require('express-session');
    const methodOverride = require('method-override');

    const initializePassport = require('./passport-config')
    initializePassport(
        passport, 
        email =>  users.find(user => user.email === email),
        id => users.find(user => user.id === id)
    )

    const users = [
        {
            id: Date.now().toString(),
            name: 'user',
            email: 'user@example.com',
            password: '$2b$10$vlZWCNqKHQm/f3HFLoilC.QyluW9WqAHaU3CVC6ZwCQLYDJIlmnnC'//123456
        }
    ];

    // Middleware
    server.use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 60000 }
    }));

    //Passport
    server.set('view-engine','html')
    server.use(passport.initialize())
    server.use(passport.session())
    server.use(methodOverride('_method'))
    server.use(express.static(__dirname + '/public'))
    server.use(express.urlencoded({ extended: false }))
    server.use(flash())

    // Server-side
    server.get('/', checkAuthenticated, (req, res) => {
        const parsedUrl = parse(req.url, true);
        const { pathname, query } = parsedUrl;

        res.locals.user = req.user.name;
        return app.render(req, res,'/', { user: req.user.name } );
    })

    server.get('/login', checkNotAuthenticated, (req, res) => {
        return app.render(req, res, '/login', req.query);
    });

    server.post('/login', checkNotAuthenticated, passport.authenticate('local', { 
        successRedirect : '/',
        failureRedirect : '/login',
        failureFlash: true
    }))
    
    server.get('/register', checkNotAuthenticated, (req, res) => {
        return app.render(req, res, '/register', req.query);
    })

    server.post('/register', checkNotAuthenticated, async (req, res) => {
        const { name, email, password } = req.body
        let errors = [];
    
        try {
    
            //check required fields
            if(!name || !email || !password) {
                errors.push({ msg: 'Please fill in all fields'})
                //res.redirect('/register' , { errors })
            }
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            users.push({
                id: Date.now().toString(),
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })
            res.redirect('/login')
        } catch {
            res.render('/register' , { errors })
        }
        console.log(users)
    
    })

    server.delete('/logout', (req, res) => {
        req.logOut()
        res.redirect('/login')
    })

    server.get('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('Server ready on http://localhost:3000');
    });
});


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return  res.redirect('/')
    }
    next()
}