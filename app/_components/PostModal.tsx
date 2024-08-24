"use client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRequestMutation } from "../_services/http/axiosFetcher";
import { mutate } from "swr";

export default function PostModal({
  todo,
  onClose,
  isEdit = false,
  initialData = null,
}: {
  todo: any;
  onClose: () => void;
  isEdit?: boolean;
  initialData?: {
    id?: string | Number;
    productName?: string;
    userId?: string;
  } | null;
}) {
  const createMutation = useRequestMutation("data", {
    method: "POST",
    module: "datasApi",
  });

  const updateMutation = useRequestMutation("dataWithId", {
    method: "PUT",
    module: "datasApi",
  });

  const initialValues = {
    productName: initialData?.productName || "",
    userId: initialData?.userId || "",
  };

  const validationSchema = Yup.object({
    productName: Yup.string().required("Product name is required"),
    userId: Yup.string().required("User ID is required"),
  });

  const handleSubmit = async (values: any) => {
    try {
      console.log("isEdit:", isEdit);
      console.log("values:", values);
      if (isEdit) {
        await updateMutation.trigger({
          body: values,
          dynamicValue: todo.id,
        });

        mutate("data");
      } else {
        await createMutation.trigger({
          body: values,
        });
      }
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded w-[400px]">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Todo" : "Create New Todo"}
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="mb-2">
              <Field
                type="text"
                name="productName"
                placeholder="Product Name"
                className="border p-2 rounded w-full"
              />
              <ErrorMessage
                name="productName"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="mb-2">
              <Field
                type="text"
                name="userId"
                placeholder="User ID"
                className="border p-2 rounded w-full"
              />
              <ErrorMessage
                name="userId"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded mt-4"
            >
              {isEdit ? "Update Todo" : "Create Todo"}
            </button>
            <button
              onClick={onClose}
              className="bg-red-500 text-white p-2 rounded mt-4 ml-2"
              type="button"
            >
              Cancel
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
