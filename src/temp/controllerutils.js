/* general functions






*/

/*


operation functions


 */



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

function update(obj, dict, uid) {
    obj.update(dict, uid)
}

function search_all(list, dict) {
    var found = []
    for (obj of list) {
        found.concat(find_element(obj.results, dict))
    }
    return found
}


exports.get_as_by_b = get_as_by_b
exports.update_as_by_b = update_as_by_b
exports.set_as_by_b = set_as_by_b
exports.update = update
exports.search_all = search_all
exports.insert_ranking = insert_ranking
