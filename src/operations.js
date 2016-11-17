"use strict";

var allocations = require('./operations/allocations.js')
var results = require('./operations/results.js')

class OP {
    constructor() {
        //var op = this
        var res = results.Results
        var alloc = allocations.Allocation
        this.allocations = {
            get: undefined,
            check: undefined
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
