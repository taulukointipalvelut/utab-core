"use strict";

function sum(list) {
    return list.reduce((a, b) => a + b)
}

function average(list) {
    return list.length === 0 ? 0 : sum(list)/list.length
}

function count(list, e) {
    return list.filter(l => e === l).length
}

function debater_result_comparer(results, id1, id2) {
    return results[id1].average < results[id2].average ? 1 : -1
}

function team_result_comparer_simple(results, id1, id2) {
    return results[id1].win < results[id2].win ? 1 : -1
}

function team_result_comparer_complex(results, id1, id2) {
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

function adjudicator_result_comparer(results, id1, id2) {
    return results[id1].score < results[id2].score ? 1 : -1
}

function insert_ranking(dict, f) {//TESTED// // f is a function that returns 1 if args[1] >~ args[2]
    var ids = Object.keys(dict)
    ids.sort((a, b) => f(dict, a, b))
	var ranking = 1
	var stay = 0
    for (var i = 0; i < ids.length-1; i++) {
		dict[ids[i]].ranking = ranking
		if (i < ids.length - 1 & f(dict, ids[i+1], ids[i]) === 1) {
			ranking += 1 + stay
			stay = 0
        } else {
			stay += 1
        }
    }

	dict[ids[ids.length-1]].ranking = ranking

	return dict
}

function sumbyeach (a, b) {//TESTED//
    var new_list = []
    for (var i = 0, M = Math.min(a.length, b.length); i < M; i++) {
        new_list.push(a[i] + b[i])
    }
    return new_list
}

function summarize_debater_results(debater_instances, raw_debater_results, r) {//TESTED BUT NEED FIX//  FOR NA
    var debaters = debater_instances.map(d => d.id)
    var results = {}
    for (var id of debaters) {
        var filtered_debater_results = raw_debater_results.filter(dr => dr.r === r && dr.id === id)
        if (filtered_debater_results.length === 0) {
            continue
        }
        results[id] = {scores: [], sum: 0}
        var scores_list = filtered_debater_results.map(dr => dr.scores)
        results[id].scores = scores_list.reduce((a, b) => sumbyeach(a, b))
        results[id].scores = results[id].scores.map(sc => sc/scores_list.length)
        results[id].average = sum(results[id].scores) //////////////////////////////////////////////////////////
    }
    insert_ranking(results, debater_result_comparer)
    return results
}

function summarize_adjudicator_results(adjudicator_instances, raw_adjudicator_results, r) {//TESTED//
    var adjudicators = adjudicator_instances.map(a => a.id)
    var results = {}
    for (var id of adjudicators) {
        var filtered_adjudicator_results = raw_adjudicator_results.filter(ar => ar.r === r && ar.id === id)
        if (filtered_adjudicator_results.length === 0) {
            continue
        }
        var score_list = filtered_adjudicator_results.map(ar => ar.score)

        var score = average(score_list)
        var watched_teams = filtered_adjudicator_results[0].watched_teams
        var comments = filtered_adjudicator_results.map(ar => ar.comment).filter(c => c)
        results[id] = {score: score, watched_teams: watched_teams, comments: comments}
    }

    insert_ranking(results, adjudicator_result_comparer)
    return results
}

function summarize_team_results (team_instances, raw_team_results, r) {//TESTED// FOR NA
    var results = {}
    var teams = team_instances.map(t => t.id)
    for (var id of teams) {
        var filtered_team_results = raw_team_results.filter(tr => tr.id === id && tr.r === r)
        if (filtered_team_results.length === 0) {
            continue
        }
        var win_nums = count(filtered_team_results.map(tr => tr.win), 1) - count(filtered_team_results.map(tr => tr.win), 0)////////for NA
        if (filtered_team_results.length % 2 === 0 && win_nums === 0) {
            throw new Error('Cannot decide win/lose at team: '+id.toString())

        }
        var win = win_nums > 0 ? 1 : 0
        var opponents = filtered_team_results[0].opponents
        var side = filtered_team_results[0].side

        results[id] = {win: win, opponents: opponents, side: side}
    }
    insert_ranking(results, team_result_comparer_simple)
    return results
}


function integrate_team_and_debater_results (team_results, debater_results, team_to_debaters, r) {//TESTED BUT NOT ENOUGH//
    var results = {}

    for (var id in team_results) { // Add sum score
        var debaters = Array.from(new Set(team_to_debaters[id][r]))

        var filtered_debater_results_list = debaters.map(id => debater_results[id])

        var _sum = sum(debaters.map(id => debater_results[id].average))
        var opponents = team_results[id].opponents
        var side = team_results[id].side
        var win = team_results[id].win

        results[id] = {win: win, opponents: opponents, side: side, sum: _sum}
    }
    for (var id in results) {// Add Margin
        results[id].margin = results[id].sum - sum(results[id].opponents.map(op_id => results[op_id].sum))/results[id].opponents.length
    }

    insert_ranking(results, team_result_comparer_complex)
    return results
}


//TEST
/*

var raw_debater_results = [
    {id: 1, from_id: 6, r: 1, scores: [75, 0, 37]},
    {id: 0, from_id: 7, r: 1, scores: [0, 73, 0]},
    {id: 0, from_id: 5, r: 1, scores: [0, 76, 0]},
    {id: 0, from_id: 5, r: 1, scores: [0, 76, 0]},
    {id: 2, from_id: 5, r: 1, scores: [77, 0, 36]},
    {id: 3, from_id: 5, r: 1, scores: [0, 76, 0]}
]

var debater_results = summarize_debater_results([{id: 0}, {id: 1}, {id: 2}, {id: 3}], raw_debater_results, 1)
console.log(debater_results)


var raw_adjudicator_results = [
    {id: 0, form_id: 2, r: 1, score: 7, watched_teams: [1, 2]},
    {id: 0, form_id: 1, r: 1, score: 6, watched_teams: [1, 2]},
    {id: 1, form_id: 3, r: 1, score: 7, watched_teams: [1, 2]},
    {id: 1, form_id: 4, r: 1, score: 8, watched_teams: [1, 2]},
    {id: 1, form_id: 5, r: 1, score: 9, watched_teams: [1, 2]}
]
var adjudicator_results = summarize_adjudicator_results([{id: 0}, {id: 1}], raw_adjudicator_results, 1)
console.log(adjudicator_results)


var raw_team_results = [
    {id: 9, from_id: 3, r: 1, win: 1, opponents: [10], side: "gov"},
    {id: 9, from_id: 4, r: 1, win: 0, opponents: [10], side: "gov"},
    {id: 9, from_id: 5, r: 1, win: 0, opponents: [10], side: "gov"},
    {id: 10, from_id: 7, r: 1, win: 0, opponents: [9], side: "gov"},
    {id: 10, from_id: 6, r: 1, win: 1, opponents: [9], side: "gov"},
    {id: 10, from_id: 8, r: 1, win: 1, opponents: [9], side: "gov"}
]
var team_results = summarize_team_results([{id: 9}, {id: 10}], raw_team_results, 1)
console.log(team_results)

var team_to_debaters = {
    9: {1: [0, 1]},
    10: {1: [2, 3]}
}

var integrated_team_results = integrate_team_and_debater_results(team_results, debater_results, team_to_debaters, 1)
console.log(integrated_team_results)
*/
