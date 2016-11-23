
function gale_shapley(gs, as, g_ranks, a_ranks) { //a proposes to b, condition: as.length < bs.length
    if (gs.length > as.length) { throw new Error('gs must be fewer than as') }

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

        if (a_matched[rec] === null || a_ranks[rec].indexOf(pro) < a_ranks[rec].indexOf(a_matched[rec])) {
            if (a_matched[rec] !== null) {
                g_ranks_pointers[a_matched[rec]] += 1
                g_matched[a_matched[rec]] = null
            }
            a_matched[rec] = pro
            g_matched[pro] = rec
        } else {
            g_ranks_pointers[pro] += 1
        }
        remaining = gs.filter(g => g_matched[g] === null)
    }
    return g_matched
}

exports.gale_shapley = gale_shapley
