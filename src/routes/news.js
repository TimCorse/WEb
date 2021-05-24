const { request } = require("express")
const ObjectID = require('mongodb').ObjectID;
module.exports = (app, db) => {

    const getBaseObject = function(data= null){
        const model = {
            _id: null,
            title: null,
            date: null,
            text: null
        };
        if (data){
            for (let key in model){
                model[key] = data[key] ?? null;
            }
        }
        return model;
    };

    app.get("/news", (request, response) => {
        db.collection("news").find({}).toArray(function(err, result) {
            if (err){
                throw err;
            }
            response.render("./news/index.hbs", {
                title: "Список новостей",
                items: result.map(getBaseObject).filter((v) => v.title || false)
           });
            
        });
        
    });

	app.get("/news/create", (request, response) => {
        response.render("./news/form.hbs", {
            title: "Добавить новость",
            model: getBaseObject(),
            url: "/news/create"
        });
    });

    app.get("/news/:id", (request, response) => {
        db.collection("news").findOne({
            "_id": new ObjectID(request.params.id)
        }, (err, item) => {
            if (err){
                throw err;
            }
            const model = getBaseObject(item);
            response.render("./news/view.hbs", {
                title: model.title,
                model: model
            });
        })
        
    });

    app.post("/news/create", (request, response) => {
        const model = getBaseObject(request.body);
        db.collection('news').insert(
            model,
            (err, results) =>{
                response.redirect("/news");
            }
        );
    });

    app.get("/news/update/:id", (request, response) => {
        db.collection("news").findOne({
            "_id": new ObjectID(request.params.id)
        }, (err, item) => {
            if (err){
                throw err;
            }
            console.log(item)
            response.render("./news/form.hbs", {
                title: "Изменить новость",
                model: getBaseObject(item),
                url: "/news/update/"+ request.params.id
            });
        })
        
    });

    app.post("/news/update/:id", (request, response) => {
        db.collection("news").updateOne({
            "_id": new ObjectID(request.params.id)
        }, { 
            $set: request.body 
        }, (err, res) => {
            if (err) throw err;
            response.redirect("/news")
        
        });
    });

    app.get("/news/delete/:id", (request, response) => {
        db.collection("news").remove({
            "_id": new ObjectID(request.params.id)
        }, (err, item) => {
            if (err){
                throw err;
            }
            response.redirect("/news");
        })
        
    });

}
