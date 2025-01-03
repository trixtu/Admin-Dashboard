import BreadcrumbTrx from '@/components/custom/Breadcrumb'
import Container from '@/components/custom/Container'
import Row from '@/components/custom/Row'
import CategoryForm from '@/components/models/admin/product-categories/CategoryForm'
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <>
      <section className="py-10">
        <Container>
          <Row className="justify-between">
            <BreadcrumbTrx name="Add new category or subcategory" />
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
          <CategoryForm />
        </Container>
      </section>
    </>
  )
}
