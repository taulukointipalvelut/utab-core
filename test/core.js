var assert = require('assert')
var expect = require('chai/chai.js').expect
var core = require('../core.js')

var wrap = x => x.then(console.log).catch(console.error)

describe('core', function() {
    core.connect(Date.now())
    describe('teams', function() {
        describe('read', function () {
            it('reads teams', function () {
                core.teams.read().then(docs => expect(docs).to.deep.equal([]))
            })
        })
        describe('create', function () {
            it('creates a team', function () {
                wrap(core.teams.create({id: 4}))
            })
        })
    })
    core.close()
})
