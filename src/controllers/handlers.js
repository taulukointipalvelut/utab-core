"use strict";

var mongoose = require('mongoose')
var schemas = require('./schemas.js')
var md5 = require('blueimp-md5')
var loggers = require('../general/loggers.js')
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
    constructor(url) {
        loggers.controllers('debug', 'constructor of DBHandler is called')
        loggers.controllers('debug', 'arguments are: '+JSON.stringify(arguments))
        var conn = mongoose.createConnection(url)
        this.conn = conn
        this.conn.on('error', function (e) {
            loggers.controllers('error', 'failed to connect to the database @ DBHandler'+e)
        })
        this.conn.once('open', function() {
            loggers.controllers('connected to the database @ DBHandler')
        })
        var Allocation = conn.model('Allocation', schemas.AllocationSchema)

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

        this.allocations = new AllocationsCollectionHandler(Allocation)

        this.teams = new EntityCollectionHandler(Team)
        this.adjudicators = new EntityCollectionHandler(Adjudicator)
        this.venues = new EntityCollectionHandler(Venue)
        this.debaters = new EntityCollectionHandler(Debater)
        this.institutions = new EntityCollectionHandler(Institution)

        this.teams_to_debaters = new RelationsByRoundsCollectionHandler(TeamToDebaters)
        this.teams_to_institutions = new RelationsCollectionHandler(TeamToInstitutions)
        this.adjudicators_to_institutions = new RelationsCollectionHandler(AdjudicatorToInstitutions)
        this.adjudicators_to_conflicts = new RelationsCollectionHandler(AdjudicatorToConflicts)

        this.raw_team_results = new ResultsCollectionHandler(RawTeamResult)
        this.raw_debater_results = new ResultsCollectionHandler(RawDebaterResult)
        this.raw_adjudicator_results = new ResultsCollectionHandler(RawAdjudicatorResult)

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
                throw new Error('DoesNotExist')
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
                throw new Error('DoesNotExist')
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
                throw new Error('DoesNotExist')
            } else {
                return arrange_doc(doc)
            }
        })
    }
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

class EntityCollectionHandler extends _CollectionHandler {
    constructor(Model) {
        super(Model, ['id'])
    }
    create(dict, override=false) {//TESTED BUT NEED FIX// name exists? => no -> create, yes -> create with new hash
        loggers.controllers(this.Model.modelName+'.create is called')
        loggers.controllers('debug', 'arguments are: '+JSON.stringify(arguments))
        var M = this.Model
        var new_dict = _.clone(dict)
        new_dict.id = create_hash(dict.name)

        var model = new M(new_dict)
        if (override) {
            return model.save().catch(function() {
                new_dict.id = create_hash(dict.name+Date.now().toString())
                model = new M(new_dict)
                return model.save().then(arrange_doc)
            })
        } else {
            return model.save().then(arrange_doc)
        }
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

exports.DBHandler = DBHandler

//var dt = new DBTournamentsHandler()
//dt.create({id: 3, name: "hi"}).then(dt.read().then(console.log)).catch(console.error)
