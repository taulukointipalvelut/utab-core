"use strict";

var allocations = require('./operations/allocations.js')
var results = require('./operations/results.js')
var filters = require('./operations/filters.js')
var adjfilters = require('./operations/adjfilters.js')

class OP {
    constructor() {
        //var op = this
        var res = new results.Results
        var alloc = new allocations.Allocation
        var filter_dict = {
            by_side: filters.filter_by_side,
            by_institution: filters.filter_by_institution,
            by_past_opponent: filters.filter_by_past_opponent,
            by_strength: filters.filter_by_strength
        }
        var adjfilter_dict = {
            by_strength: adjfilters.filter_by_strength,
            by_past: adjfilters.filter_by_past,
            by_institution: adjfilters.filter_by_institution,
            by_bubble: adjfilters.filter_by_bubble,
            by_attendance: adjfilters.filter_by_attendance,
            by_conflict: adjfilters.filter_by_conflict
        }
        //console.log(alloc)
        this.allocations = {
            teams: {
                get: alloc.teams.get,
                check: undefined,
                functions: {
                    read: () => filter_dict
                }
            },
            adjudicators: {
                get: alloc.adjudicators.get,
                check: undefined,
                functions: {
                    read: () => adjfilter_dict
                }
            },
            venues: {
                get: alloc.venues.get,
                check: undefined
            }
        }
        this.teams = {
            results: {
                check: undefined,
                summarize: res.teams.results.summarize,
                compile: res.teams.results.compile,
                simplified_summarize: res.teams.simplified_results.summarize,
                simplified_compile: res.teams.simplified_results.compile
            }
        }
        this.debaters = {
            results: {
                check: undefined,//gathered?
                summarize: res.debaters.results.summarize,
                compile: res.debaters.results.compile
            }
        }
        this.adjudicators = {
            results: {
                check: undefined,//gathered?
                summarize: res.debaters.results.summarize,
                compile: res.adjudicators.results.compile
            }
        }
    }
}

exports.OP = OP
