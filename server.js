const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const handlebars    = require('express-handlebars')

const db = require('./config/db') 
const routeMap = require("./routes/_init");
const app = express()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.engine(
    'hbs',
    handlebars({ 
        defaultLayout: 'main',
        extname: "hbs",
    })
);

app.set('views', './views')
app.set('view engine', 'hbs')

const mongo = new MongoClient(db.url, {
    useUnifiedTopology: true
});

mongo.connect((err, client) => {
    if (err){
        return console.log(err);
    }
    const db = client.db("webdev");
    require("./routes/_init")(app, db);
    app.listen(9000, () => {
        console.log('Server is run on localhost:9000');
    })
})




