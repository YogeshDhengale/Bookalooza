import React from "react";
import { type_theme_without_items } from "@/types/ThemeTypes";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { bookSliceActions } from "@/store/BooksSlice/BooksSlice";

const ThemeCard = ({
  theme,
  className,
  isAi,
}: {
  theme: type_theme_without_items;
  className?: string;
  isAi: boolean;
}) => {
  const dispatch = useAppDispatch();
  return (
    <Link
      to={`${window.location.origin}/book/${theme.name}`}
      onClick={() =>
        dispatch(bookSliceActions.fetchBook({ theme: theme.name }))
      }
      className={cn(
        "bg-white relative rounded-xl p-2 space-y-3 grid grid-cols-subgrid hover:bg-yellow-500 hover:text-white",
        className
      )}
    >
      <div className="w-full h-max overflow-hidden rounded-md shadow">
        <img
          src={theme.displayImage}
          width={152}
          height={176}
          loading="lazy"
          alt="theme"
          className="w-full object-contain hover:scale-105 transition-all aspect-theme duration-700"
        />
      </div>
      {isAi && (
        <div className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-md px-2 py-1 text-base">
          AI
        </div>
      )}
      <p className="text-center">
        <span className="text-lg font-semibold">
          {theme.name?.split("_").map((part, index) => (
            <React.Fragment key={index}>
              {part}
              {index < theme.name.split("_").length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
      </p>
    </Link>
  );
};

export default ThemeCard;
