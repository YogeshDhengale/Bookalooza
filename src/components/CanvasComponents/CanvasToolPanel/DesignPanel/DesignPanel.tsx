import React, { useEffect } from "react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"; // Assuming you have a Skeleton component.
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchAllThemes } from "@/actions/ThemeAction/ThemeAction";

const DesignPanel = () => {
  const dispatch = useAppDispatch();
  const { isFetched } = useAppSelector((state) => state.themes);

  useEffect(() => {
    if (!isFetched) dispatch(fetchAllThemes())
  }, [dispatch, isFetched]);

  return (
    <SidebarContent className="bg-white">
      <SidebarGroup className="px-0">
        <SidebarGroupContent>
          <div className="grid grid-cols-2 gap-2 p-3">
            {new Array(12)
              .fill(
                "https://www.bookalooza.com/designer/storage/themeImages/64958d7a194a2c7ef735ea27/thumbs/Untitled-2-01.png"
              )
              .map((item, index) => (
                <DesignPanel.ImageCard key={index} imageSrc={item} />
              ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

DesignPanel.ImageCard = React.memo(({ imageSrc }: { imageSrc: string }) => {
  return (
    <div className="aspect-4/3 bg-gray-100 rounded-md overflow-hidden hover:ring-2 ring-offset-2 ring-gray-400">
      <img
        src={`${imageSrc}?width=196&height=148`}
        alt={imageSrc}
        width={196}
        height={148}
        className={cn("w-full h-full object-cover")}
        loading="lazy" // Lazy load the image
      />
    </div>
  );
});

const Header = () => {
  const { allThemes } = useAppSelector((state) => state.themes);
  const themeOptions = allThemes.map((theme) => ({
    label: theme.name,
    value: theme.id,
  }));
  
  return <></>;
};

DesignPanel.Header = Header;


export default DesignPanel;
