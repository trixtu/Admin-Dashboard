import BreadcrumbTrx from "@/components/custom/Breadcrumb";
import Container from "@/components/custom/Container";
import Row from "@/components/custom/Row";
import ProductCategories from "@/components/models/admin/product-categories";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <>
      <section className="py-10">
        <Container>
          <Row className="justify-between">
            <BreadcrumbTrx name="Product Categories" />
            <Link
              href={`/admin/product-categories/new`}
              className="btn btn-icon btn-outline-brand"
            >
              <CirclePlus className="w-5 h-5" />
              New
            </Link>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <ProductCategories />
          </Row>
        </Container>
      </section>
    </>
  );
}
