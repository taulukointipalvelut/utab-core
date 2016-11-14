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

function rem (list, id) {
    return list.filter(x => x.id !== id)
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

    get_institutions_by_team (id) {
        return get_as_by_b(this.team_to_institutions, id)
    }

    get_institutions_by_adjudicator (id) {
        return get_as_by_b(this.adjudicator_to_institutions, id)
    }

    get_debaters_by_team(r, id) {
        return get_as_by_b(this.team_to_debaters[r-1], id)
    }

    set_debaters_by_team (id, ids) {
        for (r of _.range(this.current_round_num, this.db.total_round_num+1)) {
            set_as_by_b(this.team_to_debater[r-1], id, ids)
        }
    }

    set_institutions_by_team(id, ids) {
        set_as_by_b(this.team_to_institutions, id, ids)
    }

    set_institutions_by_adjudicator(id, ids) {
        set_as_by_b(this.adjudicator_to_institutions, id, ids)
    }

    update_debaters_by_team (id, ids) {
        for (r of _.range(this.current_round_num, this.db.total_round_num+1)) {
            update_as_by_b(this.team_to_debater[r-1], id, ids)
        }
    }

    update_institutions_by_team(id, ids) {
        update_as_by_b(this.team_to_institutions, id, ids)
    }

    update_institutions_by_adjudicator(id, ids) {
        update_as_by_b(this.adjudicator_to_institutions, id, ids)
    }

    set_team ({id: id, institution_ids: institution_ids}) {
        if (tools.exist(this.teams, id)) {
            throw new Error('id ' + id + ' already exists')
        }
        this.teams.push(new entities.Team(id, institution_ids))
    }

    set_adjudicator ({id: id, institution_ids: institution_ids}) {
        if (tools.exist(this.adjudicators, id)) {
            throw new Error('id ' + id + ' already exists')
        }
        this.adjudicators.push(new entities.Adjudicator(id, institution_ids))
    }

    set_venue ({id: id, priority: priority}) {
        if (tools.exist(this.venues, id)) {
            throw new Error('id ' + id + ' already exists')
        }
        this.venues.push(new entities.Venue(id, priority))
    }

    set_debater ({id: id}) {
        if (tools.exist(this.debaters, id)) {
            throw new Error('id ' + id + ' already exists')
        }
        this.debaters.push({id: id})
    }

    set_institution ({id: id}) {
        if (tools.exist(this.institutions, id)) {
            throw new Error('id ' + id + ' already exists')
        }
        this.institutions.push({id: id})
    }

    get_teams (dict=null) {
        return search(this.teams, dict)
    }

    get_adjudicators (dict=null) {
        return search(this.adjudicators, dict)
    }

    get_venues(dict=null) {
        return search(this.venues, dict)
    }

    get_debaters(dict=null) {
        return search(this.debaters, dict)
    }

    get_institutions(dict=null) {
        return search(this.institutions, dict)
    }

    remove_team (id) {
        rem(this.teams, id)
    }

    remove_adjudicator (id) {
        rem(this.adjudicators, id)
    }

    remove_venue (id) {
        rem(this.venues, id)
    }

    remove_debater (id) {
        rem(this.debaters, id)
    }

    remove_institution (id) {
        rem(this.institution, id)
    }

    update_team (id, dict) {
        //new_dict = get_unnull_dict(dict)
        update(this.teams, id, new_dict)
    }

    update_adjudicator (id, dict) {
        //new_dict = get_unnull_dict(dict)
        update(this.adjudicators, id, new_dict)
    }

    update_venue (id, dict) {
        //new_dict = get_unnull_dict(dict)
        update(this.venues, id, new_dict)
    }

    update_debater (id, dict) {
        //new_dict = get_unnull_dict(dict)
        update(this.debaters, id, new_dict)
    }

    update_institution (id, dict) {
        //new_dict = get_unnull_dict(dict)
        update(this.institutions, id, new_dict)
    }
}

exports.DB = DB
