interface TripBudgetProps {
  updateTripInfo: (key: string, value: string) => void;
}

export function TripBudget({ updateTripInfo }: TripBudgetProps) {
  return (
    <div className="flex flex-col gap-2 ">
      <h2 className="text-xl font-semibold">Your budget</h2>
      <input
        type="number"
        className="input-primary"
        placeholder="Estimated trip budget in USD"
        onChange={(e) => updateTripInfo("budget", e.target.value)}
      />
    </div>
  );
}
