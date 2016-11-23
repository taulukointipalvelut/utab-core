"use strict"
var sys = require('../allocations/sys.js')
var math = require('../general/math.js')

function error_available(square, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts) {
    var errors = []
    for (var chair of square.chairs) {
        if (!adjudicators.filter(a => a.id === chair)[0].available) {
            errors.push('ERROR: unavaiable chair judge teams')
        }
    }
    return errors
}

function warn_strength(square, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts) {//TESTED//
    var warnings = []
    var team_ranking = math.average(square.teams.map(id => sys.find_one(compiled_team_results, id).ranking))
    var chair_ranking = math.average(square.chairs.map(id => sys.find_one(compiled_adjudicator_results, id).ranking))
    if (Math.abs(team_ranking - chair_ranking) > 2) {
        warnings.push('Inappropriate chairs will judge teams : chair(' + chair_ranking + ') vs teams(' + team_ranking+')')
    }
    return warnings
}

function warn_institution(square, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts) {//TESTED//
    var warnings = []
    var team_institutions = Array.prototype.concat.apply([], square.teams.map(id => teams_to_institutions[id]))//flatten
    var chair_institutions = Array.prototype.concat.apply([], square.chairs.map(id => adjudicators_to_institutions[id]))//flatten

    if (math.count_common(team_institutions, chair_institutions) !== 0) {
        warnings.push('institution is the same: teams institution: '+team_institutions.toString()+', chairs institution: '+chair_institutions.toString())
    }

    return warnings
}

function warn_conflict(square, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts) {//TESTED//
    var warnings = []
    var chair_conflicts = Array.prototype.concat.apply([], square.chairs.map(id => adjudicators_to_conflicts[id]))//flatten

    if (math.count_common(square.teams, chair_conflicts) !== 0) {
        warnings.push('judge conflict: teams: '+square.teams.toString()+', conflict: '+chair_conflicts.toString())
    }

    return warnings
}

function warn_past(square, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts) {//TESTED//
    var warnings = []
    var chair_watched_teams = Array.prototype.concat.apply([], square.chairs.map(id => sys.find_one(compiled_adjudicator_results, id).watched_teams))
    if (math.count_common(square.teams, chair_watched_teams) !== 0) {
        warnings.push('chairs already judged the teams')
    }
    return warnings
}

function warn_bubble(square, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts) {
    var warnings = []
    return warnings
}

function check (allocation, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts) {//FOR NA
    var new_allocation = sys.allocation_deepcopy(allocation)
    for (var square of new_allocation) {
        var functions = [error_available, warn_past, warn_strength, warn_institution, warn_conflict, warn_bubble]
        for (var func of functions) {
            square.warnings = square.warnings.concat(func(square, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts))
        }
    }
    return new_allocation
}

exports.check = check

/*
var allocation = [
    {
        teams: [0, 1],
        chairs: [1]
    },
    {
        teams: [2, 3],
        chairs: [2]
    }
]
var compiled_team_results = {
    0: {
        win: 2,
        past_opponents: [1],
        past_sides: ['gov'],
        ranking: 1,
    },
    1: {
        win: 2,
        past_opponents: [0],
        past_sides: ['opp'],
        ranking: 2,
    },
    2: {
        win: 1,
        past_opponents: [1],
        past_sides: ['opp'],
        ranking: 3,
    },
    3: {
        win: 0,
        past_opponents: [1],
        past_sides: ['gov'],
        ranking: 4,
    },
}
var compiled_adjudicator_results = {
    1: {
        watched_teams: [0],
        ranking: 1
    },
    2: {
        id: 2,
        watched_teams: [1],
        ranking: 9
    },
}
var adjudicators_to_institutions = {
    1: [1, 2],
    2: [4]
}
var adjudicators_to_conflicts = {
    1: [1, 2],
    2: []
}
var teams_to_institutions = {
    0: [2],
    1: [1],
    2: [1, 3],
    3: [2, 3]
}
console.log(checks(allocation, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts))
*/
