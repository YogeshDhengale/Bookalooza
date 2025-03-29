import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";

const ContactUsForm = () => {
  return (
    <form className="p-6 md:p-8 text-app-dark flex items-center">
      <div className="flex flex-col justify-center w-full my-auto gap-6">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold w-full">Get In Touch With Us</h2>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Name</Label>
          <Input id="email" type="email" placeholder="John Doe" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Phone</Label>
          </div>
          <Input id="password" type="phoneNumber" placeholder="9999999999" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Message</Label>
          </div>
          <Textarea id="formMessage" placeholder="Type your message here." />
        </div>
        <Button type="submit" className="w-full primary-button">
          Submit
        </Button>
      </div>
    </form>
  );
};


export default ContactUsForm;
