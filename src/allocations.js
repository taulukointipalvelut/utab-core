"use strict";
var teams = require('./allocations/teams.js')
var adjudicators = require('./allocations/adjudicators.js')
var venues = require('./allocations/venues.js')
var sys = require('./allocations/sys.js')
var loggers = require('./general/loggers.js')

var standard = {
    teams: teams.standard,
    adjudicators: adjudicators.standard,
    venues: venues.standard
}

var traditional = {
    adjudicators: adjudicators.traditional
}

var wudc = {
    teams: teams.wudc
}

exports.deepcopy = sys.allocation_deepcopy
exports.standard = standard
exports.traditional = traditional
exports.wudc = wudc
