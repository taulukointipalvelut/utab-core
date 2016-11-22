"use strict";
/**
 * @module core
 * @author taulukointipalvelut@gmail.com (nswa17)
 * @file Interfaces for UTab core. Github Page is [here]{@link https://github.com/taulukointipalvelut/utab-core}.
 * @version 1.1
 * @example
 * var core = require('./core.js')
 *
 * core.tournaments.read().then(console.log)
 * var t1 = new core.Tournament({id: 1, name: "t1"})
 */

let alloc = require('./src/allocations.js')
let res = require('./src/results.js')
let controllers = require('./src/controllers.js')
let _ = require('underscore/underscore.js')

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
 * @typedef TournamentInformation
 * @property {Number} id id of the tournament
 * @property {String} name name of the tournament
 * @property {String} url url of the tournament
 * @property {Number} current_round_num current round
 * @property {Number} total_round_num total round
 * @property {Style} style style of the tournament
 */

 /**
  * Provides Interfaces related to tournaments
  * @namespace tournaments
  */
  var tournaments = controllers.tournaments
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


/**
 * A class to operate a tournament.
 */
class Tournament {
    /**
     * @param {Number} id - Unique ID of the tournament
     */
    constructor (dict) {
        var con = new controllers.CON(dict)
        var core = this

        /**
         * Provides Interfaces related to teams
         * @memberof Tournament
         * @namespace Tournament.teams
         */
        this.teams = con.teams
        /**
         * returns all teams(No side effect)
         * @name Tournament.teams.read
         * @memberof! Tournament.teams
         * @function Tournament.teams.read
         * @return {Promise.<Team[]>} Teams
         */

        /**
         * creates team.//TESTED//
         * Attention: It throws an error if the specified team already exists.
         * @name Tournament.teams.create
         * @memberof! Tournament.teams
         * @function Tournament.teams.create
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
         * @name Tournament.teams.delete
         * @memberof! Tournament.teams
         * @function Tournament.teams.delete
         * @param team
         * @param {Number} team.id id of the team to delete
         * @return {Promise.<Team>} Deleted team
         * @throws {Promise} DoesNotExist
         */
        /**
         * finds on specified condition(No side effect)//TESTED//
         * @name Tournament.teams.find
         * @memberof! Tournament.teams
         * @function Tournament.teams.find
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
         * @name Tournament.teams.update
         * @memberof! Tournament.teams
         * @function Tournament.teams.update
         * @param team
         * @param {Number} team.id id of the team to update
         * @param {Number} [team.name=""] name of the team to update
         * @param {Number} [team.available=true] id of the team to update
         * @param {Number} [team.url=""] id of the team to update
         * @return {Promise.<Team>} Updated team
         * @throws DoesNotExist
         */
        /**
         * @namespace Tournament.teams.results
         * @memberof Tournament.teams
         */
        /**
         * reads all raw team results(No side effect)
         * @name Tournament.teams.results.read
         * @memberof! Tournament.teams.results
         * @function Tournament.teams.results.read
         * @returns {Promise.<RawTeamResult[]>}
         */
        /**
         * Summarizes team results(No side effect)
         * @alias Tournament.teams.results.organize
         * @memberof! Tournament.teams.results
         * @param  {(Number | Number[])} r_or_rs round number(s) used to summarize results
         * @param options [options] for summarization
         * @param {Boolean} [options.simple=false] only use team results. No debater results is considered thus unable to output team points
         * @param {Boolean} [options.force=false] if true, it does not check raw results(not recommended)
         * @return {Promise} summarized team results
         */
        this.teams.results.organize = function(r_or_rs, {simple: simple=false, force: force=false}={}) {
            if (simple) {
                return Promise.all([con.teams.read(), con.teams.results.read()]).then(function (vs) {
                    var [teams, raw_team_results] = vs
                    if (!force) {
                        Array.isArray(r_or_rs) ? r_or_rs.map(r => res.teams.check(raw_team_results, teams, r)) : res.teams.check(raw_team_results, teams, r_or_rs)
                    }
                    return Array.isArray(r_or_rs) ? res.teams.simplified_compile(teams, raw_team_results, r_or_rs) : res.teams.simplified_summarize(teams, raw_team_results, r_or_rs)
                })
            } else {
                return Promise.all([con.teams.read(), con.teams.debaters.read(), con.teams.debaters.read(), con.teams.results.read(), con.debaters.results.read(), con.teams.debaters.read(), con.rounds.read()]).then(function (vs) {
                    var [teams, debaters, raw_teams_to_debaters, raw_team_results, raw_debater_results, raw_teams_to_debaters, round_info] = vs
                    if (!force) {
                        res.precheck(teams, raw_teams_to_debaters, debaters)
                        if (Array.isArray(r_or_rs)) {
                            r_or_rs.map(r => res.teams.check(raw_team_results, teams, r))
                            r_or_rs.map(r => res.debaters.check(raw_debater_results, debaters, r))
                        } else {
                            res.teams.check(raw_team_results, teams, r_or_rs)
                            res.debaters.check(raw_debater_results, debaters, r_or_rs)
                        }
                    }
                    return Array.isArray(r_or_rs) ? res.teams.compile(teams, debaters, raw_teams_to_debaters, raw_team_results, raw_debater_results, round_info.style, r_or_rs) : res.teams.summarize(teams, debaters, raw_teams_to_debaters, raw_team_results, raw_debater_results, round_info.style, r_or_rs)
                })
            }
        }

        /**
         * Interfaces related to teams to debaters
         * @namespace Tournament.teams.debaters
         * @memberof Tournament.teams
         */
        /**
         * returns teams to debaters(No side effect)
         * @name Tournament.teams.debaters.read
         * @memberof! Tournament.teams.debaters
         * @function Tournament.teams.debaters.read
         * @return {Promise} Teams to debaters
         */
        /**
         * sets debaters to a team.
         * Attention: It throws an error if the specified team has debaters.
         * @name Tournament.teams.debaters.create
         * @memberof! Tournament.teams.debaters
         * @function Tournament.teams.debaters.create
         * @param dict
         * @param {Number} dict.id id of the team to set debaters
         * @param {Number[]} dict.debaters debaters to set
         * @param {Number} dict.r round where the team has the debaters
         * @return {Promise} Created team
         * @throws {Promise} AlreadyExists
         */
        /**
         * deletes debaters from specified team.
         * Attention: It throws an error if the specified team does not exist.
         * @deprecated
         * @name Tournament.teams.debaters.delete
         * @memberof! Tournament.teams.debaters
         * @function Tournament.teams.debaters.delete
         * @param options
         * @param {Number} options.id id of the team to delete
         * @param {Number} options.r round where the team has the debaters
         * @return {Promise} Team
         * @throws {Promise} DoesNotExist
         */
         /**
          * finds on specified condition(No side effect)
          * @name Tournament.teams.debaters.find
          * @memberof! Tournament.teams.debaters
          * @function Tournament.teams.debaters.find
          * @param options
          * @param {Number} [options.id] id of the team to delete
          * @param {Number} [options.r] round where the team has the debaters
          * @param {Number[]} [options.debaters] debaters
          * @return {Promise} Teams
          */
        /**
         * updates debaters of specified team
         * Attention: It throws an error if the specified team does not exist.
         * @name Tournament.teams.debaters.update
         * @memberof! Tournament.teams.debaters
         * @function Tournament.teams.debaters.update
         * @param options
         * @param {Number} options.id id of the team
         * @param {Number} options.r round where the team has the debaters
         * @param {Number[]} options.debaters debaters of the team
         * @return {Promi} Team
         * @throws DoesNotExist
         */

        /**
         * Provides interefaces related to teams to institutions
         */

        /**
         * Provides interfaces related to adjudicators
         * @namespace Tournament.adjudicators
         * @memberof Tournament
         */
        this.adjudicators = con.adjudicators
        /**
         * @namespace Tournament.adjudicators.results
         * @memberof Tournament.adjudicators
         */
        /**
         * Summarizes adjudicator results(No side effect)
         * @alias Tournament.adjudicators.results.organize
         * @memberof! Tournament.adjudicators.results
         * @param  {(Number | Number[])} r_or_rs round number(s) used to summarize results
         * @param [options]
         * @param {Boolean} [options.force=false] if true, it does not check raw results(not recommended)
         * @return {Promise} summarized adjudicator results
         */
        this.adjudicators.results.organize = function(r_or_rs, {force: force=false}={}) {
            return Promise.all([con.adjudicators.read(), con.adjudicators.results.read()]).then(function(vs) {
                var [adjudicators, raw_adjudicator_results] = vs
                if (!force) {
                    Array.isArray(r_or_rs) ? r_or_rs.map(r => res.adjudicators.check(raw_adjudicator_results, adjudicators, r)) : res.adjudicators.check(raw_adjudicator_results, adjudicators, r_or_rs)
                }
                return Array.isArray(r_or_rs) ? res.adjudicators.compile(adjudicators, raw_adjudicator_results, r_or_rs) : res.adjudicators.summarize(adjudicators, raw_adjudicator_results, r_or_rs)
            })
        }
        /**
         * Interfaces related to tournament operation
         * @namespace Tournament.rounds
         * @memberof Tournament
         */
        this.rounds = con.rounds
        /**
         * Interfaces related to venues
         * @namespace Tournament.venues
         * @memberof Tournament
         */
        this.venues = con.venues
        /**
         * Interfaces related to debaters
         * @namespace Tournament.debaters
         * @memberof Tournament
         */
        this.debaters = con.debaters
        /**
         * Interfaces related to debater results
         * @namespace Tournament.debaters.results
         * @memberof Tournament.debaters
         */
        /**
         * Summarizes debater results(No side effect)
         * @alias Tournament.debaters.results.organize
         * @memberof! Tournament.debaters.results
         * @param  {(Number | Number[])} r_or_rs round number(s) used to summarize results
         * @param [options]
         * @param {Boolean} [options.force=false] if true, it does not check raw results(not recommended)
         * @return {Promise} summarized debater results
         */
        this.debaters.results.organize = function(r_or_rs, {force: force=false}={}) {
            return Promise.all([con.debaters.read(), con.debaters.results.read(), con.rounds.read()]).then(function(vs) {
                var [debaters, raw_debater_results, round_info] = vs
                if (!force) {
                    Array.isArray(r_or_rs) ? r_or_rs.map(r => res.debaters.check(raw_debater_results, debaters, r)) : res.debaters.check(raw_debater_results, debaters, r_or_rs)
                }
                return Array.isArray(r_or_rs) ? res.debaters.compile(debaters, raw_debater_results, round_info.style, r_or_rs) : res.debaters.summarize(debaters, raw_debater_results, round_info.style, r_or_rs)
            })
        }
        this.debaters.results.check = undefined
        /**
         * Interfaces related to institutions
         * @namespace Tournament.institutions
         * @memberof Tournament
         */
        this.institutions = con.institutions

        /**
         * Provides interfaces related to allocations
         * @namespace Tournament.allocations
         * @memberof Tournament
         */
        this.allocations = {
            /**
             * get allocation(No side effect)
             * @alias Tournament.allocations.get
             * @memberof! Tournament.allocations
             * @param [options]
             * @param  {Boolean} [options.simple=false] Does not use debater results
             * @param  {Boolean} [options.with_venues=false] Allocate venues
             * @param  {Boolean} [options.with_adjudicators=false] Allocate adjudicators
             * @param  {String[]} [options.filters=['by_strength', 'by_side', 'by_past_opponent', 'by_institution']] filters to use on computing team allocation
             * @param  {String[]} [options.adjudicator_filters=['by_bubble', 'by_strength', 'by_attendance', 'by_conflict', 'by_institution', 'by_past']] filters on computing adjudicator allocation
             * @param  {Square[]} [options.allocation] if specified, adjudicator/venue allocation will be created based on the allocation
             * @param {Boolean} [options.force=false] if true, it does not check the database before creating matchups. (false recommended)
             * @return {Promise.<Square[]>} allocation
             */
            get: function({
                    simple: simple = false,
                    with_venues: with_venues = true,
                    with_adjudicators: with_adjudicators = true,
                    filters: filter_functions_strs=['by_strength', 'by_side', 'by_past_opponent', 'by_institution'],
                    adjudicator_filters: filter_functions_adj_strs=['by_bubble', 'by_strength', 'by_attendance', 'by_conflict', 'by_institution', 'by_past'],
                    allocation: allocation,
                    force: force = false
                }={}) {
                try {
                    var all_filter_functions = alloc.teams.functions.read()
                    var [all_filter_functions_adj, all_filter_functions_adj2] = alloc.adjudicators.functions.read()
                    var filter_functions = filter_functions_strs.map(f_str => all_filter_functions[f_str])
                    var filter_functions_adj = filter_functions_adj_strs.filter(f_str => all_filter_functions_adj.hasOwnProperty(f_str)).map(f_str => all_filter_functions_adj[f_str])
                    var filter_functions_adj2 = filter_functions_adj_strs.filter(f_str => all_filter_functions_adj2.hasOwnProperty(f_str)).map(f_str => all_filter_functions_adj2[f_str])
                } catch(e) {
                    return Promise.reject(e)
                }

                return con.rounds.read().then(function (round_info) {
                    var current_round_num = round_info.current_round_num
                    var considering_rounds = _.range(1, current_round_num)

                    return Promise.all([con.teams.read(), con.adjudicators.read(), con.venues.read(), con.institutions.read(), core.teams.results.organize(considering_rounds), core.adjudicators.results.organize(considering_rounds), con.teams.institutions.read(), con.adjudicators.institutions.read(), con.adjudicators.conflicts.read()]).then(function (vs) {
                        var [teams, adjudicators, venues, institutions, compiled_team_results, compiled_adjudicator_results, raw_teams_to_institutions, raw_adjudicators_to_institutions, raw_adjudicators_to_conflicts] = vs

                        if (!force) {
                            alloc.precheck(teams, adjudicators, venues, institutions, raw_teams_to_institutions, raw_adjudicators_to_institutions, raw_adjudicators_to_conflicts, round_info.style, current_round_num)
                        }
                        if (allocation) {
                            var new_allocation = alloc.deepcopy(allocation)
                        } else {
                            var new_allocation = alloc.teams.get(teams, compiled_team_results, raw_teams_to_institutions, filter_functions)
                        }

                        if (with_adjudicators) {
                            new_allocation = alloc.adjudicators.get(new_allocation, teams, adjudicators, compiled_team_results, compiled_adjudicator_results, raw_teams_to_institutions, raw_adjudicators_to_institutions, raw_adjudicators_to_conflicts, filter_functions_adj, filter_functions_adj2)
                        }
                        if (with_venues) {
                            new_allocation = alloc.venues.get(new_allocation, venues)
                        }
                        return new_allocation
                    })
                })
            },
            /**
             * checks allocation(No side effect)
             * @memberof! Tournament.allocations
             * @function Tournament.allocations.check
             * @param options
             * @param  {Boolean} [options.check_teams=true] check team allocation
             * @param  {Boolean} [options.check_adjudicators=true] check adjudicator allocation
             * @param  {Boolean} [options.check_venues=true] check venue allocation
             * @return {Promise.<Square[]>}
             */
            check: function(allocation, {
                check_teams: check_teams = true,
                check_adjudicators: check_adjudicators = true,
                check_venues: check_venues = true
            }={}) {
                return Promise.all([con.teams.read(), con.adjudicators.read(), con.venues.read(), teams.results.organize(considering_rounds), adjudicators.results.organize(considering_rounds), con.teams.institutions.read(), con.adjudicators.institutions.read(), con.adjudicators.conflicts.read()]).then(function (vs) {
                    var [teams, adjudicators, venues, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts] = vs

                    var new_allocation = alloc.deepcopy(allocation)
                    if (check_teams) {
                        new_allocation = alloc.teams.check(new_allocation, teams, compiled_team_results, teams_to_institutions)///////
                    }
                    if (check_adjudicators) {
                        new_allocation = alloc.adjudicators.check(new_allocation, new_allocation, teams, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, filter_functions_adj, filter_functions_adj2)
                    }
                    if (check_venues) {
                        new_allocation = alloc.venues.check(new_allocation, new_allocation, venues)
                    }
                    return new_allocation
                })
            }
        }
        /**
         * closes connection to the tournament database.
         * @memberof! Tournament
         * @function Tournament.close
         */
        this.close = con.close
    }
}

exports.tournaments = tournaments
exports.Tournament = Tournament
