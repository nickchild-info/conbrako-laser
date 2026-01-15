import { Metadata } from "next";
import { getDesignTemplates, type DesignTemplate } from "@/lib/data-service";
import { PersonalisePageClient } from "./client";

export const metadata: Metadata = {
  title: "Personalise Your Fire Pit | KoosDoos Fire Pits",
  description:
    "Create a one-of-a-kind KoosDoos fire pit with your own custom design. Upload your logo, artwork, or choose from our template library.",
  openGraph: {
    title: "Personalise Your Fire Pit | KoosDoos Fire Pits",
    description:
      "Create a one-of-a-kind KoosDoos fire pit with your own custom design.",
    type: "website",
  },
};

// Server component that fetches data
export default async function PersonalisePage() {
  const designTemplates = await getDesignTemplates();

  return <PersonalisePageClient designTemplates={designTemplates} />;
}
