"use strict";

function get_element_by_id (target_list, target_id, f=x=>x.id) {
    for (var target of target_list) {
        if (f(target) == target_id) {
            return target
        }
    }
    throw new Error("could not find id:" + target_id)
}

function rem (list, dict, f=(x, y)=>x.id === y.id) {
    return list.filter(x => !f(x, dict))
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
    for (var e of list) {
        var unmatch = false
        for (var k in dict) {
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







function exist(target_list, id, f=x=>x.id) {
    if (target_list.filter(t => f(t) === id).length > 0) {
        return true
    } else {
        return false
    }
}

function check_keys(dict, keys) {
    for (var key of keys) {
        if (!dict.hasOwnProperty(key)) {
            throw new Error('object has no key: ' + key)
        }
    }
}

function filter_keys(dict, keys) {
    var new_dict = {}
    for (var key of keys) {
        if (dict.hasOwnProperty(key)) {
            new_dict[key] = dict[key]
        }
    }
    return new_dict
}

exports.get_element_by_id = get_element_by_id
exports.get_ids = get_ids
exports.allocation_deepcopy = allocation_deepcopy
exports.count = count
exports.count_common = count_common
exports.find_element = find_element
exports.exist = exist
exports.check_keys = check_keys
exports.rem = rem
exports.filter_keys = filter_keys
