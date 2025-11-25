"use client";

import React from "react";
import {ModuleAccordion}  from "@/components/curriculum/module-accordion";

export default function CurriculumDisplay({ modules }: any) {
  return (
    <div className="w-full mt-8">
      <h2 className="text-2xl font-bold mb-4">curriculum of the course</h2>

      {modules.length === 0 ? (
        <p>No curriculum at this time for that course.</p>
      ) : (
        modules.map((module: any) => (
          <ModuleAccordion key={module.id} module={module} />
        ))
      )}
    </div>
  );
}
