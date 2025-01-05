import BreadcrumbTrx from '@/components/custom/Breadcrumb'
import Container from '@/components/custom/Container'
import Row from '@/components/custom/Row'
import OptionForm from '@/components/models/admin/options/OptionForm'
import Link from 'next/link'
import React from 'react'

export default function page({ params }: { params: { _id: string } }) {
  return (
    <>
    <section className="py-10">
      <Container>
        <Row className="justify-between">
          <BreadcrumbTrx name="Edit brand" />
          <Link
            href={`/admin/options`}
            className="btn btn-icon btn-outline-brand"
          >
            Go to list
          </Link>
        </Row>
      </Container>
    </section>
    <section>
      <Container>
        <OptionForm _id={params._id}/>
      </Container>
    </section>
  </>
  )
}
