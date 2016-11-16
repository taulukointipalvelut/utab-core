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
            read: db.teams.read.bind(db),
            create: db.teams.create.bind(db),
            delete: db.teams.delete.bind(db),
            search: db.teams.search.bind(db),
            update: db.teams.update.bind(db),
            debaters: {
                read: db.team_to_debaters.read.bind(db),//con.read_team_to_debater.bind(db),
                create: db.team_to_debaters.create.bind(db),
                update: db.team_to_debaters.update.bind(db)
            },
            institutions: {
                read: db.team_to_institutions.read.bind(db),//con.read_team_to_debater.bind(db),
                create: db.team_to_institutions.create.bind(db),
                update: db.team_to_institutions.update.bind(db)
            },
            results: {
                read: function () {
                    if (arguments.length === 0) {
                        return db.team_results.apply(db)
                    } else {
                        return db.team_results.apply(db, {r: arguments[0]})
                    }
                },
                create: db.team_results.create.bind(db),
                update: db.team_results.update.bind(db),
                search: db.team_results.search.bind(db),
                delete: db.team_results.delete.bind(db)
            }
        }
        this.adjudicators = {
            read: db.adjudicators.read.bind(db),
            create: db.adjudicators.create.bind(db),
            delete: db.adjudicators.delete.bind(db),
            update: db.adjudicators.update.bind(db),
            search: db.adjudicators.search.bind(db),
            conflicts: {
                read: undefined,
                create: undefined,
                update: undefined
            },
            institutions: {
                read: db.adjudicator_to_institutions.read.bind(db),//con.read_team_to_debater.bind(db),
                create: db.adjudicator_to_institutions.create.bind(db),
                update: db.adjudicator_to_institutions.update.bind(db)
            },
            results: {
                read: db.adjudicator_results.read.bind(db),
                create: db.adjudicator_results.create.bind(db),
                update: db.adjudicator_results.update.bind(db),
                search: db.adjudicator_results.search.bind(db),
                delete: db.adjudicator_results.delete.bind(db)
            }
        }
        this.rounds = {
            proceed: undefined,
            configure: undefined
        }
        this.venues = {
            read: db.venues.read.bind(db),
            create: db.venues.create.bind(db),
            delete: db.venues.delete.bind(db),
            search: db.venues.search.bind(db),
            update: db.venues.update.bind(db)
        }
        this.debaters = {
            read: db.debaters.bind(db),
            create: db.debaters.create.bind(db),
            delete: db.debaters.delete.bind(db),
            update: db.debaters.update.bind(db),
            search: db.debaters.search.bind(db),
            results: {
                read: db.debater_results.read.bind(db),
                create: db.debater_results.create.bind(db),
                update: db.debater_results.update.bind(db),
                delete: db.debater_results.delete.bind(db)
            }
        }
        this.institutions = {
            read: db.institutions.bind(db),
            create: db.institutions.create.bind(db),
            delete: db.institutions.delete.bind(db),
            search: db.institutions.search.bind(db),
            update: db.institutions.update.bind(db)
        }
    }
}
