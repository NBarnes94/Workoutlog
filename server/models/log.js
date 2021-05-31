const  {DataTypes, Model} = require('sequelize');
const db = require("../db");

const WorkoutLog = db.define('Log', {
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    definition: {
        type: DataTypes.STRING,
        allowNull: false
    },
    result:{
        type: DataTypes.STRING,
        allowNull: false
    }, 
    owner_id:{
        type: DataTypes.INTEGER,

    } 
})

module.exports = WorkoutLog;