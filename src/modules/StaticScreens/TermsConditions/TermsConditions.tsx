import React from "react";
import StaticLayout from "@/components/StaticScreenComponents/StaticLayout";
import TermsConditionsAnimation from "@/assets/lotties/terms-and-condition.json";

const content = [
  {
    title: (
      <>
        <h2>Bookalooza is owned by Orange VTech Pvt. Ltd.</h2>
        <h3>About Bookalooza</h3>
      </>
    ),
    description: [
      <p>
        Bookalooza is a worldwide platform that empowers those who believe that
        words can have an influential impact. This platform enables writers to
        convert their stories and thoughts into books that people can connect
        with.
      </p>,
      <p>
        Bookalooza makes self-publishing a book easier with our free publishing
        platform. Our creative publishing program helps you publish a book. We
        offer the best way to self-publish books with lots of in-built templates
        and eye-catching covers that accurately represent the content of your
        publication.
      </p>,
      <p>
        Our goal is to provide you with the support and resources you need to
        make your publishing dream a reality. Bookalooza gives you full control
        over the entire publishing process, from editing and formatting to cover
        design, from marketing to earning royalties. We review the content
        before publishing to check if any unethical content is uploaded.
      </p>,
      <p>
        Our team of experienced professionals is committed to provide the
        highest level of service and support to ensure that your book stands out
        in a crowded marketplace.
      </p>,
      <p>
        Our Privacy Policy governs your use of our Service and explains how we
        collect, safeguard and disclose information that results from your use
        of our web pages.
      </p>,
      <p>
        Your agreement with us includes these Terms and our Privacy Policy. You
        acknowledge that you have read and understood Agreements and agree to be
        bound of them.
      </p>,
      <p>
        If you do not agree with (or cannot comply with) Agreements, then you
        may not use the Service, but please let us know by emailing at{" "}
        <a href="mailto:info@bookalooza.com">info@bookalooza.com</a> so we can
        try to find a solution. These Terms apply to all visitors, users and
        others who wish to access or use Service.
      </p>,
    ],
  },
  {
    title: (
      <>
        <h3>Prohibited Uses</h3>
        <h4>
          You may use Service only for lawful purposes and in accordance with
          Terms. You agree not to use Service:
        </h4>
      </>
    ),
    description: [
      <ul className="static-list">
        <li>
          In any way that violates any applicable national or international law
          or regulation.
        </li>
        <li>
          For the purpose of exploiting, harming, or attempting to exploit or
          harm minors in any way by exposing them to inappropriate content or
          otherwise.
        </li>
        <li>
          To transmit, or procure the sending of, any advertising or promotional
          material, including any 'junk mail', 'chain letter', 'spam' or any
          other similar solicitation.
        </li>
        <li>
          To impersonate or attempt to impersonate Company, a Company employee,
          another user, or any other person or entity.
        </li>
        <li>
          In any way that infringes upon the rights of others, or in any way is
          illegal, threatening, fraudulent, or harmful, or in connection with
          any unlawful, illegal, fraudulent, or harmful purpose or activity.
        </li>
        <li>
          To engage in any other conduct that restricts or inhibits anyone's use
          or enjoyment of Service, or which, as determined by us, may harm or
          offend Company or users of Service or expose them to liability.
        </li>
      </ul>,
    ],
  },
  {
    title: (<h3>Additionally, you agree not to:</h3>
    ),
    description: [
        <ul className="static-list">
        <li>
          Use Service in any manner that could disable, overburden, damage, or impair Service or interfere with any other party's use of Service, including their ability to engage in real-time activities through Service.
        </li>
        <li>
          Use any robot, spider, or other automatic device, process, or means to access Service for any purpose, including monitoring or copying any of the material on Service.
        </li>
        <li>
          Use any manual process to monitor or copy any of the material on Service or for any other unauthorized purpose without our prior written consent.
        </li>
        <li>
          Use any device, software, or routine that interferes with the proper working of Service.
        </li>
        <li>
          Introduce any viruses, trojan horses, worms, logic bombs, or other material which is malicious or technologically harmful.
        </li>
        <li>
          Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of Service, the server on which Service is stored, or any server, computer, or database connected to Service.
        </li>
        <li>
          Attack Service via a denial-of-service attack or a distributed denial-of-service attack.
        </li>
        <li>
          Take any action that may damage or falsify Company rating.
        </li>
        <li>
          Otherwise attempt to interfere with the proper working of Service.
        </li>
      </ul>
    ],
  },
];

function TermsConditions() {
  return (
    <StaticLayout
      title="Terms And Conditions"
      description="Read our terms below to learn more"
      animation={TermsConditionsAnimation}
      content={content}
    />
  );
}

export default React.memo(TermsConditions);
