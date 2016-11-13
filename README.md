# UTab API Server

Simpler/Faster version of UTab-api in javascript with new matching algorithm

Designed to help UTab-view

## Files

 + "CHANGELOG.md" - Release notes
 + "NEXT.md" - Concrete interface in the next api version
 + "TERMS.md" - Terms

## Documents

Preparing...

## Usage

```javascript
    preparing...
```

## Attention

1. speaker, institution -> team の順に登録

1. institution -> adjudicator の順に登録

1. トーナメント名に限っては重複不可能. スペースもなし.

1. Expected total round num is 1 ~ 6

1. You should evaluate judge-test by scores of judge evaluation by teams.

## Code Names

**version 1.0** - Candle Light

**version 2.0** - Luna Flight

**version 3.0** - Frosty Night

## Future Coming

### UTab api version 2.0 Luna Flight (by 2016/11/20)

**To improve safety**

Planning to support
1. DELETE methods
1. Redundancy of result data
1. Json format checking on server side
1. Simple backing up system
1. Logging

### UTab api version 3.0 (by 2016/12?)

**To have more usability**

Planning to support
1. Authentication
1. Official backup support
1. Multiple chairs
1. Trainees
1. Modify result after finishing rounds
1. Simplify allocation indices

### UTab api version 4.0 (in 2017)

**To improve internal algorithms**

Planning to support
1. Options for selection algorithm
1. New matching algorithm
1. Adding rounds during operation
1. Exchanging order of registration of speakers and teams
1. Mstat

### UTab api future version

1. Modifying result after rounds
1. Speaker based institution
1. Use threading.Lock() only for the same tournament

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
main.js
    |
    |_src/core.js
    |    |
    |    |_src/core/adfilters.js
    |    |    |_src/core/tools.js
    |    |
    |    |_src/core/filters.js
    |    |
    |    |_src/core/entities.js
    |    |
    |    |_src/core/matchings.js
    |    |
    |    |_src/core/sys.js
    |         |_src/core/tools.js
    |
    |_src.results
```
