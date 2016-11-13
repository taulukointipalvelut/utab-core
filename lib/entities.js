
var Adjudicator = function (adjudicator_id, institution_ids) {
    this.adjudicator_id = adjudicator_id
    this.institution_ids = institution_ids
    this.watched_teams = []
    this.scores = []
    this.active_num = []
    this.judge_score = []
    this.available = true
}

var Team = function (team_id, institution_ids) {
    this.team_id = team_id
    this.institution_ids = institution_ids
    this.past_sides = []
    this.wins = []
    this.scores = []
    this.margins = []
    this.past_opponent_ids = []
    this.available = true
}

Team.prototype.set_result = function (side, win, score, margin, opponent_id) {
    this.past_sides.push(side)
    this.wins.push(win)
    this.scores.push(score)
    this.margins.push(margin)
    this.past_opponent_ids.push(opponent_id)
}

Team.prototype.one_sided = function () {
    return this.past_sides.filter(side => side === "gov").length - this.past_sides.filter(side => side === "opp").length
}

exports.Team = Team
exports.Adjudicator = Adjudicator
