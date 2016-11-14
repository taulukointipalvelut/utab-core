"use strict";

var details = require('./results/details.js')
var _ = require('underscore/underscore.js')
var tools = require('./tools/tools.js')

function update(obj, dict, uid) {
    obj.update(dict, uid)
}

class Results {
    constructor(total_round_num, db) {
        this.db = db
        this.total_round_num = total_round_num
        this.debater_results = _.range(0, total_round_num).map(i => new details.Results(i+1))
        this.team_results = _.range(0, total_round_num).map(i => new details.Results(i+1))
        this.adjudicator_results = _.range(0, total_round_num).map(i => new details.Results(i+1))
    }

    update_debater_result(dict) {
        tools.check_keys(dict, ['r', 'uid'])
        update(this.debater_results[dict.r-1], dict, dict.uid)
    }

    update_adjudicator_result(dict) {
        tools.check_keys(dict, ['r', 'uid'])
        update(this.adjudicator_results[dict.r-1], dict, dict.uid)
    }

    update_team_result(dict) {
        tools.check_keys(dict, ['r', 'uid'])
        update(this.team_results[dict.r-1], dict, dict.uid)
    }

    set_debater_result(dict) {
        tools.check_keys(dict, ['round', 'id', 'uid', 'scores'])
        this.debater_results.set(dict)
    }

    set_adjudicator_result(dict) {
        tools.check_keys(dict, ['round', 'id', 'uid', 'score', 'watched_teams', 'comment'])
        this.adjudicator_results.set(dict)
    }

    set_team_result(dict) {
        tools.check_keys(dict, ['round', 'id', 'uid', 'win','opponents', 'side', 'margin'])
        this.team_results.set(dict)
    }

    summarize_debater_results(dict) {
        tools.check_keys(dict, ['r'])
        var debaters = this.db.debaters.map(d => d.id)
        var results = {}
        for (var id of debaters) {
            results[id] = []
        }
        for (var id of debaters) {
            var debater_result = this.debater_results[dict.r-1].get().filter(dr => dr.id === id)
            if (debater_result.length === 0) {
                continue
            }
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
    summarize_adjudicator_results(dict) {
        tools.check_keys(dict, ['r'])
        var adjudicators = this.db.adjudicators
        var results = {}
        for (var id of adjudicators) {
            results[id] = {}
        }
        for (var id of adjudicators) {
            var adjudicator_result = this.adjudicator_results[dict.r-1].get().filter(ar => ar.id === id)
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

        return results
    }

    summarize_team_results(dict) {
        tools.check_keys(dict, ['r'])
        var teams = this.db.teams
        var results = {}
        for (var id of teams) {
            results[id] = {}
        }
        const summarized_debater_results = summarize_debater_results({r: dict.r})
        for (var id of teams) {
            var team_result_list = this.team_results[dict.r-1].get().filter(tr => tr.id === id)
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
            const debaters = this.db.get_debaters_by_team({r: dict.r, id: id})
            const sum = debaters.map(id => summarized_debater_results[id].sum()).sum()

            results[id] = {win: win, opponents: opponents, side: side, sum: sum}
        }
        for (var id in results) {
            results[id].margin = results[id].sum - results[id].oppoenents.map(op_id => results[op_id]).sum()/results[id].oppoenents.length
        }
        return results
    }
    total_debater_results() {
        var summarized_debater_results_list = _.range(0, this.current_round_num).map(i => this.summarize_debater_results({r: i+1}))
        var debaters = this.db.debaters.map(d => d.id)
        var results = {}
        return summarized_debater_results_list
    }
    total_adjudicator_results() {
        var summarized_debater_results_list = _.range(0, this.current_round_num).map(i => this.summarize_debater_results({r: i+1}))
        var debaters = this.db.debaters.map(d => d.id)
        var results = {}
        return summarized_debater_results_list
    }
    total_team_results() {
        var summarized_debater_results_list = _.range(0, this.current_round_num).map(i => this.summarize_debater_results({r: i+1}))
        var debaters = this.db.debaters.map(d => d.id)
        var results = {}
        return summarized_debater_results_list
    }
}

exports.Results = Results
