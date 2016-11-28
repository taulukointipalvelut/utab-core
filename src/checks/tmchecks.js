"use strict"
var sys = require('../allocations/sys.js')
var math = require('../general/math.js')

function error_available(square, teams, compiled_team_results, teams_to_institutions, team_num) {
    var errors = []
    for (var id of square.teams) {
        if (!sys.find_one(teams, id).available) {
            errors.push('ERROR: unavaiable team appears in the square')
        }
    }
    return errors
}

function warn_side(square, teams, compiled_team_results, teams_to_institutions, team_num) {
    var warnings = []

    var sides = team_num === 4 ? ['og', 'oo', 'cg', 'co'] : ['gov', 'opp']
    for (var i = 0; i < team_num; i++) {
        var team = square.teams[i]
        var side = sides[i]
        var team_past_sides = sys.find_one(compiled_team_results, team).past_sides
        if (team_num === 2) {
            var team_one_sided = sys.one_sided(past_sides.concat([side]))
            if (Math.abs(team_one_sided) > 1) {
                warnings.push('team id ' + team + ' is one sided: '+team_past_sides)
            }
        } else if (team_num === 4) {
            var [team_one_sided_opening, team_one_sided_gov] = sys.one_sided_bp(team_past_sides.concat([side]))
            if (Math.abs(team_one_sided_opening) > 1) {
                warnings.push('team id ' + team + ' is one sided to opening/closing: '+team_past_sides)
            }
            if (Math.abs(team_one_sided_gov) > 1) {
                warnings.push('team id ' + team + ' is one sided to government/opposition: '+team_past_sides)
            }
        }
    }

    return warnings
}

function warn_past_opponent(square, teams, compiled_team_results, teams_to_institutions, team_num) {//TESTED//
    var warnings = []
    for (var team of square.teams) {
        var team_past_opponents = sys.find_one(compiled_team_results, team).past_opponents
        var other_teams = square.teams.filter(id => id !== team.id)
        var experienced = math.count_common(team_past_opponents, other_teams)
        if (experienced > 0) {
            warnings.push('team id ' + team + ' matches against the same '+experienced+' opponents in the past')
        }
    }
    return warnings
}

function warn_strength(square, teams, compiled_team_results, teams_to_institutions, team_num) {//TESTED//
    var warnings = []
    var wins = square.teams.map(id => sys.find_one(compiled_team_results, id).win)
    if (Array.from(new Set(wins)).length !== 1) {
        warnings.push('square with teams of different win :' + wins)
    }
    return warnings
}

function warn_institution(square, teams, compiled_team_results, teams_to_institutions, team_num) {
    var warnings = []

    var cs = math.combinations(square.teams, 2)
    for (var combination of cs) {
        var team0 = combination[0]
        var team1 = combination[1]
        if (math.count_common(sys.find_one(teams_to_institutions, team0).institutions, sys.find_one(teams_to_institutions, team1).institutions) !== 0) {
            warnings.push('institution is the same: teams: '+team0.toString()+'vs'+team1.toString())
        }
    }
    return warnings
}

function check (allocation, teams, compiled_team_results, teams_to_institutions, team_num) {
    var new_allocation = sys.allocation_deepcopy(allocation)
    for (var square of new_allocation) {
        var functions = [error_available, warn_side, warn_past_opponent, warn_strength, warn_institution]
        for (var func of functions) {
            square.warnings = square.warnings.concat(func(square, teams, compiled_team_results, teams_to_institutions, team_num))
        }
    }
    return new_allocation
}

exports.check = check
/*
//insti, strength

var allocation = [{teams: [0, 1]}, {teams: [2, 3]}]
var compiled_team_results = {
    0: {
        win: 2,
        past_opponents: [1],
        past_sides: ['gov']
    },
    1: {
        win: 2,
        past_opponents: [0],
        past_sides: ['opp']
    },
    2: {
        win: 1,
        past_opponents: [1],
        past_sides: ['opp']
    },
    3: {
        win: 0,
        past_opponents: [1],
        past_sides: ['gov']
    },
}
var teams_to_institutions = {
    0: [2],
    1: [1],
    2: [1, 3],
    3: [2, 3]
}
console.log(checks(allocation, compiled_team_results, teams_to_institutions))
*/
