function get_element_by_id (target_list, target_id) {
    for (target of target_list) {
        if (target.id == target_id) {
            return target
        }
    }
    throw new Error("could not find id:" + target_id)
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

exports.get_element_by_id = get_element_by_id
exports.get_ids = get_ids
exports.allocation_deepcopy = allocation_deepcopy
exports.count = count
exports.count_common = count_common
