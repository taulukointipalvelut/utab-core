var tools = require('./../tools/tools.js')

class Results {
    constructor (r) {
        this.r = r
        this.results = []
    }
    set (dict) {
        if (tools.exist(this.results, dict.uid, r => r.uid)) {
            throw new Error('result uid' + dict.uid + ' already exists.')
        }
        this.results.push(dict)
    }
    get () {
        return this.results
    }

    update (dict, uid) {
        result = get_element_by_id(this.results, uid, x => x.uid)
        for (key in dict) {
            result[key] = dict[key]
        }
    }
}


exports.Results = Results
/*
d1 = new DebaterResults(1)
d1.set({uid: 1})
//d1.set({uid: 1})
console.log(d1.results)
*/
