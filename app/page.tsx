"use client";
import Image from "next/image";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Puff } from "react-loader-spinner";

export default function Home() {
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSignIn = async (values: any, { setSubmitting }: any) => {
    try {
      const res = await signInWithEmailAndPassword(
        values.email,
        values.password
      );
      sessionStorage.setItem("user", "true");
      console.log({ res });
      setSubmitting(false);
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Sign In</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSignIn}
        >
          {({ isSubmitting }) => (
            <Form>
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="relative w-full px-5 py-2.5 overflow-hidden font-medium text-indigo-600 bg-indigo-50 border border-gray-100 rounded-lg shadow-inner group"
              >
                <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-indigo-600 group-hover:w-full ease"></span>
                <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-indigo-600 group-hover:w-full ease"></span>
                <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-indigo-600 group-hover:h-full ease"></span>
                <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-indigo-600 group-hover:h-full ease"></span>
                <span className="absolute inset-0 w-full h-full duration-300 delay-300 bg-indigo-600 opacity-0 group-hover:opacity-100"></span>
                <span className="relative text-base font-semibold transition-colors duration-300 delay-200 group-hover:text-white ease">
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Puff height={10} width={10} />
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </span>
              </button>
            </Form>
          )}
        </Formik>

        <Link className="text-blue-500 " href={"/sign-up"}>
          Don`t have an account? Register Now!
        </Link>
      </div>
    </div>
  );
}
