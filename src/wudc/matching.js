"use strict";
var math = require('../general/math.js')
var sys = require('../allocations/sys.js')

function create_pool(teams, compiled_team_results) {
    var pool = []

    for (var team of teams) {
        var win = sys.find_one(compiled_team_results, team.id).win
        pool.push({win: win, id: team.id})
    }

    return pool
}

function choose_randomly_from_list(list, num) {//TESTED//
    var chosen = []
    var list_cp = [].concat(list)
    var remaining = num
    var rest = []
    list_cp = math.shuffle(list_cp)
    for (var i = 0; i < list.length; i++) {
        if (i < num) {
            chosen.push(list_cp[i])
            remaining -= 1
        } else {
            rest.push(list_cp[i])
        }
    }
    return [chosen, remaining, rest]
}

function get_division(pool) {
    var now_win = pool[0].win
    var i = 0
    var division = [[]]
    for (var e of pool) {
        if (e.win === now_win) {
            division[i].push(e)
        } else {
            i += 1
            now_win = e.win
            division[i] = [e]
        }
    }
    return division
}

function randomly_divide(list) {
    var divided = []
    if (list.length === 4) {
        divided = [list]
    } else {
        var new_list = math.shuffle(list)
        for (var i = 0; i < new_list.length; i++) {
            if (divided[Math.floor(i/4)]) {
                divided[Math.floor(i/4)].push(new_list[i])
            } else {
                divided[Math.floor(i/4)] = [new_list[i]]
            }
        }
    }
    return divided
}

function measure_slightness(square, teams, compiled_team_results) {//mainly for BP
    var wins = square.teams.map(id => sys.find_one(compiled_team_results, id).win)
    var sum_scores = square.teams.map(id => sys.find_one(compiled_team_results, id).sum)
    return [math.sd(wins), math.sd(sum_scores)]
}

function bp_one_sided(team, compiled_team_results) {
    var past_sides = sys.find_one(compiled_team_results, team.id).past_sides
    var opening = past_sides.filter(s => s === 'og' || s === 'oo').length - past_sides.filter(s => s === 'cg' || s === 'co')
    var government = past_sides.filter(s => s === 'og' || s === 'cg').length - past_sides.filter(s => s === 'oo' || s === 'co')
    return [opening, government]
}

function get_onesidedness(teams, compiled_team_results) {
    var vals = teams.map(t => bp_one_sided(t, compiled_team_results))
}

function wudc_matching_simple(teams, compiled_team_results) {
    if (teams.length === 0) {
        return []
    }
    var pool = create_pool(teams, compiled_team_results)
    pool.sort((a, b) => a.win < b.win)

    var division = get_division(pool)
    division = division.map(e => math.shuffle(e))//CAN BE CHANGED

    var clist = Array.prototype.concat.apply([], division)

    var now_win = clist[0].win
    var pre_matching = []
    var buff = []
    var extending = false
    for (var i = 0; i < clist.length; i++) {
        buff.push(clist[i])
        if (i === clist.length - 1) {
            pre_matching.push(buff)
            buff = []
        } else if (buff.length % 4 === 0) {
             if (extending || now_win !== clist[i+1].win) {
                extending = false
                now_win = clist[i].win
                pre_matching.push(buff)
                buff = []
            } else {
                extending = true
            }
        }
    }
    //return pre_matching
    return Array.prototype.concat.apply([], pre_matching.map(pm => randomly_divide(pm)))//CAN BE CHANGED
}

console.log(wudc_matching_simple([{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}], [{id: 1, win: 1}, {id: 2, win: 1}, {id: 3, win: 1}, {id: 4, win: 1}, {id: 5, win: 3}, {id: 6, win: 1}, {id: 7, win: 8}, {id: 8, win: 1}]))

exports.wudc_matching_simple = wudc_matching_simple
