exports.get_team_by_id = function (teams, team_id) {
    for (team of teams) {
        if (team.team_id === team_id) return team
    };
    throw new Error("could no find team_id:" + team_id)
}
