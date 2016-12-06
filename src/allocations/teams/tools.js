
function decide_positions(teams, compiled_team_results, round_info) {
    var past_sides_list = teams.map(id => sys.find_one(compiled_team_results, id).past_sides)
    var decided_teams

    if (teams.length === 2) {
        if (sys.one_sided(past_sides_list[0]) > sys.one_sided(past_sides_list[1])) {//if team 0 does gov more than team b
            decided_teams = [teams[1], teams[0]]//team 1 does gov in the next round
        } else if (sys.one_sided(past_sides_list[1]) > sys.one_sided(past_sides_list[0])) {
            decided_teams = [teams[0], teams[1]]
        } else {
            decided_teams = teams
        }
    } else if (teams.length === 4) {//FOR BP
        var teams_list = math.permutator(teams)

        var vlist = teams_list.map(ids => sys.square_one_sided_bp(ids.map(id => sys.find_one(compiled_team_results, id).past_sides)))

        decided_teams = teams_list[vlist.indexOf(Math.min(...vlist))]
    }
    return decided_teams
}

function decide_positions_random(teams, compiled_team_results, round_info) {
    return math.shuffle(teams, round_info.name)
}

exports.decide_positions = decide_positions
exports.decide_positions_random = decide_positions_random
