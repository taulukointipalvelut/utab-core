"use strict";

//var _ = require('underscore/underscore.js')
//var tools = require('./tools/tools.js')
//var entities = require('./controller/entities.js')
//var cu = require('./controller/controllerutils.js')
//var keys = require('./tools/keys.js')
var database = require('./database/database.js')

class CON {
    constructor(url) {
        var dbh = new database.DBHandler(url)
        var con = this

        this.teams = {
            read: dbh.teams.read.bind(dbh.teams),
            create: dbh.teams.create.bind(dbh.teams),
            delete: dbh.teams.delete.bind(dbh.teams),
            find: dbh.teams.find.bind(dbh.teams),
            update: dbh.teams.update.bind(dbh.teams),
            debaters: {//TESTED//
                read: function (dict) {
                    return dbh.teams.findOne.call(dbh.teams, {id: dict.id}).then(t=>t.read_debaters(dict))
                },
                update: function (dict) {
                    return dbh.teams.findOne.call(dbh.teams, {id: dict.id}).then(t=>t.update_debaters(dict))
                }
                ,
                create: function (dict) {
                    return dbh.teams.findOne.call(dbh.teams, {id: dict.id}).then(t=>t.create_debaters(dict))
                }//Special
            },
            institutions: {
                read: function (dict) {//TESTED//
                    return dbh.teams.select.call(dbh.teams, {id: dict.id}, ['institutions']).then(v => v['institutions'])
                },
                update: function (dict) {//TESTED//
                    return dbh.teams.update.call(dbh.teams, {id: dict.id, institutions: dict.institutions}, {new: true})
                }
            },
            results: {
                read: dbh.raw_team_results.read.bind(dbh.raw_team_results),
                create: dbh.raw_team_results.create.bind(dbh.raw_team_results),
                update: dbh.raw_team_results.update.bind(dbh.raw_team_results),
                delete: dbh.raw_team_results.delete.bind(dbh.raw_team_results),
                find: dbh.raw_team_results.find.bind(dbh.raw_team_results)
            }
        }
        this.adjudicators = {
            read: dbh.adjudicators.read.bind(dbh.adjudicators),
            create: dbh.adjudicators.create.bind(dbh.adjudicators),
            delete: dbh.adjudicators.delete.bind(dbh.adjudicators),
            update: dbh.adjudicators.update.bind(dbh.adjudicators),
            find: dbh.adjudicators.find.bind(dbh.adjudicators),
            conflicts: {
                read: function (dict) {//TESTED//
                    return dbh.adjudicators.select.call(dbh.adjudicators, {id: dict.id}, ['conflicts']).then(v => v['conflicts'])
                },
                update: function (dict) {//TESTED//
                    return dbh.adjudicators.update.call(dbh.adjudicators, {id: dict.id, conflicts: dict.conflicts}, {new: true})
                }
            },
            institutions: {
                read: function (dict) {//TESTED//
                    return dbh.adjudicators.select.call(dbh.adjudicators, {id: dict.id}, ['institutions']).then(v => v['institutions'])
                },
                update: function (dict) {//TESTED//
                    return dbh.adjudicators.update.call(dbh.adjudicators, {id: dict.id, institutions: dict.institutions}, {new: true})
                }
            },
            results: {
                read: dbh.raw_adjudicator_results.read.bind(dbh.raw_adjudicator_results),
                create: dbh.raw_adjudicator_results.create.bind(dbh.raw_adjudicator_results),
                update: dbh.raw_adjudicator_results.update.bind(dbh.raw_adjudicator_results),
                delete: dbh.raw_adjudicator_results.delete.bind(dbh.raw_adjudicator_results),
                find: dbh.raw_adjudicator_results.find.bind(dbh.raw_adjudicator_results)
            }
        }
        this.rounds = {
            proceed: function () {
                dbh.teams.read().then(function(e, docs) {
                    for (doc of docs) {
                        var latest_debaters = doc.read_debaters({r: dbh.current_round_num})
                        if (latest_debaters) {
                            doc.create_debaters({r: dbh.current_round_num+1, latest_debaters})
                        }
                    }
                })
                dbh.current_round_num += 1
                return dbh.current_round_num
            },
            configure: function (dict) {
                if (dict.hasOwnProperty('total_round_num')) {
                    dbh.total_round_num = dict.total_round_num
                }
                if (dict.hasOwnProperty('current_round_num')) {
                    dbh.current_round_num = dict.current_round_num
                }
            }
        }
        this.venues = {
            read: dbh.venues.read.bind(dbh.venues),
            create: dbh.venues.create.bind(dbh.venues),
            delete: dbh.venues.delete.bind(dbh.venues),
            find: dbh.venues.find.bind(dbh.venues),
            update: dbh.venues.update.bind(dbh.venues)
        }
        this.debaters = {
            read: dbh.debaters.read.bind(dbh.debaters),
            create: dbh.debaters.create.bind(dbh.debaters),
            delete: dbh.debaters.delete.bind(dbh.debaters),
            update: dbh.debaters.update.bind(dbh.debaters),
            find: dbh.debaters.find.bind(dbh.debaters),
            results: {
                read: dbh.raw_debater_results.read.bind(dbh.raw_debater_results),
                create: dbh.raw_debater_results.create.bind(dbh.raw_debater_results),
                update: dbh.raw_debater_results.update.bind(dbh.raw_debater_results),
                delete: dbh.raw_debater_results.delete.bind(dbh.raw_debater_results),
                find: dbh.raw_debater_results.find.bind(dbh.raw_debater_results)
            }
        }
        this.institutions = {
            read: dbh.institutions.read.bind(dbh.institutions),
            create: dbh.institutions.create.bind(dbh.institutions),
            delete: dbh.institutions.delete.bind(dbh.institutions),
            find: dbh.institutions.find.bind(dbh.institutions),
            update: dbh.institutions.update.bind(dbh.institutions)
        }
        this.close = dbh.close.bind(dbh)
    }
}

exports.CON = CON

//Tests
function test(n = 8) {
    var con = new CON("3234222-14")
    //con.dbh.teams.read((e, v) => console.log(v))
    var show = (e, v) => console.log("error: "+e+",\nvalue: "+v)
    var print = (v) => console.log(v)

    for (var i = 0; i < n; i++) {
        con.teams.create({id: i, institutions: [i%3]}).then(print).catch(print)
        if (i % 2 === 0) {
            con.adjudicators.create({id: i/2, institutions: [(i/2)%4]}).then(print).catch(print)
            con.venues.create({id: i/2}).then(print).catch(print)
        }
    }

    //con.teams.debaters.read({id: 1, r: 1}).then(print).catch(print)
    //con.teams.debaters.read({id: 1, r: 1}).then(print).catch(print)
    //con.teams.debaters.update({id: 1, r: 1, debaters: [3, 3]}).then(print)
    //con.teams.debaters.create({id: 1, r: 3, debaters: [3, 3]}).then(print)

    //con.teams.institutions.update({id: 1, institutions: [4, 6, 7]}).then(print)
    //con.teams.institutions.read({id: 3}, show)
    //con.teams.institutions.read({id: 3}).then(print)
    //con.teams.debaters.update({id: 1, r: 1, debaters: [2, 6]}).then(() => con.teams.debaters.read({id: 1}).then(print))
    //con.teams.find({id: 1}, show)
    //con.teams.institutions.update({id: 0, institutions: [3, 8, 5]}).then(show)
    //con.adjudicators.institutions.update({id: 0, institutions: [3, 6, 8, 8, 0, 0]}).then(print).catch(print)
    //con.adjudicators.conflicts.update({id: 0, conflicts: [3, 6, 9, 8, 0, 0]}).then(print).catch(print)
    //con.adjudicators.institutions.read({id: 1}, show)
    //con.teams.institutions.read({id: 1}, show)
    setTimeout(con.close, 10000)
}

test()
