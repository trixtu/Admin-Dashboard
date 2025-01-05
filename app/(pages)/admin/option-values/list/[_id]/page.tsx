import { getOption } from "@/app/action/option";
import BreadcrumbTrx from "@/components/custom/Breadcrumb";
import Container from "@/components/custom/Container";
import Row from "@/components/custom/Row";
import OptionValues from "@/components/models/admin/options/OptionValues";
import { Button } from "@/components/ui/button";
import { OptionFormData } from "@/types/forms";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function page({ params }: { params: { _id: string } }) {
  const data: OptionFormData = await getOption(params._id);
  return (
    <>
      <section className="py-10">
        <Container>
          <Row className="justify-between">
            <BreadcrumbTrx
              name="Product Options"
              href="/admin/options"
              alDoileaLink={data.name}
            />
            <div className="flex items-center gap-4">
              <Button className="border-2 border-[#9ec0e0]" variant={"secondary"} asChild>
                <a href={`/admin/options`}>Back</a>
              </Button>
              <Link
                href={`/admin/option-values/new?optionId=${params._id}`}
                className="btn btn-icon btn-outline-brand"
              >
                <CirclePlus className="w-5 h-5" />
                New
              </Link>
            </div>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <OptionValues optionId={data._id as string} />
          </Row>
        </Container>
      </section>
    </>
  );
}
