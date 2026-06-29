import type { Metadata } from "next";
import "./founder.css";

export const metadata: Metadata = {
  title: "Lobster Watch | Baby Hippo",
  description: "A bilingual discipline tool for hardworking people: remind, record, verify, and learn.",
};

export default function FounderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
