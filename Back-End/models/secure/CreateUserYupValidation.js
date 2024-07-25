const Yup = require("yup");
const mongoose = require("mongoose");
const User = require("../User");

// Function to validate MongoDB ObjectID
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const RegisterSchema = Yup.object().shape({
    Profile_Picture: Yup.string(),
    Name: Yup.string()
        .required("وارد کردن نام الزامی است")
        .min(2, "نام باید حداقل 2 حرف یا بیشتر باشد")
        .max(40, "نام باید حداکثر 40 حرف یا کمتر باشد")
        .trim(),
    Last_Name: Yup.string()
        .required("وارد کردن نام خانوادگی الزامی است")
        .min(2, "نام خانوادگی باید حداقل 2 حرف یا بیشتر باشد")
        .max(40, "نام خانوادگی باید حداکثر 40 حرف یا کمتر باشد")
        .trim(),
    Phone_Number: Yup.string()
        .required("وارد کردن تلفن همراه الزامی است")
        .matches(/^09[0-9]{9}$/, "تلفن باید به صورت 09XXXXXXXXX وارد شود")
        .min(10, "شماره تلفن همراه باید حداقل 10 رقم باشد")
        .max(11, "شماره تلفن همراه باید حداکثر 11 رقم باشد")
        .test('unique', 'شماره تلفن همراه قبلا ثبت شده است', async (value) => {
            const count = await User.countDocuments({ Phone_Number: value });
            return count === 0;
        })
        .trim(),
    Postal_Code: Yup.string()
        .required("وارد کردن کد پستی الزامی است")
        .matches(/^\d{10}$/, "کد پستی باید 10 رقمی باشد")
        .trim(),
    Home_Number: Yup.string()
        .required("وارد کردن تلفن ثابت الزامی است")
        .matches(/^0[1-9][0-9]{9}$|^02[0-9]{9}$/, "تلفن ثابت باید به صورت 0XXXXXXXXX وارد شود")
        .min(10, "تلفن ثابت باید حداقل 10 رقم باشد")
        .max(11, "تلفن ثابت باید حداکثر 11 رقم باشد")
        .trim(),
    Address: Yup.string()
        .required("وارد کردن آدرس الزامی است")
        .min(10, "آدرس باید حداقل 10 حرف یا بیشتر باشد")
        .max(255, "آدرس باید حداکثر 255 حرف یا بیشتر باشد")
        .trim(),
    Password: Yup.string()
        .required("وارد کردن رمزعبور الزامی است")
        .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد")
        .max(20, "رمز عبور باید حداکثر 20 کاراکتر باشد")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, "رمز عبور باید حداقل شامل 1 حرف و 1 عدد باشد")
        .trim(),
    Cart: Yup.array()
        .of(
            Yup.object().shape({
                ProductId: Yup.string().required("آیدی محصول الزامی است"),
                Quantity: Yup.number()
                    .required("وارد کردن تعداد الزامی است")
                    .min(1, "تعداد باید حداقل 1 عدد باشد")
                    .positive("تعداد باید یک عدد مثبت باشد")
                    .round('ceil')
                    .default(1),
            })
        ).default([]),
    Old_Carts: Yup.array()
        .of(
            Yup.string()
                .required("آیدی سبد خرید قدیمی الزامی است")
                .test('is-valid-objectid', 'آیدی سبد خرید قدیمی معتبر نمی‌باشد', value => isValidObjectId(value))
        ).default([]),
});

module.exports = RegisterSchema;
