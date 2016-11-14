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
}


exports.Results = Results
/*
d1 = new DebaterResults(1)
d1.set({uid: 1})
//d1.set({uid: 1})
console.log(d1.results)
*/
