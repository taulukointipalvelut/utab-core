# UTab-core-js

Simpler and faster version of UTab-api in Node with DatabaseHandler embedded.

Designed to help UTab-view.

The original version of UTab-core in Python is [here](https://github.com/taulukointipalvelut/utab-api-server).

## Files

 + "CHANGELOG.md" - Release notes
 + "NEXT.md" - Concrete interface in the next version of UTab core js
 + "TERMS.md" - Terms
 + "INTERFACE.md" - Interfaces

## Documents

Preparing...

## Usage

1. Clone this repository. `git clone https://github.com/taulukointipalvelut/utab-core-js`

1. Import core.js and create an instance.
```javascript
var core = require('./utab-core-js/core.js')
var testtournament = new core.Main('testtournament')
```

## Features

1. Strict validation for database

1. New Matching Algorithms derived from Gale Shapley Algorithm

## Attention

1. All return values from database functions can be treated as Promise objects

1. All callbacks should take (error, retval[s]) as arguments.

1. Expected total round num is 1 ~ 6.

1. You should evaluate judge-test as same criteria as scores of judge evaluation from teams.

1. Num of chairs must be even.

1. ID, which is unique and constant in all entities throughout adjudicators/teams/debaters, of result sender should be specified when sending result.

## Code Names

**version 1.0** - Candle Light

**version 2.0** - Luna Flight

**version 3.0** - Frosty Night

## Future Coming

### UTab-core-js version 1.0 [Candle Light] (by 2016/11/20)

**To improve safety**

Planning to support

1. New matching algorithms
1. Json format checking
1. Logging

### UTab-core-js version 2.0 [Luna Flight] (by 2016/12?)

**To have more usability**

Planning to support

1. Simple backing up system
1. Redundancy of result data
1. Official backup support
1. Multiple chairs
1. Trainees
1. Modify result after finishing rounds

### UTab-core-js version 3.0 [Frosty Night] (in 2017)

**To improve internal algorithms**

Planning to support

1. Adding rounds during operation
1. Exchanging order of registration of speakers and teams
1. Mstat

### UTab-core-js [future version] *

1. Modifying result after rounds

## ROLE OF EACH MODULE

![structure](structure.jpg "Module Relations")

 * core.js: core
 * operations.js: minimum functions to oerate tournament
 * sys.js: functions for internal processing
 * results.js: functions to process results
    * details.js: functions to support results.js
 * matchings.js: matching algorithms
 * filters.js: functions to calculate rank matrix
 * adjfilters.js: functions to calculate rank matrix when computing adjudicator allocation
 * utils.js: extensions of Array.prototype
 * database.js: database of a tournament
    * eitities.js: entity classes

<!--```
core.js
    |
    |_src/operation.js
    |    |
    |    |_src/operation/adfilters.js
    |    |    |_src/tools/tools.js
    |    |
    |    |_src/operation/filters.js
    |    |
    |    |_src/operation/entities.js
    |    |
    |    |_src/operation/matchings.js
    |    |
    |    |_src/operation/sys.js
    |         |_src/tools/tools.js
    |
    |_src/results.js
    |    |_src/results/details.js
    |
    |_src/database.js
    |    |_src/database/entities.js
    |
    |_src/utils.js
```
-->
<!--
Operation  : output allocation - teams -> allocation                           #pure
           : check allocation  - allocation, adjudicators -> allocation        #pure
           : summarize results - results -> summarized results                 #pure

CON        : CRUDF             #not pure

DB         : CRUDF             #not pure

team -> createdMatrix -> sortedTeam -> matching
    -<   Promise   >- -<       Promise       >-
     --------------should sync----------------
||
||

team, adjudicator, allocation -> createdMatrix -> sortedGrid -> matching
                            -<   Promise   >- -<       Promise          >-
                             --------------should sync------------------
-->
