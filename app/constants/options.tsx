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
    value: "a group",
  },
];

export const API_PROMPT =
  "Generate a travel plan for Location: {TripLocation}, for {TripDuration} days for {TripPeople} with a budget of {TripBudget} USD in JSON format using the template: [{trip_name,location,travelers,duration},{itinerary: [{day:1, theme, activities:{morning:[{location,what_to_do},{location,what_to_do}],noon:[{location,what_to_do},{location,what_to_do}],evening:[{location,what_to_do},{location,what_to_do}]}},{day:2, theme, activities:{morning:[{location,what_to_do},{location,what_to_do}],noon:[{location,what_to_do},{location,what_to_do}],evening:[{location,what_to_do},{location,what_to_do}]}}]}]";
// [{trip_name,location,travelers,duration},itinerary: [{day:1, theme, activities:{morning:[{location,what_to_do},{location,what_to_do}],noon:[{location,what_to_do},{location,what_to_do}],evening:[{location,what_to_do},{location,what_to_do}]}},{day:2, theme, activities:{morning:[{location,what_to_do},{location,what_to_do}],noon:[{location,what_to_do},{location,what_to_do}],evening:[{location,what_to_do},{location,what_to_do}]}}]]
