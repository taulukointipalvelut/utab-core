var math = require('./math.js')

one_sided (past_sides) {//FOR  NA//
    return past_sides.filter(side => side === "gov").length - past_sides.filter(side => side === "opp").length
}

function filter_by_side (team, a, b, compiled_team_results) {
    var a_fit = one_sided(a) * one_sided(team) < 0)
    var b_fit = one_sided(b) * one_sided(team) < 0)

    if (a_fit & !b_fit) {
        return -1
    } else if (b_fit & !a_fit) {
        return 1
    } else {
        return 0
    }
}

function filter_by_strength (team, a, b, compiled_team_results) {
    var a_win_diff = Math.abs(math.sum(team.wins) - math.sum(a.wins))
    var b_win_diff = Math.abs(math.sum(team.wins) - math.sum(b.wins))
    if (a_win_diff > b_win_diff) {
        return 1
    } else if (a_win_diff < b_win_diff) {
        return -1
    } else {
        var a_score_diff = Math.abs(math.average(team.scores) - math.average(a.scores))
        var b_score_diff = Math.abs(math.average(team.scores) - math.average(b.scores))
        if (a_score_diff > b_score_diff) {
            return 1
        } else if (a_score_diff < b_score_diff) {
            return -1
        } else {
            return 0
        }
    }
}

function filter_by_institution (team, a, b, compiled_team_results) {
    var a_insti = math.count_common(con.get_institutions_by_team({id: team.id}), compiled_team_results.get_institutions_by_team({id: a.id}))
    var b_insti = math.count_common(con.get_institutions_by_team({id: team.id}), compiled_team_results.get_institutions_by_team({id: b.id}))
    if (a_insti < b_insti) {
        return -1
    } else if (a_insti > b_insti) {
        return 1
    } else {
        return 0
    }
}

function filter_by_past_opponent (team, a, b, db) {
    a_past = team.past_opponent_ids.filter(opp_id => opp_id === a.id).length
    b_past = team.past_opponent_ids.filter(opp_id => opp_id === b.id).length
    if (a_past > b_past) {
        return 1
    } else if (a_past < b_past) {
        return -1
    } else {
        return 0
    }
}

exports.filter_by_side = filter_by_side
exports.filter_by_institution = filter_by_institution
exports.filter_by_past_opponent = filter_by_past_opponent
exports.filter_by_strength = filter_by_strength
