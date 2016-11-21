"use strict";

var alloc = require('./operations/allocations.js')
var res = require('./operations/results.js')
var filters = require('./operations/filters.js')
var adjfilters = require('./operations/adjfilters.js')

//var op = this
var filter_dict = {
    by_side: filters.filter_by_side,
    by_institution: filters.filter_by_institution,
    by_past_opponent: filters.filter_by_past_opponent,
    by_strength: filters.filter_by_strength
}
var adjfilter_dict1 = {
    by_bubble: adjfilters.filter_by_bubble,
    by_strength: adjfilters.filter_by_strength,
    by_attendance: adjfilters.filter_by_attendance
}
var adjfilter_dict2 = {
    by_past: adjfilters.filter_by_past,
    by_institution: adjfilters.filter_by_institution,
    by_conflict: adjfilters.filter_by_conflict
}
//console.log(alloc)
var allocations = {
    teams: {
        get: alloc.teams.get,
        check: alloc.teams.check,
        functions: {
            read: () => filter_dict
        }
    },
    adjudicators: {
        get: alloc.adjudicators.get,
        check: alloc.adjudicators.check,
        functions: {
            read: () => [adjfilter_dict1, adjfilter_dict2]
        }
    },
    venues: {
        get: alloc.venues.get,
        check: alloc.venues.check
    },
    deepcopy: alloc.allocation_deepcopy,
    precheck: alloc.precheck
}

var results = {
    teams: {
        check: res.teams.check,
        summarize: res.teams.results.summarize,
        compile: res.teams.results.compile,
        simplified_summarize: res.teams.simplified_results.summarize,
        simplified_compile: res.teams.simplified_results.compile
    },
    debaters: {
        check: res.debaters.check,
        summarize: res.debaters.results.summarize,
        compile: res.debaters.results.compile
    },
    adjudicators: {
        check: res.adjudicators.check,
        summarize: res.debaters.results.summarize,
        compile: res.adjudicators.results.compile
    },
    precheck: res.precheck
}

exports.filter_dict = filter_dict
exports.adjfilter_dict1 = adjfilter_dict1
exports.adjfilter_dict2 = adjfilter_dict2
exports.allocations = allocations
exports.results = results
