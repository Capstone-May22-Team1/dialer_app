# A number dialer app that lets users dial down a list of phone numbers

### Test number dials

13018040009
19842068287
15512459377
19362072765
18582210308
13018040009
19842068287
15512459377
19362072765

## Backend

### GET /calls

- Initialize an array of call objects, [{phoneNum: "1309...", "id": null, "status": "idle"}]
- Return this array to user as a json string

### POST /calls

- Initialize the calls if they are not in progress

#### Max calls of three logic

The status will either be the literal string "ringing", "answered", or "completed".

- We start with array of 10 numbers
- Limit of maximum 3 simultaneous calls
- Start the first three calls immediately with a loop
  - Shift 3 times, and make calls for each

#### Webhook endpoint /webhook

- Receives the post request from NumberDial api
- Find the call object with given id from the array of call ojbects,
  - update its status
  - if the status is "completed"
    - if the length of the array > 0, make a call with the next number in line

## Frontend

### Phone calls list

- useState for storing phone call objects as array of objects
- useEffect with setInterval to make a call to the GET /calls endpoint initially and periodically
- Display the phone calls in a list

### Call button

- Makes a call to the POST /calls endpoint, and hide the button
