"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TripDurationProps {
  setDates: (value: number) => void;
}

export function TripDuration({ setDates }: TripDurationProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [datesDisplay, setDatesDisplay] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const onChange = (e: any[]) => {
    const [start, end] = e;
    setStartDate(start);
    setEndDate(end);
    const startString = start.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    console.log(startString);
    setDatesDisplay(startString);
    if (e[1]) {
      const timeDiff = e[1].getTime() - e[0].getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDates(daysDiff);
      console.log(e);
      console.log("how many days:", daysDiff);

      const endString = end.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setDatesDisplay(startString + " - " + endString);
      // Auto close the calendar after selecting both dates
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="">
        <h2
          className="text-xl font-semibold"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        >
          When&apos;s Your Adventure?
        </h2>
        <p
          className="text-gray-400 text-md"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        >
          We craft trips up to 5 days – pick your dates!
        </p>
      </div>
      <input
        type="text"
        readOnly
        value={datesDisplay}
        className="input-primary"
        placeholder="Select the dates"
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
      />

      <div className="relative w-full">
        {isCalendarOpen && (
          <div className="absolute w-full z-99">
            <DatePicker
              onChange={(e) => {
                onChange(e);
                console.log(e);
              }}
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              selectsRange
              inline
            />
          </div>
        )}
      </div>
    </div>
  );
}
