"use strict";

var _ = require('underscore/underscore.js')
var tools = require('./tools/tools.js')
var entities = require('./controller/entities.js')
var cu = require('./controller/controllerutils.js')
var keys = require('./tools/keys.js')

class CON {
    constructor(db) {
        this.db = db
    }

    proceed_round () {
        this.db.current_round_num.set(thid.db.current_round_num.get() + 1)
    }

    get_institutions_by_team (dict) {
        tools.check_keys(dict, keys.team_to_institutions_necessary_keys)
        return this.db.team_to_institutions.get_of(dict.id)
    }

    get_institutions_by_adjudicator (dict) {
        tools.check_keys(dict, keys.adjudicator_to_institutions_necessary_keys)
        return this.db.adjudicator_to_institutions.get(dict.id)
    }

    get_debaters_by_team(dict) {
        tools.check_keys(dict, keys.team_to_debaters_necessary_keys)
        return this.db.team_to_debaters.get()[dict.r-1].get(dict.id)
    }

    set_debaters_by_team (dict) {
        tools.check_keys(dict, keys.team_to_debaters_keys)
        dict = tools.filter_keys(dict, keys.team_to_debaters_keys)
        for (r of _.range(this.db.current_round_num.get(), this.db.total_round_num.get()+1)) {
            dict.r = r
            this.db.team_to_debaters.set(dict)
        }
    }

    set_institutions_by_team(dict) {
        tools.check_keys(dict, keys.team_to_institutions_keys)
        dict = tools.filter_keys(dict, keys.team_to_institutions_keys)
        this.db.team_to_institutions.set(dict)
    }

    set_institutions_by_adjudicator(dict) {
        tools.check_keys(dict, keys.adjudicator_to_institutions_keys)
        dict = tools.filter_keys(dict, keys.adjudicator_to_institutions_keys)
        this.db.adjudicator_to_institutions.set(dict)
    }

    update_debaters_by_team (dict) {
        tools.check_keys(dict, keys.dict_update_with_r_keys)
        for (r of _.range(dict.r, this.db.total_round_num.get()+1)) {
            this.db.team_to_debater.update(dict)
        }
    }

    update_institutions_by_team (dict) {
        tools.check_keys(dict, keys.dict_update_keys)
        this.db.team_to_institutions.update(dict)
    }

    update_institutions_by_adjudicator (dict) {
        tools.check_keys(dict, keys.dict_update_keys)
        this.db.adjudicator_to_institutions.update(dict)
    }

    set_team (dict) {
        tools.check_keys(dict, keys.team_defining_keys)
        dict = tools.filter_keys(dict, keys.team_keys)
        if (tools.exist(this.db.teams.get(), dict.id)) {
            throw new Error('id ' + dict.id + ' already exists')
        }
        this.db.teams.push(new entities.Team(dict.id, dict.institution_ids))
    }

    set_adjudicator (dict) {
        tools.check_keys(dict, keys.adjudicator_defining_keys)
        dict = tools.filter_keys(dict, keys.adjudicator_keys)
        if (tools.exist(this.db.adjudicators.get(), dict.id)) {
            throw new Error('id ' + dict.id + ' already exists')
        }
        this.db.adjudicators.push(new entities.Adjudicator(dict.id, dict.institution_ids, dict.conflicts))
    }

    set_venue (dict) {
        tools.check_keys(dict, keys.venue_defining_keys)
        dict = tools.filter_keys(dict, keys.venue_keys)
        if (tools.exist(this.db.venues.get(), dict.id)) {
            throw new Error('id ' + dict.id + ' already exists')
        }
        this.db.venues.push(new entities.Venue(dict.id, dict.priority))
    }

    set_debater (dict) {
        tools.check_keys(dict, keys.debater_defining_keys)
        dict = tools.filter_keys(dict, keys.debater_keys)
        if (tools.exist(this.db.debaters.get(), dict.id)) {
            throw new Error('id ' + dict.id + ' already exists')
        }
        this.db.debaters.push(dict)
    }

    set_institution (dict) {
        tools.check_keys(dict, keys.institution_defining_keys)
        dict = tools.filter_keys(dict, keys.institution_keys)
        if (tools.exist(this.db.institutions.get(), dict.id)) {
            throw new Error('id ' + dict.id + ' already exists')
        }
        this.db.institutions.push(dict)
    }

    get_teams () {
        return this.db.teams.get()
    }

    get_adjudicators () {
        return this.db.adjudicators.get()
    }

    get_venues() {
        return this.db.venues.get()
    }

    get_debaters() {
        return this.db.debaters.get()
    }

    get_institutions() {
        return this.db.institutions.get()
    }

    search_teams (dict=null) {
        return this.db.teams.search(dict)
    }

    search_adjudicators (dict=null) {
        return this.db.adjudicators.search(dict)
    }

    search_venues(dict=null) {
        return this.db.venues.search(dict)
    }

    search_debaters(dict=null) {
        return this.db.debaters.search(dict)
    }

    search_institutions(dict=null) {
        return this.db.institutions.search(dict)
    }

    remove_team (dict) {
        tools.check_keys(dict, keys.entity_specifying_necessary_keys)
        this.db.teams.remove(dict)
    }

    remove_adjudicator (dict) {
        tools.check_keys(dict, keys.entity_specifying_necessary_keys)
        this.db.adjudicars.remove(dict)
    }

    remove_venue (dict) {
        tools.check_keys(dict, keys.entity_specifying_necessary_keys)
        this.db.venues.remove(dict)
    }

    remove_debater (dict) {
        tools.check_keys(dict, keys.entity_specifying_necessary_keys)
        this.db.debaters.remove(dict)
    }

    remove_institution (dict) {
        tools.check_keys(dict, keys.entity_specifying_necessary_keys)
        this.db.institutions.remove(dict)
    }

    update_team (dict) {
        tools.check_keys(dict, keys.entity_update_keys)
        dict.revise = tools.filter_keys(dict.revise, keys.team_keys)
        //new_dict = get_unnull_dict(dict)
        this.db.teams.update(dict)
    }

    update_adjudicator (dict) {
        tools.check_keys(dict, keys.entity_update_keys)
        dict.revise = tools.filter_keys(dict.revise, keys.adjudicator_keys)
        //new_dict = get_unnull_dict(dict)
        this.db.adjudicators.update(dict)
    }

    update_venue (dict) {
        tools.check_keys(dict, keys.entity_update_keys)
        dict.revise = tools.filter_keys(dict.revise, keys.venue_keys)
        //new_dict = get_unnull_dict(dict)
        this.db.venues.update(dict)
    }

    update_debater (dict) {
        tools.check_keys(dict, keys.entity_update_keys)
        dict.revise = tools.filter_keys(dict.revise, keys.debater_keys)
        //new_dict = get_unnull_dict(dict)
        this.db.debaters.update(dict)
    }

    update_institution (dict) {
        tools.check_keys(dict, keys.entity_update_keys)
        dict.revise = tools.filter_keys(dict.revise, keys.institution_keys)
        //new_dict = get_unnull_dict(dict)
        this.db.institutions.update(dict)
    }

    get_total_round_num () {
        return this.db.total_round_num.get()
    }

    search_raw_debater_result(dict) {
        //tools.check_keys(dict, ['r'])
        return this.db.debater_results.search(dict)
    }

    search_raw_adjudicator_result(dict) {
        //tools.check_keys(dict, ['r'])
        return this.db.adjudicator_results.search(dict)
    }

    search_raw_team_result(dict) {
        //tools.check_keys(dict, ['r', 'uid'])
        return this.db.team_results.search(dict)
    }

    delete_raw_debater_result(dict) {
        tools.check_keys(dict, keys.result_specifying_necessary_keys)
        return this.db.debater_results.remove(dict)
    }

    delete_raw_adjudicator_result(dict) {
        tools.check_keys(dict, keys.result_specifying_necessary_keys)
        return this.db.adjudicator_results.remove(dict)
    }

    delete_raw_team_result(dict) {
        tools.check_keys(dict, keys.result_specifying_necessary_keys)
        return this.db.team_results.remove(dict)
    }

    update_debater_result(dict) {
        tools.check_keys(dict, keys.result_update_keys)
        dict.revise = tools.filter_keys(dict.revise, keys.debater_result_keys)
        this.db.debater_results.update(dict)
    }

    update_adjudicator_result(dict) {
        tools.check_keys(dict, keys.result_update_keys)
        dict.revise = tools.filter_keys(dict.revise, keys.adjudicator_result_keys)
        this.db.adjudicator_results.update(dict)
    }

    update_team_result(dict) {
        tools.check_keys(dict, keys.result_update_keys)
        dict.revise = tools.filter_keys(dict.revise, keys.team_result_keys)
        this.db.team_results.update(dict)
    }

    set_debater_result(dict) {
        tools.check_keys(dict, keys.debater_result_keys)
        dict = tools.filter_keys(dict, keys.debater_result_keys)
        this.db.debater_results.set(dict)
    }

    set_adjudicator_result(dict) {
        tools.check_keys(dict, keys.adjudicator_result_keys)
        dict = tools.filter_keys(dict, keys.adjudicator_result_keys)
        this.db.adjudicator_results.set(dict)
    }

    set_team_result(dict) {
        tools.check_keys(dict, keys.team_result_keys)
        dict = tools.filter_keys(dict, keys.team_result_keys)
        this.db.team_results.set(dict)
    }

    summarize_debater_results(dict) {
        tools.check_keys(dict, ['r'])
        var debaters = this.db.debaters.get().map(d => d.id)
        var results = {}
        //for (var id of debaters) {
        //    results[id] = {scores: [], sum: 0, ranking: 0}
        //}
        for (var id of debaters) {
            var debater_result = this.db.debater_results.get().map(dr => dr.r === dict.r).filter(dr => dr.id === id)
            if (debater_result.length === 0) {
                continue
            }
            results[id] = {scores: [], sum: 0, ranking: 0}
            var scores_list = debater_result.map(dr => dr.scores)
            for (var scores of scores_list) {
                if (results[id].scores.length === 0) {
                    results[id].scores = scores
                } else {
                    for (var i = 0; i < scores.length; i++) {
                        results[id].scores[i] += scores[i]
                    }
                }
            }
            results[id] = results[id].scores.sum()
        }
        insert_ranking(results, (results, id1, id2) => results[id1].sum < results[id2].sum ? 1 : -1)
        return results
    }
    summarize_adjudicator_results(dict) {
        tools.check_keys(dict, ['r'])
        var adjudicators = this.db.adjudicators.get()
        var results = {}
        //for (var id of adjudicators) {
        //    results[id] = {}
        //}
        for (var id of adjudicators) {
            var adjudicator_result = this.db.adjudicator_results.get().map(ar => ar.r === dict.r).filter(ar => ar.id === id)
            if (adjudicator_result.length === 0) {
                //results[id] = {score: 'n/a', watched_teams: 'n/a', comments: 'n/a'}
                continue
            }
            var score_list = adjudicator_result.filter(ar => ar.score)
            var score = score_list.adjusted_average()
            var watched_teams = adjudicator_result[0].watched_teams
            var comments = adjudicator_result.map(ar => ar.comment)
            results[id] = {score: score, watched_teams: watched_teams, comments: comments}
        }

        insert_ranking(results, (results, id1, id2) => results[id1].score < results[id2].score ? 1 : -1)
        return results
    }

    summarize_team_results(dict) {
        tools.check_keys(dict, ['r'])
        var teams = this.db.teams.get()
        var results = {}
        //for (var id of teams) {
        //    results[id] = {}
        //}
        const summarized_debater_results = summarize_debater_results({r: dict.r})
        for (var id of teams) {
            var team_result_list = this.db.team_results[dict.r-1].get().filter(tr => tr.id === id)
            if (team_result_list.length === 0) {
                //results[id] = {win: 'n/a', opponents: 'n/a', side: 'n/a'}
                continue
            }
            ////////for NA *****ATTENTION******
            const t = team_result_list.filter(tr => tr.win === 1).length
            const f = team_result_list.filter(tr => tr.win === 0).length
            if (t > f) {
                const win = 1
            } else if (t < f) {
                const win = 0
            } else {
                throw new Error('cannot decide win or lose')
            }
            const opponents = team_result_list[0].opponents
            const side = team_result_list[0].side
            const debaters = this.get_debaters_by_team({r: dict.r, id: id})
            const sum = debaters.map(id => summarized_debater_results[id].sum()).sum()

            results[id] = {win: win, opponents: opponents, side: side, sum: sum}
        }
        for (var id in results) {
            results[id].margin = results[id].sum - results[id].oppoenents.map(op_id => results[op_id]).sum()/results[id].oppoenents.length
        }
        f = function (results, id1, id2) {
            if (results[id1].win < results[id2].win) {
                return 1
            } else if (results[id1].win === results[id2].win) {
                if (results[id1].sum < results[id2].sum) {
                    return 1
                } else if (results[id1].sum === results[id2].sum) {
                    if (results[id1].margin < results[id2].margin) {
                        return 1
                    }
                }
            }
            return -1
        }
        insert_ranking(results, (results, id1, id2) => f(results, id1, id2))
        return results
    }
    total_debater_results() {
        throw new Error('hasnt finished, computing debaters average')
        var summarized_debater_results_list = _.range(0, this.db.current_round_num.get()).map(i => this.summarize_debater_results({r: i+1}))
        var debaters = this.db.debaters.get().map(d => d.id)
        var results = {}
        var temp_scores = {}
        var temp = {}
        /*
        for (summarized_results of summarized_debater_results_list) {
            for (id in summarized_results) {
                results[id].rounds = summarized_results[id].map(result => {scores: result.scores, average: result.adjusted_sum})
                if (!temp_sum.hasOwnProperty(id)) {
                    temp[id] = [adjusted_sum]
                } else {
                    temp[id].push(adjusted_sum)
                }
            }
            for (id in temp) {
                results[id].sd = temp[id].sd()
                results[id].sum = temp[id].sum()
                results[id].average = temp[id].average()
            }
        }
        insert_ranking(results, (results, id1, id2) => (results[id1].sum < results[id2].sum))
        */
        return results
    }
    total_adjudicator_results() {
        var summarized_debater_results_list = _.range(0, this.db.current_round_num.get()).map(i => this.summarize_debater_results({r: i+1}))
        var debaters = this.db.debaters.get().map(d => d.id)
        var results = {}
        /*
        for (summarized_results of summarize_adjudicator_results) {
            for (id in summarized_results) {
                results[id] = {}
                results[id].rounds = {score: summarized_results[id].}
            }
        }
        */
        return summarized_debater_results_list
    }
    total_team_results() {
        var summarized_debater_results_list = _.range(0, this.db.current_round_num.get()).map(i => this.summarize_debater_results({r: i+1}))
        var debaters = this.db.debaters.get().map(d => d.id)
        var results = {}
        return summarized_debater_results_list
    }
    check_results(r) {
        throw new Error('all gathered?')
        "hasn't finished"
        //throw new Error('broken result?')
    }
    check_adjudicator_results(r) {
        throw new Error('all gathered?')
        "hasn't finished"
    }
}

exports.CON = CON
