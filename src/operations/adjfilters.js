// adj -> grid : filter_by_conflict, filter_by_past, filter_by_institution
// grid -> adj : filter_by_bubble, filter_by_strength, filter_by_attendance
var math = require('./math.js')
var sys = require('./sys.js')

function get_active_num(adjudicator, compiled_adjudicator_results) {
    return Object.keys(compiled_adjudicator_results[adjudicator.id].details).length
}

function get_scores(adjudicator, compiled_adjudicator_results) {
    var scores = []

    //console.log(compiled_adjudicator_results, adjudicator.id)
    for (r in compiled_adjudicator_results[adjudicator.id].details) {
        scores.push(compiled_adjudicator_results[adjudicator.id].details[r].score)
    }
    return scores
}

function evaluate (adjudicator, compiled_adjudicator_results) {
    var scores = get_scores(adjudicator, compiled_adjudicator_results)
    if (scores.length === 0) {
        return adjudicator.pre_evaluation
    } else if (scores.length === 1) {
        return (adjudicator.pre_evaluation + scores[0])/2
    } else {
        return math.average(scores)
    }
}

function filter_by_strength(pair, a, b, {compiled_adjudicator_results: compiled_adjudicator_results, adjudicators_to_institutions: adjudicators_to_institutions, adjudicators_to_conflicts, teams_to_institutions: teams_to_institutions}) {
    var a_ev = evaluate(a, compiled_adjudicator_results)
    var b_ev = evaluate(b, compiled_adjudicator_results)
    if (a_ev < b_ev) {
        return 1
    } else if (a_ev > b_ev) {
        return -1
    } else {
        return 0
    }
}

function bubble(db, pair) {
    throw new Error('not yet finished')
}

////////////////////////////////////////////////////////////////////////
function filter_by_bubble(pair, a, b, {compiled_adjudicator_results: compiled_adjudicator_results, adjudicators_to_institutions: adjudicators_to_institutions, adjudicators_to_conflicts, teams_to_institutions: teams_to_institutions}) {
    var a_ev = evaluate(a, compiled_adjudicator_results)
    var b_ev = evaluate(b, compiled_adjudicator_results)
    /*
    if (db.total_round_num === db.current_round_num.get() & bubble(db, pair)) {

    } else {
        return 0
    }
    */
    //throw new Error('not yet finished')
    undefined
    return 0
}

function filter_by_attendance(pair, a, b, {compiled_adjudicator_results: compiled_adjudicator_results, adjudicators_to_institutions: adjudicators_to_institutions, adjudicators_to_conflicts, teams_to_institutions: teams_to_institutions}) {
    var a_active_num = get_active_num(a, compiled_adjudicator_results)
    var b_active_num = get_active_num(b, compiled_adjudicator_results)
    if (a_active_num > b_active_num) {
        return 1
    } else if (a_active_num < b_active_num) {
        return -1
    } else {
        return 0
    }
}

function filter_by_past(adjudicator, g1, g2, {compiled_adjudicator_results: compiled_adjudicator_results, adjudicators_to_institutions: adjudicators_to_institutions, adjudicators_to_conflicts, teams_to_institutions: teams_to_institutions}) {
    var g1_watched = math.count_common(g1.teams, compiled_adjudicator_results[adjudicator.id].watched_teams)
    var g2_watched = math.count_common(g2.teams, compiled_adjudicator_results[adjudicator.id].watched_teams)
    if (g1_watched > g2_watched) {
        return 1
    } else if (g1_watched < g2_watched) {
        return -1
    } else {
        return 0
    }
}

function filter_by_institution(adjudicator, g1, g2, {compiled_adjudicator_results: compiled_adjudicator_results, adjudicators_to_institutions: adjudicators_to_institutions, adjudicators_to_conflicts, teams_to_institutions: teams_to_institutions}) {
    var g1_institutions = Array.prototype.concat.apply([], g1.teams.map(t => sys.acess(adjudicators_to_institutions, t.id)))
    var g2_institutions = Array.prototype.concat.apply([], g2.teams.map(t => sys.acess(adjudicators_to_institutions, t.id)))
    var a_institutions = sys.acess(adjudicators_to_institutions[adjudicator.id])
    var g1_conflict = math.count_common(g1_institutions, a_institutions)
    var g2_conflict = math.count_common(g2_institutions, a_institutions)
    if (g1_conflict > g2_conflict) {
        return 1
    } else if (g1_conflict < g2_conflict) {
        return -1
    } else {
        return 0
    }
}

function filter_by_conflict(adjudicator, g1, g2, {compiled_adjudicator_results: compiled_adjudicator_results, adjudicators_to_institutions: adjudicators_to_institutions, adjudicators_to_conflicts, teams_to_institutions: teams_to_institutions}) {
    var g1_conflict = math.count_common(g1.teams, sys.acess(adjudicators_to_conflicts, adjudicator.id))
    var g2_conflict = math.count_common(g2.teams, sys.acess(adjudicators_to_conflicts, adjudicator.id))
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
