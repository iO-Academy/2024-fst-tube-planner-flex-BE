# 2024 Hippo Hooligans, Team Flex FST Tube Planner Back End

Scrum Master: Carl Ollington
Team members: Ramsey Merdassi, Henry Tottle

Using the supplied stations.json, run populate.js once to populate a database.


- URL:

```
    '/stations'
```
- Method:

GET

- URL Params:

N/A

- Success Response:
- Code: 200
- Content:
    ```
  {
  message: "Successfully Retrieved Stations."
  data: stations
   }
    ```

- Example Data:

```
  data: [
        {
            "code": "ACT",
            "name": "Acton Town"
        },
        {
            "code": "ALD",
            "name": "Aldgate"
        },
        {
            "code": "ALE",
            "name": "Aldgate East"
        }
        ]
        
```
- Error Response:
- Code: 500
- Response:

```
  {
  message: "Unexpected Error",
  data: []
  }
```


-URL

```
  '/journeys'
```

- Method:

GET

- URL Params:

N/A

- Success Response:
- Code: 200
- Response:

```
  {
    message: "Successfully Retrieved Journeys.",
    data: journeys,
    summary: journeySummaries
  }
```

- Example Data:

```
  "data": [
        [
            {
                "id": 2000,
                "code": "ACT",
                "name": "Acton Town",
                "timeToPrev": null,
                "timeToNext": 143,
                "zone": 5,
                "line": "District",
                "position": 0
            },
            {
                "id": 2001,
                "code": "ALE",
                "name": "Aldgate East",
                "timeToPrev": 143,
                "timeToNext": 180,
                "zone": 1,
                "line": "District",
                "position": 1
            }
        ]
    ],
    "summary": [
        {
            "from": "Acton Town",
            "to": "Aldgate East",
            "line": "District",
            "stations": [
                "Acton Town",
                "Aldgate East"
            ]
        }
    ]
```

- Invalid Journey Response:
- Code: 204
- Response: 

``` 
  {
    message: "No Valid Journeys",
    data: []
  }
```

- Error Response:
- Code: 500
- Response: 

``` 
  {
    message: "Unexpected Error",
    data: []
  }
```
  


  


