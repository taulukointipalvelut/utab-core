// adj -> grid : filter_by_conflict, filter_by_past, filter_by_institution
// grid -> adj : filter_by_bubble, filter_by_strength, filter_by_attendance
var tools = require('./../tools/tools.js')

function filter_by_strength(pair, a, b, db) {
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

function bubble(db, pair) {

}

function filter_by_bubble(pair, a, b, db) {
    var a_ev = a.evaluate()
    var b_ev = b.evaluate()
    /*
    if (db.total_round_num === db.current_round_num & bubble(db, pair)) {

    } else {
        return 0
    }
    */
    return 0
}

function filter_by_attendance(pair, a, b, db) {
    if (a.active_num > b.active_num) {
        return 1
    } else if (a.active_num < b.active_num) {
        return -1
    } else {
        return 0
    }
}

function filter_by_past(adjudicator, g1, g2, db) {
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

function filter_by_institution(adjudicator, g1, g2, db) {
    var g1_teams = g1.teams.map(id => tools.get_element_by_id(db.teams, id))
    var g2_teams = g2.teams.map(id => tools.get_element_by_id(db.teams, id))

    var g1_institutions = Array.prototype.concat.apply([], g1_teams.map(t => db.get_institutions_by_team({id: t.id})))
    var g2_institutions = Array.prototype.concat.apply([], g2_teams.map(t => db.get_institutions_by_team({id: t.id})))
    var g1_conflict = tools.count_common(g1_institutions, db.get_institutions_by_adjudicator({id: adjudicator.id}))
    var g2_conflict = tools.count_common(g2_institutions, db.get_institutions_by_adjudicator({id: adjudicator.id}))
    if (g1_conflict > g2_conflict) {
        return 1
    } else if (g1_conflict < g2_conflict) {
        return -1
    } else {
        return 0
    }
}

function filter_by_conflict(adjudicator, g1, g2, db) {
    var g1_team_ids = g1.teams
    var g2_team_ids = g2.teams

    var g1_conflict = tools.count_common(g1_team_ids, adjudicator.conflicts)
    var g2_conflict = tools.count_common(g2_team_ids, adjudicator.conflicts)
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
exports.filter_by_conflict = filter_by_conflict
