const router = require('express').Router();
const {UserModel} = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UniqueConstraintError} = require('sequelize');
const User = require('../models/user');
const {json} = require('express');

router.post('/register', async (req,res) =>{
    const {username, password} = req.body;

    try{
        const newUser = await UserModel.create({
            username,
            password: bcrypt.hashSync(password, 13)
        })

        const token = jwt.sign(
            {us:newUser.id},
            process.env.JWT_SECRET,
            {expiresIn: 60* 60* 24}
        )
        res.status(201).json({
            message: "User Registered",
            user: newUser,
            token
        })
    } catch (err){
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Username already in use"
            });
        } else {
            res.status(500).json({
                error: `Failed to register user: ${err}`
            })
        }
    }
})

router.post('/login', async (req,res) =>{
    let { username, password} = req.body;

    try{
        let loginUser = await UserModel.findOne({
            where: { username: username}
        })

        if (loginUser) {

            let passwordComparison = await bcrypt.compare(password, loginUser.password);
            if (passwordComparison){

                let token = jwt.sign(
                    { id: loginUser.id },
                    process.env.JWT_SECRET,
                    { expiresIn: 60 * 60 * 24}
                );

                res.status(200).json({
                    user: loginUser,
                    message: `User successfully logged in`,
                    token
                });

            } else{

                res.status(401).json({
                    message: `Incorrect Email or Password`
                })
            }

        }else {
            res.status(401).json({
                message: `Incorrect Email or Password`
            })
        }

    } catch(err){
        res.status(500).json({
            message: `Error logging in!`
        })
    }
})

module.exports = router;