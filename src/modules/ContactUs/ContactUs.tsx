import React from "react";
import ContactUsForm from "@/components/ContactUsComponents/ContactUsForm";
import { Card, CardContent } from "@/components/ui/card";
import InfoContainer from "@/components/ContactUsComponents/InfoContainer";

function ContactUs() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] items-center justify-center bg-app-static p-6 md:p-10">
      <section className="w-full max-w-sm md:max-w-4xl">
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2 bg-white">
            <InfoContainer />
            <ContactUsForm />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default ContactUs;
