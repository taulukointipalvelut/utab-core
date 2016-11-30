"use strict";

var prechecks = require('./checks/prechecks.js')
var adjchecks = require('./checks/adjchecks.js')
var tmchecks = require('./checks/tmchecks.js')
var vnchecks = require('./checks/vnchecks.js')
var reschecks = require('./checks/reschecks.js')

var results = {
    debaters: {
        check: reschecks.check_raw_debater_results
    },
    adjudicators: {
        check: reschecks.check_raw_adjudicator_results
    },
    teams: {
        check: reschecks.check_raw_team_results
    },
    check: prechecks.results_precheck
}
var allocations = {
    teams: {
        precheck: prechecks.team_allocation_precheck,
        check: tmchecks.check
    },
    adjudicators: {
        precheck: prechecks.adjudicator_allocation_precheck,
        check: adjchecks.check
    },
    venues: {
        precheck: prechecks.venue_allocation_precheck,
        check: vnchecks.check
    }
}

exports.results = results
exports.allocations = allocations
