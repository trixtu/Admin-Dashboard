"use server";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";

export const getBrands = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "/api/admin/brands"
    );
    return response.data.data;
  } catch (error) {
    return error;
  }
};

export const getBrand = async (id: string) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "/api/admin/brands?_id=" + id
    );
    return response.data.data;
  } catch (error) {
    return error;
  }
};

export const deleteBrand = async (_id: string) => {
  const { getToken } = await auth();
  const token = await getToken();

  try {
    const response = await axios.delete(
      process.env.NEXT_PUBLIC_API_URL + "/api/admin/brands?_id=" + _id,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response

  } catch (error) {
    return error;
  }
};

