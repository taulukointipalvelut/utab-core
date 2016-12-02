"use strict";

var loggers = require('./general/loggers.js')
var errors = require('./general/errors.js')
var handlers = require('./controllers/handlers.js')
var _ = require('underscore/underscore.js')

class CON {
    constructor(db_url, options) {
        this.dbh = new handlers.DBHandler(db_url, options)

        var con = this

        this.allocations = {
            read: function () {
                return con.dbh.allocations.read.call(con.dbh.allocations)
            },
            create: function (dict) {
                return con.dbh.allocations.create.call(con.dbh.allocations, dict)
            },
            delete: function (dict) {
                return con.dbh.allocations.delete.call(con.dbh.allocations, dict)
            },
            find: function(dict) {
                return con.dbh.allocations.find.call(con.dbh.allocations, dict)
            },
            update: function(dict) {
                return con.dbh.allocations.update.call(con.dbh.allocations, dict)
            }
        }
        this.config = {
            read: function() {//TESTED//
                return con.dbh.round_info.read.call(con.dbh.round_info)
            },
            proceed: function () {
                loggers.controllers('config.proceed is called')

                return Promise.all([con.dbh.round_info.read(), con.dbh.teams.read()]).then(function(vs) {
                    var [round_info, teams] = vs
                    var current_round_num = round_info.current_round_num
                    var total_round_num = round_info.total_round_num
                    if (total_round_num === current_round_num) {
                        loggers.controllers('error', 'All rounds finished @ config.proceed')
                        throw new errors.AllRoundsFinished()
                    }
                    return Promise.all(teams.map(function(team) {
                        con.teams.debaters.findOne({id: team.id, r: current_round_num})
                        .then(function (teams_to_debaters) {
                            var debaters = teams_to_debaters.debaters
                            con.teams.debaters.create({id: team.id, r: current_round_num+1, debaters: debaters}).catch(function(err) {})
                        })
                    }))
                    .then(function () {
                        round_info.current_round_num += 1
                        return con.dbh.round_info.update(round_info)
                    })
                })
            },
            rollback: function () {
                loggers.controllers('config.rollback is called')

                return Promise.all([con.dbh.round_info.read()]).then(function(vs) {
                    var [round_info] = vs
                    if (round_info.current_round_num === 1) {
                        loggers.controllers('error', 'Cannot rollback more @ config.proceed')
                        throw new errors.NoRollBack()
                    }
                    round_info.current_round_num -= 1
                    return con.dbh.round_info.update(round_info)
                })
            },
            update: function(dict) {//set styles//TESTED//
                loggers.controllers('config.update is called')
                loggers.controllers('debug', 'arguments are: '+JSON.stringify(arguments))

                return con.dbh.round_info.update(dict)
            }/*,
            extend: function(dict) {//set styles//TESTED//
                loggers.controllers('config.extend is called')

                return Promise.all([con.dbh.round_info.read()]).then(function(vs) {
                    var [round_info] = vs
                    round_info.total_round_num -= 1
                    return con.dbh.round_info.update(round_info)
                })
            }*/
        }
        this.teams = {
            read: function () {
                return con.dbh.teams.read.call(con.dbh.teams)
            },
            create: function (dict, force=false) {
                return con.dbh.teams.create.call(con.dbh.teams, dict, force)
            },
            delete: function (dict) {
                return con.dbh.teams.delete.call(con.dbh.teams, dict)
            },
            find: function(dict) {
                return con.dbh.teams.find.call(con.dbh.teams, dict)
            },
            findOne: function(dict) {
                return con.dbh.teams.findOne.call(con.dbh.teams, dict)
            },
            update: function(dict) {
                return con.dbh.teams.update.call(con.dbh.teams, dict)
            },
            debaters: {//TESTED//
                read: function () {
                    return con.dbh.teams_to_debaters.read.call(con.dbh.teams_to_debaters)
                },
                find: function (dict) {
                    return con.dbh.teams_to_debaters.find.call(con.dbh.teams_to_debaters, dict)
                },
                findOne: function (dict) {
                    return con.dbh.teams_to_debaters.findOne.call(con.dbh.teams_to_debaters, dict)
                },
                update: function (dict) {
                    return con.dbh.teams_to_debaters.update.call(con.dbh.teams_to_debaters, dict)
                },
                create: function (dict) {
                    return con.dbh.teams_to_debaters.create.call(con.dbh.teams_to_debaters, dict)
                },
                findOne: function(dict) {
                    return con.dbh.teams_to_debaters.findOne.call(con.dbh.teams_to_debaters, dict)
                }
            },
            institutions: {
                read: function () {//TESTED//
                    return con.dbh.teams_to_institutions.read.call(con.dbh.teams_to_institutions)/*.then(function (dicts) {
                        var new_dict = {}
                        for (var dict of dicts) {
                            new_dict[dict.id] = dict.institutions
                        }
                        return new_dict
                    })*/
                },
                find: function (dict) {//TESTED//
                    return con.dbh.teams_to_institutions.find.call(con.dbh.teams_to_institutions, dict)
                },
                findOne: function (dict) {//TESTED//
                    return con.dbh.teams_to_institutions.findOne.call(con.dbh.teams_to_institutions, dict)
                },
                update: function (dict) {//TESTED//
                    return con.dbh.teams_to_institutions.update.call(con.dbh.teams_to_institutions, dict, {new: true})
                },
                create: function (dict) {
                    return con.dbh.teams_to_institutions.create.call(con.dbh.teams_to_institutions, dict)
                }
            },
            results: {
                read: function () {
                    return con.dbh.raw_team_results.read.call(con.dbh.raw_team_results)
                },
                create: function (dict) {
                    return con.dbh.raw_team_results.create.call(con.dbh.raw_team_results, dict)
                },
                update: function (dict) {
                    return con.dbh.raw_team_results.update.call(con.dbh.raw_team_results, dict)
                },
                delete: function (dict) {
                    return con.dbh.raw_team_results.delete.call(con.dbh.raw_team_results, dict)
                },
                find: function (dict) {
                    return con.dbh.raw_team_results.find.call(con.dbh.raw_team_results, dict)
                },
                findOne: function (dict) {
                    return con.dbh.raw_team_results.findOne.call(con.dbh.raw_team_results, dict)
                }
            }
        }
        this.adjudicators = {
            read: function () {
                return con.dbh.adjudicators.read.call(con.dbh.adjudicators)
            },
            create: function (dict, force=false) {
                return con.dbh.adjudicators.create.call(con.dbh.adjudicators, dict, force)
            },
            delete: function (dict) {
                return con.dbh.adjudicators.delete.call(con.dbh.adjudicators, dict)
            },
            update: function (dict) {
                return con.dbh.adjudicators.update.call(con.dbh.adjudicators, dict)
            },
            find: function(dict) {
                return con.dbh.adjudicators.find.call(con.dbh.adjudicators, dict)
            },
            findOne: function(dict) {
                return con.dbh.adjudicators.findOne.call(con.dbh.adjudicators, dict)
            },
            conflicts: {
                read: function () {//TESTED//
                    return con.dbh.adjudicators_to_conflicts.read.call(con.dbh.adjudicators_to_conflicts)
                },
                find: function (dict) {//TESTED//
                    return con.dbh.adjudicators_to_conflicts.find.call(con.dbh.adjudicators_to_conflicts, dict)
                },
                findOne: function (dict) {//TESTED//
                    return con.dbh.adjudicators_to_conflicts.findOne.call(con.dbh.adjudicators_to_conflicts, dict)
                },
                update: function (dict) {//TESTED//
                    return con.dbh.adjudicators_to_conflicts.update.call(con.dbh.adjudicators_to_conflicts, dict, {new: true})
                },
                create: function (dict) {//TESTED//
                    return con.dbh.adjudicators_to_conflicts.create.call(con.dbh.adjudicators_to_conflicts, dict)
                }
            },
            institutions: {
                read: function () {//TESTED//
                    return con.dbh.adjudicators_to_institutions.read.call(con.dbh.adjudicators_to_institutions)
                },
                find: function (dict) {//TESTED//
                    return con.dbh.adjudicators_to_institutions.find.call(con.dbh.adjudicators_to_institutions, dict)
                },
                findOne: function (dict) {//TESTED//
                    return con.dbh.adjudicators_to_institutions.findOne.call(con.dbh.adjudicators_to_institutions, dict)
                },
                update: function (dict) {//TESTED//
                    return con.dbh.adjudicators_to_institutions.update.call(con.dbh.adjudicators_to_institutions, dict, {new: true})
                },
                create: function (dict) {//TESTED//
                    return con.dbh.adjudicators_to_institutions.create.call(con.dbh.adjudicators_to_institutions, dict)
                }
            },
            results: {
                read: function () {
                    return con.dbh.raw_adjudicator_results.read.call(con.dbh.raw_adjudicator_results)
                },
                create: function (dict) {
                    return con.dbh.raw_adjudicator_results.create.call(con.dbh.raw_adjudicator_results, dict)
                },
                update: function (dict) {
                    return con.dbh.raw_adjudicator_results.update.call(con.dbh.raw_adjudicator_results, dict)
                },
                delete: function (dict) {
                    return con.dbh.raw_adjudicator_results.delete.call(con.dbh.raw_adjudicator_results, dict)
                },
                find: function (dict) {
                    return con.dbh.raw_adjudicator_results.find.call(con.dbh.raw_adjudicator_results, dict)
                },
                findOne: function (dict) {
                    return con.dbh.raw_adjudicator_results.findOne.call(con.dbh.raw_adjudicator_results, dict)
                }
            }
        }
        this.venues = {
            read: function () {
                return con.dbh.venues.read.call(con.dbh.venues)
            },
            create: function (dict, force=false) {
                return con.dbh.venues.create.call(con.dbh.venues, dict, force)
            },
            delete: function (dict) {
                return con.dbh.venues.delete.call(con.dbh.venues, dict)
            },
            find: function (dict) {
                return con.dbh.venues.find.call(con.dbh.venues, dict)
            },
            findOne: function (dict) {
                return con.dbh.venues.findOne.call(con.dbh.venues, dict)
            },
            update: function (dict) {
                return con.dbh.venues.update.call(con.dbh.venues, dict)
            }
        }
        this.debaters = {
            read: function () {
                return con.dbh.debaters.read.call(con.dbh.debaters)
            },
            create: function (dict, force=false) {
                return con.dbh.debaters.create.call(con.dbh.debaters, dict, force)
            },
            delete: function (dict) {
                return con.dbh.debaters.delete.call(con.dbh.debaters, dict)
            },
            update: function (dict) {
                return con.dbh.debaters.update.call(con.dbh.debaters, dict)
            },
            find: function (dict) {
                return con.dbh.debaters.find.call(con.dbh.debaters, dict)
            },
            findOne: function (dict) {
                return con.dbh.debaters.findOne.call(con.dbh.debaters, dict)
            },
            results: {
                read: function () {
                    return con.dbh.raw_debater_results.read.call(con.dbh.raw_debater_results)
                },
                create: function (dict) {
                    return con.dbh.raw_debater_results.create.call(con.dbh.raw_debater_results, dict)
                },
                update: function (dict) {
                    return con.dbh.raw_debater_results.update.call(con.dbh.raw_debater_results, dict)
                },
                delete: function (dict) {
                    return con.dbh.raw_debater_results.delete.call(con.dbh.raw_debater_results, dict)
                },
                find: function (dict) {
                    return con.dbh.raw_debater_results.find.call(con.dbh.raw_debater_results, dict)
                }
            }
        }
        this.institutions = {
            read: function () {
                return con.dbh.institutions.read.call(con.dbh.institutions)
            },
            create: function (dict, force=false) {
                return con.dbh.institutions.create.call(con.dbh.institutions, dict, force)
            },
            delete: function (dict) {
                return con.dbh.institutions.delete.call(con.dbh.institutions, dict)
            },
            find: function (dict) {
                return con.dbh.institutions.find.call(con.dbh.institutions, dict)
            },
            findOne: function (dict) {
                return con.dbh.institutions.findOne.call(con.dbh.institutions, dict)
            },
            update: function (dict) {
                return con.dbh.institutions.update.call(con.dbh.institutions, dict)
            }
        }
        this.close = con.dbh.close.bind(con.dbh)
    }
}

exports.CON = CON

//Tests
function test(n = 4) {
    var tid = 324213111111111111
    var con = new CON()
    //con.tournaments.create({id: tid})
    //con.tournaments.read().then(console.log)
    con.connect(tid)
    //con.tournaments.findOne({id: con.id}).then(console.log)
    con.config.read().then(console.log).catch(console.error())
    con.config.update({id: tid, name: "testtournament"}).then(console.log)
    con.config.proceed().then(console.log)
    //con.dbh.teams.read((e, v) => console.log(v))
    var show = (e, v) => console.log("error: "+e+",\nvalue: "+v)
    var print = (v) => console.log(v)

    /*
    for (var i = 0; i < n; i++) {
        con.teams.create({id: i, institutions: [i%3]}).then(print).catch(print)
        if (i % 2 === 0) {
            con.adjudicators.create({id: i/2, institutions: [(i/2)%4]}).then(print).catch(print)
            con.venues.create({id: i/2}).then(print).catch(print)
        }
    }
    */

    //con.config.read().then(print).catch(console.error)
    //con.config.configure({id: 2, name: 'NA2'}).then(print).catch(print)
    //con.teams.read().then(print)
    //con.teams.results.create({id: 3, from_id: 3, r: 1, side: "gov", win: 1, opponents: [2, 3, 4]}).then(print)
    //con.config.configure({id: tid, total_round_num: 500, current_round_num: 1}).then(print)
    //con.config.read().then(print)
    //con.config.proceed().then(print).catch(print)
    //con.teams.debaters.find({id: 0}).then(print).catch(print)
    //con.config.read().then(print)
    //con.config.configure({id: tid, total_round_num: 500, current_round_num: 1}).then(print)

    //con.teams.read().then(function (docs) {
    //    //for (var doc of docs) {
    //    Promise.all(docs.map(d => con.teams.debaters.find({id: d.id}).then(v=>console.log(d.id, v, "hi"))))
    //    //}
    //})

    //con.teams.debaters.find({id: 1}).then(print).catch(print)
    //con.teams.debaters.create({id: 1, r: 2, debaters: [3, 4]}).then(print).catch(print)
    //con.teams.debaters.update({id: 3, r: 1, debaters: [5, 3, 3]}).then(print).catch(print)
    //con.teams.create({id: 1}).then(print).catch(print)

    //con.teams.create({id: 1}).then(print).catch(print)
    //con.teams.debaters.find({id: 1}).then(print)
    //con.teams.debaters.update({id: 1, r: 1, debaters: [1, 2, 3]}).then(print).catch(print)
    //con.teams.debaters.delete({id: 1, r: 1}).then(print).catch(print)
    //con.config.read().then(print)
    //con.teams.debaters.find({id: 0})


    /*
    con.config.read().then(print).catch(print)
    con.config.proceed().then(v=>con.teams.debaters.find({id: 0})).then(print).catch(print)
    */
    //con.teams.debaters.find({id: 0}).then(print).catch(print)
    //con.config.read().then(print)
    //con.teams.institutions.update({id: 1, institutions: [4, 6, 7]}).then(print).catch(print)
    //con.teams.institutions.find({id: 1})
    //con.teams.delete({id: 1}).then(print)
    //con.teams.institutions.find({id: 1}).then(print).catch(print)
    //con.teams.institutions.find({id: 3}).then(print)
    //con.teams.debaters.update({id: 1, r: 1, debaters: [2, 6]}).then(() => con.teams.debaters.find({id: 1}).then(print))
    //con.teams.find({id: 1}, show)
    //con.teams.institutions.update({id: 0, institutions: [3, 8, 5]}).then(show)
    //con.adjudicators.institutions.update({id: 0, institutions: [3, 6, 8, 8, 0, 0]}).then(print).catch(print)
    //con.adjudicators.conflicts.update({id: 0, conflicts: [3, 6, 9, 8, 0, 0]}).then(print).catch(print)
    //con.adjudicators.institutions.find({id: 1}, show)
    //con.teams.institutions.find({id: 1}, show)
    //con.teams.delete({id: 2}).then(print).catch(print)
    setTimeout(con.close, 10000)
}

//test()

//var con = new CON()
//con.connect(1112)
//con.tournaments.read().then(console.log).then(con.tournaments.create({id: 2})).then(console.log)
//con.teams.create({id: 32432423}).then(con.teams.read()).then(console.log)
//con.teams.create({id: 314234}).then(con.teams.read()).then(console.log).catch(console.error)
