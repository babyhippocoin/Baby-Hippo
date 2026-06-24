import type { Metadata } from "next";
import "./community.css";

export const metadata: Metadata = {
  title: "Community — Baby Hippo",
  description:
    "Join the Baby Hippo community for beginner-friendly Web3 education, risk awareness, and steady long-term growth.",
};

export default function CommunityLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
