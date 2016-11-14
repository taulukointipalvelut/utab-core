require('./src/utils.js')
var operation = require('./src/operation.js')
var results = require('./src/results.js')
var detabase = require('./src/database.js')

class Main {
    constructor (total_round_num, name) {
        var db = new detabase.DB(total_round_num, name)
        var op = new operation.OP(db)
        var res = new results.Results(total_round_num, db)
        //obj.tournament = op
        this.teams = {
            get: db.get_teams.bind(db),
            add: db.set_team.bind(db),
            remove: db.remove_team.bind(db),
            update: db.update_team.bind(db),
            debaters: {
                get: db.get_debaters_by_team.bind(db),//db.get_team_to_debater.bind(db),
                set: db.set_debaters_by_team.bind(db),
                update: db.update_debaters_by_team.bind(db)
            },
            institutions: {
                get: db.get_institutions_by_team.bind(db),//db.get_team_to_debater.bind(db),
                set: db.set_institutions_by_team.bind(db),
                update: db.update_institutions_by_team.bind(db)
            },
            results: {
                get: function () {
                    if (arguments.length === 0) {
                        return res.total_teams_results.apply(res)
                    } else {
                        return res.summarize_teams_results.apply(res, arguments)
                    }
                },
                pool: res.set_team_result.bind(res),
                update: res.update_team_result.bind(res)
            }
        }
        this.adjudicators = {
            get: db.get_adjudicators.bind(db),
            add: db.set_adjudicator.bind(db),
            remove: db.remove_adjudicator.bind(db),
            update: db.update_team.bind(db),
            institutions: {
                get: db.get_institutions_by_adjudicator.bind(db),//db.get_team_to_debater.bind(db),
                set: db.set_institutions_by_adjudicator.bind(db),
                update: db.update_institutions_by_adjudicator.bind(db)
            },
            results: {
                get: function () {
                    if (arguments.length === 0) {
                        return res.total_adjudicator_results.apply(res)
                    } else {
                        return res.summarize_adjudicator_results.apply(res, arguments)
                    }
                },
                pool: res.set_adjudicator_result.bind(res),
                update: res.update_adjudicator_result.bind(res)
            }
        }
        this.rounds = {
            next: function (force=false) {
                if (force === true) {
                    /////////////////////////////////////////////////
                }
                var round = op.get_current_round.call(op)
                var team_results = res.summarize_teams_results.call(res, op.db.current_round_num)
                var adjudicator_results = res.summarize_adjudicator_results.call(res, op.db.current_round_num)
                round.process_results.call(round, team_results)
                round.process_adjudicator_results.call(round, adjudicator_results)
                db.proceed_round.call(db)
            }
        }
        this.venues = {
            get: db.get_venues.bind(db),
            add: db.set_venue.bind(db),
            remove: db.remove_venue.bind(db),
            update: db.update_venue.bind(db)
        }
        this.debaters = {
            get: db.get_debaters.bind(db),
            add: db.set_debater.bind(db),
            remove: db.remove_debater.bind(db),
            update: db.update_debater.bind(db),
            results: {
                get: function () {
                    if (arguments.length === 0) {
                        return res.total_debater_results.apply(res)
                    } else {
                        return res.summarize_debater_results.apply(res, arguments)
                    }
                },
                pool: res.set_debater_result.bind(db),
                update: res.update_debater_result.bind(db)
            }
        }
        this.institutions = {
            get: db.get_institutions.bind(db),
            add: db.set_institution.bind(db),
            remove: db.remove_institution.bind(db),
            update: db.update_institution.bind(db)
        }
        this.allocations = {
            get: function () {
                var round = op.get_current_round.call(op)
                //console.log(Array.prototype.slice.call(arguments))
                return round.get_allocation.apply(round, Array.prototype.slice.call(arguments))
            },
            check: () => null,
            set: function (allocation) {
                var round = op.get_current_round.call(op)
                round.set_allocation(allocation)
            }
        }
    }
}

exports.Main = Main


var t = new Main(4, "test")
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
