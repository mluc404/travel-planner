import { travelParty } from "@/app/constants/options";
import { TripInfoType } from "@/app/types";

type PeopleCountProps = {
  tripInfo: TripInfoType;
  updateTripInfo: (key: string, value: string) => void;
};

export function PeopleCount({ tripInfo, updateTripInfo }: PeopleCountProps) {
  return (
    <div className="flex flex-col gap-2 ">
      <h2 className="text-xl font-semibold">Who’s Traveling?</h2>
      <div className="w-full flex justify-around">
        {travelParty.map((item, index) => (
          <div
            key={index}
            className={`border-2 p-2 flex justify-center rounded cursor-pointer font-semibold hover:bg-gray-300 hover:text-black ${
              tripInfo.people === item.value &&
              "bg-gray-200 text-black border-2 border-black"
            } `}
            onClick={() => updateTripInfo("people", item.value)}
          >
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
}
