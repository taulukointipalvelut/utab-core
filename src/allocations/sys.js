"use strict";
var math = require('../general/math.js')
var loggers = require('../general/loggers.js')

function one_sided (past_sides) {  //FOR  NA//
    return past_sides.filter(side => side === 'gov').length - past_sides.filter(side => side === 'opp').length
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

function find_one(list, id) {
    return list.filter(e => e.id === id)[0]
}

function one_sided_bp(past_sides) {//the higher the worser
    if (past_sides.length === 0) {
        return [0, 0]
    } else {
        var opening = (math.count(past_sides, 'og') + math.count(past_sides, 'oo') - math.count(past_sides, 'cg') - math.count(past_sides, 'co'))/past_sides.length
        var gov = (math.count(past_sides, 'og') + math.count(past_sides, 'cg') - math.count(past_sides, 'oo') - math.count(past_sides, 'co'))/past_sides.length
        return [opening, gov]
    }
}

function square_one_sided_bp(past_sides_list) {//TESTED//
    var positions = ['og', 'oo', 'cg', 'co']
    var ind1 = 0
    var ind2 = 0
    for (var i = 0; i < positions.length; i++) {
        let [opening, gov] = one_sided_bp(past_sides_list[i].concat([positions[i]]))
        ind1 += Math.abs(opening)
        ind2 += Math.abs(gov)
    }
    return ind1 + ind2
}

function square_one_sided(past_sides_list) {//TESTED//
    var positions = ['gov', 'opp']
    var ind = 0
    for (var i = 0; i < positions.length; i++) {
        let g = one_sided(past_sides_list[i].concat([positions[i]]))
        ind += Math.abs(g)
    }
    return ind
}

exports.one_sided = one_sided
exports.allocation_deepcopy = allocation_deepcopy
exports.find_one = find_one
exports.one_sided_bp = one_sided_bp
exports.square_one_sided_bp = square_one_sided_bp
exports.square_one_sided = square_one_sided
