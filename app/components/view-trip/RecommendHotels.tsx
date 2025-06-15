import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { HotelType, Trip } from "@/app/types";
import HotelCard from "./HotelCard";

interface RecommendHotelsProps {
  trip: Trip;
}

export default function RecommendHotels({ trip }: RecommendHotelsProps) {
  return (
    <Accordion defaultExpanded={false} sx={{ backgroundColor: "#202327" }}>
      <AccordionSummary
        expandIcon={<ArrowDownwardIcon className="text-white" />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <div className="font-semibold text-white text-[1.05rem]">
          Hotel Suggestions
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
        {(trip.plan[1] as HotelType[]).map((hotel, index) => (
          <HotelCard
            key={index}
            place={hotel}
            photo={trip.hotel_photos[hotel.hotel_name]}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
