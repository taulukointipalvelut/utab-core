"use strict"
var sys = require('../allocations/sys.js')
var math = require('../general/math.js')

function error_available(square, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, f, position) {
    var errors = []
    for (var adjudicator of f(square)) {
        if (!sys.find(adjudicators, adjudicator.id).available) {
            errors.push('ERROR: unavaiable '+position+' judges teams')
        }
    }
    return errors
}

function warn_strength(square, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, f, position) {//TESTED//
    var warnings = []
    var team_ranking = math.average(square.teams.map(id => sys.find_one(compiled_team_results, id).ranking))
    var adjudicator_ranking = math.average(f(square).map(id => sys.find_one(compiled_adjudicator_results, id).ranking))
    if (Math.abs(team_ranking - adjudicator_ranking) > 2) {
        warnings.push('Inappropriate '+position+'s will judge teams : '+position+'(' + adjudicator_ranking + ') vs teams(' + team_ranking+')')
    }
    return warnings
}

function warn_institution(square, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, f, position) {//TESTED//
    var warnings = []
    var team_institutions = Array.prototype.concat.apply([], square.teams.map(id => sys.find_one(teams_to_institutions, id).institutions))//flatten
    var adjudicator_institutions = Array.prototype.concat.apply([], f(square).map(id => sys.find_one(adjudicators_to_institutions, id).institutions))//flatten

    if (math.count_common(team_institutions, adjudicator_institutions) !== 0) {
        warnings.push('institution is the same: teams institution: '+team_institutions.toString()+', adjudicators institution: '+adjudicator_institutions.toString())
    }

    return warnings
}

function warn_conflict(square, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, f, position) {//TESTED//
    var warnings = []
    var adjudicator_conflicts = Array.prototype.concat.apply([], f(square).map(id => sys.find_one(adjudicators_to_conflicts, id).conflicts))//flatten

    if (math.count_common(square.teams, adjudicator_conflicts) !== 0) {
        warnings.push('judge conflict: teams: '+square.teams.toString()+', conflict: '+adjudicator_conflicts.toString())
    }

    return warnings
}

function warn_past(square, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, f, position) {//TESTED//
    var warnings = []
    var adjudicator_watched_teams = Array.prototype.concat.apply([], f(square).map(id => sys.find_one(compiled_adjudicator_results, id).watched_teams))
    if (math.count_common(square.teams, adjudicator_watched_teams) !== 0) {
        warnings.push('adjudicators already judged the teams')
    }
    return warnings
}

function warn_bubble(square, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, f, position) {
    var warnings = []

    undefined

    return warnings
}

function check (allocation, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts) {//FOR NA
    var new_allocation = sys.allocation_deepcopy(allocation)
    for (var square of new_allocation) {
        var functions = [error_available, warn_past, warn_strength, warn_institution, warn_conflict, warn_bubble]
        for (var func of functions) {
            square.warnings = square.warnings.concat(func(square, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, x=>x.chairs, 'chair'))
            square.warnings = square.warnings.concat(func(square, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, x=>x.panels, 'panel'))
            square.warnings = square.warnings.concat(func(square, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, x=>x.trainees, 'trainee'))
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
