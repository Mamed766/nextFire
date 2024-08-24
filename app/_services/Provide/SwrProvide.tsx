"use client";
import { defaultValues } from "../swr/config";
import React from "react";
import { SWRConfig } from "swr";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return <SWRConfig value={defaultValues}>{children}</SWRConfig>;
};
