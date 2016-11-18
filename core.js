"use strict";

var operations = require('./src/operations.js')
var controller = require('./src/controller.js')
var _ = require('underscore/underscore.js')

class Main {
    constructor (name) {
        var con = new controller.CON(name)
        var op = new operations.OP()

        var core = this

        this.teams = con.teams
        this.teams.results.organize = function(r_or_rs, {simple: simple=false}) {
            if (simple) {
                if (Array.isArray(r_or_rs)) {
                    return Promise.all([con.teams.read, con.teams.results.read]).then(function (vs) {
                        var [teams, raw_team_results] = vs
                        return res.teams.simplified_results.compile(teams, raw_team_results, r_or_rs)
                    })
                } else {
                    return Promise.all([con.teams.read, con.teams.results.read]).then(function (vs) {
                        var [teams, raw_team_results] = vs
                        return res.teams.simplified_results.summarize(teams, raw_team_results, r_or_rs)
                    })
                }
            } else {
                if (Array.isArray(r_or_rs)) {
                    return Promise.all([con.teams.read, con.teams.debaters.read, con.teams.debaters.read, con.teams.results.read, con.debaters.results.read, con.rounds.styles.read]).then(function (vs) {
                        var [teams, debaters, teams_to_debaters, raw_team_results, raw_debater_results, style] = vs
                        return res.teams.results.compile(teams, debaters, teams_to_debaters, raw_team_results, raw_debater_results, style, r_or_rs)
                    })
                } else {
                    return Promise.all([con.teams.read, con.teams.debaters.read, con.teams.debaters.read, con.teams.results.read, con.debaters.results.read, con.rounds.styles.read]).then(function (vs) {
                        var [teams, debaters, teams_to_debaters, raw_team_results, raw_debater_results, style] = vs
                        return res.teams.results.summarize(teams, debaters, teams_to_debaters, raw_team_results, raw_debater_results, style, r_or_rs)
                    })
                }
            }
        }

        this.adjudicators = con.adjudicators
        this.adjudicators.results.organize = function(r_or_rs) {
            if (Array.isArray(r_or_rs)) {
                return Promise.all([con.adjudicators, con.adjudicators.results.read]).then(function(vs) {
                    var [adjudicators, raw_adjudicator_results] = vs
                    return res.adjudicators.results.compile(adjudicators, raw_adjudicator_results, r_or_rs)
                })
            } else {
                return Promise.all([con.adjudicators, con.adjudicators.results.read]).then(function(vs) {
                    var [adjudicators, raw_adjudicator_results] = vs
                    return res.adjudicators.results.summarize(adjudicators, raw_adjudicator_results, r_or_rs)
                })
            }
        }
        this.rounds = con.rounds
        this.venues = con.venues
        this.debaters = con.debaters
        this.debaters.results.organize = function(r_or_rs) {
            if (Array.isArray(r_or_rs)) {
                return Promise.all([con.debaters, con.debaters.results.read]).then(function(vs) {
                    var [debaters, raw_debater_results] = vs
                    return res.debaters.results.compile(debaters, raw_debater_results, r_or_rs)
                })
            } else {
                return Promise.all([con.debaters, con.debaters.results.read]).then(function(vs) {
                    var [debaters, raw_debater_results] = vs
                    return res.debaters.results.summarize(debaters, raw_debater_results, r_or_rs)
                })
            }
        }
        this.institutions = con.institutions
        this.rounds = con.rounds

        this.allocations = {//op.allocations
            get: function({
                    simple: simple = false,
                    with_venues: with_venues = true,
                    with_adjudicators: with_adjudicators = true,
                    filters: filter_functions_strs=['by_strength', 'by_side', 'by_past_opponent', 'by_institution'],
                    filters_adj: filter_functions_adj_strs=['by_bubble', 'by_strength', 'by_attendance'],
                    filters_adj2: filter_functions_adj2_strs=['by_conflict', 'by_institution', 'by_bubble']
                }, allocation) {
                var all_filter_functions = op.teams.functions.read()
                var all_filter_functions_adj = op.adjudicators.functions.read()
                var filter_functions = filter_functions_strs.map(f_str => all_filter_functions[f_str])
                var filter_functions_adj = filter_functions_adj_strs.map(f_str => all_filter_functions_adj[f_str])
                var filter_functions_adj2 = filter_functions_adj2_strs.map(f_str => all_filter_functions_adj[f_str])
                if (simple === true) {
                    if (allocation) {

                    } else {

                    }
                    undefined
                } else {
                    if (allocation) {
                        var new_allocation = {}
                        if (with_adjudicators) {
                            undefined
                        }
                    } else {
                        return con.rounds.read().then(function (round_info) {
                            var current_round_num = round_info['current_round_num']
                            var considering_rounds = _.range(1, current_round_num)
                            return Promise.all([con.teams.read, con.adjudicators.read, con.venues.read, () => core.teams.results.organize(considering_rounds), core.adjudicators.results.organize(considering_rounds), con.teams.institutions.read, con.adjudicators.institutions.read, con.adjudicators.conflicts.read]).then(function (vs) {
                                var [teams, adjudicators, venues, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts] = vs

                                var new_allocation = op.allocations.teams.get(teams, compiled_team_results, teams_to_institutions, filter_functions)///////
                                if (with_adjudicators) {
                                    new_allocations = op.allocations.adjudicators.get(new_allocation, teams, adjudicators, compiled_team_results, compiled_adjudicator_results, adjudicators_to_institutions, adjudicators_to_conflicts, filter_functions_adj, filter_functions_adj2)
                                }
                                if (with_venues) {
                                    new_allocations = op.allocations.venues.get(new_allocation, venues)
                                }
                                return new_allocations
                            })
                        })
                    }
                }
            },
            check: function({
                check_teams: check_teams = true,
                check_adjudicators: check_adjudicators = true,
                check_venues: check_venues = true
            }) {
                throw new Error('undefined')
            }
        }
    }
}

exports.Main = Main
/*
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
*/
