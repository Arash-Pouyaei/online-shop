const {Router} = require('express')
const router = new Router()

router.post("/login",(req,res)=>{
    try {
        //validation ok
        return res.status(202).json(" is admin ")
    } catch (error) {
        //validation not ok
        console.log(error);
        return res.status(203).redirect("/")
    }
})

router.get("/panel",(req,res)=>{
    try {
        //validation ok
        return res.status(200).json(" site information ")
    } catch (error) {
        //validation not ok
        console.log(error);
        return res.status(404).redirect("/admin/login")
    }
})

module.exports = router