"use strict";

var mongoose = require('mongoose')
var assert = require('assert')
var ObjectId = mongoose.Types.ObjectId
var styles = require('./styles.js')

var TournamentInfoSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    name: {type: String, default: ""},
    current_round_num: {type: Number, default: 1},
    total_round_num: {type: Number, default: 4},
    style: {type: mongoose.Schema.Types.Mixed, default: styles.Styles.NA},
    url: {type: String, default: ""}
})

/*

Entitites

 */

var AdjudicatorSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    preev: {type: Number, default: 0},
    name: {type: String, default: ""},
    //institutions: {type: [Number], default: []},
    available: {type: Boolean, default: true},
    url: {type: String, default: ""}
})

var TeamSchema = new mongoose.Schema({//TESTED//
    id: {type: Number, required: true},
    name: {type: String, default: ""},
    //institutions: {type: [Number], default: []},
    available: {type: Boolean, default: true},
    url: {type: String, default: ""}
})

var VenueSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    //uid: {default: parseInt(new ObjectId, 16)},
    name: {type: String, default: ""},
    priority: {type: Number, default: 1},
    available: {type: Number, default: true},
    url: {type: String, default: ""}
})

var DebaterSchema = new mongoose.Schema({
   id: {type: Number, required: true},
   //uid: {default: parseInt(new ObjectId, 16)},
   name: {type: String, default: ""},
   url: {type: String, default: ""}
})

var InstitutionSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    //uid: {default: parseInt(new ObjectId, 16)},
    name: {type: String, default: ""},
    url: {type: String, default: ""}
})

/*

Relations


 */

var AdjudicatorToConflictsSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    conflicts: {type: [Number], default: []}
})

var AdjudicatorToInstitutionsSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    institutions: {type: [Number], default: []}
})

var TeamToInstitutionsSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    institutions: {type: [Number], default: []}
})

var TeamToDebatersSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    r: {type: Number, required: true},
    debaters: {type: [Number], default: []}
})
/*
TeamToDebatersSchema.methods.read_debaters = function (dict) {//TESTED//
    if (this.debaters_by_r === undefined || !this.debaters_by_r.hasOwnProperty(dict.r)) {
        throw new Error('DoesNotExist')
    } else {
        return this.debaters_by_r[dict.r]
    }
}

TeamToDebatersSchema.methods.update_debaters = function (dict) {//TESTED//
    if (this.debaters_by_r === undefined || !this.debaters_by_r.hasOwnProperty(dict.r)) {
        throw new Error('DoesNotExist')
    } else {
        this.debaters_by_r[dict.r] = dict.debaters
        this.markModified('debaters_by_r')
        return this.save()
    }
}

TeamToDebatersSchema.methods.delete_debaters = function (dict) {//TESTED//
    if (this.debaters_by_r === undefined || !this.debaters_by_r.hasOwnProperty(dict.r)) {
        throw new Error('DoesNotExist')
    } else {
        delete this.debaters_by_r[dict.r]
        this.markModified('debaters_by_r')
        return this.save()
    }
}

TeamToDebatersSchema.methods.create_debaters = function (dict) {//TESTED//
    if (this.debaters_by_r !== undefined && this.debaters_by_r.hasOwnProperty(dict.r)) {
        throw new Error('AlreadyExists')
    } else {
        var new_dict = this.debaters_by_r || {}
        new_dict[dict.r] = dict.debaters
        this.debaters_by_r = new_dict
        this.markModified('debaters_by_r')
        return this.save()
    }
}

TeamToDebatersSchema.methods.create_if_not_exists_debaters = function (dict) {//TESTED//
    if (this.debaters_by_r !== undefined && this.debaters_by_r.hasOwnProperty(dict.r)) {
        return null
    } else {
        var new_dict = this.debaters_by_r || {}
        new_dict[dict.r] = dict.debaters
        this.debaters_by_r = new_dict
        this.markModified('debaters_by_r')
        return this.save()
    }
}
*/
/*

Results

 */

var RawDebaterResultSchema = new mongoose.Schema({
    id: {type: Number, required: true},//target to evaluate
    from_id: {type: Number, required: true},//sender
    r: {type: Number, required: true},
    scores: {type: [Number], required: true}
})

var RawTeamResultSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    from_id: {type: Number, required: true},
    r: {type: Number, required: true},
    win: {type: Number, required: true},
    opponents: {type: [Number], required: true},
    side: {type: String, required: true}
    //margin: {type: [Number], required: true}
})

var RawAdjudicatorResultSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    from_id: {type: Number, required: true},
    r: {type: Number, required: true},
    score: {type: Number, required: true},
    watched_teams: {type: [Number], required: true},
    comment: {type: String, default: ""}
})

/*
var NameSchema = mongoose.Schema({
    uid: {type: Number, required: true},
    name: {type: String, required: true}
})
*/
/*
var TournamentSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    //name: {type: String, default: ""},
    //uid: {type: Number, default: parseInt(new ObjectId, 16)},
    total_round_num: {type: Number, default: 1},
    current_round_num: {type: Number, default: 1}
})
*/
/*
var Test2Schema = new mongoose.Schema({
    id: Number//,
    //uid: {type: String, default: parseInt(new ObjectId, 16)}
})
exports.Test2Schema = Test2Schema
*/

AdjudicatorSchema.methods.uid = function() {
    return parseInt(this.id, 16)
}

TeamSchema.methods.uid = function() {
    return parseInt(this.id, 16)
}

VenueSchema.methods.uid = function() {
    return parseInt(this.id, 16)
}

DebaterSchema.methods.uid = function() {
    return parseInt(this.id, 16)
}

InstitutionSchema.methods.uid = function() {
    return parseInt(this.id, 16)
}

RawTeamResultSchema.methods.uid = function() {
    return parseInt(this.id, 16)
}

RawDebaterResultSchema.methods.uid = function() {
    return parseInt(this.id, 16)
}

RawAdjudicatorResultSchema.methods.uid = function() {
    return parseInt(this.id, 16)
}

exports.TournamentInfoSchema = TournamentInfoSchema
exports.AdjudicatorSchema = AdjudicatorSchema
exports.TeamSchema = TeamSchema
exports.VenueSchema = VenueSchema
exports.DebaterSchema = DebaterSchema
exports.InstitutionSchema = InstitutionSchema
exports.TeamToInstitutionsSchema = TeamToInstitutionsSchema
exports.TeamToDebatersSchema = TeamToDebatersSchema
exports.AdjudicatorToInstitutionsSchema = AdjudicatorToInstitutionsSchema
exports.AdjudicatorToConflictsSchema = AdjudicatorToConflictsSchema
exports.RawDebaterResultSchema = RawDebaterResultSchema
exports.RawTeamResultSchema = RawTeamResultSchema
exports.RawAdjudicatorResultSchema = RawAdjudicatorResultSchema


//tests

//var Adjudicator = mongoose.model('Adjudicator', AdjudicatorSchema);
