"use strict";

function results_precheck(teams, raw_teams_to_debaters, debaters, r) {
    if (r > 1) {
        check_xs2is(teams, raw_teams_to_debaters, debaters, 'team', 'debaters', (d, id) => d.id === id && d.r === r)
    }
}

exports.results_precheck = results_precheck
