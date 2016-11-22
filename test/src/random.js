"use strict";

var _ = require('underscore/underscore.js')
var math = require('../../src/general/math.js')

function generate_raw_team_results(allocation, style, r) {//FOR NA //TESTED//
	if (style.team_num === 4) {
        var sides = ["og", "oo", "cg", "co"]
    } else {
	    var sides = ["gov", "opp"]
    }

	//team_result = {}
    var raw_team_result_list = []

    var c = 0
    for (var square of allocation) {
        var sides_cp = math.shuffle([].concat(sides))
        var win = Math.floor(Math.random()*2)
        //try {
        //    console.log(teams.map(t=>t.id))
        //} catch(e) {
        //    console.eror(e)
        //}
        //console.log("f")

        raw_team_result_list.push({
            id: square.teams[0],
            from_id: c,
            r: r,
            win: win,
            side: sides_cp[0],
            opponents: square.teams[1]
        })

        raw_team_result_list.push({
            id: square.teams[1],
            from_id: c,
            r: r,
            win: 1-win,
            side: sides_cp[1],
            opponents: square.teams[0]
        })
        c += 1
    }
    return raw_team_result_list
}

//console.log(generate_raw_team_results([{teams: [1, 2]}], {team_num: 2}, 1))

function search_debaters(raw_teams_to_debaters, id, r) {
	return raw_teams_to_debaters.filter(rt2d => rt2d.r === r && rt2d.id === id)[0].debaters
}

function generate_raw_debater_results(allocation, raw_teams_to_debaters, style, r) {//TESTED//
	var raw_debater_results = []

    var c = 0
    for (var square of allocation) {
        for (var id of square.teams) {
            var same_team_debaters = search_debaters(raw_teams_to_debaters, id, r)
            var list_to_share = style.score_weights.map(w => Math.floor((Math.random()* 9 + 71)*w))

            var score_lists = []

            for (var j = 0; j < list_to_share.length; j++) {//for each role
                var n = Math.floor(Math.random()*same_team_debaters.length)
                for (var i = 0; i < same_team_debaters.length; i++) {//for each debater
                    if (j === 0) {
                        score_lists[i] = []
                    }

                    if (i === n) {
                        score_lists[i].push(list_to_share[j])
                    } else {
                        score_lists[i].push(0)
                    }
                }
            }

            for (var i = 0; i < same_team_debaters.length; i++) {
                raw_debater_results.push({
                    id: same_team_debaters[i],
                    from_id: c,
                    r: r,
                    scores: score_lists[i]
                })
            }
        }
        c += 1
    }
    return raw_debater_results
}

//console.log(generate_raw_debater_results([{teams: [0, 1]}], [{ id: 0, r: 1, debaters: [ 0, 1 ] }, { id: 1, r: 1, debaters: [ 2, 3 ] }], {team_num: 2, score_weights: [1, 1, 0.5]}, 1))

function generate_raw_adjudicator_results(allocation, r) {//TESTED//
    var raw_adjudicator_results = []
    for (var square of allocation) {
        for (var id of square.chairs) {
            var watched_teams = square.teams
            watched_teams.map(t_id =>
                raw_adjudicator_results.push({
                    r: r,
                    id: id,
                    from_id: t_id,
                    score: Math.floor(1 + 9 * Math.random()),
                    watched_teams: watched_teams
                })
            )
        }
    }
    return raw_adjudicator_results
}

//console.log(generate_raw_adjudicator_results([{teams: [1, 2], chairs: [2]}], 1))

function generate_raw_teams_to_debaters(teams, debaters, rs, debater_num_per_team=2) {
	if (debaters.length < debater_num_per_team * teams.length) {
		throw new Error('need more debaters')
	}
    var raw_teams_to_debaters = []

    for (var r of rs) {
        var total = 0
        for (var team of teams) {
			var team_debaters = _.range(total, total+debater_num_per_team).map(o => debaters[o].id)
            raw_teams_to_debaters.push({id: team.id, r: r, debaters: team_debaters})
            total += debater_num_per_team
        }
    }
    return raw_teams_to_debaters
}

//console.log(generate_raw_teams_to_debaters([{id: 1}, {id: 2}], [{id: 1}, {id: 2}, {id: 3}, {id: 4}], [3, 2]))

exports.generate_raw_team_results = generate_raw_team_results
exports.generate_raw_debater_results = generate_raw_debater_results
exports.generate_raw_adjudicator_results = generate_raw_adjudicator_results
exports.generate_raw_teams_to_debaters = generate_raw_teams_to_debaters
