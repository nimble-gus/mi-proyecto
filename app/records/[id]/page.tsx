"use client";

import { useParams } from "next/navigation";
import { ProjectDetailsPage } from "@/src/features/projects/pages/ProjectDetailsPage";

export default function RecordDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  return <ProjectDetailsPage id={id} />;
}
