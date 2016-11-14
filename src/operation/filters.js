var tools = require('./../tools/tools.js')

function filter_by_side (team, a, b, db) {
    var a_fit = (a.one_sided() * team.one_sided() < 0)
    var b_fit = (b.one_sided() * team.one_sided() < 0)

    if (a_fit & !b_fit) {
        return -1
    } else if (b_fit & !a_fit) {
        return 1
    } else {
        return 0
    }
}

function filter_by_strength (team, a, b, db) {
    var a_win_diff = Math.abs(team.wins.sum() - a.wins.sum())
    var b_win_diff = Math.abs(team.wins.sum() - b.wins.sum())
    if (a_win_diff > b_win_diff) {
        return 1
    } else if (a_win_diff < b_win_diff) {
        return -1
    } else {
        var a_score_diff = Math.abs(team.scores.adjusted_average() - a.scores.adjusted_average())
        var b_score_diff = Math.abs(team.scores.adjusted_average() - b.scores.adjusted_average())
        if (a_score_diff > b_score_diff) {
            return 1
        } else if (a_score_diff < b_score_diff) {
            return -1
        } else {
            return 0
        }
    }
}

function filter_by_institution (team, a, b, db) {
    var a_insti = tools.count_common(db.get_institutions_by_team(team.id), db.get_institutions_by_team(a.id))
    var b_insti = tools.count_common(db.get_institutions_by_team(team.id), db.get_institutions_by_team(b.id))
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
