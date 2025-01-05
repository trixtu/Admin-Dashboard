import BreadcrumbTrx from "@/components/custom/Breadcrumb";
import Container from "@/components/custom/Container";
import Row from "@/components/custom/Row";
import Options from "@/components/models/admin/options";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import React from "react";

const AdminOptionsPage: React.FC = () => {
  return (
    <>
      <section className="py-10">
        <Container>
          <Row className="justify-between">
            <BreadcrumbTrx name="Product Options" />
            <Link
              href={`/admin/options/new`}
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
            <Options/>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default AdminOptionsPage;
