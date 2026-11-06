"use client";

import { DemoProvider } from "@/components/demo-provider";
import { AppProvider } from "@/components/app-provider";
import { DEMOS } from "@/components/playground/playground";
import type { FeatureId } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

/** The same working demo as the home page playground, on its own page. */
export function FeatureDemo({ id, stage }: { id: FeatureId; stage: string }) {
  const Demo = DEMOS[id];
  return (
    <DemoProvider>
      <AppProvider>
        <div className={cn("relative h-[500px] overflow-hidden rounded-[28px] sm:h-[460px]", stage)}>
          <Demo />
        </div>
      </AppProvider>
    </DemoProvider>
  );
}
