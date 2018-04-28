var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var urlencodedParser = bodyParser.urlencoded({
    extended: true
});
var expressSanitizer = require('express-sanitizer');
var methodOverride = require('method-override');

app.use(urlencodedParser);
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride('__method'));

//Connect to MongoDB
mongoose.connect('mongodb://localhost/Novelty');

//Schema Definition
var changeSchema = new mongoose.Schema({
    changeId: String,
    header: String,
    description: String,
    enteredDate: {
        type: Date,
        default: Date.now
    }
});

var Change = mongoose.model("Change", changeSchema);

app.get("/change", function (req, res) {
    Change.find({}, function (err, resultChanges) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                resultChanges: resultChanges
            });
        }

    });

});

app.get("/change/new", function (req, res) {

    res.render("new");

});

app.get("/change/:changeId/edit", function (req, res) {
    Change.findById(req.params.changeId, function (err, resultChange) {
        if (err) {
            console.log(err);
        } else {
            res.render("edit", {
                resultChange: resultChange
            });
        }

    });

});

app.get("/change/:changeId", function (req, res) {

    Change.findById(req.params.changeId, function (err, resultChange) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {
                resultChange: resultChange
            });
        }

    });

});

app.put("/change/:changeId", function (req, res) {

    Change.findByIdAndUpdate(req.params.changeId, req.body.change, function (err, updateChange) {
        if (err) {
            console.log(err);
        } else {
            Change.findById(req.params.changeId, function (err, resultChange) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("show", {
                        resultChange: resultChange
                    });
                }

            });
        }

    });

});

app.delete("/change/:changeId", function (req, res) {

    Change.findByIdAndRemove(req.params.changeId,function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/change");
        }

    });

});

app.post("/change", function (req, res) {

    Change.create(req.body.change, function (err, savedChange) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/change");
        }
    });

});

app.get("/", function (req, res) {

    res.redirect("/change");
});




// All RESTful Routes
app.listen("3000", () => console.log("Novelty - Change Mangement System Server started on Port #3000"));