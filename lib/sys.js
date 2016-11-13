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

function get_ranks (teams, filter_functions) {
    /* priority
    1. side
    2. strength
    3. institution
    4. past_opponent
    */
    var ranks = {};
    function sort_teams_decorator(team) {
        function _(a, b) {
            for (func of filter_functions) {
                var c = func(team, a, b)
                if (c !== 0) {
                    return c
                }
            }
            return a.team_id > b.team_id ? -1 : 1
        }
        return _
    };
    //console.log(ranks)

    for (team of teams) {
        others = teams.filter(other => team.team_id != other.team_id)
        others.sort(sort_teams_decorator(team))
        ranks[team.team_id] = others.map(x => x.team_id)
    };
    return ranks
}

function do_matching (teams, ranks) { // modified gale shapley algorithm
    var matching = {}
    var rank_pointers = {}
    for (team of teams) {
        matching[team.team_id] = null
        rank_pointers[team.team_id] = 0
    }

    var remaining = [].concat(teams.map(team => team.team_id))
    while (remaining.length > 1) {
        ap_id = remaining[0]
        for (op_id of ranks[ap_id]) {
            if (matching[op_id] === null | ranks[op_id].indexOf(matching[op_id]) > ranks[op_id].indexOf(ap_id)) {
                if (matching[op_id] !== null) {
                    rank_pointers[matching[op_id]] += 1
                    matching[matching[op_id]] = null
                }
                matching[ap_id] = op_id
                matching[op_id] = ap_id
                break
            } else {
                rank_pointers[ap_id] += 1
            }
        }
        remaining = teams.filter(x => matching[x.team_id] === null).map(x => x.team_id)
    }
    return matching
}

function get_team_allocation_from_matching(matching, sorted_teams) {
    var remaining = [].concat(sorted_teams)
    var team_allocation = []
    for (key in matching) {
        team_a = tools.get_team_by_id(sorted_teams, parseInt(key))
        team_b = tools.get_team_by_id(sorted_teams, matching[key])
        if (remaining.filter(x => x === team_a).length === 0) {
            continue
        }
        if (team_a.one_sided() > 0) {
            if (team_b.one_sided() < team_a.one_sided()) {
                team_allocation.push({team1: team_b.team_id, team2: team_a.team_id})
            } else {
                team_allocation.push({team1: team_a.team_id, team2: team_b.team_id})
            }
        } else if (team_a.one_sided() < 0) {
            if (team_b.one_sided() > team_a.one_sided()) {
                team_allocation.push({team1: team_a.team_id, team2: team_b.team_id})
            } else {
                team_allocation.push({team1: team_b.team_id, team2: team_a.team_id})
            }
        } else {
            if (team_b.one_sided() > 0) {
                team_allocation.push({team1: team_a.team_id, team2: team_b.team_id})
            } else if (team_b.one_sided() < 0) {
                team_allocation.push({team1: team_b.team_id, team2: team_a.team_id})
            } else {
                var i = Math.floor(Math.random()*2)
                ids = [team_a.team_id, team_b.team_id]
                team_allocation.push({team1: ids[i], team2: ids[1 - i]})
            }
        }
        remaining = remaining.filter(x => x !== team_a & x !== team_b)
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
            if (teams[i].team_id === teams[j].team_id) {
                throw new Error("same team exists")
            }
        }
    }
}
//check_teams([{team_id: 1}, {team_id: 2}, {team_id: 3}])
//check_teams([{team_id: 1}, {team_id: 1}])


/*

Example

*/
exports.do_matching = do_matching;
exports.get_team_allocation_from_matching = get_team_allocation_from_matching;
exports.get_adjudicator_allocation = get_adjudicator_allocation;
exports.get_ranks = get_ranks;



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
        return this.sort(compare_by_score)
    }

    Array.prototype.sort_adjudicators = function () {
        return this
    }
})();
