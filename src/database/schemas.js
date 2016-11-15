var mongoose = require('mongoose')
var assert = require('assert')
var ObjectId = mongoose.Schema.ObjectId

var AdjudicatorSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    uid: {default: parseInt(new ObjectId, 16)},
    name: {type: String, default: ""},
    institution_ids: {type: [Number], default: []},
    /*watched_teams: {type: [Number], default: []},
    scores: {type: [Number], default: []},
    active_num: {type: Number, default: 0},
    pre_evaluation: {type: Number, default: 0},*/// these are from results
    available: {type: Boolean, default: true},
    conflicts: {type: [Number], default: []},
    url: {type: String, default: ""}
})

var TeamSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    //uid: {default: parseInt(new ObjectId, 16)},
    name: {type: String, default: ""},
    institution_ids: {type: [Number], default: []},
    debaters: {type: [{r: Number, ids: []}], default: []},
    /*past_sides: {type: [String], default: []},
    wins: {type: [Number], default: []},
    scores: {type: [Number], default: []},
    margins: {type: [Number], default: []},
    past_opponents: {type: [Number], default: []},*///these are from results
    available: {type: Boolean, default: true},
    url: {type: String, default: ""}
})

var VenueSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    uid: {default: parseInt(new ObjectId, 16)},
    name: {type: String, default: ""},
    priority: {type: Number, default: 1},
    available: {type: Number, default: true},
    url: {type: String, default: ""}
})

var InstitutionSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    uid: {default: parseInt(new ObjectId, 16)},
    name: {type: String, default: ""},
    url: {type: String, default: ""}
})

var DebaterSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    uid: {default: parseInt(new ObjectId, 16)},
    name: {type: String, default: ""},
    url: {type: String, default: ""}
})

var RawDebaterResultSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    uid: {type: Number, required: true},
    r: {type: Number, required: true},
    scores: {type: [Number], required: true}
})

var RawTeamResultSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    uid: {type: Number, required: true},
    r: {type: Number, required: true},
    win: {type: Number, required: true},
    opponents: {type: Number, required: true},
    side: {type: Number, required: true},
    margin: {type: [Number], required: true}
})

var RawAdjudicatorResultSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    uid: {type: Number, required: true},
    r: {type: Number, required: true},
    score: {type: [Number], required: true},
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
    name: {type: String, default: ""},
    uid: {type: Number, default: parseInt(new ObjectId, 16)},
    total_round_num: {type: Number, default: 1},
    current_round_num: {type: Number, default: 1}
})
*/

exports.AdjudicatorSchema = AdjudicatorSchema
exports.TeamSchema = TeamSchema
exports.VenueSchema = VenueSchema
exports.DebaterSchema = DebaterSchema
exports.InstitutionSchema = InstitutionSchema
exports.RawDebaterResultSchema = RawDebaterResultSchema
exports.RawTeamResultSchema = RawTeamResultSchema
exports.RawAdjudiccatorResultSchema = RawAdjudicatorResultSchema
//exports.TournamentSchema = TournamentSchema


//tests

//var Adjudicator = mongoose.model('Adjudicator', AdjudicatorSchema);
