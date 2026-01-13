"use client";

import { Grid } from "ldrs/react";
import "ldrs/react/Grid.css";

export default function LoadingGeneral() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <Grid size="80" speed="1.5" color="#1E3A8A" />
        </div>
        <div className="space-y-2">
          <h2 className="text-md font-light text-chart-2 ">
            Almost there... Thanks for your patience!
          </h2>
          <div className="flex justify-center space-x-1"></div>
        </div>
      </div>
    </div>
  );
}
