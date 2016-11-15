exports.adjudicator_keys = ['id', 'institution_ids', 'watched_teams', 'scores', 'active_num', 'pre_evaluation', 'available', 'conflicts', 'url']
exports.institution_keys = ['id', 'url']
exports.team_keys = ['id', 'institution_ids', 'past_sides', 'wins', 'scores', 'margins', 'past_opponent_ids', 'available', 'url']
exports.debater_keys = ['id', 'url']
exports.venue_keys = ['id', 'priority', 'available', 'url']

exports.adjudicator_defining_keys = ['id', 'institution_ids', 'conflicts']
exports.institution_defining_keys = ['id']
exports.team_defining_keys = ['id', 'institution_ids']
exports.debater_defining_keys = ['id']
exports.venue_defining_keys = ['id', 'priority']

//exports.adjudicator_to_institutions_keys = ['id', 'institution_ids']
//exports.team_to_institutions_keys = ['id', 'institution_ids']
//exports.team_to_debaters_keys = ['id', 'r', 'debater_ids']

//exports.adjudicator_to_institutions_necessary_keys = ['id']
//exports.team_to_institutions_necessary_keys = ['id']
//exports.team_to_debaters_necessary_keys = ['id']

exports.adjudicator_to_institutions_revise_keys = ['id', 'revise']
exports.team_to_institutions_revise_keys = ['id', 'revise']
exports.team_to_debaters_revise_keys = ['id', 'revise', 'r']

exports.team_result_keys = ['r', 'id', 'uid', 'win','opponents', 'side', 'margin']
exports.adjudicator_result_keys = ['r', 'id', 'uid', 'score', 'watched_teams', 'comment']
exports.debater_result_keys = ['r', 'id', 'uid', 'scores']

exports.team_result_necessary_keys = ['r', 'id', 'uid']
exports.adjudicator_result_necessary_keys = ['r', 'id', 'uid']
exports.debater_result_necessary_keys = ['r', 'id', 'uid']

exports.entity_specifying_necessary_keys = ['id']
exports.result_specifying_necessary_keys = ['uid', 'id', 'r']

exports.entity_update_keys = ['id', 'revise']
exports.result_update_keys = ['id', 'uid', 'r', 'revise']

exports.dict_update_keys = ['key', 'value']
exports.dict_update_with_r_keys = ['key', 'value']
