// app/strava/success/page.tsx
import { Suspense } from "react";
import StravaSuccessClient from "./StravaSuccessClient";

export default function StravaSuccessPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <StravaSuccessClient />
    </Suspense>
  );
}
