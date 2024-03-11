// src/components/Slider.tsx

import React, { useRef } from "react";

export function SlideSection(props: React.PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative overflow-hidden mx-2 md:mx-4 lg:mx-6 xl:mx-8 2xl:mx-10 my-14 flex flex-col gap-5">
      <div
        className="flex gap-2 sm:gap-4 md:gap-6 lg:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory"
        ref={ref}
      >
        {React.Children.map(props.children, (child) => (
          <div
            className="snap-start shrink-0"
            style={{ width: "auto", maxWidth: "100%" }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
