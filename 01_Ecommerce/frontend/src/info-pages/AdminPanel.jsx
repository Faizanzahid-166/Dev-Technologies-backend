import { useEffect, useState } from "react";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/urls.js";

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: null
  });
  const [editId, setEditId] = useState(null);

  // Fetch products
const [page, setPage] = useState(1);
const [pages, setPages] = useState(1);
const fetchProducts = async (pageNum = 1) => {
  try {
    const data = await getAllProducts({ page: pageNum, limit: 15 }); // ✅ send query params
    setProducts(data.products || []);
    setPages(data.pages || 1);
  } catch (error) {
    console.error("Error fetching products", error);
  }
};

useEffect(() => {
  fetchProducts(page);
}, [page]);

  // Handle text/number/category changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  // Submit add/update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("description", form.description);
    if (form.image) formData.append("image", form.image);

    try {
      if (editId) {
        await updateProduct(editId, formData, true); // true = multipart
        alert("Product updated!");
      } else {
        await createProduct(formData, true);
        alert("Product added!");
      }
      setForm({ name: "", price: "", category: "", description: "", image: null });
      setEditId(null);
      fetchProducts();
    } catch (err) {
      console.error("Error saving product", err);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      category: product.category || "",
      description: product.description || "",
      image: null // user must re-upload if changing
    });
    setEditId(product._id);
  };

  // Delete product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Product Management</h1>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="mb-8 grid gap-4 w-full max-w-lg">
        <h2 className="font-bold">{editId ? "Edit Product" : "Add Product"}</h2>
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="p-2 border rounded"
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="p-2 border rounded"
        />
        <input
          name="category"
          type="text"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="p-2 border rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-2 border rounded"
        />
        <input
          type="file"
          name="image"
          onChange={handleImageChange}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Product List */}
      <table className="border-collapse border w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2 text-center">{p.price}</td>
              <td className="border p-2 text-center">{p.category}</td>
              <td className="border p-2 text-center">
                <img
                  src={p.image}
                  alt={p.name}
                  width={100}
                  height={100}
                  style={{ objectFit: "cover" }}
                />
              </td>
              <td className="border p-2 text-center">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded m-1"
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "10px" }}>
       <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="p-2 bg-lime-500 font-bold text-white rounded-lg hover:bg-green-600">Prev</button>
        <span> Page {page} of {pages} </span>
       <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="p-2 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-800">Next</button>
      </div>

    </div>
  );
}
