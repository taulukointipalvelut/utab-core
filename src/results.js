"use strict";

var details = require('./results/details.js')
var _ = require('underscore/underscore.js')

class Results {
    constructor(total_round_num, db) {
        this.db = db
        this.total_round_num = total_round_num
        this.debater_results = _.range(0, total_round_num).map(i => new details.Results(i+1))
        this.team_results = _.range(0, total_round_num).map(i => new details.Results(i+1))
        this.adjudicator_results = _.range(0, total_round_num).map(i => new details.Results(i+1))
    }
    set_debater_result(dict) {
        tools.check_keys(dict, ['round', 'id', 'uid', 'scores'])
        this.debater_results.set(dict)
    }
    /*update_debater_result({round: round, id: id, uid: from_id, scores: scores}) {

    }*/
    set_adjudicator_result(dict) {
        tools.check_keys(dict, ['round', 'id', 'uid', 'score', 'watched_teams', 'comment'])
        this.adjudicator_results.set(dict)
    }/*
    update_adjudicator_result({round: round, from: from, uid: uid, chair: chair, id: id, score: score, teams: teams, comment: comment}) {

    }*/
    set_team_result(dict) {
        tools.check_keys(dict, ['round', 'id', 'uid', 'win','opponents', 'side', 'margin'])
        this.team_results.set(dict)
    }/*
    update_team_result({round: round, id: id, uid: uid, win: win, opponents: opponents, side: side}) {

    }*/
    summarize_debater_results(r) {
        var debaters = Array.from(new Set(this.debater_results[r-1].get().map(dr => dr.id)))
        var results = {}
        for (var id of debaters) {
            results[id] = []
        }
        for (var id of debaters) {
            var debater_result = this.debater_results[r-1].get().filter(dr => dr.id === id)
            var scores_list = debater_result.map(dr => dr.scores)

            for (var scores of scores_list) {
                if (results[id].length === 0) {
                    results[id] = scores
                } else {
                    for (var i = 0; i < scores.length; i++) {
                        results[id][i] += scores[i]
                    }
                }
            }
            results[id] = results[id].sum()
        }
        return results
    }
    summarize_adjudicator_results(r) {
        var adjudicators = Array.from(new Set(this.adjudicator_results[r-1].get().map(ar => ar.id)))
        var results = {}
        for (var id of adjudicators) {
            results[id] = {}
        }
        for (var id of adjudicators) {
            var adjudicator_result = this.adjudicator_results[r-1].get().filter(ar => ar.id === id)
            var score_list = adjudicator_result.filter(ar => ar.score)
            var score = score_list.adjusted_average()
            var watched_teams = adjudicator_result[0].watched_teams
            var comments = adjudicator_result.map(ar => ar.comment)
            results[id] = {score: score, watched_teams: watched_teams, comments: comments}
        }

        return results

    }
    summarize_team_results(r) {
        var teams = Array.from(new Set(this.team_results[r-1].get().map(tr => tr.id)))
        var results = {}
        for (var id of teams) {
            results[id] = {}
        }
        for (var id of teams) {
            var team_result_list = this.team_results[r-1].get().filter(tr => tr.id === id)
            ////////for NA *****ATTENTION******
            var t = team_result_list.filter(tr => tr.win === 1).length
            var f = team_result_list.filter(tr => tr.win === 0).length
            if (t > f) {
                const win = 1
            } else if (t < f) {
                const win = 0
            } else {
                throw new Error('cannot decide win or lose')
            }
            const opponents = team_result_list[0].opponents
            const side = team_result_list[0].side
            results[id] = {win: win, opponents: opponents, side: side}
        }
        return results
    }
    total_debater_results() {
        var summarized_debater_results_list = _.range(0, this.total_round_num).map(i => this.summarize_debater_results(i+1))
        var debaters = []
        for (var debater_result of this.debater_results) {
            debaters = Array.from(new Set(debaters.concat(debater_result.get().map(dr => dr.id))))
        }
        return debaters
    }
}

var r1 = new Results(3)
console.log(r1.total_debater_results())
