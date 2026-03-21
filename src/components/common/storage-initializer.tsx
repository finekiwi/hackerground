"use client";

import { useEffect } from "react";
import { initStorage } from "@/lib/storage";

export function StorageInitializer() {
  useEffect(() => {
    initStorage();
  }, []);

  return null;
}
