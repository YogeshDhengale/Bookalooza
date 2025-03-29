import { cn } from "@/lib/utils";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

const TabsController = ({
  tabs,
  handelActiveTabChange,
}: {
  tabs: {
    title: string;
    value: string;
  }[];
  handelActiveTabChange: Dispatch<SetStateAction<string>>;
}) => {
  const activeTabsRefs = useRef<HTMLButtonElement[]>([]);
  const handleRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(tabs[0].value);

  useEffect(() => {
    const activeTabIdx = tabs.findIndex((tab) => tab.value === activeTab);
    const active = activeTabsRefs.current[activeTabIdx];

    if (active && handleRef.current) {
      handleRef.current.style.width = `${active.offsetWidth}px`;
      handleRef.current.style.height = `${active.offsetHeight}px`;
      handleRef.current.style.left = `${active.offsetLeft}px`;
      handleRef.current.style.top = `${active.offsetTop}px`;
    }
  }, [activeTab, tabs]);
  return (
    <div className="flex relative p-1 md:p-2 rounded-full gap-1 bg-sidebar overflow-auto w-full justify-between">
      <div
        className="bg-white absolute z-0 rounded-3xl overflow-hidden transition-all delay-75"
        ref={handleRef}
      ></div>
      {tabs.map((tab, idx) => (
        <button
          key={tab.value}
          className={cn(
            "p-1 px-3 md:px-4 text-white text-base md:text-lg relative z-10",
            activeTab === tab.value && " text-app"
          )}
          ref={(tab) => {
            activeTabsRefs.current[idx] = tab;
          }}
          onClick={() => {
            handelActiveTabChange(tab.value);
            setActiveTab(tab.value)
        }}
        >
          {tab.title}
        </button>
      ))}
    </div>
  );
};

export default TabsController;
