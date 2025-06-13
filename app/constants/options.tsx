export const travelParty = [
  {
    id: 1,
    title: "Just Me",
    value: "1 person",
  },
  {
    id: 2,
    title: "A Duo",
    value: "2 people",
  },
  {
    id: 3,
    title: "A Group",
    value: "A Group",
  },
];

export const API_PROMPT =
  // `Generate a travel plan for Location: {TripLocation}, for {TripDuration} days for {TripPeople} with a budget of {TripBudget} USD in JSON format using the template: [{trip_name,destination,duration,travelers (text optons: 1 person, 2 people or group),budget: number only, place_list:[place_name, place_name,...)], hotel_list:[hotel_name,hotel_name,hotel_name]},[{hotel_name, hotel_address, hotel_cost_per_night},{hotel_name, hotel_address, hotel_cost_per_night},{hotel_name, hotel_address, hotel_cost_per_night}],{day: 1, day_theme, places: [{place_name, activity, time_to_spend, cost}]}]. The trip budget includes hotel and all activities. Suggest 3 hotel options in the cheap to medium price range, sorted by price. For each day, suggest 3 places to visit and summarize each activity within 12 words. Add all the place_name in places into place_list exactly word by word`;

  `Generate a travel plan for Location: {TripLocation}, for {TripDuration} days for {TripPeople} with a budget of {TripBudget} USD in JSON format using the template: 
  [
    {
      trip_name,
      destination,
      duration: include the word day or days depending on the input value,
      travelers: (text optons: 1 person, 2 people or group),
      budget: number only,
      place_list: [place_name, place_name,...],
      hotel_list: [hotel_name, hotel_name, hotel_name]
    },
    [
      {hotel_name, hotel_address, hotel_cost_per_night},
      {hotel_name, hotel_address, hotel_cost_per_night},
      {hotel_name, hotel_address, hotel_cost_per_night}
    ],
    {
      day: 1,
      day_theme,
      places: [{place_name, activity, time_to_spend, cost}]
    }
  ].
  The trip budget includes hotel and all activities. 
  Suggest 3 hotel options in the cheap to medium price range, sorted by price. 
  For each day, suggest 3 places to visit and summarize each activity within 12 words. 
  Add all the place_name in places into place_list exactly word by word`;
