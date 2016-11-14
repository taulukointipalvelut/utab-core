var sys = require('./operation/sys.js')
var tools = require('./tools/tools.js')

;(function () {
    function ignore_na(a) {
        return a === 'n/a' ? 0 : a
    }

    Array.prototype.substantial_length = function () {
        return this.length - tools.count(this, 'n/a')
    }

    Array.prototype.sum = function () {
        if (this.substantial_length() === 0) {
            return 0
        } else {
            return this.reduce((a, b) => a + ignore_na(b))
        }
    }

    Array.prototype.adjusted_average = function () {
        var sum = this.sum()
        if (this.substantial_length() === 0) {
            return 0
        } else {
            return sum/this.substantial_length()
        }
    }

    Array.prototype.sort_teams = function () {
        var sorted_teams = [].concat(this)
        sorted_teams.sort(sys.compare_by_score)
        return sorted_teams
    }

    Array.prototype.sort_adjudicators = function () {
        var sorted_adjudicators = [].concat(this)
        sorted_adjudicators.sort(sys.compare_by_score_adj)
        return sorted_adjudicators
    }

    Array.prototype.sort_venues = function () {
        var sorted_venues = [].concat(this)
        sorted_venues.sort((a, b) => a.priority > b.priority ? 1 : -1)
        return sorted_venues
    }

    function compare_allocation (db, a, b) {
        var a_teams = a.teams.map(id => tools.get_element_by_id(db.teams, id))
        var b_teams = b.teams.map(id => tools.get_element_by_id(db.teams, id))
        var a_wins = a_teams.map(t => t.wins.sum()).sum()
        var b_wins = b_teams.map(t => t.wins.sum()).sum()
        if (a_wins > b_wins) {
            return 1
        } else {
            return -1
        }
    }

    Array.prototype.sort_allocation = function (db) {
        var sorted_allocation = tools.allocation_deepcopy(this)
        sorted_allocation.sort((a, b) => compare_allocation(db, a, b))
        return sorted_allocation
    }

    Array.prototype.shuffle = function () {
        var array = [].concat(this)
        var n = array.length
        var t
        var i

        while (n) {
            i = Math.floor(Math.random() * n--)
            t = array[n]
            array[n] = array[i]
            array[i] = t
        }
        return array
    }
})();
