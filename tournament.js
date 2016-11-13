var sys = require('./lib/sys.js')
var entities = require('./lib/entities.js')
var tools = require('./lib/tools.js')
var _ = require('underscore.js')

Round = function (r, tournament) {
    this.r = r
    this.tournament = tournament
}

Round.prototype.get_allocation = function (filter_functions = [filters.filter_by_strength, filters.filter_by_side, filters.filter_by_institution, filters.filter_by_past_opponent]) {
    //console.log(this.teams)
    var teams = this.tournament.teams
    var sorted_teams = teams.sort_teams()
    //console.log(sorted_teams)
    var ranks = sys.get_ranks(teams, filter_functions)//problem
    var matching = sys.do_matching(teams, ranks)
    var team_allocation = sys.get_team_allocation_from_matching(matching, sorted_teams)

    var adjudicators = this.tournament.adjudicators
    var sorted_adjudicators = adjudicators.sort_adjudicators()
    var adjudicator_allocation = sys.get_adjudicator_allocation(team_allocation, sorted_adjudicators)

    return adjudicator_allocation
}

Round.prototype.process_result = function (results) {
    for (result of results) {
        var team1 = tools.get_team_by_id(this.tournament.teams, result.team1.team_id)
        var team2 = tools.get_team_by_id(this.tournament.teams, result.team2.team_id)
        var margin = result.team1.score - result.team2.score
        team1.set_result(result.team1.side, result.team1.win, result.team1.score, margin, result.team2.team_id)
        team2.set_result(result.team2.side, result.team2.win, result.team2.score, -margin, result.team1.team_id)
    }
};

Tournament = function (tournament_name, total_round_num) {
    this.tournament_name = tournament_name
    this.adjudicators = []
    this.teams = []
    this.rounds = _.range(0, total_round_num).map(x => new Round(x + 1, this))
    this.current_round_num = 1
}

Tournament.prototype.get_current_round = function () {
    return this.rounds[this.current_round_num - 1]
}

Tournament.prototype.set_team = function ({team_id: team_id, institution_ids: institution_ids}) {
    this.teams.push(new entities.Team(team_id, institution_ids))
}

Tournament.prototype.set_adjudicator = function ({adjudicator_id: adjudicator_id, institution_ids: institution_ids}) {
    this.adjudicators.push(new entities.Adjudicator(adjudicator_id, institution_ids))
}

Tournament.prototype.get_teams = function () {
    return this.teams
}

Tournament.prototype.get_adjudicators = function () {
    return this.adjudicators
}

module.exports.Tournament = Tournament
