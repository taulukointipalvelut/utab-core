# Interface

## Teams

### ** .teams.get **
*NO SIDE EFFECTS*

List teams. If conditions in the form of a dictionary are specified, it returns teams satisfying the conditions.

* args

```javascript
{
    id: 1
}
```
(optional)

* return

```javascript
[
    {
        id: 1,
        available: 2,
        //url: "team_url"
    }
]
```

### ** .teams.add **
* args

```javascript
{
    id: 1,
    institutions: [1],
    //url: "team_url"
}
```
* return

```javascript
undefined
```

* exception

id already exists

### ** .teams.update **
*IRREVERSIBLE*

### ** .teams.remove **
*IRREVERSIBLE*
* args

```javascript
{
    id: 1
}
```
* return

```javascript

```

### ** .teams.debaters.get **
*NO SIDE EFFECTS*

### ** .teams.debaters.set **

### ** .teams.debaters.update **
*IRREVERSIBLE*

### ** .teams.institutions.get **
*NO SIDE EFFECTS*

### ** .teams.institutions.set **

### ** .teams.institutions.update **
*IRREVERSIBLE*

### ** .teams.results.get **
*NO SIDE EFFECTS*

* args

```javascript

```
* return

```javascript

```

### ** .teams.results.pool **

* args

```javascript
{
    id: 0,
    uid: 12,
    win: 1, /* in NA, 1=win, 0=lose in BP, it must be win-points the team get */
    margin: -5,
    sum: 324,
    opponents: [2],
    side: "gov"
}

```
* return

```javascript

```

### ** .teams.results.update **
*IRREVERSIBLE*

## Adjudicators

### ** .adjudicators.get **
*NO SIDE EFFECTS*

List adjudicators. If conditions in the form of a dictionary are specified, it returns adjudicators satisfying the conditions.
* args

```javascript
{
    id: 1
}
```
(optional)

* return

```javascript
[
    {
        id: 3
        judge_test: 7,
        institutions: [0],
        conflicts: [],
        //url: "",
        available: true
    }
]
```

### ** .adjudicators.add **

### ** .adjudicators.update **
*IRREVERSIBLE*

### ** .adjudicators.remove **
*IRREVERSIBLE*

### ** .adjudicators.institutions.get **
*NO SIDE EFFECTS*

### ** .adjudicators.institutions.set **

### ** .adjudicators.institutions.update **
*IRREVERSIBLE*

### ** .adjudicators.results.get **
*NO SIDE EFFECTS*
* args

```javascript

```
* return

```javascript

```

### ** .adjudicators.results.pool **

* args

```javascript
{
    //from: "chair", /* "chair", "panel", or "team" */
    uid: 34, /* uid */
    //chair: true, /* if the adj to be evaluated was a chair */
    id: 2, /* id of adj to be evaluated */
    score: 8,
    watched_teams: [1, 2], /* teams' ids that the adj judged (必要?) */
    comment: "worst judge ever"
}
```
* return

```javascript

```

### ** .adjudicators.results.update **
*IRREVERSIBLE*

## Rounds

### ** .rounds.next **
*IRREVERSIBLE*

## Venues

### ** .venues.get **
*NO SIDE EFFECTS*

### ** .venues.add **

* args

```javascript
{
    "id": 3,
    "available": true,
    "priority": 1,
    "url": "www.google.com"
}
```
* return

```javascript

```

### ** .venues.update **
*IRREVERSIBLE*

### ** .venues.remove **
*IRREVERSIBLE*

## Debaters

### ** .debaters.get **
*NO SIDE EFFECTS*

### ** .debaters.add **

### ** .debaters.update **
*IRREVERSIBLE*

### ** .debaters.remove **
*IRREVERSIBLE*

### ** .debaters.results.pool **

* args

```javascript
{
    uid: 3, /* unique id(ex adjudicator's id) */
    id: 34,
    //current_round: 1,/* round1 => 1 */
    scores: [76, 0, 38.5], /* 0 if he/she has no role */
}
```
* return

```javascript

```

### ** .debaters.results.get **
*NO SIDE EFFECTS*

* args

```javascript

```
* return

```javascript

```

### ** .debaters.results.update **
*IRREVERSIBLE*

## Institutions

### ** .institutions.get **
*NO SIDE EFFECTS*

### ** .institutions.add **

### ** .institutions.update **
*IRREVERSIBLE*

### ** .institutions.remove **
*IRREVERSIBLE*

## Allocation

### ** .allocations.get **
*NO SIDE EFFECTS*

* return
```javascript
[
    {
        "warnings": [{}],
        "teams": [0, 1],
        "chairs": [0],
        "remaining_adjudicators1": [1, 2], /*panels*/
        "remaining_adjudicators2": [1, 2], /* trainees*/
        "venue": null,
    }
]

```

### ** .allocations.check **
*NO SIDE EFFECTS*

### ** .allocations.set **

## Tournament

### ** .get_info **
*NO SIDE EFFECTS*

* args

```javascript

```
* return

```javascript

```
### **  **
* args

```javascript

```
* return

```javascript

```

### **  **
* args

```javascript

```
* return

```javascript

```

### **  **
* args

```javascript

```
* return

```javascript

```

<!--### **  **
* args

```javascript

```
* return

```javascript

```-->
