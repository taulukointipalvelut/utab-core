function get_element_by_id (target_list, target_id) {
    for (target of target_list) {
        if (target.id == target_id) {
            return target
        }
    }
    throw new Error("could not find id:" + target_id)
}

function compare_lists(list1, list2) {
    if (list1.length !== list2.length) {
        return false
    }
    for (var i = 0; i < list1.length; i++) {
        if (list1[i] !== list2[i]) {
            return false
        }
    }
    return true
}

function find_element (list, dict) {
    var found = []
    for (e of list) {
        var unmatch = false
        for (k in dict) {
            if (Array.isArray(e[k]) & Array.isArray(dict[k])) {
                if (!compare_lists(e[k], dict[k])) {
                    unmatch = true
                    break
                }
            } else {
                if (e[k] !== dict[k]) {
                    unmatch = true
                    break
                }
            }
        }
        if (!unmatch) {
            found.push(e)
        }
    }
    return found
}

function get_ids (target_list) {
    return target_list.map(x => x.id)
}

function allocation_deepcopy(allocation) {
    new_allocation = []
    for ({teams: teams, chairs: chairs=[], remaining_adjudicators: remaining_adjudicators=[], remaining_adjudicators2: remaining_adjudicators2=[], venue: venue=null, id: id} of allocation) {
        dict = {
            teams: teams, chairs:[].concat(chairs),
            remaining_adjudicators:[].concat(remaining_adjudicators),
            remaining_adjudicators2: [].concat(remaining_adjudicators2),
            venue: venue,
            id: id
        }
        new_allocation.push(dict)
    }
    return new_allocation
}

function count(target_list, element) {
    var c = 0
    for (target of target_list) {
        if (target === element) {
            c += 1
        }
    }
    return c
}

function count_common(list1, list2) {
    return list1.map(e1 => count(list2, e1)).sum()
}

function exist(target_list, id, f=x=>x.id) {
    if (target_list.filter(t => f(t) === id).length > 0) {
        return true
    } else {
        return false
    }
}

function check_keys(dict, keys) {
    for (key of keys) {
        if (!dict.hasOwnProperty(key)) {
            throw new Error('object has no key: ' + key)
        }
    }
}

exports.get_element_by_id = get_element_by_id
exports.get_ids = get_ids
exports.allocation_deepcopy = allocation_deepcopy
exports.count = count
exports.count_common = count_common
exports.find_element = find_element
exports.exist = exist
exports.check_keys = check_keys
