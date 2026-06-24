import type { Metadata } from "next";
import "./story.css";

export const metadata: Metadata = {
  title: "Founder Story — Baby Hippo",
  description:
    "The honest Baby Hippo founder journey from rural Miaoli, freight work, and violin teaching to DCA, DeFi learning, and building for ordinary people.",
};

export default function StoryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
