import { Calendar } from "primereact/calendar";

interface TripDurationProps {
  dates: Date[] | null;
  setDates: (value: Date[] | null) => void;
}

export function TripDuration({ dates, setDates }: TripDurationProps) {
  return (
    <div className="flex flex-col gap-2 ">
      <h2 className="text-xl font-semibold">How long is your trip</h2>
      <Calendar
        value={dates}
        onChange={(e) => {
          setDates(e.value as Date[] | null);
        }}
        selectionMode="range"
        // showIcon
        className="input-primary"
        placeholder="Select the dates"
        dateFormat="MM d, yy"
      />
    </div>
  );
}
