import React from "react";
import BookAlooza from "@/assets/logo-tagline.png";
import { CONTACT_INFO } from "@/lib/constantsValue";

const InfoContainer = () => {
  return (
    <div className="relative bg-contact-us rounded-xl p-6 md:p-8 text-white [&_a]:text-[#ffd536]">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col items-center space-y-2 mb-4">
          <img
            src={BookAlooza}
            alt="bookalooza logo"
            height={80}
            width={121}
            loading="lazy"
          />
          <h1 className="text-3xl font-bold">Contact Us</h1>
        </div>
        {CONTACT_INFO.map((item) => {
          return (
            <div key={item.title} className="flex flex-col">
              <p className="text-lg font-medium">{item.title}</p>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col"
              >
                {typeof item.linkText === "string"
                  ? item.linkText
                  : item.linkText?.map((link) => (
                      <div key={link}>
                        <p>{link}</p>
                      </div>
                    ))}
              </a>
            </div>
          );
        })}
        <div className="flex flex-col">
          <p className="text-lg font-medium">Locate us on map</p>
          <div className="rounded-xl overflow-hidden h-fit mt-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.364397127752!2d77.2437465!3d28.6488059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd209d24a4d5%3A0x773dd6306827a7e5!2sOrange%20Education%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1741179608798!5m2!1sen!2sin"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoContainer;
