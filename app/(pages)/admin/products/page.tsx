import BreadcrumbTrx from "@/components/custom/Breadcrumb";
import Container from "@/components/custom/Container";
import React from "react";
import Row from "../../../../components/custom/Row";
import Link from "next/link";
import { CirclePlus } from "lucide-react";
import Products from "@/components/models/admin/products";

export default function page() {
  return (
    <>
      <section className="py-10">
        <Container>
          <Row className="justify-between">
            <BreadcrumbTrx name="Product Catalog" />
            <Link
              href={`/admin/products/new`}
              className="btn btn-icon btn-outline-brand"
            >
              <CirclePlus className="w-5 h-5" />
              New Product
            </Link>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Products />
          </Row>
        </Container>
      </section>
    </>
  );
}
