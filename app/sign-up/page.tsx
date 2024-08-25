"use client";
import React from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Puff } from "react-loader-spinner";
const SignUp = () => {
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();
  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
  });

  const handleSignUp = async (
    values: any,
    { setSubmitting, setFieldError }: any
  ) => {
    try {
      const res = await createUserWithEmailAndPassword(
        values.email,
        values.password
      );

      if (res?.user) {
        await updateProfile(res.user, {
          displayName: values.username,
        });
      }

      sessionStorage.setItem("user", "true");

      setSubmitting(false);
      console.log(res);
      router.push("/");
    } catch (e: any) {
      console.error(e);
      if (e.code === "auth/email-already-in-use") {
        setFieldError("email", "Bu e-posta adresi zaten kullanılıyor");
      } else {
        console.error(e);
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Sign Up</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSignUp}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <Field
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 mt-2"
                />
              </div>

              <div className="mb-4">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 mt-2"
                />
              </div>

              <div className="mb-4">
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 mt-2"
                />
              </div>

              <div className="mb-4">
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full p-3 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 mt-2"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="relative w-full group inline-flex items-center px-8 py-2.5 overflow-hidden text-lg font-medium text-indigo-600 border-2 border-indigo-600 rounded-lg hover:text-white group hover:bg-gray-50"
              >
                <span className="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </span>
                <span className="relative text-base font-semibold transition-all duration-300 group-hover:-translate-x-3">
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Puff height={10} width={10} />
                    </div>
                  ) : (
                    "Sign Up"
                  )}
                </span>
              </button>
            </Form>
          )}
        </Formik>
        <Link className="text-blue-500 mt-4 inline-block" href={"/"}>
          Already have an account?
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
