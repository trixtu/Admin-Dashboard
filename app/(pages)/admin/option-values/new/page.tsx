import { getOption } from "@/app/action/option";
import BreadcrumbTrx from "@/components/custom/Breadcrumb";
import Container from "@/components/custom/Container";
import Row from "@/components/custom/Row";
import ValueForm from "@/components/models/admin/options/OptionValues/ValueForm";
import Link from "next/link";
import React from "react";

export default async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const optionId = searchParams.optionId;
  const data = await getOption(optionId);

  return (
    <>
      <section className="py-10">
        <Container>
          <Row className="justify-between">
            <BreadcrumbTrx
              name="Product Options"
              href="/admin/options"
              alDoileaLink={`New ${data.name} value`}
            />
            <Link
              href={`/admin/option-values/list/${data._id}`}
              className="btn btn-icon btn-outline-brand"
            >
              Go to option {data.name}
            </Link>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <ValueForm data={data}/>
        </Container>
      </section>
    </>
  );
}
