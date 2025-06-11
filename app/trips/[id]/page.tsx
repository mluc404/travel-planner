import { Suspense, use as reactUse } from "react";
import TripDetailsContent from "./TripDetailsContent";
interface TripDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function TripDetails({ params }: TripDetailsPageProps) {
  const unwrappedParams = reactUse(Promise.resolve(params));
  const tripId = unwrappedParams.id;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TripDetailsContent tripId={tripId} />
    </Suspense>
  );
}
