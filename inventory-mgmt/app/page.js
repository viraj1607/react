"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("All");

  useEffect(()=>{
    getAllData()
  },[])

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleAddClick = () => {
    if (
      productName.trim() &&
      quantity.trim() &&
      price.trim() &&
      !isNaN(quantity) &&
      !isNaN(price)
    ) {
      setInventory([
        ...inventory,
        { name: productName, quantity: Number(quantity), price: Number(price) },
      ]);
      setProductName("");
      setQuantity("");
      setPrice("");
    } else {
      alert("Please enter valid product details.");
    }
  };

  const handleDeleteClick = (index) => {
    const updatedInventory = [...inventory];
    updatedInventory.splice(index, 1);
    setInventory(updatedInventory);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  const filteredInventory = inventory.filter((item) => {
    if (searchBy === "All" || !searchTerm.trim()) {
      return true;
    }
    switch (searchBy) {
      case "Name":
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
      case "Quantity":
        return item.quantity.toString().includes(searchTerm);
      case "Price":
        return item.price.toString().includes(searchTerm);
      default:
        return true;
    }
  });

  const getAllData = async () => {
    try {
      const response = await fetch("/api/product", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products.");
      }

      const data = await response.json();
      console.log("Fetched data:", data.products);
      setInventory(data.products); // Set the state with the fetched products
    } catch (error) {
      console.log(`Error fetching data: ${error.message}`);
    }
  };

  // Function to send data to MongoDB
  const handleSendToMongoDB = async () => {
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productName, quantity: parseInt(quantity), price: parseFloat(price) }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(`Success: ${data.message}`);
        getAllData()
      } else {
        console.log(`Error: ${data.message}`);
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Current Inventory</h1>

        {/* Form to Add Inventory */}
        <div className="flex flex-col sm:flex-row items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={handleProductNameChange}
            className="p-2 w-full sm:w-1/4 rounded-md border border-gray-300 focus:outline-none focus:border-blue-600"
          />
          <input
            type="text"
            placeholder="Quantity"
            value={quantity}
            onChange={handleQuantityChange}
            className="p-2 w-full sm:w-1/4 rounded-md border border-gray-300 focus:outline-none focus:border-blue-600"
          />
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={handlePriceChange}
            className="p-2 w-full sm:w-1/4 rounded-md border border-gray-300 focus:outline-none focus:border-blue-600"
          />
          <button
            onClick={handleAddClick}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
          >
            Add
          </button>
        </div>

        {/* Button to send inventory to MongoDB */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSendToMongoDB}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded transition duration-200"
          >
            Send to MongoDB
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row items-center mb-6 mt-4 space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="p-3 w-full sm:w-2/3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
          <select
            value={searchBy}
            onChange={handleSearchByChange}
            className="p-3 w-full sm:w-1/3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          >
            <option value="All">All</option>
            <option value="Name">Name</option>
            <option value="Quantity">Quantity</option>
            <option value="Price">Price</option>
          </select>
        </div>

        {/* Display Inventory in a Table */}
        {filteredInventory.length > 0 ? (
          <table className="w-full bg-white rounded shadow-md text-left overflow-hidden">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Price</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-100 transition duration-200"
                >
                  <td className="p-3">{item.productName}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">${item.price.toFixed(2)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDeleteClick(index)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded transition duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No products found.</p>
        )}
      </div>
    </>
  );
}
