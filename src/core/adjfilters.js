// adj -> grid : filter_by_past, filter_by_institution
// grid -> adj : filter_by_bubble, filter_by_strength, filter_by_attendance
var tools = require('./../tools/tools.js')

function filter_by_strength(pair, a, b, tournament) {
    var a_ev = a.evaluate()
    var b_ev = b.evaluate()
    if (a_ev < b_ev) {
        return 1
    } else if (a_ev > b_ev) {
        return -1
    } else {
        return 0
    }
}

function bubble(tournament, pair) {

}

function filter_by_bubble(pair, a, b, tournament) {
    var a_ev = a.evaluate()
    var b_ev = b.evaluate()
    /*
    if (tournament.total_round_num === tournament.current_round_num & bubble(tournament, pair)) {

    } else {
        return 0
    }
    */
    return 0
}

function filter_by_attendance(pair, a, b, tournament) {
    if (a.active_num > b.active_num) {
        return 1
    } else if (a.active_num < b.active_num) {
        return -1
    } else {
        return 0
    }
}

function filter_by_past(adjudicator, g1, g2, tournament) {
    var g1_watched = tools.count_common(g1.teams, adjudicator.watched_teams)
    var g2_watched = tools.count_common(g2.teams, adjudicator.watched_teams)
    if (g1_watched > g2_watched) {
        return 1
    } else if (g1_watched < g2_watched) {
        return -1
    } else {
        return 0
    }
}

function filter_by_institution(adjudicator, g1, g2, tournament) {
    var g1_teams = g1.teams.map(id => tools.get_element_by_id(tournament.teams, id))
    var g2_teams = g2.teams.map(id => tools.get_element_by_id(tournament.teams, id))

    var g1_institutions = Array.prototype.concat.apply([], g1_teams.map(t => t.institution_ids))
    var g2_institutions = Array.prototype.concat.apply([], g2_teams.map(t => t.institution_ids))
    var g1_conflict = tools.count_common(g1_institutions, adjudicator.institution_ids)
    var g2_conflict = tools.count_common(g2_institutions, adjudicator.institution_ids)
    if (g1_conflict > g2_conflict) {
        return 1
    } else if (g1_conflict < g2_conflict) {
        return -1
    } else {
        return 0
    }
}


exports.filter_by_strength = filter_by_strength
exports.filter_by_past = filter_by_past
exports.filter_by_institution = filter_by_institution
exports.filter_by_bubble = filter_by_bubble
exports.filter_by_attendance = filter_by_attendance
