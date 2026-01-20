"use client";

import { useParams } from "next/navigation";
import { UnitDetailsPage } from "@/src/features/units/pages/UnitDetailsPage";

export default function UnitDetailsRoutePage() {
  const params = useParams();
  const unitId = params.unitId as string;

  return <UnitDetailsPage unitId={unitId} />;
}
