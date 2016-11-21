"use strict";
/**
 * Interfaces to operate UTab core
 * @module core
 * @author taulukointipalvelut@gmail.com (nswa17)
 * @file Interfaces to manage tournament
 * @todo simple allocation
 * @version 1.1
 * @example
 * var core = require('./core.js')
 *
 * var t_id = 234234
 * core.tournaments.read().then(console.log) //print all tournaments
 * core.tournaments.create({id: t_id, name: "testtournament"})
 * core.connect(t_id)
 * core.teams.read().then(console.log) //print all teams
 */

let operations = require('./src/operations.js')
let controllers = require('./src/controllers.js')
let _ = require('underscore/underscore.js')
let con = new controllers.CON()
let op = new operations.OP()

/**
 * Represents a pair/set of teams in a venue. A minimum unit to be an allocation.
 * @typedef Square
 * @property {Number} id id of the Square
 * @property {Number[]} teams teams in the Square
 * @property {Number[]} chairs chairs in the Square
 * @property {Number[]} remaining_adjudicators adjudicators(panels) in the Square
 * @property {Number[]} remaining_adjudicators2 adjudicators(trainees) in the Square
 * @property {String[]} warnings warnings
 * @property {Number} venue
 */

 /**
  * Represents a team.
  * @typedef Team
  * @property {Number} id id of the Team
  * @property {String} name name of the Team
  * @property {Boolean} available available
  * @property {String} url url of the Team
  */

  /**
   * Represents an adjudicator.
   * @typedef Adjudicator
   * @property {Number} id id of the Adjudicator
   * @property {Number} preev pre evaluation(judge test) of the Adjudicator
   * @property {String} name name of the Adjudicator
   * @property {Boolean} available available
   * @property {String} url url of the Adjudicator
   */

/**
 * Represents a venue.
 * @typedef Venue
 * @property {Number} id id of the Venue
 * @property {Number} priority priority of the Venue
 * @property {String} name name of the Venue
 * @property {Boolean} available available
 * @property {String} url url of the Venue
 */

/**
 * Represents an institution.
 * @typedef Institution
 * @property {Number} id id of the Institution
 * @property {String} name name of the Institution
 * @property {Boolean} available available
 * @property {String} url url of the Institution
 */

 /**
  * Represents raw team result.
  * @typedef RawTeamResult
  * @property {Number} id id of the team to evaluate
  * @property {Number} from_id id of the sender
  * @property {Number} r round number at which the result is sent
  * @property {Number} win in NA it's either 1(win) or 0(lose), in BP it's the win-points
  * @property {Number[]} opponents opponents of the team
  * @property {String} side side of the team
  * @example
  * {
  *   id: 1,
  *   from_id: 2,
  *   r: 1,
  *   win: 1,
  *   opponents: [2],
  *   side: "gov"
  * }
  */

/**
* Represents raw debater result.
* @typedef RawDebaterResult
* @property {Number} id id of the debater to evaluate
* @property {Number} from_id id of the sender
* @property {Number} r round number at which the result is sent
* @property {Number[]} scores scores the sender writes
* @example
* {
*   id: 1,
*   from_id: 2,
*   r: 1,
*   scores: [75, 0, 36.5]
* }
*/

/**
 * Represents raw adjudicator result.
 * @typedef RawAdjudicatorResult
 * @property {Number} id id of the adjudicator to evaluate
 * @property {Number} from_id id of the sender
 * @property {Number} r round number at which the result is sent
 * @property {Number} score the score of the adjudicator the sender writes
 * @property {Number[]} watched_teams teams the adjudicator watched
 * @property {String} [comment] the comment for the adjudicator from the sender
 */

/**
 * Represents debate style.
 * @typedef Style
 * @property {String} name style name
 * @property {Number} debater_num_per_team number of debaters per team
 * @property {Number} team_num number of team in a [Square]{@link Square}
 * @property {Number[]} score_weights weights of the scores
 * @property {Number} replies candidates of replies (Necessary only for testing)
 * @property {Number} reply_num number of replies in a [Square]{@link Square} (Necessary only for testing)
 * @example
 * {
 * name: "ASIAN",
 *  debater_num_per_team: 3,
 *  team_num: 2,
 *  score_weights: [1, 1, 1, 0.5],
 *  replies: [0, 1],
 *  reply_num: 1
 * }
 */

/**
 * Represents a tournament.
 * @typedef Tournament
 * @property {Number} id id of the tournament
 * @property {String} name name of the tournament
 * @property {String} url url of the tournament
 * @property {Number} current_round_num current round
 * @property {Number} total_round_num total round
 * @property {Style} style style of the tournament
 */

 /**
  * @param {Number} id - Unique ID of the tournament
  */

/**
 * connects to tournament database specified
 * @param  {Number} id unique id of the tournament
 */
function connect(id) {
    con.connect(id)
}
/**
 * close connection on tournament database
 */
function close() {
    con.close()
}

/**
 * Provides Interfaces related to tournaments
 * @namespace tournaments
 */
/**
 * reads all tournaments.//1.1TESTED//
 * @name tournaments.read
 * @memberof! tournaments
 * @function tournaments.read
 * @return {Promise.<Tournament[]>}
 */
 /**
  * create a tournament. //1.1TESTED//
  * @name tournaments.create
  * @memberof! tournaments
  * @function tournaments.create
  * @param tournament
  * @param {Number} tournament.id tournament id
  * @param {String} [tournament.tournament.name] tournament name
  * @param {String} [tournament.url] tournament url
  * @param {Style} [tournament.style] debating style
  * @param {Number} [tournament.total_round_num] total round
  * @param {Number} [tournament.current_round_num] current round(default 1)
  */
/**
 * @name tournaments.update
 * @memberof! tournaments
 * @function tournaments.update
 */
 /**
  * @name tournaments.delete
  * @memberof! tournaments
  * @function tournaments.delete
  */
var tournaments = con.tournaments

/**
 * Provides Interfaces related to teams
 * @namespace teams
 */
var teams = con.teams
/**
 * returns all teams(No side effect)
 * @name teams.read
 * @memberof! teams
 * @function teams.read
 * @return {Promise.<Team[]>} Teams
 */

/**
 * creates team.//TESTED//
 * Attention: It throws an error if the specified team already exists.
 * @name teams.create
 * @memberof! teams
 * @function teams.create
 * @param team
 * @param {Number} team.id id of the team to create
 * @param {Number} [team.name=""] name of the team to create
 * @param {Number} [team.available=true] id of the team to create
 * @param {Number} [team.url=""] id of the team to create
 * @return {Promise.<Team>} Created team
 * @throws {Promise} AlreadyExists
 */
/**
 * deletes specified team.//TESTED//
 * Attention: It throws an error if the specified team does not exist.
 * @name teams.delete
 * @memberof! teams
 * @function teams.delete
 * @param team
 * @param {Number} team.id id of the team to delete
 * @return {Promise.<Team>} Deleted team
 * @throws {Promise} DoesNotExist
 */
/**
 * finds on specified condition(No side effect)//TESTED//
 * @name teams.find
 * @memberof! teams
 * @function teams.find
 * @param team
 * @param {Number} [team.id] id of the team to find
 * @param {Number} [team.name] name of the team to find
 * @param {Number} [team.available] id of the team to find
 * @param {Number} [team.url] id of the team to find
 * @return {Promise.<Team[]>} Teams
 */
/**
 * updates specified team//TESTED//
 * Attention: It throws an error if the specified team does not exist.
 * @name teams.update
 * @memberof! teams
 * @function teams.update
 * @param team
 * @param {Number} team.id id of the team to update
 * @param {Number} [team.name=""] name of the team to update
 * @param {Number} [team.available=true] id of the team to update
 * @param {Number} [team.url=""] id of the team to update
 * @return {Promise.<Team>} Updated team
 * @throws DoesNotExist
 */
/**
 * @namespace teams.results
 * @memberof! teams
 */
/**
 * reads all raw team results(No side effect)
 * @name teams.results.read
 * @memberof! teams.results
 * @function teams.results.read
 * @returns {Promise.<RawTeamResult[]>}
 */
/**
 * Summarizes team results(No side effect)
 * @alias teams.results.organize
 * @memberof! teams.results
 * @param  {(Number | Number[])} r_or_rs round number(s) used to summarize results
 * @param options options for summarization
 * @param {Boolean} options.simple only use team results. No debater results is considered thus unable to output team points
 * @return {Promise} summarized team results
 */
teams.results.organize = function(r_or_rs, {simple: simple}={simple: false}) {
    if (simple) {
        if (Array.isArray(r_or_rs)) {
            return Promise.all([con.teams.read(), con.teams.results.read()]).then(function (vs) {
                var [teams, raw_team_results] = vs
                return op.teams.results.simplified_compile(teams, raw_team_results, r_or_rs)
            })
        } else {
            return Promise.all([con.teams.read(), con.teams.results.read()]).then(function (vs) {
                var [teams, raw_team_results] = vs
                return op.teams.results.simplified_summarize(teams, raw_team_results, r_or_rs)
            })
        }
    } else {
        if (Array.isArray(r_or_rs)) {
            return Promise.all([con.teams.read(), con.teams.debaters.read(), con.teams.debaters.read(), con.teams.results.read(), con.debaters.results.read(), con.rounds.read()]).then(function (vs) {
                var [teams, debaters, teams_to_debaters, raw_team_results, raw_debater_results, round_info] = vs
                return op.teams.results.compile(teams, debaters, teams_to_debaters, raw_team_results, raw_debater_results, round_info.style, r_or_rs)
            })
        } else {
            return Promise.all([con.teams.read(), con.teams.debaters.read(), con.teams.debaters.read(), con.teams.results.read(), con.debaters.results.read(), con.rounds.read()]).then(function (vs) {
                var [teams, debaters, teams_to_debaters, raw_team_results, raw_debater_results, round_info] = vs
                return op.teams.results.summarize(teams, debaters, teams_to_debaters, raw_team_results, raw_debater_results, round_info.style, r_or_rs)
            })
        }
    }
}

/**
 * Interfaces related to teams to debaters
 * @namespace debaters
 * @memberof! teams
 */
/**
 * returns teams to debaters(No side effect)
 * @name teams.debaters.read
 * @memberof! teams.debaters
 * @function teams.debaters.read
 * @return {Promise} Teams to debaters
 */
/**
 * sets debaters to a team.
 * Attention: It throws an error if the specified team has debaters.
 * @name teams.debaters.create
 * @memberof! teams.debaters
 * @function teams.debaters.create
 * @param options
 * @param {Number} options.id id of the team to set debaters
 * @param {Number} options.debaters debaters to set
 * @param {Number} options.r round where the team has the debaters
 * @return {Promise} Created team
 * @throws {Promise} AlreadyExists
 */
/**
 * deletes debaters from specified team.
 * Attention: It throws an error if the specified team does not exist.
 * @name teams.debaters.delete
 * @memberof! teams.debaters
 * @function teams.debaters.delete
 * @param options
 * @param {Number} options.id id of the team to delete
 * @param {Number} options.r round where the team has the debaters
 * @return {Promise} Team
 * @throws {Promise} DoesNotExist
 */
/**
 * finds on specified condition(No side effect)
 * @name teams.debaters.find
 * @memberof! teams
 * @function teams.debaters.find
 * @param options
 * @param {Number} [options.id] id of the team
 * @param {Number} [options.debaters] debaters of the team
 * @return {Promise} Teams
 */
/**
 * updates debaters of specified team
 * Attention: It throws an error if the specified team does not exist.
 * @name teams.debaters.update
 * @memberof! teams.debaters
 * @function teams.debaters.update
 * @param options
 * @param {Number} options.id id of the team
 * @param {Number} [options.debaters] debaters of the team
 * @return {Promise} Team
 * @throws DoesNotExist
 */

/**
 * Provides interefaces related to teams to institutions
 */

/**
 * Provides interfaces related to adjudicators
 * @namespace adjudicators
 */
var adjudicators = con.adjudicators
/**
 * @namespace adjudicators.results
 * @memberof! adjudicators
 */
/**
 * Summarizes adjudicator results(No side effect)
 * @alias adjudicators.results.organize
 * @memberof! adjudicators.results
 * @param  {(Number | Number[])} r_or_rs round number(s) used to summarize results
 * @return {Promise} summarized adjudicator results
 */
adjudicators.results.organize = function(r_or_rs) {
    if (Array.isArray(r_or_rs)) {

        return Promise.all([con.adjudicators.read(), con.adjudicators.results.read()]).then(function(vs) {
            var [adjudicators, raw_adjudicator_results] = vs
            return op.adjudicators.results.compile(adjudicators, raw_adjudicator_results, r_or_rs)
        })
    } else {
        return Promise.all([con.adjudicators.read(), con.adjudicators.results.read()]).then(function(vs) {
            var [adjudicators, raw_adjudicator_results] = vs
            return op.adjudicators.results.summarize(adjudicators, raw_adjudicator_results, r_or_rs)
        })
    }
}
/**
 * Interfaces related to tournament operation
 * @namespace rounds
 * @deprecated
 */
var rounds = con.rounds
/**
 * Interfaces related to venues
 * @namespace venues
 */
var venues = con.venues
/**
 * Interfaces related to debaters
 * @namespace debaters
 */
var debaters = con.debaters
/**
 * Interfaces related to debater results
 * @namespace debaters.results
 * @memberof! debaters
 */
/**
 * Summarizes debater results(No side effect)
 * @alias debaters.results.organize
 * @memberof! debaters.results
 * @param  {(Number | Number[])} r_or_rs round number(s) used to summarize results
 * @return {Promise} summarized debater results
 */
debaters.results.organize = function(r_or_rs) {
    if (Array.isArray(r_or_rs)) {
        return Promise.all([con.debaters.read(), con.debaters.results.read()]).then(function(vs) {
            var [debaters, raw_debater_results] = vs
            return op.debaters.results.compile(debaters, raw_debater_results, r_or_rs)
        })
    } else {
        return Promise.all([con.debaters.read(), con.debaters.results.read()]).then(function(vs) {
            var [debaters, raw_debater_results] = vs
            return op.debaters.results.summarize(debaters, raw_debater_results, r_or_rs)
        })
    }
}
/**
 * Interfaces related to institutions
 * @namespace institutions
 */
var institutions = con.institutions

/**
 * Provides interfaces related to allocations
 * @namespace allocations
 */
var allocations = {//op.allocations
    /**
     * get allocation(No side effect)
     * @alias allocations.get
     * @memberof! allocations
     * @param options
     * @param  {Boolean} options.simple Does not use debater results
     * @param  {Boolean} options.with_venues Allocate venues
     * @param  {Boolean} options.with_adjudicators Allocate adjudicators
     * @param  {String[]} options.filters filters to use on computing team allocation
     * @param  {String[]} options.adjudicator_filters filters on computing adjudicator allocation
     * @param  {Square[]} [allocation] team allocation by which it creates adjudicator/venue allocation if indicated
     * @return {Promise.<Square[]>} allocation
     */
    get: function({
            simple: simple = false,
            with_venues: with_venues = true,
            with_adjudicators: with_adjudicators = true,
            filters: filter_functions_strs=['by_strength', 'by_side', 'by_past_opponent', 'by_institution'],
            adjudicator_filters: filter_functions_adj_strs=['by_bubble', 'by_strength', 'by_attendance', 'by_conflict', 'by_institution', 'by_past']
        }, allocation) {
        try {
            var all_filter_functions = op.allocations.teams.functions.read()
            var [all_filter_functions_adj, all_filter_functions_adj2] = op.allocations.adjudicators.functions.read()
            var filter_functions = filter_functions_strs.map(f_str => all_filter_functions[f_str])
            var filter_functions_adj = filter_functions_adj_strs.filter(f_str => all_filter_functions_adj.hasOwnProperty(f_str)).map(f_str => all_filter_functions_adj[f_str])
            var filter_functions_adj2 = filter_functions_adj_strs.filter(f_str => all_filter_functions_adj2.hasOwnProperty(f_str)).map(f_str => all_filter_functions_adj2[f_str])
        } catch(e) {
            return Promise.reject(e)
        }

        if (allocation) {
            return con.rounds.read().then(function (round_info) {
                var current_round_num = round_info.current_round_num
                var considering_rounds = _.range(1, current_round_num)
                return Promise.all([con.teams.read(), con.adjudicators.read(), con.venues.read(), teams.results.organize(considering_rounds), adjudicators.results.organize(considering_rounds), con.teams.institutions.read(), con.adjudicators.institutions.read(), con.adjudicators.conflicts.read()]).then(function (vs) {
                    var [teams, adjudicators, venues, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts] = vs

                    if (with_adjudicators) {
                        new_allocation = op.allocations.adjudicators.get(allocation, teams, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, filter_functions_adj, filter_functions_adj2)
                    }
                    if (with_venues) {
                        new_allocation = op.allocations.venues.get(new_allocation, venues)
                    }
                    return new_allocation
                })
            })
        } else {
            return con.rounds.read().then(function (round_info) {
                var current_round_num = round_info.current_round_num
                var considering_rounds = _.range(1, current_round_num)
                return Promise.all([con.teams.read(), con.adjudicators.read(), con.venues.read(), teams.results.organize(considering_rounds), adjudicators.results.organize(considering_rounds), con.teams.institutions.read(), con.adjudicators.institutions.read(), con.adjudicators.conflicts.read()]).then(function (vs) {
                    var [teams, adjudicators, venues, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts] = vs

                    var new_allocation = op.allocations.teams.get(teams, compiled_team_results, teams_to_institutions, filter_functions)///////
                    if (with_adjudicators) {
                        new_allocation = op.allocations.adjudicators.get(new_allocation, teams, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, filter_functions_adj, filter_functions_adj2)
                    }
                    if (with_venues) {
                        new_allocation = op.allocations.venues.get(new_allocation, venues)
                    }
                    return new_allocation
                })
            })
        }

    },
    /**
     * checks allocation(No side effect)
     * @memberof! allocations
     * @param options
     * @param  {Boolean} [options.check_teams=true] check team allocation
     * @param  {Boolean} [options.check_adjudicators=true] check adjudicator allocation
     * @param  {Boolean} [options.check_venues=true] check venue allocation
     * @return {Promise.<Square[]>}
     */
    check: function({
        check_teams: check_teams = true,
        check_adjudicators: check_adjudicators = true,
        check_venues: check_venues = true
    }) {
        throw new Error('undefined')
    }
}

exports.connect = connect
exports.close = close

exports.tournaments = tournaments

exports.teams = teams
exports.adjudicators = adjudicators
exports.venues = venues
exports.rounds = rounds
exports.debaters = debaters
exports.institutions = institutions
exports.allocations = allocations
