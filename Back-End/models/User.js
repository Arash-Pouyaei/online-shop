const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    Profile_Picture: {
        type: String,
        required: false,
    },
    Name: {
        type: String,
        required: [true, "وارد کردن نام الزامی است"],
        minlength: [2, "نام باید حداقل 2 حرف یا بیشتر باشد"],
        maxlength: [40, "نام باید حداکثر 40 حرف یا کمتر باشد"],
        trim: true
    },
    Last_Name: {
        type: String,
        required: [true, "وارد کردن نام خانوادگی الزامی است"],
        minlength: [2, "نام خانوادگی باید حداقل 2 حرف یا بیشتر باشد"],
        maxlength: [40, "نام خانوادگی باید حداکثر 40 حرف یا کمتر باشد"],
        trim: true
    },
    Phone_Number: {
        type: Number,
        required: [true, "وارد کردن تلفن همراه الزامی است"],
        unique: [true, "شماره تماس تکراری می باشد"],
        match: [/^09[0-9]{9}$/, "تلفن باید به صورت 09XXXXXXXXX وارد شود"],
        minlength: [10, "شماره تلفن همراه باید حداقل 10 رقم باشد"],
        maxlength: [11, "شماره تلفن همراه باید حداکثر 11 رقم باشد"],
        trim: true
    },
    Postal_Code: {
        type: Number,
        required: [true, "وارد کردن کد پستی الزامی است"],
        match: [/^\d{10}$/, "کد پستی باید 10 رقمی باشد"],
        trim: true,
    },
    Home_Number: {
        type: Number,
        required: [true, "وارد کردن تلفن ثابت الزامی است"],
        match: [/^0[1|3|4|5|6|7|8|9][0-9]{9}$|^02[0-9]{9}$/, "تلفن ثابت باید به صورت 0XXXXXXXXX وارد شود"],
        minlength: [10, "تلفن ثابت باید حداقل 10 رقم باشد"],
        maxlength: [11, "تلفن ثابت باید حداکثر 11 رقم باشد"],
        trim: true,
    },
    Address: {
        type: String,
        required: [true, "وارد کردن آدرس الزامی است"],
        minlength: [10, "آدرس باید حداقل 10 حرف یا بیشتر باشد"],
        maxlength: [255, "آدرس باید حداکثر 255 حرف یا بیشتر باشد"],
        trim: true,
    },
    Password: {
        type: String,
        required: [true, "وارد کردن رمزعبور الزامی است"],
        match: [/^\$argon2id\$v=\d+\$m=\d+,t=\d+,p=\d+\$[A-Za-z0-9+/=]+\$[A-Za-z0-9+/=]+$/, "پسورد به درستی هش نشده است"],
        trim: true
    },
    Cart: {
        type: [
            new mongoose.Schema({
                ProductId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: [true, "آیدی محصول الزامی است"],
                },
                Quantity: {
                    type: Number,
                    required: [true, "وارد کردن تعداد الزامی است"],
                    default: 1
                }
            })
        ],
        default: [],
    },
    Old_Carts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OldCart',
        required: [true, "آیدی سبد خرید قدیمی الزامی است"]
    }],
    Created_At:{
        type: Date,
        default: Date.now
    },
    loginAttempts: {
        type: Number,
        required: true,
        default: 0
    },
    lockUntil: {
        type: Number,
        default:0
    }
});

// Virtual for lock status
userSchema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

const User = mongoose.model("User", userSchema);

module.exports = User;
