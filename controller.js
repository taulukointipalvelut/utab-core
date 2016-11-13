var core = require('./src/core.js')

function tournament_handler (name, total_round_num) {
    var obj = {}
    var tn = new core.Tournament(name, total_round_num)
    //obj.tournament = tn
    obj.teams = {
        list: tn.get_teams.bind(tn),
        add: tn.set_team.bind(tn),
        remove: tn.remove_team.bind(tn),
        update: tn.update_team.bind(tn)
    }
    obj.adjudicators = {
        list: tn.get_adjudicators.bind(tn),
        add: tn.set_adjudicator.bind(tn),
        remove: tn.remove_adjudicator.bind(tn),
        update: tn.update_team.bind(tn)
    }
    obj.allocations = {
        get: function () {
            var round = tn.get_current_round.call(tn)
            console.log(Array.prototype.slice.call(arguments))
            return round.get_allocation.apply(round, Array.prototype.slice.call(arguments))
        },
        check: () => null,
        set: function (allocation) {
            var round = tn.get_current_round.call(tn)
            round.set_allocation(allocation)
        }
    }
    obj.results = {
        set_results: () => null,
        set_adjudicator_results: () => null,
        get: () => null
    }
    obj.venues = {
        list: tn.get_venues.bind(tn),
        add: tn.set_venue.bind(tn),
        remove: tn.remove_venue.bind(tn),
        update: tn.update_venue.bind(tn)
    }
    return obj
}

exports.tournament_handler = tournament_handler

var t = tournament_handler("test", 4)
console.log(t)

t.teams.add({id: 1, institution_ids: [0, 1]})
console.log(t.teams.list())
