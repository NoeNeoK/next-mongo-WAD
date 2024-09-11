"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";

export default function Home() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const [categoryList, setCategoryList] = useState([]);
  const [updateForm, setUpdateForm] = useState(false);
  const [idToBeUpdated, setIdToBeUpdated] = useState(null);
  const { register, handleSubmit, setValue, reset } = useForm();

  async function fetchCategory() {
    const data = await fetch(`${API_BASE}/category`);
    const c = await data.json();
    const c2 = c.map((category) => {
      return { id: category._id, ...category };
    });
    setCategoryList(c2);
  }

  function startEdit(category) {
    reset(category);
    setIdToBeUpdated(category.id);
    setUpdateForm(true);
  }

  async function deleteCategory(id) {
    await fetch(`${API_BASE}/category/${id}`, {
      method: "DELETE",
    }).then(() => fetchCategory());
  }

  useEffect(() => {
    fetchCategory();
  }, []);

  function createOrUpdateCategory(data) {
    if (updateForm) {
      data.id = idToBeUpdated;
      fetch(`${API_BASE}/category/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(() => {
        fetchCategory();
        reset();
        setUpdateForm(false);
      });
      return;
    }

    fetch(`${API_BASE}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      reset();
      fetchCategory();
    });
  }

  const columns = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "order", headerName: "Order", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => startEdit(params.row)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => deleteCategory(params.row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <main>
      <div className="border border-black w-[50%] m-4">
        <form onSubmit={handleSubmit(createOrUpdateCategory)}>
          <div className="grid grid-cols-2 gap-4 w-fit m-4">
            <div>Name:</div>
            <div>
              <input
                name="name"
                type="text"
                {...register("name", { required: true })}
                className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>

            <div>Order:</div>
            <div>
              <input
                name="order"
                type="number"
                {...register("order", { default: 0, required: true })}
                className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            <div className="col-span-2">
              <input
                type="submit"
                value={updateForm ? "Update" : "Add"}
                className={
                  "italic text-white font-bold py-2 px-4 rounded-full " +
                  (updateForm
                    ? " bg-blue-800 hover:bg-blue-700"
                    : " bg-green-800 hover:bg-green-700")
                }
              />
            </div>

            <div className="col-span-2">
              {updateForm && (
                <button
                  onClick={() => {
                    reset({ name: "", order: 0 });
                    setUpdateForm(false);
                  }}
                  className="italic bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
      <div>
        <DataGrid rows={categoryList} columns={columns} pageSize={5} />
      </div>
    </main>
  );
}
