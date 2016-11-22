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
    free: {type: mongoose.Schema.Types.Mixed, default: {}}
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
    free: {type: mongoose.Schema.Types.Mixed, default: {}}
})

var TeamSchema = new mongoose.Schema({//TESTED//
    id: {type: Number, required: true},
    name: {type: String, default: ""},
    //institutions: {type: [Number], default: []},
    available: {type: Boolean, default: true},
    free: {type: mongoose.Schema.Types.Mixed, default: {}}
})

var VenueSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    //uid: {default: parseInt(new ObjectId, 16)},
    name: {type: String, default: ""},
    priority: {type: Number, default: 1},
    available: {type: Number, default: true},
    free: {type: mongoose.Schema.Types.Mixed, default: {}}
})

var DebaterSchema = new mongoose.Schema({
   id: {type: Number, required: true},
   //uid: {default: parseInt(new ObjectId, 16)},
   name: {type: String, default: ""},
   free: {type: mongoose.Schema.Types.Mixed, default: {}}
})

var InstitutionSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    //uid: {default: parseInt(new ObjectId, 16)},
    name: {type: String, default: ""},
    free: {type: mongoose.Schema.Types.Mixed, default: {}}
})

/*

Relations

 */

var AdjudicatorToConflictsSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    conflicts: {type: [Number], default: []},
    free: {type: mongoose.Schema.Types.Mixed, default: {}}
})

var AdjudicatorToInstitutionsSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    institutions: {type: [Number], default: []},
    free: {type: mongoose.Schema.Types.Mixed, default: {}}
})

var TeamToInstitutionsSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    institutions: {type: [Number], default: []},
    free: {type: mongoose.Schema.Types.Mixed, default: {}}
})

var TeamToDebatersSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    r: {type: Number, required: true},
    debaters: {type: [Number], default: []},
    free: {type: mongoose.Schema.Types.Mixed, default: {}}
})

/*

Results

 */

var RawDebaterResultSchema = new mongoose.Schema({
    id: {type: Number, required: true},//target to evaluate
    from_id: {type: Number, required: true},//sender
    r: {type: Number, required: true},
    scores: {type: [Number], required: true},
    free: {type: mongoose.Schema.Types.Mixed, default: {}}
})

var RawTeamResultSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    from_id: {type: Number, required: true},
    r: {type: Number, required: true},
    win: {type: Number, required: true},
    opponents: {type: [Number], required: true},
    side: {type: String, required: true},
    free: {type: mongoose.Schema.Types.Mixed, default: {}}
})

var RawAdjudicatorResultSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    from_id: {type: Number, required: true},
    r: {type: Number, required: true},
    score: {type: Number, required: true},
    watched_teams: {type: [Number], required: true},
    free: {type: mongoose.Schema.Types.Mixed, default: {}}
})

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
