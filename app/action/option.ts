"use server";

import axios from "axios";
import { auth } from "@clerk/nextjs/server";

export const getOption = async (id: string) => {
  const { getToken } = await auth();
  try {
    const token = await getToken();

    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL +
        "/api/admin/options?method=getOption&_id=" +
        id,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    return error;
  }
};
