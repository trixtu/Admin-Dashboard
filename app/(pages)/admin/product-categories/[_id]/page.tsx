import React from "react";
import Container from "@/components/custom/Container";
import Row from "@/components/custom/Row";
import Link from "next/link";
import BreadcrumbTrx from "@/components/custom/Breadcrumb";
import CategoryForm from "@/components/models/admin/product-categories/CategoryForm";

const page = ({ params }: { params: { _id: string } }) => {
  return (
    <>
      <section className="py-10">
        <Container>
          <Row className="justify-between">
            <BreadcrumbTrx name="Edit category" />
            <Link
              href={`/admin/product-categories`}
              className="btn btn-icon btn-outline-brand"
            >
              Go to list
            </Link>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <CategoryForm _id={params._id} />
        </Container>
      </section>
    </>
  );
};

export default page;
