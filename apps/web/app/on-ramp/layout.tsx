import type { Metadata } from "next";
import "./on-ramp.css";

export const metadata: Metadata = {
  title: "台灣新手入金指南 — Baby Hippo",
  description: "A beginner-friendly bilingual guide to moving from TWD into responsible crypto learning and DCA.",
};

export default function OnRampLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
