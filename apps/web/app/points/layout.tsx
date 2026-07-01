import type { Metadata } from "next";
import "./points.css";

export const metadata: Metadata = {
  title: "Verified Growth Hub | Baby Hippo",
  description:
    "The frontend architecture for BHC verified growth reputation across exchange, wallet, community, passport, and future proof systems.",
};

export default function PointsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
