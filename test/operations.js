var assert = require('assert')
var expect = require('chai/chai.js').expect
var operations = require('../src/operations.js')
var vars = require('./src/vars.js')

function same_list(list0, list1) {
    if (list0.length !== list1.length) {
        return false
    }
    for (var i = 0; i < list0.length; i++) {
        if (list0[i] != list1[i]) {
            return false
        }
    }
    return true
}

function check_0(allocation, allocation0, f = x => x.teams) {
    for (var square of allocation) {
        var flag = false
        for (var square0 of allocation0) {
            if (same_list(f(square), f(square0))) {
                flag = true
            }
        }
        if (flag === false) {
            return false
        }
    }
    return true
}

describe('operations', function () {
    var op = new operations.OP
    describe('allocations', function() {
        describe('teams', function () {
            describe('get', function() {
                it('returns an allocation', function () {
                    var allocation = op.allocations.teams.get(vars.teams, vars.compiled_simple_team_results, vars.teams_to_institutions, [])
                    expect(allocation).to.satisfy(allocation => check_0(allocation, vars.allocation0))
                })
            })
        })
        describe('adjudicator allocations', function() {
            describe('get', function() {
                it('returns an adjudicator allocation', function () {
                    var allocation = op.allocations.adjudicators.get()
                })
            })
        })
    })
})
