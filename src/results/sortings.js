
function debater_result_comparer(results, id1, id2) {
    return results[id1].average < results[id2].average ? 1 : -1
}

function team_result_comparer_simple(results, id1, id2) {
    return results[id1].win < results[id2].win ? 1 : -1
}

function team_result_comparer_complex(results, id1, id2) {
    if (results[id1].win < results[id2].win) {
        return 1
    } else if (results[id1].win === results[id2].win) {
        if (results[id1].sum < results[id2].sum) {
            return 1
        } else if (results[id1].sum === results[id2].sum) {
            if (results[id1].margin < results[id2].margin) {
                return 1
            }
        }
    }
    return -1
}

function adjudicator_result_comparer(results, id1, id2) {
    return results[id1].score < results[id2].score ? 1 : -1
}

function total_debater_result_comparer(results, id1, id2) {
    if (results[id1].sum < results[id2].sum) {
        return 1
    } else {
        if (results[id1].average < results[id2].average) {
            return 1
        }
    }
    return -1
}

function total_adjudicator_result_comparer(results, id1, id2) {
    return results[id1].average < results[id2].average ? 1 : -1
}

function total_team_result_comparer(results, id1, id2) {
    if (results[id1].win < results[id2].win) {
        return 1
    } else if (results[id1].win === results[id2].win) {
        if (results[id1].sum < results[id2].sum) {
            return 1
        } else if (results[id1].sum === results[id2].sum) {
            if (results[id1].margin < results[id2].margin) {
                return 1
            }
        }
    }
    return -1
}

function total_team_result_simple_comparer(results, id1, id2) {
    if (results[id1].win < results[id2].win) {
        return 1
    } else {
        return -1
    }
}


exports.debater_result_comparer = debater_result_comparer
exports.adjudicator_result_comparer = adjudicator_result_comparer
exports.team_result_comparer_simple = team_result_comparer_simple
exports.team_result_comparer_complex = team_result_comparer_complex
exports.total_debater_result_comparer = total_debater_result_comparer
exports.total_adjudicator_result_comparer = total_adjudicator_result_comparer
exports.total_team_result_comparer = total_team_result_comparer
exports.total_team_result_simple_comparer = total_team_result_simple_comparer
