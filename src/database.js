"use strict";

var _ = require('underscore/underscore.js')
var tools = require('./tools/tools.js')
var keys = require('./tools/keys.js')

/*
function get_unnull_dict (dict) {
    var new_dict = {}
    for (key in dict) {
        if (dict[key] !== null) {
            new_dict[key] = dict[key]
        }
    }
}
*/

class __DB_dict_list {
    constructor() {
        this[Symbol.for('list')] = []//private
    }
    search(dict) {
        tools.find_element(this[Symbol.for('list')], dict)
    }
    get() {
        return this[Symbol.for('list')]
    }
    push(v) {
        this[Symbol.for('list')].push(v)
    }
}

class _DB_result_list extends __DB_dict_list {
    update(dict) { // used for dict list
        tools.check_keys(dict, keys.result_update_keys)
        var elements = this[Symbol.for('list')].filter(x=>x.id === dict.id & x.uid === dict.uid & x.r === dict.r)
        if (elements.length === 0) {
            throw new Error('does not exist')
        }
        for (key in dict.revise) {
            elements[0][key] = dict.revise[key]
        }
    }
    remove(dict) { // used for dict list
        tools.check_keys(dict, keys.result_specifying_necessary_keys)

        var elements = this[Symbol.for('list')].filter(x=>x.id !== dict.id | x.uid !== dict.uid | x.r !== dict.r)
        if (elements.length === 0) {
            throw new Error('id ' + f(dict) + ' does not exist')
        }
        this[Symbol.for('list')] = elements
    }

}

class _DB_dict_list extends __DB_dict_list {
    constructor() {
        super()//private
    }

    update(dict) { // used for dict list
        tools.check_keys(dict, keys.entity_update_keys)
        var elements = this[Symbol.for('list')].filter(x=>x.id === dict.id)
        if (elements.length === 0) {
            throw new Error('id ' + dict.id + ' does not exist')
        }
        for (key in dict.revise) {
            elements[0][key] = dict.revise[key]
        }
    }

    remove(dict) { // used for dict list
        tools.check_keys(dict, keys.entity_specifying_necessary_keys)

        var elements = this[Symbol.for('list')].filter(x=>x.id !== dict.id)
        if (elements.length === 0) {
            throw new Error('id ' + f(dict) + ' does not exist')
        }
        this[Symbol.for('list')] = elements
    }
}

class _DB_dict {
    constructor () {
        this[Symbol.for('dict')] = {}
    }
    get_of(key) {
        return this[Symbol.for('dict')][key]
    }
    get() {
        return this[Symbol.for('dict')]
    }
    set(dict) {
        tools.check_keys(dict, keys.dict_update_keys)
        if (this[Symbol.for('dict')].hasOwnProperty(dict.key)) {
            throw new Error('object value is already set')
        } else {
            this[Symbol.for('dict')][dict.key] = dict.value
        }
    }
    update(dict) {
        tools.check_keys(dict, keys.dict_update_keys)
        if (!this[Symbol.for('dict')].hasOwnProperty(dict.key)) {
            throw new Error('object value does not exist')
        } else {
            this[Symbol.for('dict')][dict.key] = dict.value
        }
    }
    /*
    remove(dict) {
        tools.check_keys(dict, ['key'])
        if (!this[Symbol.for('dict')].hasOwnProperty(dict.key)) {
            throw new Error('object value does not exist')
        } else {
            this[Symbol.for('dict')][dict.key] = {}
        }
    }*/
}

class _DB_var {
    constructor() {
        this[Symbol.for('var')] = undefined
    }
    get() {
        return this[Symbol.for('var')]
    }
    set(v) {
        if (this[Symbol.for('var')] !== undefined) {
            throw new Error('object value is already set')
        } else {
            this[Symbol.for('var')] = v
        }
    }
    update(v) {
        if (this[Symbol.for('var')] === undefined) {
            throw new Error('object value is not set')
        } else {
            this[Symbol.for('var')] = v
        }
    }
}

class DB {
    constructor(total_round_num, tournament_name=null) {
        this.tournament_name = new _DB_var
        this.tournament_name.set(tournament_name)
        this.total_round_num = new _DB_var
        this.total_round_num.set(total_round_num)
        this.teams = new _DB_dict_list
        this.adjudicators = new _DB_dict_list
        this.venues = new _DB_dict_list
        this.debaters = new _DB_dict_list
        this.institutions = new _DB_dict_list
        this.team_to_institutions = new _DB_dict
        this.adjudicator_to_institutions = new _DB_dict
        this.team_to_debaters = new _DB_dict_list
        _.range(0, total_round_num).map(i => this.team_to_debaters.push(new _DB_dict_list))//possibility to change debaters
        this.current_round_num = new _DB_var
        this.current_round_num.set(1)
        this.raw_debater_results = new _DB_result_list
        this.raw_team_results = new _DB_result_list
        this.raw_adjudicator_results = new _DB_result_list
    }
}

exports.DB = DB
/*
var db = new DB(4, "test")
console.log(db.team_to_debaters.get()[0])
console.log(db.team_to_debaters.get()[0].get())
*/
