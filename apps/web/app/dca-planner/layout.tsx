import type { Metadata } from "next";
import "./dca-planner.css";

export const metadata: Metadata = {
  title: "My Investment Plan — Baby Hippo",
  description:
    "A bilingual educational DCA planning tool for budgeting, emergency cash, asset allocation, schedules, and long-term illustrations.",
};

export default function DcaPlannerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
