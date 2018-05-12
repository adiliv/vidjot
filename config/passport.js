const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//load User model
// require('./models/User');
const User = mongoose.model('users');

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        //match user
        User.findOne({
            email: email
        }).then(user => {
            if(!user){
                return done(null, false, {message: 'no user found'});  //1. error = null, 2. user = not found so: false
            }
            //match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'password incorrect'});
                }
            })
        })
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}