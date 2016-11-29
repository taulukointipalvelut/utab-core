"use strict";

var mongoose = require('mongoose')
var assert = require('assert')
var ObjectId = mongoose.Types.ObjectId
var styles = require('./styles.js')

var AllocationSchema = new mongoose.Schema({
    r: {type: Number, required: true, unique: true},
    squares: {type: mongoose.Schema.Types.Mixed, required: true}
})

/*

Entitites

 */

var AdjudicatorSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    preev: {type: Number, default: 0},
    name: {type: String, default: ""},
    //institutions: {type: [Number], default: []},
    available: {type: Boolean, default: true},
    user_defined_data: {type: mongoose.Schema.Types.Mixed, default: {}}
})

var TeamSchema = new mongoose.Schema({//TESTED//
    id: {type: Number, required: true, unique: true},
    name: {type: String, default: ""},
    //institutions: {type: [Number], default: []},
    available: {type: Boolean, default: true},
    user_defined_data: {type: mongoose.Schema.Types.Mixed, default: {}}
})

var VenueSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    //uid: {default: parseInt(new ObjectId, 16)},
    name: {type: String, default: ""},
    priority: {type: Number, default: 1},
    available: {type: Number, default: true},
    user_defined_data: {type: mongoose.Schema.Types.Mixed, default: {}}
})

var DebaterSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    //uid: {default: parseInt(new ObjectId, 16)},
    name: {type: String, default: ""},
    user_defined_data: {type: mongoose.Schema.Types.Mixed, default: {}}
})

var InstitutionSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    //uid: {default: parseInt(new ObjectId, 16)},
    name: {type: String, default: ""},
    user_defined_data: {type: mongoose.Schema.Types.Mixed, default: {}}
})

/*

Relations

 */

var AdjudicatorToConflictsSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    conflicts: {type: [Number], default: []},
    user_defined_data: {type: mongoose.Schema.Types.Mixed, default: {}}
})

var AdjudicatorToInstitutionsSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    institutions: {type: [Number], default: []},
    user_defined_data: {type: mongoose.Schema.Types.Mixed, default: {}}
})

var TeamToInstitutionsSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    institutions: {type: [Number], default: []},
    user_defined_data: {type: mongoose.Schema.Types.Mixed, default: {}}
})

var TeamToDebatersSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    r: {type: Number, required: true},
    debaters: {type: [Number], default: []},
    user_defined_data: {type: mongoose.Schema.Types.Mixed, default: {}}
})

/*

Results

 */

var RawDebaterResultSchema = new mongoose.Schema({
    id: {type: Number, required: true, index: true},//target to evaluate
    from_id: {type: Number, required: true, index: true},//sender
    r: {type: Number, required: true, index: true},
    scores: {type: [Number], required: true},
    user_defined_data: {type: mongoose.Schema.Types.Mixed, default: {}}
})
RawDebaterResultSchema.index({id: 1, from_id: 1, r: 1}, {unique: true})

var RawTeamResultSchema = new mongoose.Schema({
    id: {type: Number, required: true, index: true},
    from_id: {type: Number, required: true, index: true},
    r: {type: Number, required: true, index: true},
    win: {type: Number, required: true},
    opponents: {type: [Number], required: true},
    side: {type: String, required: true},
    user_defined_data: {type: mongoose.Schema.Types.Mixed, default: {}}
})
RawTeamResultSchema.index({id: 1, from_id: 1, r: 1}, {unique: true})

var RawAdjudicatorResultSchema = new mongoose.Schema({
    id: {type: Number, required: true, index: true},
    from_id: {type: Number, required: true, index: true},
    r: {type: Number, required: true, index: true},
    score: {type: Number, required: true},
    watched_teams: {type: [Number], required: true},
    comment: {type: String, default: ""},
    user_defined_data: {type: mongoose.Schema.Types.Mixed, default: {}}
})
RawAdjudicatorResultSchema.index({id: 1, from_id: 1, r: 1}, {unique: true})

exports.AllocationSchema = AllocationSchema
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
