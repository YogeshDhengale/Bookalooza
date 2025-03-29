import React, { useEffect } from "react";
import Section from "../Section/Section";
import Container from "../Container/Container";
import SectionHeading from "../SectionHeading/SectionHeading";
import { fetchAllStartAuthors } from "@/actions/UserAction/UserAction";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

const StarAuthors = () => {
  const dispatch = useAppDispatch();
  const { startAuthors, isStartAuthorFetched } = useAppSelector(
    (state: any) => state.user
  );

  useEffect(() => {
    if (!isStartAuthorFetched) fetchAllStartAuthors(dispatch);
  }, [dispatch, isStartAuthorFetched]);

  return (
    <Section className="bg-theme-selection">
      <Container>
        <SectionHeading title="Some Of Our Star Authors" />
        <div className="w-full">
          <div className="w-full overflow-hidden">
            <div
              className="animate-scroll p-4 h-full w-full min-w-max"
              style={
                {
                  "--duration": "23s",
                  "--delay": "0s",
                  "--iteration-count": "infinite",
                } as React.CSSProperties
              }
            >
              <div className="flex h-full w-full min-w-max box-border space-x-6">
                {[...startAuthors, ...startAuthors].map((item, idx) => {
                  return (
                    <div className="space-y-4 h-max" key={idx}>
                      <div className="w-full rounded-md overflow-hidden ring ring-blue-50 aspect-[3/4]">
                        <img
                          src={item.startAuthorPhotoURL}
                          alt="Carousel item"
                          loading="lazy"
                          width={288}
                          height={384}
                          className="bg-blue-50 w-full object-contain min-w-72"
                        />
                      </div>
                      <p className="text-xl text-white uppercase font-bold text-center">
                        {item.fullName}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default StarAuthors;
