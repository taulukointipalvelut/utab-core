"use strict";

var database = require('./controllers/database.js')

class CON {
    constructor(id) {
        var dbh = new database.DBHandler(id)
        var con = this

        this.teams = {
            read: dbh.teams.read.bind(dbh.teams),
            create: function (dict) {
                return Promise.all([
                    dbh.teams_to_institutions.create.call(dbh.teams_to_institutions, {id: dict.id}),
                    dbh.teams_to_debaters.create.call(dbh.teams_to_debaters, {id: dict.id}),
                    dbh.teams.create.call(dbh.teams, dict)
                ]).then(v=>v[2])
            },
            delete: function (dict) {
                return Promise.all([
                    dbh.teams_to_institutions.delete.call(dbh.teams_to_institutions, {id: dict.id}),
                    dbh.teams_to_debaters.delete.call(dbh.teams_to_debaters, {id: dict.id}),
                    dbh.teams.delete.call(dbh.teams, {id: dict.id})
                ]).then(v=>v[2])
            },
            find: dbh.teams.find.bind(dbh.teams),
            update: dbh.teams.update.bind(dbh.teams),
            debaters: {//TESTED//
                read: dbh.teams_to_debaters.read.bind(dbh.teams_to_debaters),
                find: function (dict) {
                    return dbh.teams_to_debaters.select.call(dbh.teams_to_debaters, {id: dict.id}, ['debaters_by_r']).then(v=>v['debaters_by_r'])
                },
                update: function (dict) {
                    return dbh.teams_to_debaters.findOne.call(dbh.teams_to_debaters, {id: dict.id}).then(t=>t.update_debaters(dict))
                },
                create: function (dict) {
                    return dbh.teams_to_debaters.findOne.call(dbh.teams_to_debaters, {id: dict.id}).then(t=>t.create_debaters(dict))
                },
                delete: function (dict) {
                    return dbh.teams_to_debaters.findOne.call(dbh.teams_to_debaters, {id: dict.id}).then(t=>t.delete_debaters(dict))
                },
                createIfNotExists: function (dict) {
                    return dbh.teams_to_debaters.findOne.call(dbh.teams_to_debaters, {id: dict.id}).then(t=>t.create_if_not_exists_debaters(dict))
                }
            },
            institutions: {
                read: function (dict) {//TESTED//
                    return dbh.teams_to_institutions.read.call(dbh.teams_to_institutions).then(function (dicts) {
                        var new_dict = {}
                        for (dict of dicts) {
                            new_dict[dict.id] = dict.institutions
                        }
                        return new_dict
                    })
                },
                find: function (dict) {//TESTED//
                    return dbh.teams_to_institutions.select.call(dbh.teams_to_institutions, {id: dict.id}, ['institutions']).then(v => v['institutions'])
                    //return dbh.teams.select.call(dbh.teams, {id: dict.id}, ['institutions']).then(v => v['institutions'])
                },
                update: function (dict) {//TESTED//
                    return dbh.teams_to_institutions.update.call(dbh.teams_to_institutions, {id: dict.id, institutions: dict.institutions}, {new: true})
                },
                create: function (dict) {
                    return dbh.teams_to_institutions.create.call(dbh.teams_to_institutions, {id: dict.id, institutions: dict.institutions})
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
            create: function (dict) {
                return Promise.all([
                    dbh.adjudicators_to_institutions.create.call(dbh.adjudicators_to_institutions, {id: dict.id}),
                    dbh.adjudicators_to_conflicts.create.call(dbh.adjudicators_to_conflicts, {id: dict.id}),
                    dbh.adjudicators.create.call(dbh.adjudicators, dict)
                ]).then(v=>v[2])
            },
            delete: function (dict) {
                return Promise.all([
                    dbh.adjudicators_to_institutions.delete.call(dbh.adjudicators_to_institutions, {id: dict.id}),
                    dbh.adjudicators_to_conflicts.delete.call(dbh.adjudicators_to_conflicts, {id: dict.id}),
                    dbh.adjudicators.delete.call(dbh.adjudicators, {id: dict.id})
                ]).then(v=>v[2])
            },
            update: dbh.adjudicators.update.bind(dbh.adjudicators),
            find: dbh.adjudicators.find.bind(dbh.adjudicators),
            conflicts: {
                read: function (dict) {//TESTED//
                    return dbh.adjudicators_to_conflicts.read.call(dbh.adjudicators_to_conflicts).then(function (dicts) {
                        var new_dict = {}
                        for (dict of dicts) {
                            new_dict[dict.id] = dict.conflicts
                        }
                        return new_dict
                    })
                },
                find: function (dict) {//TESTED//
                    return dbh.adjudicators.select.call(dbh.adjudicators, {id: dict.id}, ['conflicts']).then(v => v['conflicts'])
                },
                update: function (dict) {//TESTED//
                    return dbh.adjudicators.update.call(dbh.adjudicators, {id: dict.id, conflicts: dict.conflicts}, {new: true})
                }
            },
            institutions: {
                read: function (dict) {//TESTED//
                    return dbh.adjudicators_to_institutions.read.call(dbh.adjudicators_to_institutions).then(function (dicts) {
                        var new_dict = {}
                        for (dict of dicts) {
                            new_dict[dict.id] = dict.institutions
                        }
                        return new_dict
                    })
                },
                find: function (dict) {//TESTED//
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
            read: dbh.info.show,//TESTED//
            proceed: function () {
                return dbh.info.show().then(function(info) {
                    var current_round_num = info.current_round_num
                    var total_round_num = info.total_round_num
                    if (total_round_num === current_round_num) { throw new Error('All rounds finished') }
                    return dbh.teams.read().then(function(docs) {
                        return Promise.all(docs.map(function(doc) {
                            return con.teams.debaters.find({id: doc.id})
                                .then(debaters_by_r => con.teams.debaters.createIfNotExists({id: doc.id, r: current_round_num+1, debaters: debaters_by_r[current_round_num]}))
                                .then(() => info)}))
                            .then(function (info) {
                                return dbh.info.configure({total_round_num: total_round_num, current_round_num: current_round_num+1})
                            })
                        })
                    })
            },
            configure: dbh.info.configure,//TESTED//
            styles: {
                read: function () {
                    return dbh.info.show().then(v=>v['style'])
                },
                update: function (dict) {
                    return dbh.info.configure({style: dict})
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
        this.close = dbh.close.bind(dbh)// for debug
    }
}

exports.CON = CON

//Tests
function test(n = 4) {
    var tid = 324213111111111111
    var con = new CON(tid)
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
    con.rounds.styles.read().then(print)
    con.rounds.styles.update({name: 'NA2'}).then(print).catch(print)
    //con.teams.read().then(print)
    //con.teams.results.create({id: 3, from_id: 3, r: 1, side: "gov", win: 1, opponents: [2, 3, 4]}).then(print)
    //con.rounds.configure({id: tid, total_round_num: 500, current_round_num: 1}).then(print)
    //con.rounds.read().then(print)
    //con.rounds.proceed().then(print).catch(print)
    //con.teams.debaters.find({id: 0}).then(print).catch(print)
    //con.rounds.read().then(print)
    //con.rounds.configure({id: tid, total_round_num: 500, current_round_num: 1}).then(print)

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
    //con.rounds.read().then(print)
    //con.teams.debaters.find({id: 0})


    /*
    con.rounds.read().then(print).catch(print)
    con.rounds.proceed().then(v=>con.teams.debaters.find({id: 0})).then(print).catch(print)
    */
    //con.teams.debaters.find({id: 0}).then(print).catch(print)
    //con.rounds.read().then(print)
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
