"use strict";
require('./src/utils.js')
var operations = require('./src/operation.js')
var controller = require('./src/controller2.js')
var detabase = require('./src/database/database.js')

class Main {
    constructor (total_round_num, name) {
        var con = new controller.CON(name)
        var op = new operations.OP(con)
        this.info = {
            get: function (callback) {
                callback(null, {total_round_num: total_round_num, name: name})
            },
            set: undefined
        }
        //obj.tournament = op
        this.teams = con.teams
        this.adjudicators = con.adjudicators
        this.rounds = con.rounds
        this.rounds.check = undefined
        this.rounds.summarize = undefined
        this.venues = con.venues
        this.debaters = con.debaters
        this.institutions = con.institutions
        this.allocations = {
            read: function () {
                //console.log(Array.prototype.slice.call(arguments))
                //return round.read_allocation.apply(round, Array.prototype.slice.call(arguments))
                return op.rounds.allocations.read.bind(op)
            },
            check: function (allocation) {
                return op.rounds.allocations.check.call(op, allocation)
            },
            create: function (allocation) {
                return op.rounds.allocations.create.call(op, allocation)
            }
        }
    }
}

exports.Main = Main

var t = new Main(4, "test")
//console.log(t)

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
