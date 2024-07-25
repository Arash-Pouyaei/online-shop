const {Router} = require('express')
const router = new Router()

router.get("/",(req,res)=>{
    return res.status(200).json({pagetitle:"hello"})
})

module.exports = router