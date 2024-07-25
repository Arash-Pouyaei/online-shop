const passport = require("passport");
const { Strategy } = require("passport-local");
const argon2 = require("argon2");
const User = require("../models/User");

// Define constants for login attempt limits and lock time
const MAX_LOGIN_ATTEMPTS = 5; // Max number of login attempts before lockout
const LOCK_TIME = 2 * 60 * 60 * 1000; // Lock time in milliseconds (2 hours)

passport.use(new Strategy({ usernameField: "Phone_Number", passwordField: 'Password' }, async (Phone_Number, Password, done) => {
    try {
        // Find the user by phone number
        const user = await User.findOne({ Phone_Number });

        // If no user is found, return error
        if (!user) {
            return done(null, false, { "error": "Validation failed", "details": { "Phone_Number": ["نام کاربری یا کلمه عبور اشتباه است"] } });
        }

        // Check if the account is locked
        if (user.lockUntil && user.lockUntil > Date.now()) {
            return done(null, false, { "error": "Account locked", "details": { "Phone_Number": ["حساب کاربری شما به دلیل تلاش‌های ناموفق زیاد قفل شده است. لطفا بعدا تلاش کنید."] } });
        }

        // Verify password
        const isMatch = await argon2.verify(user.Password, Password);

        if (isMatch) {
            // Reset login attempts and lockUntil on successful login
            user.loginAttempts = 0;
            user.lockUntil = 0;
            await user.save();
            return done( null , {
                                    Name: user.Name,
                                    Last_Name: user.Last_Name,
                                    Profile_Picture: user.Profile_Picture,
                                    Phone_Number: user.Phone_Number,
                                    Postal_Code: user.Postal_Code,
                                    Home_Number: user.Home_Number,
                                    Address: user.Address,
                                    Cart: user.Cart,
                                    Old_Carts: user.Old_Carts,
                                }); // req.user
        } else {
            // Increment login attempts and handle lockout
            user.loginAttempts += 1;

            if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                user.lockUntil = Date.now() + LOCK_TIME;
                await user.save();
                return done(null, false, { "error": "Account locked", "details": { "Phone_Number": ["حساب کاربری شما به دلیل تلاش‌های ناموفق زیاد قفل شده است. لطفا بعدا تلاش کنید."] } });
            }

            await user.save();
            return done(null, false, { "error": "Validation failed", "details": { "Password": ["نام کاربری یا کلمه عبور اشتباه است"] } });
        }
    } catch (error) {
        // Handle any errors that occurred during the process
        console.log(error);
        return done(error);
    }
}));

passport.serializeUser((user,done)=>{
    done(null,{
        Name: user.Name,
        Last_Name: user.Last_Name,
    })
})

passport.deserializeUser(async (Phone_Number, done) => {
    try {
        const user = await User.findOne(Phone_Number);
        done(null, {
                        Name: user.Name,
                        Last_Name: user.Last_Name,
                    }
            );
    } catch (err) {
        done(err);
    }
});
