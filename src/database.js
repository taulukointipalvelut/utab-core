var entities = require('./database/entities.js')
var _ = require('underscore/underscore.js')
var tools = require('./tools/tools.js')

function search(list, dict) {
    if (dict === null) {
        return list
    } else {
        return tools.find_element(list, dict)
    }
}
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
function update (list, id, properties) {
    element = tools.get_element_by_id(list, id)
    for (key in properties) {
        element[key] = property[key]
    }
}

function get_as_by_b(dict, id) {
    if (dict.hasOwnProperty(id)) {
        return dict[id]
    } else {
        return []
    }
}

function update_as_by_b (dict, id, ids) {
    if (!dict.hasOwnProperty(id)) {
        throw new Error('id ' + id  + ' does not exist')
    } else {
        dict[id] = ids
    }
}

function set_as_by_b (dict, id, ids) {
    if (dict.hasOwnProperty(id)) {
        throw new Error('id ' + id  + ' already exists')
    } else {
        dict[id] = ids
    }
}

class DB {
    constructor(total_round_num, tournament_name=null) {
        this.tournament_name = tournament_name
        this.total_round_num = total_round_num
        this.adjudicators = []
        this.teams = []
        this.venues = []
        this.debaters = []
        this.institutions = []
        this.team_to_institutions = {}
        this.adjudicator_to_institutions = {}
        this.team_to_debaters = _.range(0, total_round_num).map(i => {})//possibility to change debaters
        this.current_round_num = 1
    }

    proceed_round () {
        this.current_round_num += 1
    }

    get_institutions_by_team (dict) {
        tools.check_keys(dict, ['id'])
        return get_as_by_b(this.team_to_institutions, dict.id)
    }

    get_institutions_by_adjudicator (dict) {
        tools.check_keys(dict, ['id'])
        return get_as_by_b(this.adjudicator_to_institutions, dict.id)
    }

    get_debaters_by_team(dict) {
        tools.check_keys(dict, ['id', 'r'])
        return get_as_by_b(this.team_to_debaters[dict.r-1], dict.id)
    }

    set_debaters_by_team (dict) {
        tools.check_keys(dict, ['id', 'r', 'debater_ids'])
        for (r of _.range(this.current_round_num, this.db.total_round_num+1)) {
            set_as_by_b(this.team_to_debater[dict.r-1], dict.id, dict.debater_ids)
        }
    }

    set_institutions_by_team(dict) {
        tools.check_keys(dict, ['id', 'institution_ids'])
        set_as_by_b(this.team_to_institutions, dict.id, dict.ids)
    }

    set_institutions_by_adjudicator(dict) {
        tools.check_keys(dict, ['id', 'institution_ids'])
        set_as_by_b(this.adjudicator_to_institutions, dict.id, dict.ids)
    }

    update_debaters_by_team (dict) {
        tools.check_keys(dict, ['id', 'r', 'debater_ids'])
        for (r of _.range(this.current_round_num, this.db.total_round_num+1)) {
            update_as_by_b(this.team_to_debater[dict.r-1], dict.id, dict.debater_ids)
        }
    }

    update_institutions_by_team (dict) {
        tools.check_keys(dict, ['id', 'institution_ids'])
        update_as_by_b(this.team_to_institutions, dict.id, dict.ids)
    }

    update_institutions_by_adjudicator (dict) {
        tools.check_keys(dict, ['id', 'institution_ids'])
        update_as_by_b(this.adjudicator_to_institutions, dict.id, dict.ids)
    }

    set_team (dict) {
        tools.check_keys(dict, ['id', 'institution_ids'])
        if (tools.exist(this.teams, dict.id)) {
            throw new Error('id ' + dict.id + ' already exists')
        }
        this.teams.push(new entities.Team(dict.id, dict.institution_ids))
    }

    set_adjudicator (dict) {
        tools.check_keys(dict, ['id', 'institution_ids', 'conflicts'])
        if (tools.exist(this.adjudicators, dict.id)) {
            throw new Error('id ' + dict.id + ' already exists')
        }
        this.adjudicators.push(new entities.Adjudicator(dict.id, dict.institution_ids, dict.conflicts))
    }

    set_venue (dict) {
        tools.check_keys(dict, ['id', 'priority'])
        if (tools.exist(this.venues, dict.id)) {
            throw new Error('id ' + dict.id + ' already exists')
        }
        this.venues.push(new entities.Venue(dict.id, dict.priority))
    }

    set_debater (dict) {
        tools.check_keys(dict, ['id'])
        if (tools.exist(this.debaters, dict.id)) {
            throw new Error('id ' + dict.id + ' already exists')
        }
        this.debaters.push(dict)
    }

    set_institution (dict) {
        tools.check_keys(dict, ['id'])
        if (tools.exist(this.institutions, dict.id)) {
            throw new Error('id ' + dict.id + ' already exists')
        }
        this.institutions.push(dict)
    }

    get_teams (dict=null) {
        return this.teams
    }

    get_adjudicators (dict=null) {
        return this.adjudicators
    }

    get_venues(dict=null) {
        return this.venues
    }

    get_debaters(dict=null) {
        return this.debaters
    }

    get_institutions(dict=null) {
        return this.institutions
    }

    search_teams (dict=null) {
        return search(this.teams, dict)
    }

    search_adjudicators (dict=null) {
        return search(this.adjudicators, dict)
    }

    search_venues(dict=null) {
        return search(this.venues, dict)
    }

    search_debaters(dict=null) {
        return search(this.debaters, dict)
    }

    search_institutions(dict=null) {
        return search(this.institutions, dict)
    }

    tools.remove_team (dict) {
        tools.check_keys(dict)
        tools.rem(this.teams, dict.id)
    }

    tools.remove_adjudicator (dict) {
        tools.check_keys(dict)
        tools.rem(this.adjudicators, dict.id)
    }

    tools.remove_venue (dict) {
        tools.check_keys(dict)
        tools.rem(this.venues, dict.id)
    }

    tools.remove_debater (dict) {
        tools.check_keys(dict)
        tools.rem(this.debaters, dict.id)
    }

    tools.remove_institution (dict) {
        tools.check_keys(dict)
        tools.rem(this.institution, dict.id)
    }

    update_team (dict) {
        tools.check_keys(dict, ['id'])
        //new_dict = get_unnull_dict(dict)
        update(this.teams, dict.id, dict)
    }

    update_adjudicator (dict) {
        tools.check_keys(dict, ['id'])
        //new_dict = get_unnull_dict(dict)
        update(this.adjudicators, dict.id, dict)
    }

    update_venue (dict) {
        tools.check_keys(dict, ['id'])
        //new_dict = get_unnull_dict(dict)
        update(this.venues, dict.id, dict)
    }

    update_debater (dict) {
        tools.check_keys(dict, ['id'])
        //new_dict = get_unnull_dict(dict)
        update(this.debaters, dict.id, dict)
    }

    update_institution (dict) {
        tools.check_keys(dict, ['id'])
        //new_dict = get_unnull_dict(dict)
        update(this.institutions, dict.id, dict)
    }
}

exports.DB = DB
