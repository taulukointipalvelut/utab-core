"use strict"

var tools = require('./tools.js');
var filters = require('./filters.js');

function compare_by_x(a, b, f, tf=true) {
    var point_a = f(a)
    var point_b = f(b)
    if (point_a > point_b) {
        return tf ? -1 : 1
    } else if (point_a < point_b) {
        return tf ? 1 : -1
    } else {
        return 0
    }
}

function compare_by_score(a, b) {
    var v_compare_by_win = compare_by_x(a, b, x => x.wins.sum())
    if (v_compare_by_win === 0) {
        var v_compare_by_score = compare_by_x(a, b, x => x.scores.adjusted_average())
        if (v_compare_by_score === 0) {
            var v_compare_by_margin = compare_by_x(a, b, x => x.margins.adjusted_average())
            return v_compare_by_margin >= 0 ? -1 : 1
        } else {
            return v_compare_by_score
        }
    } else {
        return v_compare_by_win
    }
};

function compare_by_score_adj(a, b) {
    a.evaluate() > b.evaluate() ? -1 : 1
}

function sort_decorator(base, filter_functions) {
    function _(a, b) {
        for (var func of filter_functions) {
            var c = func(base, a, b)
            if (c !== 0) {
                return c
            }
        }
        return a.id > b.id ? -1 : 1
    }
    return _
}

function get_ranks (teams, filter_functions) {
    /* priority
    1. side
    2. strength
    3. institution
    4. past_opponent
    */
    var ranks = {};
    //console.log(ranks)

    for (var team of teams) {
        var others = teams.filter(other => team.id != other.id)
        others.sort(sort_decorator(team, filter_functions))
        ranks[team.id] = tools.get_ids(others)
    };
    return ranks
}

function get_ranks2 (team_allocation, teams, adjudicators, filter_functions, filter_functions2) {
    var g_ranks = {}
    var a_ranks = {}
    for (var pair of team_allocation) {
        var pair_teams = pair.teams.map(x => tools.get_element_by_id(teams, x))
        adjudicators.sort(sort_decorator(pair_teams, filter_functions))
        g_ranks[pair.id] = tools.get_ids(adjudicators)
    }
    for (var adjudicator of adjudicators) {
        team_allocation.sort(sort_decorator(adjudicator, filter_functions2))
        a_ranks[adjudicator.id] = tools.get_ids(team_allocation)
    }

    return [g_ranks, a_ranks]
}

function get_adjudicator_allocation_from_matching(team_allocation, matching) {
    new_allocation = tools.allocation_deepcopy(team_allocation)
    for (var i in matching) {
        var target_allocation = tools.get_element_by_id(team_allocation, i)
        target_allocation.chairs = [matching[i]]
    }
    return new_allocation
}

function set_remaining_adjudicators(allocation, adjudicators, maxnum) {
    adjudicators.sort_adjudicators()
    var new_allocation = tools.allocation_deepcopy(allocation)
    var c = 0
    for (adjudicator of adjudicators) {
        if (c < maxnum) {
            c === 0 ? new_allocation.remaining_adjudicators = [] : new_allocation.remaining_adjudicators.push(adjudicator)
            c += 1
        } else {
            c = 0
        }
    }
    return new_allocation
}

function get_team_allocation_from_matching(matching, sorted_teams) {
    var remaining = [].concat(sorted_teams)
    var team_allocation = []
    var id = 0
    for (var key in matching) {
        var team_a = tools.get_element_by_id(sorted_teams, parseInt(key))
        var team_b = tools.get_element_by_id(sorted_teams, matching[key])
        if (remaining.filter(x => x.id === team_a.id).length === 0) {
            continue
        }
        if (team_a.one_sided() > 0) {
            if (team_b.one_sided() < team_a.one_sided()) {
                team_allocation.push({teams: [team_b.id, team_a.id], id: id})
            } else {
                team_allocation.push({teams: [team_a.id, team_b.id], id: id})
            }
        } else if (team_a.one_sided() < 0) {
            if (team_b.one_sided() > team_a.one_sided()) {
                team_allocation.push({teams: [team_a.id, team_b.id], id: id})
            } else {
                team_allocation.push({teams: [team_b.id, team_a.id], id: id})
            }
        } else {
            if (team_b.one_sided() > 0) {
                team_allocation.push({teams: [team_a.id, team_b.id], id: id})
            } else if (team_b.one_sided() < 0) {
                team_allocation.push({teams: [team_b.id, team_a.id], id: id})
            } else {
                var i = Math.floor(Math.random()*2)
                var ids = [team_a.id, team_b.id]
                team_allocation.push({teams: [ids[i], ids[1 - i]], id: id})
            }
        }
        remaining = remaining.filter(x => x.id !== team_a.id & x.id !== team_b.id)
        id += 1
    }
    return team_allocation
}

function get_adjudicator_allocation(team_allocation, sorted_adjudicators) {
    var adjudicator_allocation = []
    for (pair of team_allocation) {
        adjudicator_allocation.push({})
    }
    return team_allocation//adjudicator_allocation
}

function check_teams(teams) {
    if (teams.length % 2 === 1) {
        throw new Error("the number of teams should be odd")
    }

    console.log(teams.length)
    for (var i = 0; i < teams.length; i++) {
        for (var j = i + 1; j < teams.length; j++) {
            if (teams[i].id === teams[j].id) {
                throw new Error("same team exists")
            }
        }
    }
}
//check_teams([{id: 1}, {id: 2}, {id: 3}])
//check_teams([{id: 1}, {id: 1}])


/*

Example

*/
exports.get_team_allocation_from_matching = get_team_allocation_from_matching;
exports.get_adjudicator_allocation = get_adjudicator_allocation;
exports.get_ranks = get_ranks;
exports.get_ranks2 = get_ranks2;
exports.get_adjudicator_allocation_from_matching = get_adjudicator_allocation_from_matching;


(function () {
    Array.prototype.sum = function () {
        if (this.length === 0) {
            return 0
        } else {
            return this.reduce((a, b) => a + b)
        }
    }

    Array.prototype.adjusted_average = function () {
        var sum = this.sum()
        if (this.length == 0) {
            return 0
        } else {
            return sum/this.length
        }
    }

    Array.prototype.sort_teams = function () {
        var sorted_teams = [].concat(this)
        sorted_teams.sort(compare_by_score)
        return sorted_teams
    }

    Array.prototype.sort_adjudicators = function () {
        var sorted_adjudicators = [].concat(this)
        sorted_adjudicators.sort(compare_by_score_adj)
        return sorted_adjudicators
    }
})();
