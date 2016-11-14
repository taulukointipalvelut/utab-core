# Interface

## Teams

### ** .teams.get **

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

### ** .teams.set **
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

### ** .teams.remove **
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

### ** .teams.debaters.set **

### ** .teams.debaters.update **

### ** .teams.institutions.get **

### ** .teams.institutions.set **

### ** .teams.institutions.update **

## Adjudicators

### ** .adjudicators.get **

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

### ** .adjudicators.set **

### ** .adjudicators.update **

### ** .adjudicators.remove **

### ** .adjudicators.institutions.get **

### ** .adjudicators.institutions.set **

### ** .adjudicators.institutions.update **

## Venues

### ** .venues.set **

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

### ** .venues.get **

### ** .venues.update **

### ** .venues.remove **

## Allocation

### ** .allocations.get **

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

### ** .allocations.set **

## Tournament

### ** .tournaments.get **
* return

```javascript
{
    "name": "test tournament",
    "num_of_rounds": 3//,
    //"style": "PDA",
    //"url": "www.goodtournament.com"
}
```

### ** .tournament.set **
* args

```javascript

```
* return

```javascript

```

## Team Results

### ** .results.teams.set **

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

### ** .results.teams.get **

* args

```javascript

```
* return

```javascript

```

## Adjudicator Results

### ** .results.adjudicators.set **
* args

```javascript
{
    from: "chair", /* "chair", "panel", or "team" */
    uid: 34, /* uid */
    //chair: true, /* if the adj to be evaluated was a chair */
    id: 2, /* id of adj to be evaluated */
    score: 8,
    watched_teams: [1, 2], /* teams' ids that the adj judged (必要?) */
    comment: "worst judge ever",
    round: 1
}
```
* return

```javascript

```

### ** .results.adjudicators.get **
* args

```javascript

```
* return

```javascript

```

## Debater Results

### ** .results.debaters.set **
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

### ** .results.debaters.get **
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

## Debaters

## Institutions

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