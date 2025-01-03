import BreadcrumbTrx from '@/components/custom/Breadcrumb'
import Container from '@/components/custom/Container'
import Row from '@/components/custom/Row'
import Brands from '@/components/models/admin/brands'
import { CirclePlus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <>
      <section className="py-10">
        <Container>
          <Row className="justify-between">
            <BreadcrumbTrx name="Brands" />
            <Link
              href={`/admin/brands/new`}
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
            <Brands />
          </Row>
        </Container>
      </section>
    </>
  )
}
