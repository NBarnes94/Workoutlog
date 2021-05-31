require('dotenv').config();
const Express = require('express');
const app = Express();
app.use(Express.json());
const dbConnection = require('./db');
const controllers = require('./controllers');
const middleware = require('./middleware');

app.use('/user', controllers.userController);
app.use('/log', controllers.workoutController);

dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(process.env.PORT, () =>{
            console.log(`[Server]: is listening on ${process.env.PORT}`)
        });
    })
    .catch((err) => {
        console.log("[Server:] Server crashed");
        console.log(err);
    })