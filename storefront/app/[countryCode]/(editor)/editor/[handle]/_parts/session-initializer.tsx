"use client";

import {createAnonymousSession} from "@/actions/medusa/auth";
import {useEffect, useState} from "react";

interface SessionInitializerProps {
  customer: any;
  session: any;
}

export function SessionInitializer({
  customer,
  session,
}: SessionInitializerProps) {
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    if (!customer && !session && !initializing) {
      setInitializing(true);
      createAnonymousSession().then(() => {
        window.location.reload(); // Or use router.refresh() for soft refresh
      });
    }
  }, [customer, session, initializing]);

  return null;
}
