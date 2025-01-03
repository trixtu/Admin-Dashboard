"use client";

import React from "react";
import {
  ThemeProvider as NextThemesProviders,
  ThemeProviderProps,
} from "next-themes";

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemesProviders {...props}>{children}</NextThemesProviders>;
};
