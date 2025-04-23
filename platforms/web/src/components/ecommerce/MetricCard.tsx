import React, { ReactNode } from "react";
import { GroupIcon } from "../../icons";
import Skeleton from "react-loading-skeleton";


interface componentProps {
    title: string;
    data: string|number;
    isPending: boolean;
    icon: ReactNode;
}

export default function MetricCard({ title, data, isPending, icon}: componentProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        {icon}
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {title}
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {!isPending ? (
              data
            ) : (
              <Skeleton
                width={20}
                height={20}
                className="bg-gray-500 animate-pulse"
              />
            )}
          </h4>
        </div>
      </div>
    </div>
  );
}
