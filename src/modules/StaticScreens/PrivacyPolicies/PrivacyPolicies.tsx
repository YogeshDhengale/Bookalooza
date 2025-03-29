import React from "react";
import privacyPoliciesAnimation from "@/assets/lotties/privacy-policies.json";
import StaticLayout from "@/components/StaticScreenComponents/StaticLayout";
import StaticContent from "@/components/StaticScreenComponents/StaticContent";
import { type_static_contentItem } from "@/types/StaticScreenTypes";


const content: type_static_contentItem[] = [
  {
    title: (
      <>
        <h2>Interpretation and Definitions</h2>
        <h3>Interpretation</h3>
      </>
    ),
    description: [
      <p>
        The words of which the initial letter is capitalized have meanings
        defined under the following conditions. The following definitions shall
        have the same meaning regardless of whether they appear in singular or
        in plural.
      </p>,
    ],
  },
  {
    title: <h3>Definitions</h3>,
    description: [
      <>
        <p>For the purposes of this Privacy Policy</p>
        <ul className="static-list">
          <li>
            Account means a unique account created for You to access our Service
            or parts of our Service.
          </li>
          <li>
            Company (referred to as either "the Company", "We", "Us" or "Our" in
            this Agreement) refers to Orange VtechPvt. Ltd.
          </li>
          <li>Country refers to: India</li>
          <li>
            Device means any device that can access the Service such as a
            computer, a cellphone or a digital tablet.
          </li>
          <li>
            Personal Data is any information that relates to an identified or
            identifiable individual.
          </li>
          <li>Service refers to the Website.</li>
          <li>
            Service Provider means any natural or legal person who processes the
            data on behalf of the Company. It refers to third-party companies or
            individuals employed by the Company to facilitate the Service, to
            provide the Service on behalf of the Company, to perform services
            related to the Service or to assist the Company in analyzing how the
            Service is used.
          </li>
          <li>
            Usage Data refers to data collected automatically, either generated
            by the use of the Service or from the Service infrastructure itself
            (for example, the duration of a page visit).
          </li>
          <li>
            Website refers to Bookalooza, accessible from{" "}
            <a href="www.bookalooza.com">www.bookalooza.com</a>
          </li>
          <li>
            You means the individual accessing or using the Service, or the
            company, or other legal entity on behalf of which such individual is
            accessing or using the Service, as applicable.
          </li>
        </ul>
      </>,
    ],
  },
  {
    title: (
      <>
        <h2>Collecting and Using Your Personal Data</h2>
        <h3>Types of Data Collected</h3>
      </>
    ),
  },
  {
    title: <h3>Personal Data</h3>,
    description: [
      <>
        <p>
          While using Our Service, We may ask You to provide Us with certain
          personally identifiable information that can be used to contact or
          identify You. Personally identifiable information may include, but is
          not limited to:
        </p>
        <ul className="static-list">
          <li>Email address</li>
          <li>First name and last name</li>
          <li>Phone number</li>
          <li>Usage Data</li>
        </ul>
      </>,
    ],
  },
  {
    title: <h3>Usage Data</h3>,
    description: [
      <p>Usage Data is collected automatically when using the Service.</p>,
      <p>
        Usage Data may include information such as Your Device's Internet
        Protocol address (e.g. IP address), browser type, browser version, the
        pages of our Service that You visit, the time and date of Your visit,
        the time spent on those pages, unique device identifiers and other
        diagnostic data.
      </p>,
      <p>
        When You access the Service by or through a mobile device, We may
        collect certain information automatically, including, but not limited
        to, the type of mobile device You use, Your mobile device unique ID, the
        IP address of Your mobile device, Your mobile operating system, the type
        of mobile Internet browser You use, unique device identifiers and other
        diagnostic data.
      </p>,
      <p>
        We may also collect information that Your browser sends whenever You
        visit our Service or when You access the Service by or through a mobile
        device.
      </p>,
    ],
  },
  {
    title: <h3>Tracking Technologies and Cookies</h3>,
    description: [
      <>
        <p>
          We use Cookies and similar tracking technologies to track the activity
          on Our Service and store certain information. Tracking technologies
          used are beacons, tags, and scripts to collect and track information
          and to improve and analyze Our Service. The technologies We use may
          include:
        </p>
        <ul className="static-list">
          <li>
            Cookies or Browser Cookies. A cookie is a small file placed on Your
            Device. You can instruct Your browser to refuse all Cookies or to
            indicate when a Cookie is being sent. However, if You do not accept
            Cookies, You may not be able to use some parts of our Service.
            Unless you have adjusted Your browser setting so that it will refuse
            Cookies, our Service may use Cookies.
          </li>
          <li>
            Web Beacons. Certain sections of our Service and our emails may
            contain small electronic files known as web beacons (also referred
            to as clear gifs, pixel tags, and single-pixel gifs) that permit the
            Company, for example, to count users who have visited those pages or
            opened an email and for other related website statistics (for
            example, recording the popularity of a certain section and verifying
            system and server integrity).
          </li>
        </ul>
      </>,
      <p>
        Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies
        remain on Your personal computer or mobile device when You go offline,
        while Session Cookies are deleted as soon as You close Your web browser.
        Learn more about cookies: Use of Cookies by Free Privacy Policy.
      </p>,
    ],
  },
  {
    title: (
      <h3>
        We use both Session and Persistent Cookies for the purposes set out
        below:
      </h3>
    ),
    description: [
      <>
        <ul className="static-list">
          <li>
            <div>
              <p>
                <b>Necessary / Essential Cookies</b>
              </p>
              <p>Type: Session Cookies</p>
              <p>Administered by: Us</p>
              <p>
                Purpose: These Cookies are essential to provide You with
                services available through the Website and to enable You to use
                some of its features. They help to authenticate users and
                prevent fraudulent use of user accounts. Without these Cookies,
                the services that You have asked for cannot be provided, and We
                only use these Cookies to provide You with those services.
              </p>
            </div>
          </li>
          <li>
            <div>
              <p>
                <b>Cookies Policy / Notice Acceptance Cookies</b>
              </p>
              <p>Type: Persistent Cookies</p>
              <p>Administered by: Us</p>
              <p>
                Purpose: These Cookies identify if users have accepted the use
                of cookies on the Website.
              </p>
            </div>
          </li>
          <li>
            <div>
              <p>
                <b>Functionality Cookies</b>
              </p>
              <p>Type: Persistent Cookies</p>
              <p>Administered by: Us</p>
              <p>
                Purpose: These Cookies allow us to remember choices You make
                when You use the Website, such as remembering your login details
                or language preference. The purpose of these Cookies is to
                provide You with a more personal experience and to avoid You
                having to re-enter your preferences every time You use the
                Website.
              </p>
            </div>
          </li>
        </ul>
      </>,
      <p>
        For more information about the cookies we use and your choices regarding
        cookies, please visit our Cookies Policy or the Cookies section of our
        Privacy Policy.
      </p>,
    ],
  },
  {
    title: (
      <>
        <h2>Use of Your Personal Data</h2>
        <h3>The Company may use Personal Data for the following purposes:</h3>
      </>
    ),
    description: [
      <ul className="static-list">
        <li>
          To provide and maintain our Service, including to monitor the usage of
          our Service.
        </li>
        <li>
          To manage Your Account: to manage Your registration as a user of the
          Service. The Personal Data You provide can give You access to
          different functionalities of the Service that are available to You as
          a registered user.
        </li>
        <li>
          For the performance of a contract: the development, compliance and
          undertaking of the purchase contract for the products, items or
          services You have purchased or of any other contract with Us through
          the Service.
        </li>
        <li>
          To contact You: To contact You by email, telephone calls, SMS, or
          other equivalent forms of electronic communication, such as a mobile
          application's push notifications regarding updates or informative
          communications related to the functionalities, products or contracted
          services, including the security updates, when{" "}
        </li>
        <li>
          To provide You with news, special offers and general information about
          other goods, services and events which we offer that are similar to
          those that you have already purchased or enquired about unless You
          have opted not to receive such information.
        </li>
        <li>
          To manage Your requests: To attend and manage Your requests to Us.
        </li>
        <li>
          For business transfers: We may use Your information to evaluate or
          conduct a merger, divestiture, restructuring, reorganization,
          dissolution, or other sale or transfer of some or all of Our assets,
          whether as a going concern or as part of bankruptcy, liquidation, or
          similar proceeding, in which Personal Data held by Us about our
          Service users is among the assets transferred.
        </li>
        <li>
          For other purposes: We may use Your information for other purposes,
          such as data analysis, identifying usage trends, determining the
          effectiveness of our promotional campaigns and to evaluate and improve
          our Service, products, services, marketing and your experience.
        </li>
      </ul>,
    ],
  },
  {
    title: (
      <h3>
        We may share Your personal information in the following situations:
      </h3>
    ),
    description: [
      <ul className="static-list">
        <li>
          With Service Providers: We may share Your personal information with
          Service Providers to monitor and analyze the use of our Service, to
          contact You.
        </li>
        <li>
          For business transfers: We may share or transfer Your personal
          information in connection with, or during negotiations of, any merger,
          sale of Company assets, financing, or acquisition of all or a portion
          of Our business to another company.
        </li>
        <li>
          With Affiliates: We may share Your information with Our affiliates, in
          which case we will require those affiliates to honor this Privacy
          Policy. Affiliates include Our parent company and any other
          subsidiaries, joint venture partners or other companies that We
          control or that are under common control with Us.
        </li>
        <li>
          With business partners: We may share Your information with Our
          business partners to offer You certain products, services or
          promotions.
        </li>
        <li>
          With other users: when You share personal information or otherwise
          interact in the public areas with other users, such information may be
          viewed by all users and may be publicly distributed outside.
        </li>
        <li>
          With Your consent: We may disclose Your personal information for any
          other purpose with Your consent.
        </li>
      </ul>,
    ],
  },
  {
    title: <h3>Retention of Your Personal Data</h3>,
    description: [
      <p>
        The Company will retain Your Personal Data only for as long as is
        necessary for the purposes set out in this Privacy Policy. We will
        retain and use Your Personal Data to the extent necessary to comply with
        our legal obligations (for example, if we are required to retain your
        data to comply with applicable laws), resolve disputes, and enforce our
        legal agreements and policies.
      </p>,
      <p>
        The Company will also retain Usage Data for internal analysis purposes.
        Usage Data is generally retained for a shorter period of time, except
        when this data is used to strengthen the security or to improve the
        functionality of Our Service, or We are legally obligated to retain this
        data for longer time periods.
      </p>,
    ],
  },
  {
    title: (
      <>
        <h2>Disclosure of Your Personal Data</h2>
        <h3>Business Transactions</h3>
      </>
    ),
    description: [
      <p>
        If the Company is involved in a merger, acquisition or asset sale, Your
        Personal Data may be transferred. We will provide notice before Your
        Personal Data is transferred and becomes subject to a different Privacy
        Policy.
      </p>,
    ],
  },
  {
    title: <h3>Law enforcement</h3>,
    description: [
      <p>
        Under certain circumstances, the Company may be required to disclose
        Your Personal Data if required to do so by law or in response to valid
        requests by public authorities (e.g. a court or a government agency).
      </p>,
    ],
  },
  {
    title: (
      <>
        <h2>Other legal requirements</h2>
        <h3>
          The Company may disclose Your Personal Data in the good faith belief
          that such action is necessary to:
        </h3>
      </>
    ),
    description: [
      <ul className="static-list">
        <li>Comply with a legal obligation</li>
        <li>Protect and defend the rights or property of the Company</li>
        <li>
          Prevent or investigate possible wrongdoing in connection with the
          Service
        </li>
        <li>
          Protect the personal safety of Users of the Service or the public
        </li>
        <li>Protect against legal liability</li>
      </ul>,
    ],
  },
  {
    title: <h3>Security of Your Personal Data</h3>,
    description: [
      <p>
        The security of Your Personal Data is important to Us, but remember that
        no method of transmission over the Internet, or method of electronic
        storage is 100% secure. While we strive to use commercially acceptable
        means to protect Your Personal Data, We cannot guarantee its absolute
        security.
      </p>,
    ],
  },
  {
    title: <h3>Children's Privacy</h3>,
    description: [
      <p>
        Our Service does not address anyone under the age of 13. We do not
        knowingly collect personally identifiable information from anyone under
        the age of 13. If You are a parent or guardian and You are aware that
        Your child has provided Us with Personal Data, please contact Us. If We
        become aware that We have collected Personal Data from anyone under the
        age of 13 without verification of parental consent, We take steps to
        remove that information from Our servers.
      </p>,
      <p>
        If We need to rely on consent as a legal basis for processing Your
        information and Your country requires consent from a parent, We may
        require Your parent's consent before We collect and use that
        information.
      </p>,
    ],
  },
  {
    title: <h3>Links to Other Websites</h3>,
    description: [
      <p>
        Our Service may contain links to other websites that are not operated by
        Us. If You click on a third party link, You will be directed to that
        third party's site. We strongly advise You to review the Privacy Policy
        of every site You visit.
      </p>,
      <p>
        We have no control over and assume no responsibility for the content,
        privacy policies or practices of any third party sites or services.
      </p>,
    ],
  },
  {
    title: <h3>Changes to this Privacy Policy</h3>,
    description: [
      <p>
        We may update Our Privacy Policy from time to time. We will notify You
        of any changes by posting the new Privacy Policy on this page.
      </p>,
      <p>
        We will let You know via email and/or a prominent notice on Our Service,
        prior to the change becoming effective and update the "Last updated"
        date at the top of this Privacy Policy.
      </p>,
      <p>
        You are advised to review this Privacy Policy periodically for any
        changes. Changes to this Privacy Policy are effective when they are
        posted on this page.
      </p>,
    ],
  },
  {
    title: <h2>Terms & Conditions for Bookalooza.com Image Upload</h2>,
    description: [
      <ul className="static-list">
        <li>
          <b>Copyright and Intellectual Property Rights: </b>
          You represent and warrant that you own or have obtained all necessary
          licences, permissions, and consents required to use and upload the
          images to Bookalooza.com. You agree not to upload any images that
          infringe or violate any intellectual property rights, including but
          not limited to copyright, trademark, or trade secret rights. You also
          agree to indemnify and hold Bookalooza.com harmless from any claims or
          damages arising out of any alleged or actual infringement or violation
          of intellectual property rights.
        </li>
        <li>
          <b>Religious and Cultural Sentiments: </b>
          You acknowledge and agree that Bookalooza.com is a platform for people
          of all cultures and religions. Therefore, you must not upload any
          images that are discriminatory, defamatory, or offensive to any
          particular community or religion. You also agree to indemnify and hold
          Bookalooza.com harmless from any claims or damages arising out of any
          alleged or actual discriminatory, defamatory, or offensive images.
        </li>
        <li>
          <b>Image Usage Rights:</b>
          By uploading your images to Bookalooza.com, you grant Bookalooza.com a
          worldwide, royalty-free, non-exclusive, perpetual, irrevocable, and
          sublicensable licence to use, reproduce, modify, adapt, publish,
          translate, distribute, and display the images in connection with our
          services. You also grant Bookalooza.com the right to use your name,
          image, and likeness in connection with the images.
        </li>
        <li>
          <b>Image Removal Rights: </b>
          Bookalooza.com reserves the right to remove any images that violate
          these terms and conditions or are deemed inappropriate or offensive by
          Bookalooza.com. Bookalooza.com will not be responsible for any damages
          or losses arising out of the removal of any images.
        </li>
        <li>
          <b>User Conduct: </b>
          You agree not to use Bookalooza.com for any unlawful, harmful, or
          inappropriate purposes, including but not limited to uploading images
          that are illegal, fraudulent, obscene, or harassing. You also agree
          not to interfere with or disrupt Bookalooza.com’s services or servers,
          or violate any requirements, procedures, policies, or regulations of
          networks connected to Bookalooza.com.
        </li>
        <li>
          <b>Limitation of Liability: </b>
          Bookalooza.com will not be liable for any direct, indirect,
          incidental, special, consequential, or punitive damages arising out of
          your use of our services or these terms and conditions.
          Bookalooza.com’s liability to you for any cause whatsoever, and
          regardless of the form of the action, will at all times be limited to
          the amount paid, if any, by you to Bookalooza.com for the services.
        </li>
        <li>
          <b>Governing Law:</b>
          These terms and conditions will be governed by and construed in
          accordance with the laws of the jurisdiction where Bookalooza.com
          operates.
        </li>
        <li>
          <b>Modification: </b>
          Bookalooza.com reserves the right to modify these terms and conditions
          at any time, with or without notice to you. Your continued use of our
          services after any such modification constitutes your acceptance of
          the modified terms and conditions.
        </li>
      </ul>,
    ],
  },
  {
    title: <h2>Contact Us</h2>,
    description: [
      <>
        <h4>Please send your feedback, comments, requests for technical</h4>{" "}
        support by email:{" "}
        <a href="mailto:info@bookalooza.com">info@bookalooza.com</a>
      </>,
    ],
  },
];

function PrivacyPolicies() {
  return (
    <StaticLayout
      title="Privacy Policies"
      description="This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your
              information when You use the Service and tells You about Your privacy rights and how the law protects You.
              We use Your Personal data to provide and improve the Service. By using the Service, You agree to the
              collection and use of information in accordance with this Privacy Policy. This Privacy Policy has been
              created with the help of the Privacy Policy Template."
      animation={privacyPoliciesAnimation}
      content={content}
    />        
  );
}

export default PrivacyPolicies;
