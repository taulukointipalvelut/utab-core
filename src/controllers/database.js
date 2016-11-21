"use strict";
var mongoose = require('mongoose')
var schemas = require('./schemas.js')

mongoose.Promise = global.Promise

class DBTournamentsHandler {
    constructor() {
        this.conn = mongoose.createConnection('mongodb://localhost/tournaments')
        this.conn.on('error', function (e) {
            throw new Error('connection error: ' + e)
        })
        var TournamentInfo = this.conn.model('TournamentInfo', schemas.TournamentInfoSchema)
        var coll = new CollectionHandler(TournamentInfo)
        this.read = coll.read.bind(coll)
        this.update = coll.update.bind(coll)
        this.delete = coll.delete.bind(coll)
        this.create = coll.create.bind(coll)
        this.find = coll.find.bind(coll)
        this.findOne = coll.findOne.bind(coll)
        //this.select = coll.select
        this.close = this.conn.close.bind(this.conn)
    }
}

class DBHandler {//TESTED//
    constructor(id) {
        var conn = mongoose.createConnection('mongodb://localhost/test'+id.toString())
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

        var TeamToInstitutions = conn.model('TeamToInstitutions', schemas.TeamToInstitutionsSchema)
        var TeamToDebaters = conn.model('TeamToDebaters', schemas.TeamToDebatersSchema)
        var AdjudicatorToInstitutions = conn.model('AdjudicatorToInstitutions', schemas.AdjudicatorToInstitutionsSchema)
        var AdjudicatorToConflicts = conn.model('AdjudicatorToConflicts', schemas.AdjudicatorToConflictsSchema)

        var RawTeamResult = conn.model('RawTeamResult', schemas.RawTeamResultSchema)
        var RawDebaterResult = conn.model('RawDebaterResult', schemas.RawDebaterResultSchema)
        var RawAdjudicatorResult = conn.model('RawAdjudicatorResult', schemas.RawAdjudicatorResultSchema)

        this.teams = new CollectionHandler(Team)
        this.adjudicators = new CollectionHandler(Adjudicator)
        this.venues = new CollectionHandler(Venue)
        this.debaters = new CollectionHandler(Debater)
        this.institutions = new CollectionHandler(Institution)

        this.teams_to_debaters = new RelationCollectionHandler(TeamToDebaters)
        this.teams_to_institutions = new CollectionHandler(TeamToInstitutions)
        this.adjudicators_to_institutions = new CollectionHandler(AdjudicatorToInstitutions)
        this.adjudicators_to_conflicts = new CollectionHandler(AdjudicatorToConflicts)

        this.raw_team_results = new ResultsCollectionHandler(RawTeamResult)
        this.raw_debater_results = new ResultsCollectionHandler(RawDebaterResult)
        this.raw_adjudicator_results = new ResultsCollectionHandler(RawAdjudicatorResult)

    }
    close() {
        this.conn.close()
    }
}

function get_identity(identifiers, dict) {
    var new_dict = {}
    for (var identifier of identifiers) {
        new_dict[identifier] = dict[identifier]
    }
    return new_dict
}

class _CollectionHandler {//TESTED// returns Promise object
    constructor(Model, identifiers) {
        this.Model = Model
        this.identifiers = identifiers
    }
    read() {//TESTED//
        return this.Model.find().exec()
    }
    find(dict) {//TESTED//
        return this.Model.find(dict).exec()
    }
    create(dict) {//TESTED//
        var M = this.Model
        var identity = get_identity(this.identifiers, dict)

        return new Promise(function (resolve, reject) {
            M.find(dict, function (err, docs) {
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
        var M = this.Model
        var identity = get_identity(this.identifiers, dict)

        return new Promise(function (resolve, reject) {
            M.find(identity, function (err, docs) {
                if (docs.length === 0) {
                    reject(new Error('DoesNotExist'))
                } else {
                    M.findOneAndUpdate(identity, {$set: dict}, {new: true}).exec().then(resolve).catch(reject)
                }
            })
        })
    }
    delete(dict) {//TESTED//
        var M = this.Model
        var identity = get_identity(this.identifiers, dict)

        return new Promise(function (resolve, reject) {
            M.find(identity, function (err, docs) {
                if (docs.length === 0) {
                    reject(new Error('DoesNotExist'))
                } else {
                    M.findOneAndRemove(identity).exec().then(resolve).catch(reject)
                }
            })
        })
    }
    findOne(dict) {//TESTED//
        var M = this.Model
        var identity = get_identity(this.identifiers, dict)

        return new Promise(function (resolve, reject) {
            M.findOne(identity).exec().then(function(v) {
                if (v === null) {
                    reject(new Error('DoesNotExist'))
                } else {
                    resolve(v)
                }
            }).catch(reject)
        })
    }
    /*
    select(dict, fields = [], no_id = false) {//TESTED//
        if (fields.length === 0) {
            return this.Model.findOne(dict).exec()
        } else {
            var field = no_id ? fields.reduce((a, b) => a + ' ' + b)+' -_id' : fields.reduce((a, b) => a + ' ' + b)
            return this.Model.findOne(dict, field).exec()
        }
    }*/
}

class CollectionHandler extends _CollectionHandler {
    constructor(Model) {
        super(Model, ['id'])
    }
}

class ResultsCollectionHandler extends _CollectionHandler {
    constructor(Model) {
        super(Model, ['id', 'r', 'from_id'])
    }
}

class RelationCollectionHandler extends _CollectionHandler {
    constructor(Model) {
        super(Model, ['id', 'r'])
    }
}

exports.DBHandler = DBHandler
exports.DBTournamentsHandler = DBTournamentsHandler

//var dt = new DBTournamentsHandler()
//dt.create({id: 3, name: "hi"}).then(dt.read().then(console.log)).catch(console.error)
