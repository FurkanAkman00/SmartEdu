const express = require('express')
const router = express.Router()
const Category = require('../models/Category')

router.post('/',async (req,res) => {
    try{
        const category = await Category.create(req.body)

            res.status(201).json({
                status:'success',
                category
            })
    }
    catch (error){
        res.status(400).json({
            status:'fail',
            error
        })
    }
})

module.exports = router