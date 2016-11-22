"use strict";

var dbchecks = require('./checks/dbchecks.js')
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
    check: dbchecks.results_precheck
}
var allocations = {
    teams: {
        check: tmchecks.check
    },
    adjudicators: {
        check: adjchecks.check
    },
    venues: {
        check: vnchecks.check
    },
    check: dbchecks.allocations_precheck
}

exports.results = results
exports.allocations = allocations
