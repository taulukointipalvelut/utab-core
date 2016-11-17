"use strict";
require('./src/utils.js')

var operations = require('./src/operations.js')
var controller = require('./src/controller.js')

class Main {
    constructor (name) {
        var con = new controller.CON(name)
        var op = new operations.OP()

        this.teams = con.teams
        this.teams.results.summarize = () => con.teams.results.read().then(op.teams.results.summarize)
        this.teams.results.compile = () => con.teams.results.read().then(op.teams.results.compile)
        this.adjudicators = con.adjudicators
        this.adjudicators.results.summarize = () => con.adjudicators.results.read().then(op.adjudicators.results.summarize)
        this.adjudicators.results.compile = () => con.adjudicators.results.read().then(op.adjudicators.results.compile)
        this.rounds = con.rounds
        this.venues = con.venues
        this.debaters = con.debaters
        this.debaters.results.summarize = () => con.debaters.results.read().then(op.debaters.results.summarize)
        this.debaters.results.compile = () => con.debaters.results.read().then(op.debaters.results.compile)
        this.institutions = con.institutions
        this.allocations = op.allocations //////////////////////////
    }
}

exports.Main = Main

var t = new Main( "test")
//console.log(t)

t.rounds.configure({total_round_num: 4})
t.teams.create({id: 1, institution_ids: [0]})
t.teams.create({id: 2, institution_ids: [0]})
t.teams.create({id: 3, institution_ids: [1]})
t.teams.create({id: 4, institution_ids: [1]})
t.adjudicators.create({id: 1, institution_ids: [0], conflicts: [1]})
t.adjudicators.create({id: 2, institution_ids: [2], conflicts: [3]})
t.venues.create({id: 1, priority: 1})
t.venues.create({id: 2, priority: 1})
console.log(t.teams.read({id: 1, institution_ids: [0, 1]}))
console.log(t.teams.read())
console.log(t.adjudicators.read({institution_ids: [0, 1]}))
console.log(t.allocations.read())
//console.log(t.teams.delete(1))
//console.log(t.teams.read)
