# Specific Speaker 

[/v1.0/{tournament_name}/speakers/{speaker_id}]

### Get Specific Speaker [GET]

+ Response 200 (application/json)
```
{
    "errors":
    "data":
    {
        "id": 1,
        "name": "kym",
        "team": 0,
        "url": ""
    },
    "resource_url": ""
}
```
### Create Speaker [POST]

+ Request (application/json)
```
{
    "name": "kym",
    "team": 0,
    "url": ""
}
```
+ Response 200 (application/json)
```
{
	"errors": null,
	"data":
	{
	    "name": "kym",
	    "team": 0,
	    "url": ""
	},
    "resource_url": ""
}
```