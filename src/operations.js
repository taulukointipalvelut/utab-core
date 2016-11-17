"use strict";
require('./operations/utils.js')


class OP {
    constructor() {
        var op = this
        this.allocations = {
            get: undefined,
            check: undefined
        }
        this.teams = {
            results: {
                check: undefined,
                summarize: undefined,
                compile: undefined
            }
        }
        this.debaters = {
            results: {
                check: undefined,
                summarize: undefined,
                compile: undefined
            }
        }
        this.adjudicators = {
            results: {
                check: undefined,
                summarize: undefined,
                compile: undefined
            }
        }
    }
}

exports.OP = OP
