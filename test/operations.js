var assert = require('assert')
var expect = require('chai/chai.js').expect
var operations = require('../src/operations.js')
var vars = require('./src/vars.js')

describe('operations', function () {
    var op = new operations.OP
    describe('allocations', function() {
        describe('teams', function () {
            describe('get', function() {
                var allocation = op.allocations.teams.get(vars.teams, vars.compiled_simple_team_results, vars.teams_to_institutions, [])
                expect(allocation).to.deep.equal(vars.allocation0)
            })
        })
    })
})
