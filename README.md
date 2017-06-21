# RolePlayGateway Graphing Experiments

These are some basic tests for graphing data from [RolePlayGateway.com](https://www.roleplaygateway.com)

## Endpoints

All data for this project is derived from public JSON endpoints. The API is completely ephemeral during this period. Pay
attention to file modification times. Old files are more likely to be broken.

### Places

Places are locations within a Roleplay.

[`https://www.roleplaygateway.com/roleplay/the-multiverse/places\?format\=json`](https://www.roleplaygateway.com/roleplay/the-multiverse/places\?format\=json)

Returns an array of `Place` objects.

```json
[
  {
    "id": "1",
    "name": "Mjötviðr; The Realms",
    "roleplay_id": "1",
    "owner": "4",
    "url": "the-realms"
  }
]
```

### Exits

Exits connect locations within a Roleplay.

```json
[
  {
    "place_id": "49222",
    "destination_id": "16861",
    "direction": "east",
    "mode": "normal"
  }
]
```

There are 4 cardinal directions:
- `north`
- `south`
- `east`
- `west`

As well as 2 vertical directions:
- `up`
- `down`

Places can be contained within another:
- `in`
- `out`

And a parent-child relationship can be expressed:
- `ascend`
- `descend`



## Local testing

```bash
pip install flask
FLASK_DEBUG=1 FLASK_APP=mini.py flask run
```
