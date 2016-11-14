require('./src/utils.js')
var core = require('./src/core.js')
var results = require('./src/results.js')

function tournament_handler (name, total_round_num) {
    var obj = {}
    var tn = new core.Tournament(name, total_round_num)
    //obj.tournament = tn
    obj.teams = {
        get: tn.get_teams.bind(tn),
        add: tn.set_team.bind(tn),
        remove: tn.remove_team.bind(tn),
        update: tn.update_team.bind(tn)
    }
    obj.adjudicators = {
        get: tn.get_adjudicators.bind(tn),
        add: tn.set_adjudicator.bind(tn),
        remove: tn.remove_adjudicator.bind(tn),
        update: tn.update_team.bind(tn)
    }
    obj.venues = {
        get: tn.get_venues.bind(tn),
        add: tn.set_venue.bind(tn),
        remove: tn.remove_venue.bind(tn),
        update: tn.update_venue.bind(tn)
    }
    obj.allocations = {
        get: function () {
            var round = tn.get_current_round.call(tn)
            //console.log(Array.prototype.slice.call(arguments))
            return round.get_allocation.apply(round, Array.prototype.slice.call(arguments))
        },
        check: () => null,
        set: function (allocation) {
            var round = tn.get_current_round.call(tn)
            round.set_allocation(allocation)
        }
    }
    obj.results = {
        teams: {
            set: () => null,
            get: () => null
        },
        adjudicators: {
            set: () => null,
            get: () => null
        }
    }

    return obj
}

exports.tournament_handler = tournament_handler

/*
var t = tournament_handler("test", 4)
//console.log(t)

t.teams.add({id: 1, institution_ids: [0]})
t.teams.add({id: 2, institution_ids: [0]})
t.teams.add({id: 3, institution_ids: [1]})
t.teams.add({id: 4, institution_ids: [1]})
t.adjudicators.add({id: 1, institution_ids: [0]})
t.adjudicators.add({id: 2, institution_ids: [2]})
t.venues.add({id: 1, priority: 1})
t.venues.add({id: 2, priority: 1})
console.log(t.teams.get({id: 1, institution_ids: [0, 1]}))
console.log(t.teams.get())
console.log(t.adjudicators.get({institution_ids: [0, 1]}))
console.log(t.allocations.get())
//console.log(t.teams.remove(1))
//console.log(t.teams.get)
*/
