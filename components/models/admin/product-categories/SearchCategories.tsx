import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

export default function SearchCategories() {
  return (
    <div className='flex gap-2'>
      <Input placeholder='Search'/>
      <Button className='md:px-12'>Search</Button>
    </div>
  )
}
