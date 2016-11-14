class Adjudicator {
    constructor (id, institution_ids, pre_evaluation=0) {
        this.id = id
        this.institution_ids = institution_ids
        this.watched_teams = []
        this.scores = []
        this.active_num = []
        this.pre_evaluation = pre_evaluation
        this.available = true
    }

    evaluate () {
        if (this.scores.length === 0) {
            return this.pre_evaluation
        } else if (this.scores.length === 1) {
            return (this.pre_evaluation + this.scores[0]) / 2
        } else {
            return this.scores.adjusted_average()
        }
    }

    set_result (watched_team_ids, score) {
        this.scores.push(score)
        this.watched_teams = this.watched_teams.concat(watched_team_ids)
        this.active_num += 1
    }
}

class Team {
    constructor (id, institution_ids) {
        this.id = id
        this.institution_ids = institution_ids
        this.past_sides = []
        this.wins = []
        this.scores = []
        this.margins = []
        this.past_opponent_ids = []
        this.available = true
    }

    set_result (side, win, score, margin, opponent_id) {
        this.past_sides.push(side)
        this.wins.push(win)
        this.scores.push(score)
        this.margins.push(margin)
        this.past_opponent_ids.push(opponent_id)
    }

    one_sided () {
        return this.past_sides.filter(side => side === "gov").length - this.past_sides.filter(side => side === "opp").length
    }
}

class Venue {
    constructor (id, priority) {
        this.id = id
        this.priority = priority
        this.available = true
    }
}

exports.Team = Team
exports.Adjudicator = Adjudicator
exports.Venue = Venue
