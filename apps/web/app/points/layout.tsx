import type { Metadata } from "next";
import "./points.css";

export const metadata: Metadata = {
  title: "Baby Hippo Points — Achievement Journey",
  description:
    "A local-only, non-token educational achievement system connecting Baby Hippo learning, planning, yield education, story, and community activities.",
};

export default function PointsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
