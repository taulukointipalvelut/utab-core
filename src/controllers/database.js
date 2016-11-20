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
        this.TournamentInfo = this.conn.model('TournamentInfo', schemas.TournamentInfoSchema)
    }
    read() {
        return this.TournamentInfo.find().exec()
    }
    find(dict) {
        return this.TournamentInfo.find(dict).exec
    }
    delete(dict) {
        let M = this.TournamentInfo
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
    create(dict) {
        let M = this.TournamentInfo
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
    update(dict) {
        var M = this.TournamentInfo
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
    findOne(dict) {
        var M = this.TournamentInfo
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
    close() {
        this.conn.close()
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

        /*
        TournamentInfo.findOne({id: id}).then(function (info) {
            if (info) {
                return info
            } else {
                var database_info = new TournamentInfo({id: id})
                return database_info.save()
            }
        })

        this.info = {
            configure: function (dict) {
                return TournamentInfo.findOne({id: id}).then(function (doc) {
                    if (doc === null) { throw new Error('Creating database. Please Wait.') }
                    if (dict.hasOwnProperty('total_round_num')) {
                        doc.total_round_num = dict.total_round_num
                    }
                    if (dict.hasOwnProperty('current_round_num')) {
                        doc.current_round_num = dict.current_round_num
                    }
                    if (dict.hasOwnProperty('style')) {
                        for (var key in dict.style) {
                            doc.style[key] = dict.style[key]
                        }
                    }
                    return doc.save()
                })
            },
            show: function () {
                return TournamentInfo.findOne({id: id})
            }
        }
        */

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

        this.teams_to_debaters = new CollectionHandler(TeamToDebaters)
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

class _CollectionHandler {//TESTED// returns Promise object
    constructor(Model) {
        this.Model = Model
    }
    read() {//TESTED//
        return this.Model.find().exec()
    }
    find(dict) {//TESTED//
        return this.Model.find(dict).exec()
    }
}

class CollectionHandler extends _CollectionHandler {
    constructor(Model) {
        super(Model)
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
        //return this.Model.findOneAndRemove({id: dict.id}).exec()

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
    findOne(dict) {//TESTED//
        //return this.Model.findOne({id: dict.id}).exec()

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
    select(dict, fields = [], no_id = false) {//TESTED//
        if (fields.length === 0) {
            return this.Model.findOne(dict).exec()
        } else {
            var field = no_id ? fields.reduce((a, b) => a + ' ' + b)+' -_id' : fields.reduce((a, b) => a + ' ' + b)
            return this.Model.findOne(dict, field).exec()
        }
    }
}

class ResultsCollectionHandler extends _CollectionHandler {
    constructor(Model) {
        super(Model)
    }
    create(dict) {//TESTED//
        var M = this.Model
        return new Promise(function (resolve, reject) {
            M.find({id: dict.id, r: dict.r, from_id: dict.from_id}, function (err, docs) {
                if (docs.length !== 0) {
                    reject(new Error('AlreadyExists'))
                } else {
                    var model = new M(dict)
                    model.save().then(resolve).catch(reject)
                }
            })
        })
    }
    update(dict) {
        //return this.Model.findOneAndUpdate({id: dict.id, from_id: dict.from_id, r: dict.r}, {$set: dict}, {new: true}).exec()
        var M = this.Model
        return new Promise(function (resolve, reject) {
            M.find({id: dict.id, from_id: dict.from_id, r: dict.r}, function (err, docs) {
                if (docs.length === 0) {
                    reject(new Error('DoesNotExist'))
                } else {
                    M.findOneAndUpdate({id: dict.id, from_id: dict.from_id, r: dict.r}, {$set: dict}, {new: true}).exec().then(resolve).catch(reject)
                }
            })
        })
    }
    delete(dict) {
        //return this.Model.findOneAndRemove({id: dict.id, from_id: dict.from_id, r: dict.r}).exec()

        var M = this.Model
        return new Promise(function (resolve, reject) {
            M.find({id: dict.id, from_id: dict.from_id, r: dict.r}, function (err, docs) {
                if (docs.length === 0) {
                    reject(new Error('DoesNotExist'))
                } else {
                    M.findOneAndRemove({id: dict.id, from_id: dict.from_id, r: dict.r}).exec().then(resolve).catch(reject)
                }
            })
        })
    }
    findOne(dict) {
        //return this.Model.findOne({id: dict.id, from_id: dict.from_id, r: dict.r}).exec()

        var M = this.Model
        return new Promise(function (resolve, reject) {
            M.findOne({id: dict.id, from_id: dict.from_id, r: dict.r}).exec().then(function(v) {
                if (v === null) {
                    reject(new Error('DoesNotExist'))
                } else {
                    resolve(v)
                }
            }).catch(reject)
        })
    }
    /*
    select(dict, fields = [], noid = true) {//TESTED//
        if (fields.length === 0) {
            return this.Model.findOne(dict).exec()
        } else {
            var field = noid ? fields.reduce((a, b) => a + ' ' + b)+' -id' : fields.reduce((a, b) => a + ' ' + b)
            return this.Model.findOne(dict, field).exec()
        }
    }
    */
}

exports.DBHandler = DBHandler
exports.DBTournamentsHandler = DBTournamentsHandler
/*var dt = new DBTournamentsHandler()
dt.create({id: 3, name: "hi"}).then(dt.read().then(console.log)).catch(console.error)*/