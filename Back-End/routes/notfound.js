const {Router} = require("express")
const router = new Router()

router.use("*",(req,res)=>{
    return res.status(404).json("notfound")
})

module.exports = router