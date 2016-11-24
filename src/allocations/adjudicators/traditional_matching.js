//high level adjudicators judges slight rounds
//high level adjudicators judges high level squares
//middle level adjudicators do chairs and high do panels in squares ordered by level
//             											 in squares ordered by slightness

var sys = require('../sys.js')
var math = require('../../general/math.js')

function measure_slightness(teams, compiled_team_results) {//FOR BP
	var wins = teams.map(id => sys.find_one(compiled_team_results, id).win)
	var sums = teams.map(id => sys.find_one(compiled_team_results, id).sum)
	return [math.sd(wins), math.sd(sums)]
}

function isconflict (square, adjudicator, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflcits) {
	var adj_insti = sys.find_one(adjudicators_to_institutions, adjudicator.id).institutions
	var adj_confl = sys.find_one(adjudicators_to_conflicts, adjudicator.id).conflicts
	var team_insti = Array.prototype.concat.apply([], square.teams.map(id => sys.find_one(teams_to_institutions, id).institutions))
	if (math.count(adj_insti, team_insti) > 0) {
		return true
	}
	if (math.count(adj_confl, square.teams) > 0) {
		return true
	}
	return false
}

//NEED FIX
function distribute_adjudicators_equally(sorted_allocation, sorted_adjudicators, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, chairs, panels) {//WITH SIDE EFFECT
	var remaining = [].concat(sorted_adjudicators)
	for (var i = 0; i < chairs+panels; i++) {//square to adj
		for (var square of sorted_allocation) {
			for (var adjudicator of remaining) {
				if (!isconflict (square, adjudicator,teams_to_institutions, adjudicators_to_institutions, adjudicators_to_coflicts)) {
					i < chairs ? square.chairs.push(adjudicator.id) : square.panels.push(adjudicator.id)
					remaining = remaining.filter(adj => adj.id !== adjudicator.id)
					break
				}
			}
		}
	}
}

function distribute_adjudicators_to_top(sorted_allocation, sorted_adjudicators, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, chairs, panels) {//WITH SIDE EFFECT
	var remaining = [].concat(sorted_adjudicators)
	for (var square of sorted_allocations) {//square to adj
		for (var adjudicator of remaining) {
			if (!isconflict (square, adjudicator,teams_to_institutions, adjudicators_to_institutions, adjudicators_to_coflicts)) {
				if (square.chairs.length < chairs) {
					square.chairs.push(adjudicator.id)
					remaining = remaining.filter(adj => adj.id !== adjudicator.id)
				} else if (square.panels.length < panels) {
					square.panels.push(adjudicator.id)
					remaining = remaining.filter(adj => adj.id !== adjudicator.id)
				} else {
					break
				}
			}
		}
	}
}

//allocate adjudicators based on specified sort algorithm
function allocate_adjudicators_factory(allocation, adjudicators, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, compiled_adjudicator_results, compiled_team_results, allocation_sort_algorithm, adjudicators_sort_algorithm, {chairs: chairs=1, panels: panels=2, scatter: scatter=true}={}) {
	var sorted_allocation = allocation_sort_algorithm(allocation, compiled_team_results)
	var sorted_adjudicators = adjudicator_sort_algorithm(adjudicators, compiled_adjudicator_results)

	if (scatter) {//equally distribute chairs to each square
		distribute_adjudicators_equally(sorted_allocation, sorted_adjudicators, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, chairs, panels)
	} else {//prioritize top level square
		distribute_adjudicators_to_top(sorted_allocation, sorted_adjudicators, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, chairs, panels)
	}
}

function allocate_high_to_high() {

}

function allocate_high_to_slight() {

}

function allocate_middle_to_high() {

}

function allocate_middle_to_slight(allocation, adjudicators, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, compiled_adjudicator_results, copmiled_team_results, options) {

}

exports.allocate_high_to_high = allocate_high_to_high
exports.allocate_middle_to_high = allocate_middle_to_high
exports.allocate_middle_to_high = allocate_middle_to_high
exports.allocate_high_to_slight = allocate_high_to_slight
//console.log(measure_slightness([1, 2], [{id: 1, win: 2, sum: 100}, {id: 2, win: 1, sum: 100}]))
