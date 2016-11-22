"use strict";

var assert = require('assert')
var expect = require('chai/chai.js').expect
var sys = require('../src/operations/sys.js')

describe('sys', function() {
    describe('one_sided', function () {
        it('covers one sided', function () {
            var onesided0 = sys.one_sided(['gov', 'gov', 'gov'])
            var onesided1 = sys.one_sided(['gov', 'gov', 'opp'])
            expect(onesided0).to.equal(3)
            expect(onesided1).to.equal(1)
        })
    })
    describe('allocation_deepcopy', function() {
        it('covers allocation deepcopy', function () {
            var allocation = [
                {
                    id: 0,
                    teams: [0, 1],
                    chairs: [1, 2],
                    remaining_adjudicators: [1, 2, 3],
                    remaining_adjudicators2: [1],
                    venue: 1,
                    warnings: []
                },
                {
                    id: 1,
                    teams: [0, 1],
                    chairs: [1, 2],
                    remaining_adjudicators: [1, 2, 3],
                    remaining_adjudicators2: [1],
                    venue: 1,
                    warnings: []
                },
            ]
            var allocation_dc = sys.allocation_deepcopy(allocation)
            expect(allocation_dc).to.deep.equal(allocation)
        })
    })
    describe("access", function() {
        it('covers default acess to property', function () {
            var v0 = sys.acess(dict, 'id')
            expect(v0).to.equal(0)
        })
        it('coveres no acess to undefined property', function () {
            var v0 = sys.acess(dict, 'uid')
        })
    })
})
