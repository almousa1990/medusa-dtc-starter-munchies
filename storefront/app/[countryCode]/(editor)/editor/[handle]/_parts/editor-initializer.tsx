"use client";

import {createPrintfileEditorSessions} from "@/actions/medusa/printfile";
import {useEffect, useState} from "react";

interface SessionInitializerProps {
  customer: any;
  productId: string;
  session: any;
  sessions: any;
}

export function EditorInitializer({
  customer,
  productId,
  session,
  sessions,
}: SessionInitializerProps) {
  const [initializing, setInitializing] = useState(false);
  useEffect(() => {
    if ((customer || session) && !sessions?.length && !initializing) {
      setInitializing(true);
      createPrintfileEditorSessions(productId).then(() => {
        window.location.reload(); // Or use router.refresh() for soft refresh
      });
    }
  }, [customer, session, initializing, sessions, productId]);

  return null;
}
