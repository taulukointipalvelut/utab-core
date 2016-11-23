var math = require('../../general/math.js')
var sys = require('../sys.js')

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
            div[i].in = 0
        } else {
            div[i].out = now_in
            div[i].consider = true
            var remaining = div[i].teams.length - div[i].out
            div[i].in = remaining % team_num === 0 ? 0 : team_num - remaining
            now_in = div[i].in
        }
    }

    div[div.length-1].out = Math.min(now_in, div[div.length-1].teams.length)
    div[div.length-1].consider = div[div.length-1].teams.length - div[div.length-1].out > 0 ? true : false
    div[div.length-1].in = 0

    return div
}

function divide_func_default(list, team_num) {
    var divided = []
    for (var i = 0; i < list.length; i++) {
        if (i % team_num === 0) {
            divided[Math.floor(i/team_num)] = [list[i]]
        } else {
            divided[Math.floor(i/team_num)].push(list[i])
        }
    }
    return divided
}

function part_func_default(list, num) {
    var ret = []
    var rem = []
    for (var i = 0; i < list.teams.length; i++) {
        if (i < num) {
            ret.push(list.teams[i])
        } else {
            rem.push(list.teams[i])
        }
    }
    return [ret, rem]
}

function choose_from_latter_dicts(div, i, now_in, part_func) {
    var remaining = now_in
    var chosen = []

    for (var j = i+1; j < div.length; j++) {
        if (remaining === 0) {
            break
        }
        if (div[j].teams.length < remaining) {
            chosen = chosen.concat(div[j].teams)
            remaining = remaining - div[j].teams.length
            div[j].teams = []
        } else {
            var [ret, rem] = part_func(div[j], div[j].out)
            remaining = 0
            chosen = chosen.concat(ret)
            div[j].teams = rem
        }
    }
    return chosen
}

function wudc_matching(teams, compiled_team_results, part_func=part_func_default, divide_func=divide_func_default, team_num=4, pullup=true){
    if (teams.length === 0) {
        return {}
    }
    var matching = []
    var pre_matching = []
    var div = []
    var wins = Array.from(new Set(compiled_team_results.map(ctr => ctr.win)))
    var team_ids = teams.map(t => t.id)
    if (pullup) {
        wins.sort().reverse()
    } else {
        wins.sort()
    }
    for (var win of wins) {
        var same_win_teams = team_ids.filter(id => sys.find_one(compiled_team_results, id).win === win)
        div.push({win: win, teams: same_win_teams})
    }

    div = add_information_to_division(div, team_num)

    var now_in
    for (var i = 0; i < div.length; i++) {
        if (div[i].consider) {
            var matched = [].concat(div[i].teams)
            now_in = div[i].in
            var chosen = choose_from_latter_dicts(div, i, now_in, part_func)
            matched = matched.concat(chosen)
            pre_matching.push(matched)
        }
    }
    matching = Array.prototype.concat.apply([], pre_matching.map(pm => divide_func(pm, team_num)))
    return matching
}

exports.wudc_matching = wudc_matching
//console.log(wudc_matching([{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}], [{id: 1, win: 1}, {id: 2, win: 1}, {id: 3, win: 1}, {id: 4, win: 1}, {id: 5, win: 3}, {id: 6, win: 1}, {id: 7, win: 8}, {id: 8, win: 1}], part_func_default, divide_func_default, 4))
