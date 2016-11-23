function one_sided (past_sides) {  //FOR  NA//
    return past_sides.filter(side => side === "gov").length - past_sides.filter(side => side === "opp").length
}

function allocation_deepcopy(allocation) {
    var new_allocation = []
    //console.log(allocation)
    for (var square of allocation) {
        var {teams: teams, chairs: chairs=[], panels: panels=[], trainees: trainees=[], venue: venue=null, id: id, warnings: warnings=[]} = square
        var dict = {
            teams: teams,
            chairs:[].concat(chairs),
            panels: [].concat(panels),
            trainees: [].concat(trainees),
            venue: venue,
            warnings: warnings,
            id: id
        }
        new_allocation.push(dict)
    }
    return new_allocation
}

function acess(dict, key, def=[]) {
    if (dict.hasOwnProperty(key)) {
        return dict[key]
    } else {
        return def
    }
}

function find_one(list, id) {
    return list.filter(e => e.id === id)[0]
}

exports.one_sided = one_sided
exports.allocation_deepcopy = allocation_deepcopy
exports.acess= acess
exports.find_one = find_one
