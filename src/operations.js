"use strict";
//require('./operations/utils.js')


class OP {
    constructor() {
        var op = this
        this.allocations = {
            get: undefined,
            check: undefined
        }
        this.teams.results = {
            summarize: undefined,
            compile: undefined
        }
        this.debaters.results = {
            summarize: undefined,
            compile: undefined
        }
        this.adjudicators.results = {
            summarize: undefined,
            compile: undefined
        }
    }
}

exports.OP = OP
