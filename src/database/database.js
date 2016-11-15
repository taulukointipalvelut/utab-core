"use strict";

var mongoose = require('mongoose')
var schemas = require('./schemas.js')
//var _ = require('underscore/underscore.js')
//var tools = require('./tools/tools.js')
//var keys = require('./tools/keys.js')
mongoose.Promise = global.Promise;

class DBHandler {
    constructor(id) {
        //this[Symbol.for('db')] = mongoose.createConnection('mongodb://localhost/tournament'+id.toString())
        mongoose.connect('mongodb://localhost/test');
        var db = mongoose.connection
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', function() {
            console.log('database connected')
        })
        var Team = mongoose.model('Team', schemas.TeamSchema)
        //var Adjudicator = mangoose.model('Adjudicator', schemas.AdjudicatorSchema)
        //var Venue = mangoose.model('Venue', schemas.VenueSchema)
        /*var  = mangoose.model('', schemas.Schema)
        var  = mangoose.model('', schemas.Schema)
        var  = mangoose.model('', schemas.Schema)
        var  = mangoose.model('', schemas.Schema)
        var  = mangoose.model('', schemas.Schema)
        var  = mangoose.model('', schemas.Schema)
        var  = mangoose.model('', schemas.Schema)*/
        this.teams = new CollectionHandler(Team)
    }
}


class CollectionHandler {
    constructor(Model) {
        this.Model = Model
    }
    get (condition={}) {
        var dicts = []
        this.Model.find(condition, function(err, docs) {
            for (var i=0, size=docs.length; i<size; ++i) {
                dicts.push(docs[i].doc)
            }
        })
        return dicts
    }
    add(dict) {
        if (this.get({id: dict.id}).length !== 0) {
            throw new Error('AlreadyExists')
        }
        var model = new this.Model(dict)
        model.save(function(err, doc) {
            if (err) {
                throw new Error(err)
            }
        })
    }
    update() {
        //findOneAndUpdate
    }
}

exports.DBHandler = DBHandler
/*
var db = new DB(4, "test")
console.log(db.team_to_debaters.get()[0])
console.log(db.team_to_debaters.get()[0].get())
*/

var dbh = new DBHandler("test201611151")
console.log(dbh.teams.get())
console.log(dbh.teams.add({id: 3}))
console.log(dbh.teams.get({id: 3}))
setTimeout(()=>console.log(dbh.teams.get()), 3000)
