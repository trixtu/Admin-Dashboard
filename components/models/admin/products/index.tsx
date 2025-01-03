import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

const data: Products[] = [
  {
    _id: "p1",
    image: "https://lolelaboutique.ro/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F2193c5fb-5c93-432a-a25f-72b6f52dcb8b-18m.jpg&w=640&q=75",
    name: "Brățară din oțel inoxidabil",
    user: "admin",
    createdOn: new Date().toISOString(),
    approved: "approved",
    status: false,
  },
  {
    _id: "p2",
    image: "https://lolelaboutique.ro/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F1eb0835e-ae3b-4871-8890-1b83b1a03b2e-18l.jpg&w=640&q=75",
    name: "Colier cu pietre semiprețioase",
    user: "admin",
    createdOn: "2024-12-30T12:34:56Z",
    approved: "approved",
    status: true,
  },
  {
    _id: "p3",
    image: "https://lolelaboutique.ro/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2Fimage3.jpg&w=640&q=75",
    name: "Cercei handmade",
    user: "admin",
    createdOn: new Date().toISOString(),
    approved: "approved",
    status: false,
  },
  {
    _id: "p4",
    image: "https://lolelaboutique.ro/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2Fimage4.jpg&w=640&q=75",
    name: "Inele personalizate cu nume",
    user: "admin",
    createdOn: new Date().toISOString(),
    approved: "pending",
    status: true,
  },
  {
    _id: "p5",
    image: "https://lolelaboutique.ro/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2Fimage5.jpg&w=640&q=75",
    name: "Brățară cu șnur roșu și charm",
    user: "admin",
    createdOn: new Date().toISOString(),
    approved: "approved",
    status: false,
  },
 
  {
    _id: "p1",
    image: "https://lolelaboutique.ro/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F2193c5fb-5c93-432a-a25f-72b6f52dcb8b-18m.jpg&w=640&q=75",
    name: "Brățară din oțel inoxidabil",
    user: "admin",
    createdOn: new Date().toISOString(),
    approved: "approved",
    status: true,
  },
  {
    _id: "p2",
    image: "https://lolelaboutique.ro/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F1eb0835e-ae3b-4871-8890-1b83b1a03b2e-18l.jpg&w=640&q=75",
    name: "Colier cu pietre semiprețioase",
    user: "admin",
    createdOn: "2024-12-30T12:34:56Z",
    approved: "approved",
    status: true,
  },
  {
    _id: "p1",
    image: "https://lolelaboutique.ro/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F2193c5fb-5c93-432a-a25f-72b6f52dcb8b-18m.jpg&w=640&q=75",
    name: "Brățară din oțel inoxidabil",
    user: "admin",
    createdOn: new Date().toISOString(),
    approved: "approved",
    status: true,
  },
  {
    _id: "p2",
    image: "https://lolelaboutique.ro/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F1eb0835e-ae3b-4871-8890-1b83b1a03b2e-18l.jpg&w=640&q=75",
    name: "Colier cu pietre semiprețioase",
    user: "admin",
    createdOn: "2024-12-30T12:34:56Z",
    approved: "approved",
    status: true,
  },
]
 
export type Products = {
  _id: string
  image: string
  name: string
  user: "admin" | "user"
  createdOn: string
  approved: "approved" | "pending"
  status: boolean
  
}

export default function Products() {
  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <DataTable searchKey="name" columns={columns} data={data ? data : []} />
      </CardContent>
    </Card>
  );
}
