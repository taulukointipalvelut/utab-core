"use strict";

function check_raw_debater_results(raw_debater_results, debaters, r) {
    for (var debater of debaters) {
        var results = raw_debater_results.filter(rdr => rdr.id === debater.id && rdr.r === r)
        if (results.length === 0) {
            throw new Error('results of ' + 'debater' + ': '+debater.id + ' is not sent')
        }
    }
}

function check_raw_adjudicator_results(raw_adjudicator_results, adjudicators, r) {
    for (var adjudicator of adjudicators) {
        var results = raw_adjudicator_results.filter(rar => rar.id === adjudicator.id && rar.r === r)
        if (results.length === 0) {
            throw new Error('results of ' + 'adjudicator' + ': '+adjudicator.id + ' is not sent')
        }
    }
}

function check_raw_team_results(raw_team_results, teams, r) {
    for (var team of teams) {
        var results = raw_team_results.filter(rdr => rdr.id === team.id && rdr.r === r)
        if (results.length === 0) {
            throw new Error('results of ' + 'team' + ': '+team.id + ' is not sent')
        }
        if (results.length % 2 === 0) {
            throw new Error('cannot decide win of team '+team.id)
        }
    }
}

//check_raw_debater_results([{id: 1, r: 1}, {id: 2, r: 1}], [{id: 1}, {id: 2}], 1)

//check_raw_team_results([{id: 1, r: 1}, {id: 2, r: 1}, {id: 2, r: 1}], [{id: 1}, {id: 2}], 1)

exports.check_raw_debater_results = check_raw_debater_results
exports.check_raw_team_results = check_raw_team_results
exports.check_raw_adjudicator_results = check_raw_adjudicator_results
