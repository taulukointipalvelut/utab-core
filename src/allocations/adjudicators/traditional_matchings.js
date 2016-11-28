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

function isconflict (square, adjudicator, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts) {//TESTED//
	var adj_insti = sys.find_one(adjudicators_to_institutions, adjudicator.id).institutions
	var adj_confl = sys.find_one(adjudicators_to_conflicts, adjudicator.id).conflicts
	var team_insti = Array.prototype.concat.apply([], square.teams.map(id => sys.find_one(teams_to_institutions, id).institutions))
	if (math.count_common(adj_insti, team_insti) > 0) {
		return true
	}
	if (math.count_common(adj_confl, square.teams) > 0) {
		return true
	}
	console.log(team_insti, adj_confl, adj_insti)
	return false
}
/*
console.log(isconflict(
	{teams: [1, 2]},
	{id: 1},
	[{id: 1, institutions: [1, 2]}, {id: 2, institutions: [2]}],
	[{id: 1, institutions: [3]}],
	[{id: 1, conflicts: [1]}]
))*/

function select_middle(remaining, sorted_adjudicators, {chairs: chairs, panels: panels, trainees: trainees}) {//TESTED//
	var c_num = Math.floor(sorted_adjudicators.length*chairs/(chairs+panels+trainees))
	var p_num = Math.floor(sorted_adjudicators.length*panels/(chairs+panels+trainees))

	for (var adjudicator of remaining) {
		var i = sorted_adjudicators.map(adj => adj.id).indexOf(adjudicator.id)
		if (p_num <= i && i < p_num+c_num) {
			return adjudicator
		}
	}
	return remaining[0]
}

//console.log(select_middle([{id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}], [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}], {chairs: 1, panels: 2, trainees: 1}))

function distribute_adjudicators(sorted_allocation, sorted_adjudicators, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, options) {//WITH SIDE EFFECT//TESTED//
	var new_allocation = sys.allocation_deepcopy(sorted_allocation)
	var remaining = [].concat(sorted_adjudicators)
	for (var j = 0; j < new_allocation.length; j++) {//square to adj
		var square = new_allocation[j]
		var exit_condition = !options.scatter ? (i, remaining) => i >= options.chairs + options.panels + options.trainees || remaining.length === 0 : (i, remaining) => i >= options.chairs + options.panels + options.trainees || (new_allocation.length+1) * (i - 1) + (j + 1) >= sorted_adjudicators.length || remaining.length === 0//i : num of chairs + panels for the square
		for (var i = 0; !exit_condition(i, remaining); i++) {
			var adjudicator = options.middle ? select_middle(remaining, sorted_adjudicators, options) : remaining[0]
			if (true){//!isconflict (square, adjudicator, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_coflicts)) {
				if (square.chairs.length < options.chairs) {
					square.chairs.push(adjudicator.id)
				} else if (square.panels.length < options.panels) {
					square.panels.push(adjudicator.id)
				} else if (square.trainees.length < options.trainees) {
					square.trainees.push(adjudicator.id)
				} else {
					break
				}
				remaining = remaining.filter(adj => adj.id !== adjudicator.id)
			}
		}
	}
	return new_allocation
}
/*
var sorted_allocation = [{chairs: [], panels: [], trainees: []}, {chairs: [], panels: [], trainees: []}]
console.log(distribute_adjudicators(
	sorted_allocation,
	[{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 69}],
	undefined,
	undefined,
	undefined,
	undefined,
	{
		chairs: 1,
		panels: 0,
		trainees: 0,
		scatter: false
	}
))*/

//allocate adjudicators based on specified sort algorithm
function allocate_adjudicators(allocation, adjudicators, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, compiled_adjudicator_results, compiled_team_results, allocation_sort_algorithm, adjudicators_sort_algorithm, {chairs: chairs=1, panels: panels=2, scatter: scatter=true}={}) {
	var sorted_allocation = allocation_sort_algorithm(allocation, compiled_team_results)
	var sorted_adjudicators = adjudicator_sort_algorithm(adjudicators, compiled_adjudicator_results)

	new_allocation = distribute_adjudicators(sorted_allocation, sorted_adjudicators, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, {chairs: chairs, panels: panels, scatter: scatter, middle: middle})
	return new_allocation
}

function allocate_high_to_high(allocation, adjudicators, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, compiled_adjudicator_results, compiled_team_results, {chairs:chairs=1, panels:panels=2, trainees:trainees=0}={}, assign, scatter) {
	return allocate_adjudicators(
		allocation,
		adjudicators,
		teams_to_institutions,
		adjudicators_to_institutions,
		adjudicators_to_conflicts,
		compiled_adjudicator_results,
		compiled_team_results,
		sortings.sort_allocation,
		sortings.sort_adjudicators,
		{chairs:chairs, panels:panels, trainees:trainees, scatter:scatter, middle: false}
	)
}

function allocate_high_to_slight(allocation, adjudicators, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, compiled_adjudicator_results, compiled_team_results, {chairs:chairs=1, panels:panels=2, trainees:trainees=0}={}, assign, scatter) {
	return allocate_adjudicators_factory(
		allocation,
		adjudicators,
		teams_to_institutions,
		adjudicators_to_institutions,
		adjudicators_to_conflicts,
		compiled_adjudicator_results,
		compiled_team_results,
		(allocation, compiled_team_results) => sortings.sort_allocation(allocaton, compiled_team_results, sortings.allocation_slightness_comparer),
		sortings.sort_adjudicators,
		{chairs:chairs, panels:panels, trainees:trainees, scatter:scatter, middle: false}
	)
}
/*
function sort_by_middle_prioritization(sorted_list, {chairs: chairs=1, panels: panels=2, trainees: trainees=1} = {}) {//TESTED//
	var c_num = Math.floor(sorted_list.length*chairs/(chairs+panels+trainees))
	var p_num = Math.floor(sorted_list.length*panels/(chairs+panels+trainees))
	var div_chairs = []
	var div_panels = []
	var div_trainees = []
	for (var i = 0; i < sorted_list.length; i++) {
		var target = sorted_list[i]
		if (i < p_num) {
			div_panels.push(target)
		} else if (i < p_num+c_num) {
			div_chairs.push(target)
		} else {
			div_trainees.push(target)
		}
	}
	return div_chairs.concat(div_panels).concat(div_trainees)
}

console.log(sort_by_middle_prioritization([{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}]))
*/

function allocate_middle_to_high(allocation, adjudicators, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, compiled_adjudicator_results, compiled_team_results, {chairs:chairs=1, panels:panels=2, trainees:trainees=0}={}, assign, scatter) {
	return allocate_adjudicators(
		allocation,
		adjudicators,
		teams_to_institutions,
		adjudicators_to_institutions,
		adjudicators_to_conflicts,
		compiled_adjudicator_results,
		compiled_team_results,
		sortings.sort_allocation,
		sortings.sort_adjudicators,
		{chairs:chairs, panels:panels, trainees:trainees, scatter:scatter, middle: true}
	)
}

function allocate_middle_to_slight(allocation, adjudicators, teams_to_institutions, adjudicators_to_institutions, adjudicators_to_conflicts, compiled_adjudicator_results, compiled_team_results, {chairs:chairs=1, panels:panels=2, trainees:trainees=0}={}, assign, scatter) {
	return allocate_adjudicators(
		allocation,
		adjudicators,
		teams_to_institutions,
		adjudicators_to_institutions,
		adjudicators_to_conflicts,
		compiled_adjudicator_results,
		compiled_team_results,
		(allocation, compiled_team_results) => sortings.sort_allocation(allocaton, compiled_team_results, sortings.allocation_slightness_comparer),
		sortings.sort_adjudicators,
		{chairs:chairs, panels:panels, trainees:trainees, scatter:scatter, middle: true}
	)
}

exports.allocate_high_to_high = allocate_high_to_high
exports.allocate_middle_to_high = allocate_middle_to_high
exports.allocate_middle_to_high = allocate_middle_to_high
exports.allocate_high_to_slight = allocate_high_to_slight
//console.log(measure_slightness([1, 2], [{id: 1, win: 2, sum: 100}, {id: 2, win: 1, sum: 100}]))
