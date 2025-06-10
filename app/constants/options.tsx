export const travelParty = [
  {
    id: 1,
    title: "Just Me",
    value: "1 person",
  },
  {
    id: 2,
    title: "Us two",
    value: "2 people",
  },
  {
    id: 3,
    title: "Group",
    value: "group",
  },
];

export const API_PROMPT =
  // "Generate a travel plan for Location: {TripLocation}, for {TripDuration} days for {TripPeople} with a budget of {TripBudget} USD in JSON format using the template: [{trip_name,destination,duration,travelers},{day: 1, day_theme, places: [{place_name, activity, time_to_spend}]}]. For each day, suggest 3 places to visit and summarize each activity within 12 words.";
  "Generate a travel plan for Location: {TripLocation}, for {TripDuration} days for {TripPeople} with a budget of {TripBudget} USD in JSON format using the template: [{trip_name,destination,duration,travelers (text optons: 1 person, 2 people or group), place_list:[place_name, place_name,...)]},{day: 1, day_theme, places: [{place_name, activity, time_to_spend}]}]. For each day, suggest 3 places to visit and summarize each activity within 12 words. Add all the place_name in places into place_list exactly word by word";
