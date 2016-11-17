"use strict";


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
exports.count = count
exports.count_common = count_common
exports.find_element = find_element
exports.exist = exist
exports.check_keys = check_keys
exports.rem = rem
exports.filter_keys = filter_keys
