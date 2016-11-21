# UTab-core

Interfaces of Simpler and faster UTab-core in Nodejs and of Database handler.

The original version of UTab-core in Python is [here](https://github.com/taulukointipalvelut/utab-api-server).

## Files

 + "CHANGELOG.md" - Release notes
 + "TERMS.md" - Terms

## Documents

Documentation for version 1 is available at [here](https://taulukointipalvelut.github.io/)

## Usage

1. Clone this repository. `git clone https://github.com/taulukointipalvelut/utab-core`

1. Start MongoDB. `mongod`

1. Import core.js and create an instance.
```javascript
var core = require('./utab-core-js/core.js')

core.tournaments.read().then(console.log) // read tournaments
var t1 = new core.Tournament({id: 1, name: "6th test tournament"}) // create a tournament with id 1
t1.close()//close connection
```

## Features

1. Strict validation for database

1. New Matching Algorithms derived from Gale Shapley Algorithm

## Attention

1. You should either set pre-evaluation to all adjudicators, or to no adjudicator.

1. All return values from database functions are treated as Promise objects

1. Expected total round num is 1 ~ 6.

1. judge-pre-evaluation should be evaluated as same criteria as judge evaluation at the tournament.

1. If num of chairs is odd, they should discuss who is the winner and send the same `win`.

1. ID, which is unique and constant in all entities throughout adjudicators/teams/debaters, of result sender should be specified when sending result.

## Future Coming

### UTab-core version 1.0 <!--[Candle Light]--> (by 2016/11/20)

**To have basic functions**

Planning to support

1. New matching algorithms
1. database(MongoDB)
1. All basic functions

### UTab-core version 2.0 <!--[Luna Flight]--> (by 2016/12?)

**To have more safety**

Planning to support

1. Stricter validation
1. Multiple chairs, panels, trainees

### UTab-core version 3.0 <!--[Frosty Night]--> (in 2017)

**To improve internal algorithms**

Planning to support

1. New algorithms
1. Mstat

### UTab-core future version *

1. Modifying result after rounds

## ROLE OF EACH MODULE

![structure](structure.jpg "Module Relations")

 * core.js: tournament management interface
     * operations.js: data computing interface
         * allocations.js: functions to compute allocations
         * results.js: functions to summarize results
     * controllers.js: database management interface
         * database.js: databaase handler
         * schemas.js: document schema

```
core.js
    |
    |_src/operations.js
    |    |
    |    |_src/operations/allocations.js
    |    |    |_src/operations/sortings.js
    |    |    |_src/operations/matchings.js
    |    |    |_src/operations/sys.js
    |    |    |_src/operations/checks/tmchecks.js
    |    |    |_src/operations/checks/adjchecks.js
    |    |    |_src/operations/checks/vnchecks.js
    |    |    |_src/operations/checks/dbchecks.js
    |    |
    |    |_src/operations/results.js
    |    |    |_src/operations/sortings.js
    |    |    |_src/operations/math.js
    |    |    |_src/operations/sys.js
    |    |    |_src/operations/checks/reschecks.js
    |    |    |_src/operations/checks/dbchecks.js
    |    |
    |    |_src/operations/adfilters.js
    |    |    |_src/operations/math.js
    |    |    |_src/operations/sys.js
    |    |
    |    |_src/operations/filters.js
    |         |_src/operations/math.js
    |         |_src/operations/sys.js
    |
    |_src/controllers.js
         |_src/controllers/database.js
              |_src/controllers/schemas.js

```
