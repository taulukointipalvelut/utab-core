# UTab core js

Simpler/Faster version of UTab-api in javascript with new matching algorithm.

Designed to help UTab-view.

The older version of UTab core is [here](https://github.com/taulukointipalvelut/utab-api-server).

## Files

 + "CHANGELOG.md" - Release notes
 + "NEXT.md" - Concrete interface in the next version of UTab core js
 + "TERMS.md" - Terms
 + "INTERFACE.md" - Interfaces

## Documents

Preparing...

## Usage

```javascript
    preparing...
```

## Attention

1. トーナメント名に限っては重複不可能. スペースもなし.

1. Expected total round num is 1 ~ 6.

1. You should evaluate judge-test by scores of judge evaluation by teams.

1. Num of chairs must be odd

## Code Names

**version 1.0** - Candle Light

**version 2.0** - Luna Flight

**version 3.0** - Frosty Night

## Future Coming

### UTab core js * version 1.0 * Candle Light (by 2016/11/20)

**To improve safety**

Planning to support
1. New matching algorithms
1. Json format checking
1. Logging

### UTab core js  * version 2.0 * Luna Flight (by 2016/12?)

**To have more usability**

Planning to support
1. Simple backing up system
1. Redundancy of result data
1. Official backup support
1. Multiple chairs
1. Trainees
1. Modify result after finishing rounds

### UTab core js * version 3.0 * Frosty Night (in 2017)

**To improve internal algorithms**

Planning to support
1. Adding rounds during operation
1. Exchanging order of registration of speakers and teams
1. Mstat

### UTab core js * future version *

1. Modifying result after rounds

## ROLE OF EACH MODULE

 * main.js: model
 * core.js: core for tournaments
 * sys: functions for internal processing
 * result: functions to process results
 * matchings: matching algorithms
 * filters: functions to calculate rank matrix
 * adjfilters: functions to calculate rank matrix when computing adjudicator allocation
 * entities: entity classes
 * tools: tools

```
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
