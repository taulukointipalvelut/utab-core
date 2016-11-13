var model = require('./model.js')

function tournament_handler (name, total_round_num) {
    var obj = {}
    var tn = new model.Tournament(name, total_round_num)
    obj.tournament = tn
    obj.teams = {
        list: () => tn.teams,
        add: tn.set_team.bind(tn),
        remove: tn.remove_team.bind(tn),
        update: tn.update_team.bind(tn)
    }
    obj.adjudicators = {
        //list: tn.adjudicators,
        add: tn.set_adjudicator.bind(tn),
        remove: tn.remove_adjudicator.bind(tn),
        update: tn.update_team.bind(tn)
    }
    obj.rounds = {

    }
    obj.venues = {
        //list,
        add: tn.set_venue.bind(tn),
        remove: tn.remove_venue.bind(tn),
        update: tn.update_venue.bind(tn)
    }
    return obj
}

exports.tournament_handler = tournament_handler

var t = tournament_handler()
console.log(t)

t.teams.add({id: 1, institution_ids: [0, 1]})
console.log(t.teams.list())
