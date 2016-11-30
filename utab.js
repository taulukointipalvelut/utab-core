"use strict";
/**
* @module utab
* @author taulukointipalvelut@gmail.com (nswa17)
* @file Interfaces for UTab core. Github Page is [here]{@link https://github.com/taulukointipalvelut/utab-core}.
* @version 2.1
* @example
* var utab = require('./utab.js')
*
* var t1 = new utab.Tournament({name: 't1', style: 'NA'})//create a tournament named 't1'
* t1.teams.read().then(console.log)//show all teams
*
* t1.close()//close connection to t1 database
*/

const loggers = require('./src/general/loggers.js')//Must be the first to require
loggers.init()
const alloc = require('./src/allocations.js')
const res = require('./src/results.js')
const checks = require('./src/checks.js')
const controllers = require('./src/controllers.js')
const _ = require('underscore/underscore.js')


/**
* Represents a pair/set of teams in a venue. A minimum unit to be an allocation.
* @typedef Square
* @property {Number} id id of the Square
* @property {Number[]} teams teams in the Square
* @property {Number[]} chairs chairs in the Square
* @property {Number[]} panels adjudicators(panels) in the Square
* @property {Number[]} trainees adjudicators(trainees) in the Square
* @property {String[]} warnings warnings
* @property {Number} venue
*/

/**
* Represents a team.
* @typedef Team
* @property {Number} id id of the Team
* @property {String} name name of the Team
* @property {Boolean} available available
* @property {Object} user_defined_data user defined data
*/

/**
* Represents an adjudicator.
* @typedef Adjudicator
* @property {Number} id id of the Adjudicator
* @property {Number} preev pre evaluation(judge test) of the Adjudicator
* @property {String} name name of the Adjudicator
* @property {Boolean} available available
* @property {Object} user_defined_data user defined data
*/

/**
* Represents a venue.
* @typedef Venue
* @property {Number} id id of the Venue
* @property {Number} priority priority of the Venue
* @property {String} name name of the Venue
* @property {Boolean} available available
* @property {Object} user_defined_data user defined data
*/

/**
* Represents an institution.
* @typedef Institution
* @property {Number} id id of the Institution
* @property {String} name name of the Institution
* @property {Boolean} available available
* @property {Object} user_defined_data user defined data
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
* @property {Object} user_defined_data user defined data
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
* @property {Object} user_defined_data user defined data
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
* @property {Number[]} judged_teams teams the adjudicator watched
* @property {String} comment the comment for the adjudicator from the sender
* @property {Object} user_defined_data user defined data
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
* @property {String} name name of the tournament
* @property {Number} current_round_num current round
* @property {Number} total_round_num total round
* @property {Style} style style of the tournament
*/


/**
* A class to operate a tournament.
*/
class Tournament {
    /**
    * @param {String} [db_url='mongodb://localhost/testtournament'] database url
    * @param {Object} [options] necessary for new tournament. if the tournament already exists, it's just ignored
    * @param {String} [options.name='testtournament'] tournament name
    * @param {Style} [options.style='NA'] debate style
    * @param {Number} [options.total_round_num=4] total rounds
    * @param {Number} [options.current_round_num=1] current round
    */
    constructor (db_url, options) {
        var con = new controllers.CON(db_url, options)
        var utab = this

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
        * @param {Boolean} [force=false] if true, it creates the specified team regardless of wheter the name specified already exists
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
        * @return {Promise.<Team>} Updated team
        * @throws DoesNotExist
        */
        /**
        * checks whether specified team exists
        * @name Tournament.teams.update
        * @memberof! Tournament.teams
        * @function Tournament.teams.update
        * @param team
        * @param {Number} [team.id] id of the team to update
        * @param {Number} [team.name] name of the team to update
        * @param {Number} [team.available] id of the team to update
        * @return {Promise.<Boolean>}
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
            loggers.results('teams.results.organize is called')
            loggers.results('debug', 'arguments are: '+JSON.stringify(arguments))
            if (simple) {
                return Promise.all([con.teams.read(), con.teams.results.read()]).then(function (vs) {
                    var [teams, raw_team_results] = vs
                    var team_num = round_info.style.team_num
                    if (!force) {
                        Array.isArray(r_or_rs) ? r_or_rs.map(r => checks.results.teams.check(raw_team_results, teams, r, team_num)) : checks.results.teams.check(raw_team_results, teams, r_or_rs, team_num)
                    }
                    return Array.isArray(r_or_rs) ? res.teams.simplified_compile(teams, raw_team_results, r_or_rs, round_info.style) : res.teams.simplified_summarize(teams, raw_team_results, r_or_rs, round_info.style)
                })
            } else {
                return Promise.all([con.teams.read(), con.teams.debaters.read(), con.teams.debaters.read(), con.teams.results.read(), con.debaters.results.read(), con.teams.debaters.read(), con.config.read()]).then(function (vs) {
                    var [teams, debaters, teams_to_debaters, raw_team_results, raw_debater_results, teams_to_debaters, round_info] = vs
                    var team_num = round_info.style.team_num
                    if (!force) {
                        checks.results.check(teams, teams_to_debaters, debaters, team_num)
                        if (Array.isArray(r_or_rs)) {
                            r_or_rs.map(r => checks.results.teams.check(raw_team_results, teams, r, team_num))
                            r_or_rs.map(r => checks.results.debaters.check(raw_debater_results, debaters, r, team_num))
                        } else {
                            checks.results.teams.check(raw_team_results, teams, r_or_rs, team_num)
                            checks.results.debaters.check(raw_debater_results, debaters, r_or_rs, team_num)
                        }
                    }
                    return Array.isArray(r_or_rs) ? res.teams.compile(teams, debaters, teams_to_debaters, raw_team_results, raw_debater_results, r_or_rs, round_info.style) : res.teams.summarize(teams, debaters, teams_to_debaters, raw_team_results, raw_debater_results, r_or_rs, round_info.style)
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
            loggers.results('adjudicators.results.organize is called')
            loggers.results('debug', 'arguments are: '+JSON.stringify(arguments))
            return Promise.all([con.adjudicators.read(), con.adjudicators.results.read(), con.config.get()]).then(function(vs) {
                var [adjudicators, raw_adjudicator_results, round_info] = vs
                var team_num = round_info.style.team_num
                if (!force) {
                    Array.isArray(r_or_rs) ? r_or_rs.map(r => checks.results.adjudicators.check(raw_adjudicator_results, adjudicators, r, team_num)) : checks.results.adjudicators.check(raw_adjudicator_results, adjudicators, r_or_rs, team_num)
                }
                return Array.isArray(r_or_rs) ? res.adjudicators.compile(adjudicators, raw_adjudicator_results, r_or_rs) : res.adjudicators.summarize(adjudicators, raw_adjudicator_results, r_or_rs)
            })
        }
        /**
        * Interfaces related to tournament operation
        * @namespace Tournament.config
        * @memberof Tournament
        */
        this.config = con.config
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
            loggers.results('debaters.results.organize is called')
            loggers.results('debug', 'arguments are: '+JSON.stringify(arguments))
            return Promise.all([con.debaters.read(), con.debaters.results.read(), con.config.read()]).then(function(vs) {
                var [debaters, raw_debater_results, round_info] = vs
                var team_num = round_info.style.team_num
                if (!force) {
                    Array.isArray(r_or_rs) ? r_or_rs.map(r => checks.results.debaters.check(raw_debater_results, debaters, r, team_num)) : checks.results.debaters.check(raw_debater_results, debaters, r_or_rs, team_num)
                }
                return Array.isArray(r_or_rs) ? res.debaters.compile(debaters, raw_debater_results, round_info.style, r_or_rs) : res.debaters.summarize(debaters, raw_debater_results, round_info.style, r_or_rs)
            })
        }

        /*/**
        * checks debater results are all gathered
        * @alias Tournament.debaters.results.check
        * @memberof! Tournament.debaters.results
        * @throws error
        */
        //this.debaters.results.check = checks.debaters.check
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
        this.allocations = con.allocations
        this.allocations.check = function() {
        loggers.allocations('allocations.check is called')
        loggers.allocations('debug', 'arguments are: '+JSON.stringify(arguments))
            return con.config.read().then(function (round_info) {
                var current_round_num = round_info.current_round_num
                var considering_rounds = _.range(1, current_round_num)

                return Promise.all([con.teams.read(), con.adjudicators.read(), con.venues.read(), con.institutions.read(), utab.teams.results.organize(considering_rounds), utab.adjudicators.results.organize(considering_rounds), con.teams.institutions.read(), con.adjudicators.institutions.read(), con.adjudicators.conflicts.read()]).then(function (vs) {
                    var [teams, adjudicators, venues, institutions, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts] = vs

                    checks.allocations.check(teams, adjudicators, venues, institutions, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, round_info.style, current_round_num)
                })
            })
        }
        /**
        * Provides interfaces related to team allocation
        * @namespace Tournament.allocations.teams
        * @memberof Tournament.allocations
        */
        this.allocations.teams = {
            //@param  {String[]} [options.adjudicator_filters=['by_bubble', 'by_strength', 'by_attendance', 'by_conflict', 'by_institution', 'by_past']] filters on computing adjudicator allocation
            //@param  {Square[]} [options.allocation] if specified, adjudicator/venue allocation will be created based on the allocation
            /**
            * get allocation(No side effect)
            * @alias Tournament.allocations.teams.get
            * @memberof! Tournament.allocations.teams
            * @param {Object} [options]
            * @param  {Boolean} [options.simple=false] if true, it does not use debater results
            * @param {Boolean} [options.force=false] if true, it does not check the database before creating matchups. (false recommended)
            * @param {String} [options.algorithm='standard'] it computes the allocation using specified algorithm
            * @param {Object} [options.algorithm_options]
            * @param  {String[]} [options.algorithm_options.filters=['by_strength', 'by_side', 'by_past_opponent', 'by_institution']] filters to compute team allocation in `standard` algorithm
            * @return {Promise.<Square[]>} allocation
            */
            get: function({
                    simple: simple = false,
                    force: force=false, // ignores warnings from processing results
                    algorithm: algorithm = 'standard',
                    algorithm_options: algorithm_options = {
                        filters: ['by_strength', 'by_side', 'by_past_opponent', 'by_institution']
                    }
                }={}) {
                loggers.allocations('allocations.teams.get is called')
                loggers.allocations('debug', 'arguments are: '+JSON.stringify(arguments))
                return con.config.read().then(function (round_info) {
                    var current_round_num = round_info.current_round_num
                    var considering_rounds = _.range(1, current_round_num)
                    var team_num = round_info.style.team_num

                    return Promise.all([con.teams.read(), utab.teams.results.organize(considering_rounds, {simple: simple, force: force}), con.teams.institutions.read()]).then(function (vs) {
                        var [teams, compiled_team_results, teams_to_institutions] = vs

                        var allocation = algorithm === 'standard' ? alloc.standard.teams.get(teams, compiled_team_results, teams_to_institutions, algorithm_options.filters, round_info) : alloc.wudc.teams.get(teams, compiled_team_results, round_info)
                        var new_allocation = checks.allocations.teams.check(allocation, teams, compiled_team_results, teams_to_institutions, team_num)///////

                        return allocation
                    })
                })
            },
            /**
            * checks allocation(No side effect)
            * @memberof! Tournament.allocations.teams
            * @function Tournament.allocations.teams.check
            * @param allocation
            * @return {Promise.<Square[]>}
            */
            check: function(allocation) {
                loggers.allocations('allocations.teams.check is called')
                loggers.allocations('debug', 'arguments are: '+JSON.stringify(arguments))
                return con.config.read().then(function (round_info) {
                    var current_round_num = round_info.current_round_num
                    var considering_rounds = _.range(1, current_round_num)

                    return Promise.all([con.teams.read(), teams.results.organize(considering_rounds), con.teams.institutions.read()]).then(function (vs) {
                        var [teams, compiled_team_results, teams_to_institutions] = vs

                        var new_allocation = checks.allocations.teams.check(allocation, teams, compiled_team_results, teams_to_institutions, team_num)///////

                        return new_allocation
                    })
                })
            }
        }
        /**
        * Provides interfaces related to adjudicator allocation
        * @namespace Tournament.allocations.adjudicators
        * @memberof Tournament.allocations
        */
        this.allocations.adjudicators = {
            get: function(allocation, {
                    simple: simple = false,
                    force: force = false,
                    algorithm: algorithm = 'standard',
                    algorithm_options: algorithm_options = {
                        filters: ['by_bubble', 'by_strength', 'by_attendance', 'by_conflict', 'by_institution', 'by_past'],
                        assign: 'high_to_high',// or middle_to_high, middle_to_slight, high_to_slight
                        scatter: false
                    },
                    numbers: numbers = {chairs: 2, panels: 1, trainees: 1}
                }={}) {
                loggers.allocations('allocations.adjudicators.get is called')
                loggers.allocations('debug', 'arguments are: '+JSON.stringify(arguments))
                return con.config.read().then(function (round_info) {
                    var current_round_num = round_info.current_round_num
                    var considering_rounds = _.range(1, current_round_num)

                    return Promise.all([con.teams.read(), con.adjudicators.read(), utab.teams.results.organize(considering_rounds, {force: force, simple: simple}), utab.adjudicators.results.organize(considering_rounds, {force: force}), con.teams.institutions.read(), con.adjudicators.institutions.read(), con.adjudicators.conflicts.read()]).then(function (vs) {
                        var [teams, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts] = vs

                        if (algorithm === 'standard') {
                            var new_allocation = alloc.standard.adjudicators.get(allocation, adjudicators, teams, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, algorithm_options.filters, numbers)
                        } else if (algorithm === 'traditional') {
                            var new_allocation = alloc.traditional.adjudicators.get(allocation, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, numbers, algorithm_options.assign, algorithm_options.scatter)
                        }
                        new_allocation = checks.allocations.adjudicators.check(allocation, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts)

                        return new_allocation
                    })
                })
            },
            check: function(allocation) {
                loggers.allocations('allocations.adjudicators.check is called')
                loggers.allocations('debug', 'arguments are: '+JSON.stringify(arguments))
                return con.config.read().then(function (round_info) {
                    var current_round_num = round_info.current_round_num
                    var considering_rounds = _.range(1, current_round_num)

                    return Promise.all([con.teams.read(), con.adjudicators.read(), con.venues.read(), teams.results.organize(considering_rounds), adjudicators.results.organize(considering_rounds), con.teams.institutions.read(), con.adjudicators.institutions.read(), con.adjudicators.conflicts.read()]).then(function (vs) {
                        var [teams, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts] = vs

                        var new_allocation = checks.allocations.adjudicators.check(allocation, adjudicators, compiled_team_results, compiled_adjudicator_results, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts)

                        return new_allocation
                    })
                })
            }
        }
        /**
        * Provides interfaces related to venue allocation
        * @namespace Tournament.allocations.venues
        * @memberof Tournament.allocations
        */
        this.allocations.venues = {
            /**
            * get venue allocation from allocation
            * @param  {Square[]} allocation allocation
            * @param  {Object} options
            * @param  {Boolean} [options.shuffle=false] if true, it randomly allocates venues to squares so that no one can guess the current rankings of teams.
            * @return {Promise.<Square[]>}
            */
            get: function(allocation, options={shuffle: false}) {
                loggers.allocations('allocations.venues.get is called')
                loggers.allocations('debug', 'arguments are: '+JSON.stringify(arguments))
                return con.config.read().then(function (round_info) {
                    var current_round_num = round_info.current_round_num
                    var considering_rounds = _.range(1, current_round_num)

                    return Promise.all([con.venues.read(), con.teams.results.organize(considering_rounds)]).then(function (vs) {
                        var [venues, compiled_team_results] = vs

                        var new_allocation = alloc.standard.venues.get(allocation, venues, compiled_team_results, round_info, options)
                        new_allocation = checks.allocations.venues.check(new_allocation, venues)

                        return new_allocation
                    })
                })
            },

            check: function(allocation) {
                loggers.allocations('allocations.venues.check is called')
                loggers.allocations('debug', 'arguments are: '+JSON.stringify(arguments))
                return con.config.read().then(function (round_info) {
                    var current_round_num = round_info.current_round_num
                    var considering_rounds = _.range(1, current_round_num)

                    return Promise.all([con.venues.read(), con.teams.results.organize(considering_rounds)]).then(function (vs) {
                        var [venues, compiled_team_results] = vs

                        var new_allocation = checks.allocations.venues.check(allocation, venues)

                        return new_allocation
                    })
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

exports.Tournament = Tournament
