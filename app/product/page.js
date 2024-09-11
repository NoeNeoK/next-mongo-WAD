"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

export default function Home() {
  const APIBASE = process.env.NEXT_PUBLIC_API_URL;
  const { register, handleSubmit } = useForm();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  async function fetchProducts() {
    const data = await fetch(`${APIBASE}/product`);
    const p = await data.json();
    setProducts(p);
  }

  async function fetchCategories() {
    const data = await fetch(`${APIBASE}/category`);
    const c = await data.json();
    setCategories(c);
  }

  const createProduct = (data) => {
    fetch(`${APIBASE}/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => fetchProducts());
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const columns = [
    { field: "code", headerName: "Code", width: 200 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "price", headerName: "Price", width: 100 },
    {
      field: "category",
      headerName: "Category",
      width: 200,
      valueGetter: (params) => {
        const category = categories.find((c) => c._id === params.value);
        return category ? category.name : "";
      },
    },
    {
      field: "link",
      headerName: "Link",
      width: 200,
      renderCell: (params) => (
        <Link href={`/product/${params.row._id}`} className="font-bold">
          {params.row.name}
        </Link>
      ),
    },
  ];

  return (
    <div className="flex flex-row gap-4">
      <div className="flex-1 w-64">
        <form onSubmit={handleSubmit(createProduct)}>
          <div className="grid grid-cols-2 gap-4 m-4 w-1/2">
            <div>Code:</div>
            <div>
              <TextField
                name="code"
                type="text"
                {...register("code", { required: true })}
                fullWidth
              />
            </div>
            <div>Name:</div>
            <div>
              <TextField
                name="name"
                type="text"
                {...register("name", { required: true })}
                fullWidth
              />
            </div>
            <div>Description:</div>
            <div>
              <TextField
                name="description"
                {...register("description", { required: true })}
                fullWidth
                multiline
                rows={4}
              />
            </div>
            <div>Price:</div>
            <div>
              <TextField
                name="price"
                type="number"
                {...register("price", { required: true })}
                fullWidth
              />
            </div>
            <div>Category:</div>
            <div>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  {...register("category", { required: true })}
                >
                  {categories.map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-span-2">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Add
              </Button>
            </div>
          </div>
        </form>
      </div>
      <div className="border m-4 bg-slate-300 flex-1 w-64">
        <h1 className="text-2xl">Products ({products.length})</h1>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={products}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row._id}
          />
        </div>
      </div>
    </div>
  );
}
