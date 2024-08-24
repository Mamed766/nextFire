"use client";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { signOut } from "firebase/auth";
import Modal from "../_components/Modal";
import Table from "../_components/table";
const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [password, setPassword] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [user] = useAuthState(auth);
  const router = useRouter();
  const userSession = sessionStorage.getItem("user");
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || "User");
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user && !userSession) {
    router.push("/");
  }

  const handleProfileUpdate = async (e: any) => {
    if (!user) return;

    e.preventDefault();

    const email = user.email;

    if (!email) {
      console.error("User email is null, cannot reauthenticate.");
      return;
    }

    const credential = EmailAuthProvider.credential(email, password);

    try {
      await reauthenticateWithCredential(user, credential);

      await updateProfile(user, {
        displayName: newUsername,
      });

      setUserName(newUsername);
      setModalIsOpen(false);

      setNewUsername("");
      setPassword("");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div>
      <div className="w-full p-5 flex items-center gap-2 justify-end bg-black text-white">
        <h2 className="">Hello {userName ? userName : "User"}!</h2>
        <button
          onClick={() => setModalIsOpen(true)}
          className=" text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Update Profile
        </button>

        <button
          onClick={() => {
            signOut(auth);
            sessionStorage.removeItem("user");
          }}
          className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Logout
        </button>

        <Modal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
          <h2 className="text-white text-2xl mb-5">Update Profile</h2>
          <form onSubmit={handleProfileUpdate}>
            <input
              type="text"
              placeholder="New Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
            />
            <input
              type="password"
              placeholder="Current Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
            />
            <button
              onClick={handleProfileUpdate}
              className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
            >
              Save Changes
            </button>
            <button
              onClick={() => setModalIsOpen(false)}
              className="w-full mt-2 p-3 bg-red-500 rounded text-white hover:bg-red-400"
            >
              Cancel
            </button>
          </form>
        </Modal>
      </div>
      <div className="mt-5">
        <Table />
      </div>
    </div>
  );
};

export default Dashboard;
