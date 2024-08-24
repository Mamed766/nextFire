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

  const handleProfileUpdate = async () => {
    if (!user) return;

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
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div>
      <div className="w-full p-5 flex items-center gap-2 justify-end bg-black text-white">
        <h2>Hello {userName}!</h2>
        <button
          onClick={() => setModalIsOpen(true)}
          className=" bg-gray-400 p-1 rounded text-[12px]"
        >
          Update Profile
        </button>

        <button
          onClick={() => {
            signOut(auth);
            sessionStorage.removeItem("user");
          }}
          className="bg-red-100 p-1 text-[12px] text-red-500 rounded"
        >
          Logout
        </button>

        <Modal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
          <h2 className="text-white text-2xl mb-5">Update Profile</h2>
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
        </Modal>
      </div>
      <div className="mt-5">
        <Table />
      </div>
    </div>
  );
};

export default Dashboard;
