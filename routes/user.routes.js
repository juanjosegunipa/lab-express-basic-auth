const Express = require('express');
const router = Express.Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const { isAuthenticated, isNotAuthenticated } = require('../middlewares/auth.middlewares')

router.get('/signup', isNotAuthenticated, (req, res, next) => {
    res.render('signup.hbs')
})

router.post('/signup', (req, res, next) => {
    console.log(req.body);
    const myUsername = req.body.username;
    const myPassword = req.body.password;
    const encryptedPassword = bcryptjs.hashSync(myPassword)

    User.create({
        username: myUsername,
        password: encryptedPassword
    })
        .then(savedUser => {
            console.log(savedUser);
            res.send(savedUser)
        })
        .catch(err => {
            console.log(err);
            res.send(err);
        })
});

router.get('/login', isNotAuthenticated, (req, res, next) => {
    res.render('login.hbs')
})

router.post('/login', (req, res, render) => {
    const myUsername = req.body.username
    const myPassword = req.body.password

    User.findOne({
        username: myUsername
    })
        .then(foundUser => {
            console.log(foundUser);
            if (!foundUser) {
                res.send('Username does not exist');
                return;
            }

            const validPassword = bcryptjs.compareSync(myPassword, foundUser.password)

            if (!validPassword) {
                res.send('incorrect password');
                return;
            }

            req.session.user = foundUser;

            res.redirect('/profile');

            res.render('profile.hbs', { username: foundUser.username })
        })
        .catch(err => {
            console.log(err);
            res.send(err);
        })
});

router.get('/profile', (req, res, next) => {
    if (req.session.user) {
        res.render('profile.hbs', { username: req.session.user.username })
    } else {
        res.render('profile.hbs', { username: 'Anonymous' })
    }
    res.render('profile.hbs')
})

router.get('/main', isAuthenticated, (req, res, next) => {
    res.render('main.hbs')
})

router.get('/private', isAuthenticated, (req, res, next) => {
    res.render('private.hbs')
})


module.exports = router;