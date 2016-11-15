"use strict";
require('./src/utils.js')
var operations = require('./src/operation.js')
var controller = require('./src/controller.js')
var detabase = require('./src/database.js')

class Main {
    constructor (total_round_num, name) {
        var db = new detabase.DB(total_round_num, name)
        var con = new controller.CON(db)
        var op = new operations.OP(con)
        this.get_info = function () {
            return {total_round_num: total_round_num, name: name}
        }
        //obj.tournament = op
        this.teams = {
            get: con.get_teams.bind(con),
            add: con.set_team.bind(con),
            remove: con.remove_team.bind(con),
            update: con.update_team.bind(con),
            search: con.search_teams.bind(con),
            debaters: {
                get: con.get_debaters_by_team.bind(con),//con.get_team_to_debater.bind(con),
                set: con.set_debaters_by_team.bind(con),
                update: con.update_debaters_by_team.bind(con)
            },
            institutions: {
                get: con.get_institutions_by_team.bind(con),//con.get_team_to_debater.bind(con),
                set: con.set_institutions_by_team.bind(con),
                update: con.update_institutions_by_team.bind(con)
            },
            results: {
                get: function () {
                    if (arguments.length === 0) {
                        return con.total_teams_results.apply(con)
                    } else {
                        return con.summarize_teams_results.apply(con, {r: arguments[0]})
                    }
                },
                pool: con.set_team_result.bind(con),
                update: con.update_team_result.bind(con),
                search: con.search_raw_team_result.bind(con),
                delete: con.delete_raw_team_result.bind(con)
            }
        }
        this.adjudicators = {
            get: con.get_adjudicators.bind(con),
            add: con.set_adjudicator.bind(con),
            remove: con.remove_adjudicator.bind(con),
            update: con.update_team.bind(con),
            search: con.search_adjudicators.bind(con),
            institutions: {
                get: con.get_institutions_by_adjudicator.bind(con),//con.get_team_to_debater.bind(con),
                set: con.set_institutions_by_adjudicator.bind(con),
                update: con.update_institutions_by_adjudicator.bind(con)
            },
            results: {
                get: function () {
                    if (arguments.length === 0) {
                        return con.total_adjudicator_results.apply(con)
                    } else {
                        return con.summarize_adjudicator_results.apply(con, {r: arguments[0]})
                    }
                },
                pool: con.set_adjudicator_result.bind(con),
                update: con.update_adjudicator_result.bind(con),
                search: con.search_raw_adjudicator_result.bind(con),
                delete: con.delete_raw_adjudicator_result.bind(con)
            }
        }
        this.rounds = {
            next: function (force=false) {
                if (force === false) {
                    con.check_results.call(con)
                    con.check_adjudicator_results.call(con)
                }
                var round = op.get_current_round.call(op)
                var team_results = con.summarize_teams_results.call(con, {r: op.con.current_round_num})
                var adjudicator_results = con.summarize_adjudicator_results.call(con, {r: op.con.current_round_num})
                round.process_results.call(round, team_results)
                round.process_adjudicator_results.call(round, adjudicator_results)
                con.proceed_round.call(con)
            }
        }
        this.venues = {
            get: con.get_venues.bind(con),
            add: con.set_venue.bind(con),
            remove: con.remove_venue.bind(con),
            update: con.update_venue.bind(con),
            search: con.search_venues.bind(con)
        }
        this.debaters = {
            get: con.get_debaters.bind(con),
            add: con.set_debater.bind(con),
            remove: con.remove_debater.bind(con),
            update: con.update_debater.bind(con),
            search: con.search_debaters.bind(con),
            results: {
                get: function () {
                    if (arguments.length === 0) {
                        return con.total_debater_results.apply(con)
                    } else {
                        return con.summarize_debater_results.apply(con, {r: arguments[0]})
                    }
                },
                pool: con.set_debater_result.bind(con),
                update: con.update_debater_result.bind(con),
                search: con.search_raw_debater_result.bind(con),
                delete: con.delete_raw_debater_result.bind(con)
            }
        }
        this.institutions = {
            get: con.get_institutions.bind(con),
            add: con.set_institution.bind(con),
            remove: con.remove_institution.bind(con),
            update: con.update_institution.bind(con),
            search: con.search_institutions.bind(con)
        }
        this.allocations = {
            get: function () {
                var round = op.get_current_round.call(op)
                //console.log(Array.prototype.slice.call(arguments))
                //return round.get_allocation.apply(round, Array.prototype.slice.call(arguments))
                return round.get_allocation.apply(round, arguments)
            },
            check: function (allocation) {
                var round = op.get_current_round.call(op)
                round.check_allocation(allocation)
            },
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
t.adjudicators.add({id: 1, institution_ids: [0], conflicts: [1]})
t.adjudicators.add({id: 2, institution_ids: [2], conflicts: [3]})
t.venues.add({id: 1, priority: 1})
t.venues.add({id: 2, priority: 1})
console.log(t.teams.get({id: 1, institution_ids: [0, 1]}))
console.log(t.teams.get())
console.log(t.adjudicators.get({institution_ids: [0, 1]}))
console.log(t.allocations.get())
//console.log(t.teams.remove(1))
//console.log(t.teams.get)
