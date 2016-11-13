var sys = require('./src/sys.js')
var entities = require('./src/entities.js')
var tools = require('./src/tools.js')
var matchings = require('./src/matchings.js')
var filters = require('./src/filters.js')
var adjfilters = require('./src/adjfilters.js')
var _ = require('underscore.js')

Round = function (r, tournament) {
    this.r = r
    this.tournament = tournament
}

function get_team_allocation (tournament, filter_functions) {
    var teams = tournament.teams.filter(t => t.available)
    var sorted_teams = teams.sort_teams()
    //console.log(sorted_teams)
    const ranks = sys.get_ranks(teams, filter_functions)
    var ts = tools.get_ids(teams.sort_teams())
    var matching = matchings.m_gale_shapley(ts, ranks)
    var team_allocation = sys.get_team_allocation_from_matching(matching, sorted_teams)
    return team_allocation
}

function get_adjudicator_allocation (team_allocation, tournament, filter_functions_adj, filter_functions_adj2) {
    var teams = tournament.teams.filter(t => t.available)
    var adjudicators = tournament.adjudicators.filter(a => a.available)
    var sorted_adjudicators = adjudicators.sort_adjudicators()
    const [g_ranks, a_ranks] = sys.get_ranks2(team_allocation, teams, adjudicators, tournament, filter_functions_adj, filter_functions_adj2)

    var as = tools.get_ids(team_allocation.sort_allocation(tournament))
    var matching2 = matchings.gale_shapley(as, tools.get_ids(adjudicators), g_ranks, a_ranks)

    var adjudicator_allocation = sys.get_adjudicator_allocation_from_matching(team_allocation, matching2)
    return adjudicator_allocation
}

function get_venue_allocation(allocation, tournament) {
    var venues = tournament.venues.filter(v => v.available).sort_venues()
    var new_allocation = tools.allocation_deepcopy(allocation)
    var i = 0
    for (pair of new_allocation) {
        pair.venue = venues[i].id
        i += 1
    }
    return new_allocation
}

Round.prototype.get_allocation = function (
        filter_functions = [filters.filter_by_strength, filters.filter_by_side, filters.filter_by_institution, filters.filter_by_past_opponent],
        filter_functions_adj = [adjfilters.filter_by_bubble, adjfilters.filter_by_strength, adjfilters.filter_by_attendance],//
        filter_functions_adj2 = [adjfilters.filter_by_institution, adjfilters.filter_by_past],
        allocate_judge = true,
        allocate_venue = true
    ) {
    //console.log(this.teams)
    var allocation = get_team_allocation(this.tournament, filter_functions).shuffle()

    if (allocate_judge) {
        allocation = get_adjudicator_allocation(allocation, this.tournament, filter_functions_adj, filter_functions_adj2).shuffle()
        //console.log(adjudicator_allocation)
    }
    if (allocate_venue) {
        allocation = get_venue_allocation(allocation, this.tournament).shuffle()
    }

    return allocation
}

Round.prototype.process_results = function (results) {
    for (result of results) {
        var team1 = tools.get_element_by_id(this.tournament.teams, result.team1.id)
        var team2 = tools.get_element_by_id(this.tournament.teams, result.team2.id)
        var margin = result.team1.score - result.team2.score
        team1.set_result(result.team1.side, result.team1.win, result.team1.score, margin, result.team2.id)
        team2.set_result(result.team2.side, result.team2.win, result.team2.score, -margin, result.team1.id)
    }
};

Round.prototype.process_result_of_adjudicators = function (results) {
    for (result of results) {
        var adjudicator = tools.get_element_by_id(this.tournament.adjudicators, result.id)
        adjudicator.set_result(result.watched_team_ids, result.score)
    }
}

Tournament = function (tournament_name, total_round_num) {
    this.tournament_name = tournament_name
    this.adjudicators = []
    this.teams = []
    this.venues = []
    this.rounds = _.range(0, total_round_num).map(x => new Round(x + 1, this))
    this.current_round_num = 1
    this.total_round_num = total_round_num
}

Tournament.prototype.get_current_round = function () {
    return this.rounds[this.current_round_num - 1]
}

Tournament.prototype.set_team = function ({id: id, institution_ids: institution_ids}) {
    this.teams.push(new entities.Team(id, institution_ids))
}

Tournament.prototype.set_adjudicator = function ({id: id, institution_ids: institution_ids}) {
    this.adjudicators.push(new entities.Adjudicator(id, institution_ids))
}

Tournament.prototype.set_venue = function ({id: id, priority: priority}) {
    this.venues.push(new entities.Venue(id, priority))
}

Tournament.prototype.get_teams = function () {
    return this.teams
}

Tournament.prototype.get_adjudicators = function () {
    return this.adjudicators
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

Tournament.prototype.get_team_results = function (r=null, summarize=false) {
    if (r === null) {
        if (summarize) {
            return []
        } else {
            return this.teams.map(t => get_result_of_team(t))
        }
    } else {
        //console.log(this.teams[0].id)
        return this.teams.map(t => get_result_of_team(t, r))
    }
}

module.exports.Tournament = Tournament
