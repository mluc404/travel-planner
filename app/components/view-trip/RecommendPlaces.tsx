import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { PlaceCard } from "./PlaceCard";
import { Trip, TripPlan1 } from "@/app/types";

interface RecommendPlacesProps {
  day: TripPlan1;
  index: number;
  trip: Trip;
}

export default function RecommendPlaces({
  day,
  index,
  trip,
}: RecommendPlacesProps) {
  return (
    <Accordion
      defaultExpanded={index === 0}
      sx={{ backgroundColor: "#202327" }}
    >
      <AccordionSummary
        expandIcon={<ArrowDownwardIcon className="text-white" />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <div className="font-semibold text-white text-[1.05rem]">
          Day {day.day}: {day.day_theme}
        </div>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: 1,
          paddingBottom: 2,
          "@media (min-width: 600px)": { padding: 2 },
        }}
        className="flex flex-col gap-2 text-white items-center "
      >
        {day.places.map((place, index) => (
          <PlaceCard
            key={index}
            place={place}
            destination={trip.destination_details.description}
            photo={trip.place_photos[place.place_name]}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
