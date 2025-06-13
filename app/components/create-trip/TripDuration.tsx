import { Calendar } from "primereact/calendar";

interface TripDurationProps {
  dates: Date[] | null;
  setDates: (value: Date[] | null) => void;
}

export function TripDuration({ dates, setDates }: TripDurationProps) {
  return (
    <div className="flex flex-col gap-2 ">
      <div>
        <h2 className="text-xl font-semibold">When’s Your Adventure?</h2>
        <p className="text-gray-400 text-md">
          We craft trips up to 5 days – pick your dates!
        </p>
      </div>
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
        // readOnlyInput
        // hideOnRangeSelection
      />
    </div>
  );
}
