"use strict";
var mongoose = require('mongoose')
var schemas = require('./schemas.js')

mongoose.Promise = global.Promise

class DBHandler {//TESTED//
    constructor(url) {
        var conn = mongoose.createConnection('mongodb://localhost/test'+url.toString())
        this.conn = conn
        conn.on('error', function (e) {
            throw new Error('connection error: ' + e)
        })
        //conn.once('open', function() {
        //    console.log('database connected')
        //})

        var Team = conn.model('Team', schemas.TeamSchema)
        var Adjudicator = conn.model('Adjudicator', schemas.AdjudicatorSchema)
        var Venue = conn.model('Venue', schemas.VenueSchema)
        var Debater = conn.model('Debater', schemas.DebaterSchema)
        var Institution = conn.model('Institution', schemas.InstitutionSchema)
        var RawTeamResult = conn.model('RawTeamResult', schemas.RawTeamResultSchema)
        var RawDebaterResult = conn.model('RawDebaterResult', schemas.RawDebaterResultSchema)
        var RawAdjudicatorResult = conn.model('RawAdjudicatorResult', schemas.RawAdjudicatorResultSchema)

        this.teams = new CollectionHandler(Team)
        this.adjudicators = new CollectionHandler(Adjudicator)
        this.venues = new CollectionHandler(Venue)
        this.debaters = new CollectionHandler(Debater)
        this.institutions = new CollectionHandler(Institution)
        this.raw_team_results = new CollectionHandler(RawTeamResult)
        this.raw_debater_results = new CollectionHandler(RawDebaterResult)
        this.raw_adjudicator_results = new CollectionHandler(RawAdjudicatorResult)
        
        this.total_round_num = 4
        this.current_round_num = 1
        this.url = url
    }
    close() {
        this.conn.close()
    }
}

class CollectionHandler {//TESTED// returns Promise object
    constructor(Model) {
        this.Model = Model
    }
    read() {//TESTED//
        return this.Model.find().exec()
    }
    create(dict) {//TESTED//
        /*
        var model = new this.Model(dict)
        return model.save()
        */
        var M = this.Model
        return new Promise(function (resolve, reject) {
            M.find({id: dict.id}, function (err, docs) {
                if (docs.length !== 0) {
                    reject(new Error('AlreadyExists'))
                } else {
                    var model = new M(dict)
                    model.save().then(resolve).catch(reject)
                }
            })
        })
    }
    update(dict) {//TESTED//
        //return this.Model.findOneAndUpdate({id: dict.id}, {$set: dict}, {new: true}).exec()

        var M = this.Model
        return new Promise(function (resolve, reject) {
            M.find({id: dict.id}, function (err, docs) {
                if (docs.length === 0) {
                    reject(new Error('DoesNotExist'))
                } else {
                    M.findOneAndUpdate({id: dict.id}, {$set: dict}, {new: true}).exec().then(resolve).catch(reject)
                }
            })
        })
    }
    delete(dict) {//TESTED//
        var M = this.Model
        return new Promise(function (resolve, reject) {
            M.find({id: dict.id}, function (err, docs) {
                if (docs.length === 0) {
                    reject(new Error('DoesNotExist'))
                } else {
                    M.findOneAndRemove({id: dict.id}).exec().then(resolve).catch(reject)
                }
            })
        })
    }
    find(dict) {//TESTED//
        return this.Model.find(dict).exec()
    }
    findOne(dict) {//TESTED//
        var M = this.Model
        return new Promise(function (resolve, reject) {
            M.findOne({id: dict.id}).exec().then(function(v) {
                if (v === null) {
                    reject(new Error('DoesNotExist'))
                } else {
                    resolve(v)
                }
            }).catch(reject)
        })
    }
    select(dict, fields = [], no_uid = true) {//TESTED//
        if (fields.length === 0) {
            return this.Model.findOne(dict).exec()
        } else {
            var field = no_uid ? fields.reduce((a, b) => a + ' ' + b)+' -_id' : fields.reduce((a, b) => a + ' ' + b)
            return this.Model.findOne(dict, field).exec()
        }
    }
}

exports.DBHandler = DBHandler
