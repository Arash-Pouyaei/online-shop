const {Router} = require("express")
const router = new Router()

const {authenticated , access_denied} = require("../middlewares/auth")

const {register , login , dashboard , logout } = require("../controllers/UsersControllers")


router.post("/register" , access_denied , register)

router.post("/login" , access_denied , login )

router.get("/logout" , authenticated , logout)

router.get("/dashboard" , authenticated , dashboard)

module.exports = router