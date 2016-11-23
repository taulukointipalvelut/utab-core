function m_gale_shapley (ts, ranks) { // modified gale shapley algorithm
    var matching = {}
    var rank_pointers = {}
    for (var t of ts) {
        matching[t] = null
        rank_pointers[t] = 0
    }

    var remaining = [].concat(ts)
    while (remaining.length > 1) {
        var ap = remaining[0]
        for (var op of ranks[ap]) {
            if (matching[op] === null || ranks[op].indexOf(matching[op]) > ranks[op].indexOf(ap)) {
                if (matching[op] !== null) {
                    rank_pointers[matching[op]] += 1
                    matching[matching[op]] = null
                }
                matching[ap] = op
                matching[op] = ap
                break
            } else {
                rank_pointers[ap] += 1
            }
        }
        remaining = ts.filter(t => matching[t] === null)
    }
    return matching
}

/* test
var as = [1, 2]
var bs = [4, 5, 6]

var a_ranks = {1: [4, 5, 6], 2: [5, 4, 6]}
var b_ranks = {4: [1, 2], 5: [2, 1], 6:[2, 1]}
console.log(gale_shapley(as, bs, a_ranks, b_ranks))
*/

exports.m_gale_shapley = m_gale_shapley
