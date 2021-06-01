const router = require('express').Router();
const { LogModel } =require('../models');
const validateSession = require('../middleware');
const middleware = require('../middleware');

router.get("/", async (req,res) =>{
    try{
        const allLogs = await LogModel.findAll();

        res.status(200).json(allLogs)
    } catch(err){
        res.status(500).json({
            error: err
        })
    }
})

router.get("/log/id", async (req, res) =>{
    try{
        const locateLog = await LogModel.findOne({
            where: {logId: req.params.id}
        })
        res.status(200).json({
            message: "Log successfully retrieved",
            log: locateLog
        })
    } catch(err) {
        res.status(500).json({
            message: `Failed to retrieve log: ${err}`
        })
    }
})

router.post('/', middleware.validateSession, async (req,res) =>{
    const {
        description, 
        definition,
        results,
        owner_id
    } = req.body;

    try {
        const Log = await LogModel.create({
            description,
            definition,
            results,
            owner_id
        });

        res.status(201).json({
            message:`Log successfully created`,
            Log
        })
    } catch(err){
        res.status(500).json({
            message: `Failed to create Pie: ${err}`
        })
    }
})

router.put("/:id", middleware.validateSession, async (req, res) =>{
    const {description, definition, results, owner_id} =req.body;

    try{
        const logUpdated = await LogModel.update({
            description, definition, results, },
                {where: {id: req.params.id} }
            )

            res.status(200).json({
                message: `Log successfully updated`,
                logUpdated
            })
    } catch(err) {
        res.status(500).json({
            message: `Failed to update Log: ${err}`
        })
    }
})

router.delete('/delete/:id', middleware.validateSession, async (req,res) => {
    try {
        const locateLog = await LogModel.destroy({
            where: { id: req.params.id}
        })

        res.status(200).json({
            message: "Log Successfully Deleted",
            deletedLog: locateLog
        })
    } catch(err) {
        res.status(500).json({
            message: `Failed to delete Log ${err}`
        })
    }
})
module.exports = router;