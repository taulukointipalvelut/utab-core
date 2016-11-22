"use strict"
var sys = require('../allocations/sys.js')
var math = require('../general/math.js')

function error_available(square, teams, compiled_team_results, teams_to_institutions) {
    var errors = []
    for (var id of square.teams) {
        if (!teams.filter(t => t.id === id)[0].available) {
            errors.push('ERROR: unavaiable team appears in the square')
        }
    }
    return errors
}

function warn_side(square, teams, compiled_team_results, teams_to_institutions) {//TESTED//
    var warnings = []
    var team0_past_sides = compiled_team_results[square.teams[0]].past_sides
    var team1_past_sides = compiled_team_results[square.teams[1]].past_sides
    var team0_one_sided = sys.one_sided(team0_past_sides) + 1
    var team1_one_sided = sys.one_sided(team1_past_sides) - 1
    if (Math.abs(team0_one_sided) > 1) {
        warnings.push('team id ' + square.teams[0] + ' one_sided: '+team0_past_sides)
    }
    if (Math.abs(team1_one_sided) > 1) {
        warnings.push('team id ' + square.teams[1] + ' one_sided: '+team1_past_sides)
    }
    return warnings
}

function warn_past_opponent(square, teams, compiled_team_results, teams_to_institutions) {//TESTED//
    var warnings = []
    for (var team of square.teams) {
        var team_past_opponents = compiled_team_results[team].past_opponents
        var other_teams = square.teams.filter(id => id !== team.id)
        var experienced = math.count_common(team_past_opponents, other_teams)
        if (experienced > 0) {
            warnings.push('team id ' + team + ' matches against the same '+experienced+' opponents in the past')
        }
    }
    return warnings
}

function warn_strength(square, teams, compiled_team_results, teams_to_institutions) {//TESTED//
    var warnings = []
    var wins = square.teams.map(id => compiled_team_results[id].win)
    if (Array.from(new Set(wins)).length !== 1) {
        warnings.push('square with teams of different win :' + wins)
    }
    return warnings
}

function warn_institution(square, teams, compiled_team_results, teams_to_institutions) {//TESTED//
    var warnings = []
    for (var i = 0; i < square.teams.length; i++) {
        for (var j = i + 1; j < square.teams.length; j++) {
            var team0 = square.teams[i]
            var team1 = square.teams[j]
            if (math.count_common(teams_to_institutions[team0], teams_to_institutions[team1]) !== 0) {
                warnings.push('institution is the same: teams: '+team0.toString()+'vs'+team1.toString())
            }
        }
    }
    return warnings
}

function check (allocation, teams, compiled_team_results, teams_to_institutions) {//FOR NA
    var new_allocation = sys.allocation_deepcopy(allocation)
    for (var square of new_allocation) {
        var functions = [error_available, warn_side, warn_past_opponent, warn_strength, warn_institution]
        for (var func of functions) {
            square.warnings = square.warnings.concat(func(square, teams, compiled_team_results, teams_to_institutions))
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
