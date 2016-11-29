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

1. Import utab.js and create an instance.
```javascript
var utab = require('./utab-core/utab.js')

var t1 = new utab.Tournament({name: "6th test tournament"}) // create a tournament

t1.teams.create({id: 1}) // create a team
t1.close()//close connection to database for t1
```

## Features

1. Strict validation for database

<!--New Matching Algorithms derived from Gale Shapley Algorithm-->

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

### UTab-core version 2.0 <!--[Luna Flight]--> (by the end of Descember 2016)

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

 * utab.js: tournament management interface
     * allocations.js: functions to compute allocations
     * results.js: functions to summarize/check results
     * controllers.js: database management interface
     * checks.js: functions to check data

```
utab.js
    |
    |_src/allocations.js
    |    |
    |    |_src/allocations/teams.js
    |    |    |_src/allocations/teams/filters.js
    |    |    |_src/allocations/teams/matchings.js
    |    |    |_src/allocations/teams/wudc_matchings.js
    |    |
    |    |_src/allocations/adjudicators.js
    |    |    |_src/allocations/adjudicators/adfilters.js
    |    |    |_src/allocations/adjudicators/matchings.js
    |    |
    |    |_src/allocations/venues.js
    |    
    |_src/results.js
    |    |_src/results/sortings.js
    |    |_src/general/math.js
    |
    |_src/controllers.js
    |    |_src/controllers/database.js
    |          |_src/controllers/schemas.js
    |
    |_src/checks.js
         |_src/checks/reschecks.js
         |_src/checks/dbchecks.js
         |_src/checks/tmchecks.js
         |_src/checks/adjchecks.js
         |_src/checks/vnchecks.js
         |_src/checks/dbchecks.js
```
