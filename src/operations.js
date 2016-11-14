var sys = require('./operations/sys.js')
var tools = require('./tools/tools.js')
var matchings = require('./operations/matchings.js')
var filters = require('./operations/filters.js')
var adjfilters = require('./operations/adjfilters.js')
var _ = require('underscore/underscore.js')

function get_team_allocation (db, filter_functions) {
    var teams = db.teams.filter(t => t.available)
    var sorted_teams = teams.sort_teams()
    //console.log(sorted_teams)
    const ranks = sys.get_ranks(teams, db, filter_functions)
    var ts = tools.get_ids(teams.sort_teams())
    var matching = matchings.m_gale_shapley(ts, ranks)
    var team_allocation = sys.get_team_allocation_from_matching(matching, sorted_teams)
    return team_allocation
}

function get_adjudicator_allocation (team_allocation, db, filter_functions_adj, filter_functions_adj2) {
    var teams = db.teams.filter(t => t.available)
    var adjudicators = db.adjudicators.filter(a => a.available)
    var sorted_adjudicators = adjudicators.sort_adjudicators()
    const [g_ranks, a_ranks] = sys.get_ranks2(team_allocation, teams, adjudicators, db, filter_functions_adj, filter_functions_adj2)

    var as = tools.get_ids(team_allocation.sort_allocation(db))
    var matching2 = matchings.gale_shapley(as, tools.get_ids(adjudicators), g_ranks, a_ranks)

    var adjudicator_allocation = sys.get_adjudicator_allocation_from_matching(team_allocation, matching2)
    return adjudicator_allocation
}

function get_venue_allocation(allocation, db) {
    var venues = db.venues.filter(v => v.available).sort_venues()
    var new_allocation = tools.allocation_deepcopy(allocation)
    var i = 0
    for (pair of new_allocation) {
        pair.venue = venues[i].id
        i += 1
    }
    return new_allocation
}

class Round {
    constructor (r, tournament) {
        this.r = r
        this.tournament = tournament
        this.allocation = null
    }

    get_allocation (
            filter_functions = [filters.filter_by_strength, filters.filter_by_side, filters.filter_by_institution, filters.filter_by_past_opponent],
            filter_functions_adj = [adjfilters.filter_by_bubble, adjfilters.filter_by_strength, adjfilters.filter_by_attendance],
            filter_functions_adj2 = [adjfilters.filter_by_conflict, adjfilters.filter_by_institution, adjfilters.filter_by_past],
            allocate_judge = true,
            allocate_venue = true
        ) {
        //console.log(this.teams)
        var allocation = get_team_allocation(this.tournament.db, filter_functions).shuffle()

        if (allocate_judge) {
            allocation = get_adjudicator_allocation(allocation, this.tournament.db, filter_functions_adj, filter_functions_adj2).shuffle()
            //console.log(adjudicator_allocation)
        }
        if (allocate_venue) {
            allocation = get_venue_allocation(allocation, this.tournament.db).shuffle()
        }

        return allocation
    }

    set_allocation (allocation) {
        allocation.map(dict => tools.check_keys(dict, ['warnings','teams','chairs','remaining_adjudicators1','remaining_adjudicators2','venue']))
        this.allocation = allocation
    }

    check_allocation (allocation) {
        allocation.map(dict => tools.check_keys(dict, ['warnings','teams','chairs','remaining_adjudicators1','remaining_adjudicators2','venue']))
        throw new Error('not done')
    }

    process_results (results) {
        results.map(dict => tools.check_keys(dict, ['id','uid','win','margin','sum','opponents','side']))
        for (result of results) {
            var team1 = tools.get_element_by_id(this.tournament.db.teams, result.team1.id)
            var team2 = tools.get_element_by_id(this.tournament.db.teams, result.team2.id)
            var margin = result.team1.score - result.team2.score
            team1.set_result(result.team1.side, result.team1.win, result.team1.score, margin, result.team2.id)
            team2.set_result(result.team2.side, result.team2.win, result.team2.score, -margin, result.team1.id)
        }
    };

    process_adjudicator_results (results) {
        results.map(dict => tools.check_keys(dict, ['id','uid','score','watched_teams','comment']))
        for (result of results) {
            var adjudicator = tools.get_element_by_id(this.tournament.db.adjudicators, result.id)
            adjudicator.set_result(result.watched_team_ids, result.score)
        }
    }
}
function get_result_of_team (t, r=null) {
    if (r === null) {
        var dict = {
            id: t.id,
            win: t.wins.sum(),
            score: t.scores.sum()
        }
    } else {
        var dict = {
            id: t.id,
            win: t.wins[r-1],
            score: t.scores[r-1]
        }
    }
    return dict
}

class OP {
    constructor (db) {
        this.db = db
        this.rounds = _.range(0, this.db.total_round_num).map(i => new Round(i + 1, this))
    }

    get_current_round () {
        return this.rounds[this.db.current_round_num - 1]
    }

/*    get_team_results (r=null, summarize=false) {
        if (r === null) {
            if (summarize) {
                return []
            } else {
                return this.db.teams.map(t => get_result_of_team(t))
            }
        } else {
            //console.log(this.db.teams[0].id)
            return this.teams.map(t => get_result_of_team(t, r))
        }
    }*/
}

module.exports.OP = OP
