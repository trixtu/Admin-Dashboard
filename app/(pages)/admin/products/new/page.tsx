import Container from '@/components/custom/Container'
import ProductForm from '@/components/models/admin/products/ProductForm'
import React from 'react'

export default function page() {
  return (
    <>
      <section className="py-10">
        <Container>
          <ProductForm />
        </Container>
      </section>
    </>
  )
}
