const Yup = require("yup")
const argon2 = require('argon2');
const passport = require("passport")

const User = require("../models/User")
const  RegisterSchema  = require("../models/secure/CreateUserYupValidation")

exports.register = async(req,res)=>{
    try {
        const {
            Profile_Picture,
            Name,
            Last_Name,
            Phone_Number,
            Postal_Code,
            Home_Number,
            Address,
            Password
        } = req.body
        await RegisterSchema.validate({ 
            Profile_Picture,
            Name,
            Last_Name,
            Phone_Number,
            Postal_Code,
            Home_Number,
            Address,
            Password,
            Cart:[],
            Old_Carts:[]}, { abortEarly: false });
        const newUser = new User({
            Profile_Picture,
            Name,
            Last_Name,
            Phone_Number,
            Postal_Code,
            Home_Number,
            Address,
            Password:await argon2.hash(Password).catch((err)=>{throw err}),
            Cart: typeof Cart === 'undefined'? [] : Cart ,
            Old_Carts: typeof Old_Carts === 'undefined'? [] : Old_Carts
        });
        await newUser.save().then((user)=>{
            console.log(user);
            return res.status(201).send("user created");
        }).catch((err)=>{
            if (err) throw err 
        });
    } catch (error) {
        if (error instanceof Yup.ValidationError) {
            const errors = error.inner.reduce((acc, curr) => {
                acc[curr.path] = curr.errors;
                return acc;
            }, {});
            return res.status(400).json({ error: 'Validation failed', details: errors });
        } else {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

exports.login = (req, res, next) => {
    console.log(req.body);
    if (!req.body["g-recaptcha-response"]) {
        return res.status(400).json({error: "Validation failed", details: { captcha: ["تیک من ربات نیستم را بزنید"] }})
    }
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).json(info);
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            if (req.body.remember) {
                req.session.cookie.originalMaxAge = 7 * 24 * 60 * 60 * 1000; // 1 week
                req.session.cookie.expire = 7 * 24 * 60 * 60 * 1000;
            } else {
                req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000;
                req.session.cookie.expire = 24 * 60 * 60 * 1000;
            }
            return res.status(200).json({ message: 'user logged in successfully', user });
        });
    })(req, res, next);
};


exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed', error: err });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Session destruction failed', error: err });
            }
            res.clearCookie('connect.sid'); // Adjust the cookie name if different
            res.status(200).json({ message: 'user logged out successful' });
        });
    });
};

exports.dashboard = async(req,res)=>{
    console.log(req.user);
    return res.status(200).json("this is dashboard")
}