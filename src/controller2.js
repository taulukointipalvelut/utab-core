"use strict";

//var _ = require('underscore/underscore.js')
//var tools = require('./tools/tools.js')
//var entities = require('./controller/entities.js')
//var cu = require('./controller/controllerutils.js')
var keys = require('./tools/keys.js')
var database = require('./database/database.js')

class CON {
    constructor(id) {
        var db_handler = database.DBHandler(id)
        var con = this

        this.teams = {
            get: con.get_teams.bind(con),
            add: con.set_team.bind(con),
            remove: con.remove_team.bind(con),
            update: con.update_team.bind(con),
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
            next: con.proceed_round.call(con)
        }
        this.venues = {
            get: con.get_venues.bind(con),
            add: con.set_venue.bind(con),
            remove: con.remove_venue.bind(con),
            update: con.update_venue.bind(con),
        }
        this.debaters = {
            get: con.get_debaters.bind(con),
            add: con.set_debater.bind(con),
            remove: con.remove_debater.bind(con),
            update: con.update_debater.bind(con),
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
            update: con.update_institution.bind(con)
        }
    }
}
