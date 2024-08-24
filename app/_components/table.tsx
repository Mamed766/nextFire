"use client";
import React, { useEffect, useState } from "react";
import { useRequest } from "../_services/http/axiosFetcher";
import PostModal from "./PostModal";

const Table = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  const { data, isLoading, error } = useRequest("data", {
    method: "GET",
    module: "datasApi",
  });

  const handleEdit = (todo: any) => {
    setEditData(todo);
    setIsEdit(true);
    setIsPostModalOpen(true);
  };

  const handleAddNew = () => {
    setEditData(null);
    setIsEdit(false);
    setIsPostModalOpen(true);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <button
        onClick={handleAddNew}
        className="mb-5 ml-2 bg-blue-500 p-2 rounded-md text-white"
      >
        Add New
      </button>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Product name
            </th>
            <th scope="col" className="px-6 py-3">
              id
            </th>
            <th scope="col" className="px-6 py-3">
              userid
            </th>

            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((todo: any, index: number) => {
              return (
                <tr
                  key={index}
                  className="odd:bg-white  even:bg-gray-50  border-b "
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    {todo?.productName}
                  </th>
                  <td className="px-6 py-4">{todo.id}</td>
                  <td className="px-6 py-4">{todo.userId}</td>
                  <td className=" flex gap-2  py-4">
                    <button className="font-medium text-blue-600 hover:underline">
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(todo)}
                      className="font-medium text-yellow-600  hover:underline"
                    >
                      Edit
                    </button>
                    <button className="font-medium text-red-600  hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {isPostModalOpen && (
        <PostModal
          onClose={() => setIsPostModalOpen(false)}
          isEdit={isEdit}
          initialData={editData}
          todo={editData}
        />
      )}
    </div>
  );
};

export default Table;
