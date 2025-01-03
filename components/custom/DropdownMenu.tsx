"use client";
import { useState } from "react";
import Link from "next/link";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Minus, Pencil, Plus, Trash } from "lucide-react";


export default function Accordion() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div>
      <ul className="m-0 p-0 list-none">
        <li className="border bg-[#efefef] m-1 pl-10 relative">
          <div className="bg-white">
            <div className="rounded-[1px] p-4 mb-0 flex items-center justify-between">
              <div className="flex items-center font-medium">
                <Link
                  href={"#"}
                  className="underline underline-offset-4 decoration-dotted"
                >
                  Electronics
                </Link>
                {/* to do numar produse */}
              </div>
              <div className="bg-white flex items-center gap-4">
                <Switch />
                <Button variant={"outline"} size={"icon"}>
                  <Pencil />
                </Button>
                <Button variant={"outline"} size={"icon"}>
                  <Trash />
                </Button>
              </div>
            </div>
            <span
              className="float-left w-10 h-[72px] absolute left-0 top-0 flex items-center justify-center cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <Minus className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </span>
          </div>
          <div
            className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${
              open ? "max-h-[500px]" : "max-h-0"
            }`}
          >
            <ul className="m-0 p-[1px] list-none bg-white">
              <li className="border bg-[#efefef] m-1 pl-10 relative">
                <div className="bg-white">
                  <div className="border rounded-[1px] p-4 mb-0 flex items-center justify-between">
                    <div className="flex items-center font-medium">
                      <Link href={"#"}>Electronics</Link>
                      {/* to do numar produse */}
                    </div>
                    <div className="bg-white flex items-center gap-4">
                      <Switch />
                      <Button variant={"outline"} size={"icon"}>
                        <Pencil />
                      </Button>
                      <Button variant={"outline"} size={"icon"}>
                        <Trash />
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
              <li className="border bg-[#efefef] m-1 pl-10 relative">
                <div className="bg-white">
                  <div className="border rounded-[1px] p-4 mb-0 flex items-center justify-between">
                    <div className="flex items-center font-medium">
                      <Link href={"#"}>Electronics</Link>
                      {/* to do numar produse */}
                    </div>
                    <div className="bg-white flex items-center gap-4">
                      <Switch />
                      <Button variant={"outline"} size={"icon"}>
                        <Pencil />
                      </Button>
                      <Button variant={"outline"} size={"icon"}>
                        <Trash />
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
}
