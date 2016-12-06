"use strict";

var mongoose = require('mongoose')
var schemas = require('./schemas.js')
var md5 = require('blueimp-md5')
var loggers = require('../general/loggers.js')
var errors = require('../general/errors.js')
var _ = require('underscore/underscore.js')

mongoose.Promise = global.Promise

function create_hash(seed) {
    return parseInt(md5(seed).slice(0, 12), 16)
}

function arrange_doc(doc) {
    var new_doc = JSON.parse(JSON.stringify(doc))
    delete new_doc.__v
    delete new_doc._id
    return new_doc
}

class DBHandler {//TESTED//
    constructor(db_url, options) {
        loggers.controllers('debug', 'constructor of DBHandler is called')
        loggers.controllers('debug', 'arguments are: '+JSON.stringify(arguments))
        var conn = mongoose.createConnection(db_url)
        this.conn = conn
        this.conn.on('error', function (e) {
            loggers.controllers('error', 'failed to connect to the database @ DBHandler'+e)
        })
        this.conn.once('open', function() {
            loggers.controllers('connected to the database @ DBHandler of '+db_url)
        })

        var RoundInfo = conn.model('RoundInfo', schemas.RoundInfoSchema)

        var Allocation = conn.model('Allocation', schemas.AllocationSchema)

        var Team = conn.model('Team', schemas.TeamSchema)
        var Adjudicator = conn.model('Adjudicator', schemas.AdjudicatorSchema)
        var Venue = conn.model('Venue', schemas.VenueSchema)
        var Debater = conn.model('Debater', schemas.DebaterSchema)
        var Institution = conn.model('Institution', schemas.InstitutionSchema)

        var RawTeamResult = conn.model('RawTeamResult', schemas.RawTeamResultSchema)
        var RawDebaterResult = conn.model('RawDebaterResult', schemas.RawDebaterResultSchema)
        var RawAdjudicatorResult = conn.model('RawAdjudicatorResult', schemas.RawAdjudicatorResultSchema)

        this.round_info = new TournamentsCollectionHandler(RoundInfo)

        this.allocations = new AllocationsCollectionHandler(Allocation)

        this.teams = new EntityCollectionHandler(Team)
        this.adjudicators = new EntityCollectionHandler(Adjudicator)
        this.venues = new EntityCollectionHandler(Venue)
        this.debaters = new EntityCollectionHandler(Debater)
        this.institutions = new EntityCollectionHandler(Institution)

        this.raw_team_results = new ResultsCollectionHandler(RawTeamResult)
        this.raw_debater_results = new ResultsCollectionHandler(RawDebaterResult)
        this.raw_adjudicator_results = new ResultsCollectionHandler(RawAdjudicatorResult)

        if (options) {
            let new_options = _.clone(options)
            new_options.db_url = db_url
            this.round_info.create(new_options).catch(function(err) {})
        }
    }
    close() {
        loggers.controllers('debug', 'connection by DBHandler was closed')
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
        loggers.controllers(this.Model.modelName+'.read is called')
        return this.Model.find().exec().then(docs => docs.map(arrange_doc))
    }
    find(dict) {//TESTED//
        loggers.controllers(this.Model.modelName+'.find is called')
        loggers.controllers('debug', 'arguments are: '+JSON.stringify(arguments))
        return this.Model.find(dict).exec().then(docs => docs.map(arrange_doc))
    }
    create(dict) {//TESTED//
        loggers.controllers(this.Model.modelName+'.create is called')
        loggers.controllers('debug', 'arguments are: '+JSON.stringify(arguments))
        var M = this.Model

        var model = new M(dict)
        return model.save().then(arrange_doc)
    }
    update(dict) {//TESTED//
        loggers.controllers(this.Model.modelName+'.update is called')
        loggers.controllers('debug', 'arguments are: '+JSON.stringify(arguments))
        var M = this.Model
        var identity = get_identity(this.identifiers, dict)

        return M.findOneAndUpdate(identity, {$set: dict}, {new: true}).exec().then(function(doc) {
            if (doc === null) {
                throw new errors.DoesNotExist(identity)
            } else {
                return arrange_doc(doc)
            }
        })
    }
    delete(dict) {//TESTED//
        loggers.controllers(this.Model.modelName+'.delete is called')
        loggers.controllers('debug', 'arguments are: '+JSON.stringify(arguments))
        var M = this.Model
        var identity = get_identity(this.identifiers, dict)

        return M.findOneAndRemove(identity).exec().then(function(doc) {
            if (doc === null) {
                throw new errors.DoesNotExist(identity)
            } else {
                return arrange_doc(doc)
            }
        })
    }
    findOne(dict) {
        loggers.controllers(this.Model.modelName+'.findOne is called')
        loggers.controllers('debug', 'arguments are: '+JSON.stringify(arguments))
        var M = this.Model
        var identity = get_identity(this.identifiers, dict)

        return M.findOne(identity).exec().then(function(doc) {
            if (doc === null) {
                loggers.controllers('error', 'DoesNotExist'+JSON.stringify(dict))
                throw new errors.DoesNotExist(identity)
            } else {
                return arrange_doc(doc)
            }
        })
    }/*
    exists(dict) {
        loggers.controllers(this.Model.modelName+'.exists is called')
        loggers.controllers('debug', 'arguments are: '+JSON.stringify(arguments))
        var M = this.Model
        var identity = get_identity(this.identifiers, dict)

        return M.findOne(identity).exec().then(function (doc) {
            if (doc !== null) {
                return true
            } else {
                return false
            }
        })
    }*/
}

class EntityCollectionHandler extends _CollectionHandler {
    constructor(Model) {
        super(Model, ['id'])
    }
    create(dict, force=false) {//TESTED//
        loggers.controllers(this.Model.modelName+'.create is called')
        loggers.controllers('debug', 'arguments are: '+JSON.stringify(arguments))
        var M = this.Model

        return M.findOne({name: dict.name}).exec().then(function(doc) {
            if (doc === null) {
                var new_dict = _.clone(dict)
                new_dict.id = create_hash(M.modelName+dict.name)
                var model = new M(new_dict)
                return model.save().then(arrange_doc)
            } else {
                if (force) {
                    var new_dict = _.clone(dict)
                    new_dict.id = create_hash(M.modelName+dict.name+Date.now().toString())
                    var model = new M(new_dict)
                    return model.save().then(arrange_doc)
                } else {
                    loggers.controllers('error', 'AlreadyExists'+JSON.stringify({name: dict.name}))
                    throw new errors.AlreadyExists({name: dict.name})
                }
            }
        })
    }
}

class ResultsCollectionHandler extends _CollectionHandler {
    constructor(Model) {
        super(Model, ['id', 'r', 'from_id'])
    }
}

class RelationsByRoundsCollectionHandler extends _CollectionHandler {
    constructor(Model) {
        super(Model, ['id', 'r'])
    }
}

class RelationsCollectionHandler extends _CollectionHandler {
    constructor(Model) {
        super(Model, ['id'])
    }
}

class AllocationsCollectionHandler extends _CollectionHandler {
    constructor(Model) {
        super(Model, ['r'])
    }
}

class TournamentsCollectionHandler extends _CollectionHandler {
    constructor(Model) {
        super(Model, ['db_url'])
        this.exists = undefined
        this.findOne = undefined
        this.delete = undefined
        this.find = undefined
    }
    read() {//TESTED//
        loggers.controllers(this.Model.modelName+'.read is called')
        return super.read().then(function(docs) {
            if (docs.length === 0) {
                return {}
            } else {
                return docs[0]
            }
        })
    }
    create(dict) {//TESTED//
        loggers.controllers(this.Model.modelName+'.create is called')
        loggers.controllers('debug', 'arguments are: '+JSON.stringify(arguments))
        return super.create(dict)
    }
    update(dict) {//TESTED//
        loggers.controllers(this.Model.modelName+'.update is called')
        loggers.controllers('debug', 'arguments are: '+JSON.stringify(arguments))
        var super_update = super.update
        var that = this
        return this.read().then(function(doc) {
            var new_dict = _.clone(dict)
            new_dict.id = doc.id
            return super_update.call(that, new_dict)
        })
    }

}

exports.DBHandler = DBHandler

//var dt = new DBTournamentsHandler()
//dt.create({id: 3, name: "hi"}).then(dt.read().then(console.log)).catch(console.error)
