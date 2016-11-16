class Adjudicator {
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
    set_result (side, win, score, margin, opponents) {
        this.past_sides.push(side)
        this.wins.push(win)
        this.scores.push(score)
        this.margins.push(margin)
        this.past_opponent_ids.concat(opponents)
    }

    one_sided () {
        return this.past_sides.filter(side => side === "gov").length - this.past_sides.filter(side => side === "opp").length
    }
}
