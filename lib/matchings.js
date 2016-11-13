function m_gale_shapley (ts, ranks) { // modified gale shapley algorithm
    var matching = {}
    var rank_pointers = {}
    for (t of ts) {
        matching[t] = null
        rank_pointers[t] = 0
    }

    var remaining = [].concat(ts)
    while (remaining.length > 1) {
        ap = remaining[0]
        for (op of ranks[ap]) {
            if (matching[op] === null | ranks[op].indexOf(matching[op]) > ranks[op].indexOf(ap)) {
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

function gale_shapley(gs, as, g_ranks, a_ranks) { //a proposed to b, condition: as.length < bs.length
    var g_ranks_pointers = {}
    var g_matched = {}
    var a_matched = {}
    var remaining = [].concat(gs)

    for (var g of gs) {
        g_ranks_pointers[g] = 0
        g_matched[g] = null
    }
    for (var a of as) {
        a_matched[a] = null
    }
    while (remaining.length > 0) {
        var pro = remaining[0]
        var rec = g_ranks[pro][g_ranks_pointers[pro]]
        if (a_matched[rec] === null | a_ranks[rec].indexOf(pro) < a_ranks[rec].indexOf(a_matched[rec])) {
            if (a_matched[rec] !== null) {
                g_ranks_pointers[a_matched[rec]] += 1
                g_matched[a_matched[rec]] = null
            }
            a_matched[rec] = pro
            g_matched[pro] = rec
        } else {
            g_ranks_pointers[pro] += 1
        }
        remaining = gs.filter(g => g_matched[t] === null)
    }
    return g_matched
}
/* test
var as = [1, 2]
var bs = [4, 5, 6]

var a_ranks = {1: [4, 5, 6], 2: [5, 4, 6]}
var b_ranks = {4: [1, 2], 5: [2, 1], 6:[2, 1]}
console.log(gale_shapley(as, bs, a_ranks, b_ranks))
*/

exports.m_gale_shapley = m_gale_shapley
exports.gale_shapley = gale_shapley
