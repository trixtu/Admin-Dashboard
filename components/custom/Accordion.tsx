"use client";

import { useState } from "react";
import Link from "next/link";
import { TypeCategoryModel } from "@/types/models";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Minus, Pencil, Plus, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import Image from "next/image";

interface AccordionProps {
  data: TypeCategoryModel[];
  mutate: () => void;
  onDelete?: (_id: string) => void;
}

export default function Accordion({ data, onDelete, mutate }: AccordionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { push } = useRouter();

  const [openCategories, setOpenCategories] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prevState) => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }));
  };

  const getSubcategories = (parentId: string) => {
    const subcategories = data.filter((category) => {
      const categoryParentId = category.parentId
        ? typeof category.parentId === "object" && "_id" in category.parentId
          ? (category.parentId as { _id: string })._id // Accesăm _id din obiect
          : category.parentId // Folosim direct dacă este un string
        : null;

      const isMatch = categoryParentId === parentId;

      return isMatch;
    });

    return subcategories;
  };

  const deleteCategory = async () => {
    if (onDelete && selectedCategory) {
      await onDelete(selectedCategory);
    }
  };

  const handleStatusChange = async (checked: boolean, _id: string) => {
    const newValue = checked ? "publish" : "draft";

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories?method=activateOne`,

        {
          data: { _id: _id, status: newValue },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast({
        variant: "info",
        description: `Category status updated to ${
          checked ? "publish" : "draft"
        }`,
      });
      mutate();
    } catch (error) {
      console.error("Failed to update status", error);
      toast({
        variant: "error",
        description: "Failed to update status",
      });
    }
  };

  return (
    <>
      <div className="w-full overflow-x-scroll">
        <ul className="m-0 p-0 list-none min-w-[500px]">
          {data
            .filter((category) => category.parentId === null) // Afișăm doar categoriile principale
            .map((category) => {
              const subcategories = getSubcategories(category._id);
              const isOpen = openCategories[category._id] || false;

              return (
                <li
                  key={category._id}
                  className="border bg-[#efefef] m-1 pl-10 relative"
                >
                  <div className="bg-white">
                    <div className="rounded-[1px] p-4 mb-0 flex items-center justify-between">
                      <div className="flex items-center font-medium">
                        <Image
                          className="hidden md:block rounded-md overflow-hidden mr-4"
                          src={category.image as string}
                          alt={category.name}
                          width={40}
                          height={40}
                        />
                        <Link
                          href={"#"}
                          className="capitalize underline underline-offset-4 decoration-dotted"
                        >
                          {category.name}
                        </Link>
                        {/* To do: număr produse */}
                      </div>
                      <div className="bg-white flex items-center gap-4">
                        <Switch
                          checked={category.status === "publish"}
                          onCheckedChange={(checked) => {
                            handleStatusChange(checked, category._id); // Apelăm funcția cu valoarea corespunzătoare
                          }}
                        />
                        <Button
                          variant={"outline"}
                          size={"icon"}
                          onClick={() =>
                            push(`/admin/product-categories/${category._id}`)
                          }
                        >
                          <Pencil />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant={"outline"}
                              size={"icon"}
                              onClick={() => setSelectedCategory(category._id)}
                            >
                              <Trash />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl">
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="mt-2 text-sm text-gray-600">
                                Sigur dorești să ștergi categoria{" "}
                                <strong>{category.name}</strong>? Această
                                acțiune este ireversibilă.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction asChild>
                                <button
                                  onClick={deleteCategory}
                                  className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                  Șterge
                                </button>
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    {subcategories.length > 0 && (
                      <span
                        className="float-left w-10 h-[72px] absolute left-0 top-0 flex items-center justify-center cursor-pointer"
                        onClick={() => toggleCategory(category._id)}
                      >
                        {isOpen ? (
                          <Minus className="w-5 h-5" />
                        ) : (
                          <Plus className="w-5 h-5" />
                        )}
                      </span>
                    )}
                  </div>
                  {subcategories.length > 0 && (
                    <div
                      className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${
                        isOpen ? "max-h-[500px]" : "max-h-0"
                      }`}
                    >
                      <ul className="m-0 p-[1px] list-none bg-white">
                        {subcategories.map((subcategory) => (
                          <li
                            key={subcategory._id}
                            className="capitalize border bg-[#efefef] m-1 pl-10 relative"
                          >
                            <div className="bg-white">
                              <div className="border rounded-[1px] p-4 mb-0 flex items-center justify-between">
                                <div className="flex items-center font-medium">
                                  <Image
                                    className="hidden md:block rounded-md overflow-hidden mr-4"
                                    src={subcategory.image as string}
                                    alt={category.name}
                                    width={40}
                                    height={40}
                                  />
                                  <Link href={"#"}>{subcategory.name}</Link>
                                  {/* To do: număr produse */}
                                </div>
                                <div className="bg-white flex items-center gap-4">
                                  <Switch
                                    checked={subcategory.status === "publish"}
                                    onCheckedChange={(checked) => {
                                      handleStatusChange(
                                        checked,
                                        subcategory._id
                                      ); // Apelăm funcția cu valoarea corespunzătoare
                                    }}
                                  />
                                  <Button
                                    variant={"outline"}
                                    size={"icon"}
                                    onClick={() =>
                                      push(
                                        `/admin/product-categories/${subcategory._id}`
                                      )
                                    }
                                  >
                                    <Pencil />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant={"outline"}
                                        size={"icon"}
                                        onClick={() =>
                                          setSelectedCategory(subcategory._id)
                                        }
                                      >
                                        <Trash />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle className="text-xl">
                                          Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="mt-2 text-sm text-gray-600">
                                          Sigur dorești să ștergi subcategoria{" "}
                                          <strong>{subcategory.name}</strong>?
                                          Această acțiune este ireversibilă.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction asChild>
                                          <button
                                            onClick={deleteCategory}
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                          >
                                            Șterge
                                          </button>
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
}
