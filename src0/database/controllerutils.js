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

function insert_ranking(dict, f) { // f is a function that returns 1 if args[1] >~ args[2]
    var ids = Object.keys(dict).map(x => parseInt(x))
    ids.sort((a, b) => f(dict, a, b))
	var ranking = 1
	var stay = 0
    for (var i = 0; i < ids.length-1; i++) {
		dict[ids[i]].ranking = ranking
        console.log(i)
		if (i < ids.length - 1 & f(dict, ids[i+1], ids[i]) === 1) {
			ranking += 1 + stay
			stay = 0
        } else {
			stay += 1
        }
    }

	dict[ids[ids.length-1]].ranking = ranking

	return dict
}

exports.get_as_by_b = get_as_by_b
exports.update_as_by_b = update_as_by_b
exports.set_as_by_b = set_as_by_b
exports.update = update
exports.search_all = search_all
exports.insert_ranking = insert_ranking
