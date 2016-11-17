var math = require('./math.js');
var sys = require('./sys.js')

// if b is more desirable, return 1


function filter_by_side (team, a, b, {compiled_team_results: compiled_team_results, teams_to_institutions: teams_to_institutions}) {
    var a_fit = sys.one_sided(a) * sys.one_sided(team) < 0
    var b_fit = sys.one_sided(b) * sys.one_sided(team) < 0

    if (a_fit & !b_fit) {
        return -1
    } else if (b_fit & !a_fit) {
        return 1
    } else {
        return 0
    }
}

function filter_by_strength (team, a, b, {compiled_team_results: compiled_team_results, teams_to_institutions: teams_to_institutions}) {
    var a_wins = compiled_team_results[a.id].wins
    var b_wins = compiled_team_results[b.id].wins
    var team_wins = compiled_team_results[team.id].wins
    var a_win_diff = Math.abs(team_wins - a_wins)
    var b_win_diff = Math.abs(team_wins - b_wins)
    if (a_win_diff > b_win_diff) {
        return 1
    } else if (a_win_diff < b_win_diff) {
        return -1
    } else {
        var a_sum = compiled_team_results[a.id].sum
        var b_sum = compiled_team_results[b.id].sum
        var team_sum = compiled_team_results[team.id].sum
        var a_sum_diff = Math.abs(team_sum - a_sum)
        var b_sum_diff = Math.abs(team_sum - b_sum)
        if (a_sum_diff > b_sum_diff) {
            return 1
        } else if (a_sum_diff < b_sum_diff) {
            return -1
        } else {
            return 0
        }
    }
}

function filter_by_institution (team, a, b, {compiled_team_results: compiled_team_results, teams_to_institutions: teams_to_institutions}) {
    a_institutions = teams_to_institutions[a.id]
    b_institutions = teams_to_institutions[b.id]
    team_institutions = teams_to_institutions[team.id]
    var a_insti = math.count_common(a_institutions, team_institutions)
    var b_insti = math.count_common(b_institutions, team_institutions)
    if (a_insti < b_insti) {
        return -1
    } else if (a_insti > b_insti) {
        return 1
    } else {
        return 0
    }
}

function filter_by_past_opponent (team, a, b, {compiled_team_results: compiled_team_results, teams_to_institutions: teams_to_institutions}) {
    a_past = math.count(compiled_team_results[a.id].past_opponents, team.id)
    b_past = math.count(compiled_team_results[a.id].past_opponents, team.id)
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
