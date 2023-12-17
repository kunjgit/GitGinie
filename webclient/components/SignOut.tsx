"use client";
import React from "react";
import { signOut } from "next-auth/react";

export default function SignOutComponent({ type }: { type?: string }) {
  return (
    <div>
      <button
        className="btn"
        onClick={() =>
          signOut({
            callbackUrl: "/auth/signin",
            redirect: true,
          })
        }
      >
        Sign Out
      </button>
    </div>
  );
}