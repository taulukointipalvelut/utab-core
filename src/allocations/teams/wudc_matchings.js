var math = require('../../general/math.js')
var sys = require('../sys.js')
var _ = require('underscore')

function add_information_to_division(division, team_num) {
    var div = [].concat(division)
    div[0].out = 0
    div[0].consider = true
    div[0].in = div[0].teams.length % team_num === 0 ? 0 : team_num - div[0].teams.length % team_num

    var now_in = div[0].in
    for (var i = 1; i < div.length - 1; i++) {
        if (div[i].teams.length < now_in) {
            div[i].out = div[i].teams.length
            now_in -= div[i].teams.length
            div[i].consider = false
            //div[i].in = 0
        } else {
            div[i].out = now_in
            div[i].consider = true
            var remaining = div[i].teams.length - div[i].out
            //div[i].in = remaining % team_num === 0 ? 0 : team_num - remaining
            now_in = remaining % team_num === 0 ? 0 : team_num - remaining
        }
    }

    div[div.length-1].out = Math.min(now_in, div[div.length-1].teams.length)
    div[div.length-1].consider = div[div.length-1].teams.length - div[div.length-1].out > 0 ? true : false
    //div[div.length-1].in = 0

    return div
}

function match(div, pullup_func, pairing_func, position_func, avoid_conflict, round_info, team_num) {
    let div_cp = _.clone(div)
    let pre_matching
    let pairings
    let matches
    let final
    let matched = div[0].teams
    for (var i = 1; i < div_cp.length-1; i++) {
        if (div_cp[i].consider) {
            var [chosen, rem] = pullup_func(div_cp[i], round_info)
            div_cp[i].teams = rem
            matched = matched.concat(chosen)
            if (rem.length > 0) {
                pre_matching.push([].concat(matched))
                matched = []
            }
        }
    }
    if (div_cp[div_cp.length-1].consider) {
        pre_matching.push(div_cp[div_cp.length-1])
    }

    pairings = [].concat(div.map(d => pairing_func(d.teams, team_num, round_info)))
    matches = pairings.map(pairing_func)
    final = avoid_conflict(matches)
    return final
}

function wudc_matching(teams, compiled_team_results, round_info, team_num=4, {pairing_method: pairing_method, pullup_method: pullup_method, position_method: position_method, avoid_conflict: avoid_conflict}={}){
    if (teams.length === 0) {
        return {}
    }
    var matching = []
    var pre_matching = []
    var div = []
    var wins = Array.from(new Set(compiled_team_results.map(ctr => ctr.win)))
    var team_ids = teams.map(t => t.id)
    wins.sort()

    for (var win of wins) {
        var same_win_teams = team_ids.filter(id => sys.find_one(compiled_team_results, id).win === win)
        div.push({win: win, teams: same_win_teams})
    }

    div = add_information_to_division(div, team_num)

    pullup_funcs = {
        fromtop: pullup_func_fromtop,
        frombottom: pullup_func_frombottom,
        random: undefined
    }

    pairing_funcs = {
        random: undefined,//NEED FIX//
        fold: pairing_func_fold,
        slide: pairing_func_slide,
        sort: pairing_func_sort,
        adjusted: undefined
    }

    position_funcs = {
        random: undefined,
        adjusted: undefined
    }

    matching = match(div, pullup_funcs[pullup_method], pairing_funcs[pairing_method], position_funcs[position_method], avoid_conflict, team_num)

    return matching
}

function pullup_func_fromtop(d, round_info) {///TESTED///
    return [d.slice(0, d.out), d.slice(d.out)]
}

function pullup_func_frombottom(d, round_info) {///TESTED///
    let e = [].concat(d)
    e.reverse()
    return [e.slice(0, d.out), e.slice(d.out)]
}

function pullup_func_random(d, round_info) {
    let e = math.shuffle(round_info.name)
    return [e.slice(0, d.out), e.slice(d.out)]
}

function pairing_func_random(teams, team_num, round_info) {
    let shuffled_teams = math.shuffle(teams, round_info.name)
    return pairing_func_sort(shuffled_teams, team_num)
}

function pairing_func_fold(teams, team_num, round_info) {///TESTED///
    let matched = []
    let divided = divide_into(teams, team_num)
    for (let j = team_num-1; j >= team_num/2; j--) {
        divided[j].reverse()
    }
    for (let i = 0; i < teams.length/team_num; i++) {
        matched.push(divided.map(div => div.filter((x, j) => j === i)[0]))
    }
    return matched
}

function pairing_func_slide(teams, team_num, round_info) {///TESTED///
    let matched = []
    let divided = divide_into(teams, team_num)
    for (let i = 0; i < teams.length/team_num; i++) {
        matched.push(divided.map(div => div.filter((x, j) => j === i)[0]))
    }
    return matched
}

function pairing_func_sort(teams, team_num, round_info) {///TESTED///
    let matched = divide_into(teams, teams.length/team_num)
    return matched
}

function divide_into(list, num) {///TESTED///
    var divided = []
    var in_div = list.length/num
    for (var j = 0; j < num; j++) {
        divided.push(list.slice(j*in_div, (j+1)*in_div))
    }
    return divided
}

//divide_into([1, 2, 3, 4], 2) === [[1, 2], [3, 4]]
//divide_into([1, 2, 3, 4], 4) === [[1, 2, 3, 4]]
//pairing_func_slide([1, 2, 3, 4], 2) === [[1, 3], [2, 4]]
//pairing_func_slide([1, 2, 3, 4], 4) === [[1, 2, 3, 4]]
//pairing_func_sort([1, 2, 3, 4], 2) === [[1, 2], [3, 4]]
//pairing_func_sort([1, 2, 3, 4], 4) === [[1, 2, 3, 4]]
//pairing_func_fold([1, 2, 3, 4], 2) === [[1, 4], [2, 3]]
//pairing_func_fold([1, 2, 3, 4], 4) === [[1, 2, 3, 4]]
//let d = [1, 2, 3, 4]
//d.out = 3
//pullup_func_fromtop(d) === [[1, 2, 3], [4]]
//pullup_func_frombottom(d) === [[4, 3, 2], [1]]
//d.out = 4
//pullup_func_fromtop(d) === [[1, 2, 3, 4], []]
//pullup_func_frombottom(d) === [[4, 3, 2, 1], []]

exports.wudc_matching = wudc_matching
