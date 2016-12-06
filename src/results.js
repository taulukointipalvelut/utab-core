"use strict";
var math = require('./general/math.js')
var sys = require('./allocations/sys.js')
var sortings = require('./general/sortings.js')
var loggers = require('./general/loggers.js')

function insert_ranking(list, f) {//TESTED// // f is a function that returns 1 if args[1] >~ args[2]
    var ids = list.map(e => e.id)
    if (ids.length === 0) {
        return list
    }
    ids.sort((a, b) => f(list, a, b))
	var ranking = 1
	var stay = 0
    for (var i = 0; i < ids.length-1; i++) {
		sys.find_one(list, ids[i]).ranking = ranking
		if (i < ids.length - 1 & f(list, ids[i+1], ids[i]) === 1) {
			ranking += 1 + stay
			stay = 0
        } else {
			stay += 1
        }
    }

	sys.find_one(list, ids[ids.length-1]).ranking = ranking

	return list
}

function sumbyeach (a, b) {//TESTED//
    var new_list = []
    for (var i = 0, M = Math.min(a.length, b.length); i < M; i++) {
        new_list.push(a[i] + b[i])
    }
    return new_list
}

function get_weighted_score(scores, style) {
    var score_weights = style.score_weights
    var score = 0
    var sum_weight = 0
    for (var i = 0; i < scores.length; i++) {
        if (scores[i] !== 0) {
            score += scores[i]
            sum_weight += score_weights[i]
        }
    }
    return sum_weight === 0 ? 0 : score/sum_weight
}

function summarize_debater_results(debater_instances, raw_debater_results, style, r) {
    var debaters = debater_instances.map(d => d.id)
    var results = []
    for (var id of debaters) {
        var filtered_debater_results = raw_debater_results.filter(dr => dr.r === r && dr.id === id)
        if (filtered_debater_results.length === 0) {
            continue
        }
        var result = {id: id, scores: [], sum: 0}
        var scores_list = filtered_debater_results.map(dr => dr.scores)
        result.scores = scores_list.reduce((a, b) => sumbyeach(a, b)).map(sc => sc/scores_list.length)

        result.average = get_weighted_score(result.scores, style)
        result.sum = math.sum(result.scores)
        result.user_defined_data_collection = filtered_debater_results.map(dr => dr.user_defined_data)
        results.push(result)
    }
    insert_ranking(results, sortings.debater_simple_comparer)
    return results
}

function summarize_adjudicator_results(adjudicator_instances, raw_adjudicator_results, r) {//TESTED//
    var adjudicators = adjudicator_instances.map(a => a.id)
    var results = []
    for (var id of adjudicators) {
        var filtered_adjudicator_results = raw_adjudicator_results.filter(ar => ar.r === r && ar.id === id)
        if (filtered_adjudicator_results.length === 0) {
            continue
        }
        var score_list = filtered_adjudicator_results.map(ar => ar.score)

        var score = math.average(score_list)
        var judged_teams = filtered_adjudicator_results[0].judged_teams
        var comments = filtered_adjudicator_results.map(ar => ar.comment).filter(c => c)
        var result = {id: id, score: score, judged_teams: judged_teams, comments: comments}
        result.user_defined_data_collection = filtered_adjudicator_results.map(ar => ar.user_defined_data)
        results.push(result)
    }

    insert_ranking(results, sortings.adjudicator_simple_comparer)
    return results
}

function summarize_team_results (team_instances, raw_team_results, r, style) {//TESTED// FOR NA
    var results = []
    var teams = team_instances.map(t => t.id)
    var team_num = style.team_num
    for (var id of teams) {
        var filtered_team_results = raw_team_results.filter(tr => tr.id === id && tr.r === r)
        if (filtered_team_results.length === 0) {
            continue
        }
        if (team_num === 2) {
            var win_nums = math.count(filtered_team_results.map(tr => tr.win), 1) - math.count(filtered_team_results.map(tr => tr.win), 0)////////for NA
            var win = win_nums > 0 ? 1 : 0
        } else {
            var win = filtered_team_results[0].win//already unified by chairs' discussion
        }
        var opponents = filtered_team_results[0].opponents
        var side = filtered_team_results[0].side

        var result = {id: id, win: win, opponents: opponents, side: side}
        result.user_defined_data_collection = filtered_team_results.map(tr => tr.user_defined_data)
        results.push(result)
    }
    insert_ranking(results, sortings.team_simple_comparer)
    return results
}


function integrate_team_and_debater_results (teams, team_results, debater_results, r) {//TESTED//
    var results = []

    for (var team_result of team_results) { // Add sum score
        let team = teams.filter(t => t.id === team_result.id)[0]
        let debaters_dict = team.debaters_by_r.filter(dbr => dbr.r === r)[0]
        var debaters = Array.from(new Set(debaters_dict['debaters']))

        var filtered_debater_results_list = debaters.map(id => sys.find_one(debater_results, id))

        var sum = math.sum(debaters.map(id => sys.find_one(debater_results, id).sum))

        var result = {id: team_result.id, win: team_result.win, opponents: team_result.opponents, side: team_result.side, sum: sum}
        result.user_defined_data_collection = team_result.user_defined_data_collection
        results.push(result)
    }
    for (var result of results) {// Add Margin
        result.margin = result.sum - math.sum(result.opponents.map(op_id => sys.find_one(results, op_id).sum))/result.opponents.length
    }

    insert_ranking(results, sortings.team_comparer)
    return results
}

/*
{
    Number: {
        ranking: Number,
        average: Number,
        sum: Number,
        sd: Number,
        details: {
            Number: {
                scores: [Number],
                sum: Number,
                average: Number,
                user_defined_data: Object
            }
        }
    }
}
*/

function compile_debater_results (debater_instances, raw_debater_results, style, rs) {//TESTED//
    loggers.results('compile_debater_results is called')
    loggers.results('debug', 'arguments are: '+JSON.stringify(arguments))
    var results = []
    var debaters = debater_instances.map(d => d.id)
    var _averages = {}
    var _details = {}

    for (id of debaters) {
        _averages[id] = []
        _details[id] = {}
    }

    for (var r of rs) {
        var summarized_debater_results = summarize_debater_results(debater_instances, raw_debater_results, style, r)
        for (id of debaters) {
            if (!summarized_debater_results.hasOwnProperty(id)) {
                _averages[id].push(null)
                _details[id][r] = {
                    scores: [],
                    sum: null,
                    average: null,
                    user_defined_data: null
                }
            } else {
                _averages[id].push(summarized_debater_results[id].average)
                _details[id][r] = {
                    scores: summarized_debater_results[id].scores,
                    sum: summarized_debater_results[id].sum,
                    average: summarized_debater_results[id].average,
                    user_defined_data: summarized_debater_results[id].user_defined_data
                }
            }
        }
    }

    for (var id of debaters) {
        var result = {
            id: id,
            average: math.adjusted_average(_averages[id]),
            sum: math.adjusted_sum(_averages[id]),
            sd: math.adjusted_sd(_averages[id]),
            details: _details[id]
        }
        results.push(result)
    }

    insert_ranking(results, sortings.debater_comparer)
    return results
}

/*
{
    Number: {
        ranking: Number,
        average: Number,
        sd: Number,
        judged_teams: [Number],
        details: {
            Number: {
                score: Number
            }
        }
    }
}
*/

function compile_adjudicator_results (adjudicator_instances, raw_adjudicator_results, rs) {//TESTED//
    loggers.results('compile_adjudicator_results is called')
    loggers.results('debug', 'arguments are: '+JSON.stringify(arguments))
    var results = []
    var adjudicators = adjudicator_instances.map(a => a.id)
    var _averages = {}
    var _details = {}
    var _judged_teams = {}
    var _active_num = {}

    for (id of adjudicators) {
        _averages[id] = []
        _details[id] = {}
        _judged_teams[id] = []
        _active_num[id] = 0
    }

    for (var r of rs) {
        var summarized_adjudicator_results = summarize_adjudicator_results(adjudicator_instances, raw_adjudicator_results, r)
        for (id of adjudicators) {
            if (!summarized_adjudicator_results.hasOwnProperty(id)) {
                _averages[id].push(null)
                _details[id][r] = {
                    score: null,
                    user_defined_data: null
                }
            } else {
                _averages[id].push(summarized_adjudicator_results[id].score)
                _details[id][r] = {
                    score: summarized_adjudicator_results[id].score,
                    user_defined_data: summarized_adjudicator_results[id].user_defined_data
                }
                _judged_teams[id] = _judged_teams[id].concat(summarized_adjudicator_results[id].judged_teams)
                _active_num[id] += 1
            }
        }
    }

    for (var id of adjudicators) {
        var result = {
            id: id,
            average: math.adjusted_average(_averages[id]),
            sd: math.adjusted_sd(_averages[id]),
            judged_teams: _judged_teams[id],
            active_num: _active_num[id],
            details: _details[id]
        }
        results.push(result)
    }

    insert_ranking(results, sortings.adjudicator_comparer)
    return results
}

/*
{
    Number: {
        ranking: Number,
        win: Number,
        past_opponents: [Number],
        past_sides: [Number],
        details: {
            Number: {
                win: Number
            }
        }
    }
}
*/

function compile_team_results_simple (team_instances, raw_team_results, rs, style) {
    loggers.results('compile_team_results_simple is called')
    loggers.results('debug', 'arguments are: '+JSON.stringify(arguments))
    var results = []
    var teams = team_instances.map(t => t.id)
    var _wins = {}
    var _sides = {}
    var _details = {}
    var _opponents = {}

    for (id of teams) {
        _wins[id] = []
        _sides[id] = []
        _details[id] = {}
        _opponents[id] = []
    }

    for (var r of rs) {
        var summarized_team_results = summarize_team_results(team_instances, raw_team_results, r, style)
        for (id of teams) {
            if (!summarized_team_results.hasOwnProperty(id)) {
                _wins[id].push(null)
                _details[id][r] = {
                    win: null,
                    user_defined_data: null
                }
            } else {
                _wins[id].push(summarized_team_results[id].win)
                _details[id][r] = {
                    win: summarized_team_results[id].win,
                    user_defined_data: summarized_team_results[id].user_defined_data
                }
                _sides[id].push(summarized_team_results[id].side)
                _opponents[id] = _opponents[id].concat(summarized_team_results[id].opponents)
            }
        }
    }

    for (var id of teams) {
        var result = {
            id: id,
            win: math.adjusted_sum(_wins[id]),
            past_sides: _sides[id],
            past_opponents: _opponents[id],
            sum: null,
            average: null,
            sd: null,
            margin: null,
            details: _details[id]
        }
        results.push(result)
    }

    insert_ranking(results, sortings.team_simple_comparer)
    return results
}

/*
{
    Number: {
        ranking: Number,
        win: Number,
        sum: Number,
        margin: Number,
        average: Number,
        sd: Number,
        details: {
            Number: {
                score: Number,
                margin: Number
            }
        },
        past_opponents: [Number]
    }
}
*/

function compile_team_results_complex (team_instances, debater_instances, raw_team_results, raw_debater_results, rs, style) {//TESTED//
    loggers.results('compile_team_results_complex is called')
    loggers.results('debug', 'arguments are: '+JSON.stringify(arguments))
    var results = []
    var teams = team_instances.map(t => t.id)
    var _sums = {}
    var _details = {}
    var _margins = {}
    var _wins = {}
    var _opponents = {}
    var _sides = {}

    for (id of teams) {
        _sums[id] = []
        _details[id] = {}
        _margins[id] = []
        _wins[id] = []
        _opponents[id] = []
        _sides[id] = []
    }

    for (var r of rs) {
        var summarized_team_results = summarize_team_results(team_instances, raw_team_results, r, style)
        var summarized_debater_results = summarize_debater_results(debater_instances, raw_debater_results, style, r)
        var integrated_team_results = integrate_team_and_debater_results (team_instances, summarized_team_results, summarized_debater_results, r)

        for (id of teams) {
            if (!integrated_team_results.hasOwnProperty(id)) {
                _sums[id].push(null)
                _details[id][r] = {
                    score: null,
                    margin: null,
                    user_defined_data: null
                }
                _margins[id].push(null)
                _wins[id].push(null)
            } else {
                _sums[id].push(integrated_team_results[id].sum)
                _details[id][r] = {
                    score: integrated_team_results[id].sum,
                    margin: integrated_team_results[id].margin,
                    user_defined_data: integrated_team_results[id].user_defined_data
                }
                _margins[id].push(integrated_team_results[id].margin)
                _wins[id].push(integrated_team_results[id].win)
                _opponents[id] = _opponents[id].concat(integrated_team_results[id].opponents)
                _sides[id].push(integrated_team_results[id].side)
            }
        }
    }

    for (var id of teams) {
        var result = {
            id: id,
            win: math.adjusted_sum(_wins[id]),
            sum: math.adjusted_sum(_sums[id]),
            margin: math.adjusted_sum(_margins[id]),
            average: math.adjusted_average(_sums[id]),
            sd: math.adjusted_sd(_sums[id]),
            details: _details[id],
            past_opponents: _opponents[id],
            past_sides: _sides[id]
        }
        results.push(result)
    }

    insert_ranking(results, sortings.team_comparer)
    return results
}

var teams = {/*
    summarize: function (teams, debaters, teams_to_debaters, raw_team_results, raw_debater_results, r, style) {
        var summarized_team_results = summarize_team_results(teams, raw_team_results, r, style)
        var summarized_debater_results = summarize_debater_results(debaters, raw_debater_results, r, style)
        return integrate_team_and_debater_results(summarized_team_results, summarized_debater_results, teams_to_debaters, r)
    },*/
    compile: compile_team_results_complex,
    simplified_summarize: summarize_team_results,
    simplified_compile: compile_team_results_simple
}
var debaters = {
    summarize: summarize_debater_results,
    compile: compile_debater_results
}
var adjudicators = {
    summarize: summarize_adjudicator_results,
    compile: compile_adjudicator_results
}


//TEST

/*
var style = {score_weights: [1, 1, 0.5]}

var raw_debater_results = [
    {id: 1, from_id: 6, r: 1, scores: [75, 0, 37]},
    {id: 0, from_id: 7, r: 1, scores: [0, 73, 0]},
    {id: 0, from_id: 5, r: 1, scores: [0, 76, 0]},
    {id: 0, from_id: 5, r: 1, scores: [0, 76, 0]},
    {id: 2, from_id: 5, r: 1, scores: [77, 0, 36]},
    {id: 3, from_id: 5, r: 1, scores: [0, 76, 0]},
    {id: 1, from_id: 6, r: 2, scores: [75, 0, 37]},
    {id: 0, from_id: 7, r: 2, scores: [0, 73, 0]},
    {id: 0, from_id: 5, r: 2, scores: [0, 76, 0]},
    {id: 0, from_id: 5, r: 2, scores: [0, 76, 0]},
    {id: 2, from_id: 5, r: 2, scores: [77, 0, 36]},
    {id: 3, from_id: 5, r: 2, scores: [0, 76, 0]}
]

var debaters = [{id: 0}, {id: 1}, {id: 2}, {id: 3}]

var debater_results = summarize_debater_results(debaters, raw_debater_results, style, 1)
console.log(debater_results, "hi")


var raw_adjudicator_results = [
    {id: 0, form_id: 2, r: 1, score: 7, judged_teams: [1, 2]},
    {id: 0, form_id: 1, r: 1, score: 6, judged_teams: [1, 2]},
    {id: 1, form_id: 3, r: 1, score: 7, judged_teams: [1, 2]},
    {id: 1, form_id: 4, r: 1, score: 8, judged_teams: [1, 2]},
    {id: 1, form_id: 5, r: 1, score: 9, judged_teams: [1, 2]}
]

var adjudicators = [{id: 0}, {id: 1}]

var adjudicator_results = summarize_adjudicator_results(adjudicators, raw_adjudicator_results, 1)
console.log(adjudicator_results)


var raw_team_results = [
    {id: 9, from_id: 3, r: 1, win: 1, opponents: [10], side: "gov"},
    {id: 9, from_id: 4, r: 1, win: 0, opponents: [10], side: "gov"},
    {id: 9, from_id: 5, r: 1, win: 0, opponents: [10], side: "gov"},
    {id: 10, from_id: 7, r: 1, win: 0, opponents: [9], side: "gov"},
    {id: 10, from_id: 6, r: 1, win: 1, opponents: [9], side: "gov"},
    {id: 10, from_id: 8, r: 1, win: 1, opponents: [9], side: "gov", user_defined_data: {a: "hi"}}
]

var teams = [{id: 9}, {id: 10}]

var team_results = summarize_team_results(teams, raw_team_results, 1)
console.log(team_results)

var teams_to_debaters = [
    {id: 9, r: 1, debaters: [0, 1]},
    {id: 10, r: 1, debaters: [2, 3]}
]

var integrated_team_results = integrate_team_and_debater_results(team_results, debater_results, teams_to_debaters, 1)
console.log(integrated_team_results)

var compiled_debater_results = compile_debater_results(debaters, raw_debater_results, style, [1, 2])
console.log(compiled_debater_results)

var compiled_adjudicator_results = compile_adjudicator_results(adjudicators, raw_adjudicator_results, [1, 2])
//console.log(compiled_adjudicator_results)

var compiled_team_results = compile_team_results_complex(teams, debaters, teams_to_debaters, raw_team_results, raw_debater_results, style, [1, 2])
console.log(compiled_team_results)

var compiled_team_results_simple = compile_team_results_simple(teams, raw_team_results, [1, 2])
console.log(compiled_team_results_simple)
*/
exports.teams = teams
exports.adjudicators = adjudicators
exports.debaters = debaters
