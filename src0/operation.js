var sys = require('./operations/sys.js')
var tools = require('./tools/tools.js')
var matchings = require('./operations/matchings.js')
var filters = require('./operations/filters.js')
var adjfilters = require('./operations/adjfilters.js')
var _ = require('underscore/underscore.js')

function get_team_allocation (db, filter_functions) {
    var teams = db.teams.search({available: true})
    var sorted_teams = teams.sort_teams()
    //console.log(sorted_teams)
    const ranks = sys.get_ranks(teams, db, filter_functions)
    var ts = tools.get_ids(teams.sort_teams())
    var matching = matchings.m_gale_shapley(ts, ranks)
    var team_allocation = sys.get_team_allocation_from_matching(matching, sorted_teams)
    return team_allocation
}

function get_adjudicator_allocation (team_allocation, db, filter_functions_adj, filter_functions_adj2) {
    var teams = db.teams.search({available: true})
    var adjudicators = db.adjudicators.search({available: true})
    var sorted_adjudicators = adjudicators.sort_adjudicators()
    const [g_ranks, a_ranks] = sys.get_ranks2(team_allocation, teams, adjudicators, db, filter_functions_adj, filter_functions_adj2)

    var as = tools.get_ids(team_allocation.sort_allocation(db))
    var matching2 = matchings.gale_shapley(as, tools.get_ids(adjudicators), g_ranks, a_ranks)

    var adjudicator_allocation = sys.get_adjudicator_allocation_from_matching(team_allocation, matching2)
    return adjudicator_allocation
}

function get_venue_allocation(allocation, db) {
    var venues = db.venues.search({available: true}).sort_venues()
    var new_allocation = tools.allocation_deepcopy(allocation)
    var i = 0
    for (pair of new_allocation) {
        pair.venue = venues[i].id
        i += 1
    }
    return new_allocation
}

class OP {
    constructor (con) {
        this.con = con
        this.allocation = null
    }

    get_allocation (
            filter_functions = [filters.filter_by_strength, filters.filter_by_side, filters.filter_by_institution, filters.filter_by_past_opponent],
            filter_functions_adj = [adjfilters.filter_by_bubble, adjfilters.filter_by_strength, adjfilters.filter_by_attendance],
            filter_functions_adj2 = [adjfilters.filter_by_conflict, adjfilters.filter_by_institution, adjfilters.filter_by_past],
            allocate_judge = true,
            allocate_venue = true
        ) {
        //console.log(this.teams.get())
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
        results.map(dict => tools.check_keys(dict, ['id','win','margin','sum','opponents','side']))
        for (result of results) {
            var team = tools.get_element_by_id(this.tournament.db.teams.get(), result.id)
            team.set_result(result.side, result.win, result.sum, result.margin, result.opponents)
        }
    };

    process_adjudicator_results (results) {
        results.map(dict => tools.check_keys(dict, ['id','score','watched_teams']))
        for (result of results) {
            var adjudicator = tools.get_element_by_id(this.tournament.db.adjudicators.get(), result.id)
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

exports.OP = OP
