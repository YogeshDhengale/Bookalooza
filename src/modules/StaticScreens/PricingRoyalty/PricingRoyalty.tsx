import React from "react";
import StaticLayout from "@/components/StaticScreenComponents/StaticLayout";
import PricingRoyaltyAnimation from "@/assets/lotties/pricing-and-royalties.json";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const content = [
  {
    title: <h2>Book Price Calculator</h2>,
    description: [
      <>
        <Table className="text-lg">
          <TableHeader className="[&_tr]:!border-0">
            <TableRow>
              <TableHead className="pricing-table-heading">Total no. of Book Pages</TableHead>
              <TableHead className="pricing-table-heading">Title</TableHead>
              <TableHead className="pricing-table-heading">Binding</TableHead>
              <TableHead className="pricing-table-heading">MRP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_td:first-child]:pl-6">
            <TableRow>
              <TableCell>24-32</TableCell>
              <TableCell>4 Page</TableCell>
              <TableCell>Center Pin</TableCell>
              <TableCell>350</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>40-48</TableCell>
              <TableCell>4 Page</TableCell>
              <TableCell>Center Pin</TableCell>
              <TableCell>375</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>48-64</TableCell>
              <TableCell>4 Page</TableCell>
              <TableCell>Perfect</TableCell>
              <TableCell>400</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>64 & Above </TableCell>
              <TableCell>4 Page</TableCell>
              <TableCell>Perfect</TableCell>
              <TableCell>400 + 3 per extra page</TableCell>
            </TableRow>
        </TableBody>
        </Table>
      </>,
      <p>
        (<b>Every extra page will cost Rs 3 per page</b>)
      </p>,
      <p>Every Book must include page count which should be multiple of 8.</p>,
    ],
  },
  {
    title: <h2>Book Quantity discount (Includes 4 Pages of Title Cover)</h2>,
    description: [
      <>
        <Table className="text-lg">
          <TableHeader className="[&_tr]:!border-0">
            <TableRow className="rounded-md">
              <TableHead className="pricing-table-heading">Type</TableHead>
              <TableHead className="pricing-table-heading">Discount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_td:first-child]:pl-6">
            <TableRow>
              <TableCell>1. Author Code Discount</TableCell>
              <TableCell>10% discount on MRP</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                2. Quantity Discount
              </TableCell>
              <TableCell rowSpan={5}>
                <div className="space-y-2">
                  <p>1-09 = No discount</p>
                  <p>10-19 = 5% Discount</p>
                  <p>20-49 = 10% Discount</p>
                  <div className="relative border border-[#663399] rounded-md p-2">
                    <div className="absolute -top-3 left-4 bg-white px-2 text-[#663399] text-sm">
                      Most Recommended
                    </div>
                    <p>50-99 = 15% Discount</p>
                  </div>
                  <p>100 or more = 20% Discount</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>,
    ],
  },
  {
    title: <h2>Royalty on each sold book</h2>,
    description: [
      <>
        <Table className="text-lg">
          <TableHeader className="[&_tr]:!border-0">
            <TableRow>
              <TableHead className="pricing-table-heading">MRP (Depends on Pages)</TableHead>
              <TableHead className="pricing-table-heading">Royalty (Per Book)</TableHead>
              <TableHead className="pricing-table-heading">Amount (Per Book)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_td:first-child]:pl-6">
            <TableRow>
              <TableCell>&#8377; 200</TableCell>
              <TableCell>10%</TableCell>
              <TableCell>&#8377; 20</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>,
    ],
  },
  {
    title: <h2>ISBN allocation & Global Presence</h2>,
    description: [
      <p>
        Please find below the minimum criteria for ISBN allotment and Amazon
        Global Upload. Before meeting the below requirements, the book sold will
        be considered as author copies.
      </p>,
      <>
        <Table className="text-lg">
          <TableHeader className="[&_tr]:!border-0">
            <TableRow>
              <TableHead className="pricing-table-heading">ISBN allocation</TableHead>
              <TableHead className="pricing-table-heading">Minimum 50 book copies sold</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_td:first-child]:pl-6">
            <TableRow>
              <TableCell>Amazon / Flipkart Global Upload</TableCell>
              <TableCell>Minimum 50 book copies sold</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>,
    ],
  },
  {
    title: <h2>Disclaimer</h2>,
    description: [
      <p>
        The services provided by the company are offered on an "as is" and "as
        available" basis. The company does not make any guarantees or
        warranties, whether explicit or implicit, regarding the operation of
        these services, or the accuracy, completeness, reliability, security,
        quality, or availability of the information, content, or materials
        included therein. By using these services, their content, or any
        services or items obtained from the company, you acknowledge and agree
        that you assume all risks associated with it.
      </p>,
      <p>
        Neither the company nor any person associated with the company provides
        any warranty or representation concerning the accuracy, reliability,
        completeness, error-free nature, uninterrupted availability, or freedom
        from viruses or other harmful components of the services. Furthermore,
        the company and its affiliates do not guarantee that the services, their
        content, or any services or items obtained through the services will
        meet your specific needs or expectations.
      </p>,
      <p>
        The company explicitly disclaims all warranties, whether express or
        implied, including but not limited to warranties of merchantability,
        non-infringement, and fitness for a particular purpose. This disclaimer
        of warranties applies to the fullest extent permitted by applicable law
        and does not affect any warranties that cannot be excluded or limited
        under such laws.
      </p>,
    ],
  },
];

function PricingRoyalty() {
  return (
    <StaticLayout
      title="Pricing And Royalties"
      description="Read our terms below to learn more"
      animation={PricingRoyaltyAnimation}
      content={content}
    />
  );
}

export default React.memo(PricingRoyalty);
