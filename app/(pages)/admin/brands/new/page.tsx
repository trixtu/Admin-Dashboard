import BreadcrumbTrx from "@/components/custom/Breadcrumb";
import Container from "@/components/custom/Container";
import Row from "@/components/custom/Row";
import BrandForm from "@/components/models/admin/brands/BrandForm";
import Link from "next/link";

export default function page() {
  return (
    <>
      <section className="py-10">
        <Container>
          <Row className="justify-between">
            <BreadcrumbTrx name="Add new brand" />
            <Link
              href={`/admin/brands`}
              className="btn btn-icon btn-outline-brand"
            >
              Go to list
            </Link>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <BrandForm />
        </Container>
      </section>
    </>
  );
}
