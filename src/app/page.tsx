"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  // Database se saaman mangwane ke liye
  async function fetchInventory() {
    const { data, error } = await supabase.from("inventory").select("*");
    if (error) console.error("Error fetching:", error);
    if (data) setItems(data);
  }

  useEffect(() => { fetchInventory(); }, []);

  // Naya item add karne ke liye
  async function addItem() {
    if (!name || !price) return alert("Bhai, naam aur price toh dalo!");
    const { error } = await supabase
      .from("inventory")
      .insert([{ name, rent_price: parseFloat(price), status: "available" }]);
    
    if (error) {
      alert("Database error: " + error.message);
    } else {
      setName(""); setPrice(""); fetchInventory();
    }
  }

  return (
    <div className="p-10 bg-white min-h-screen text-black">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">👔 VastraWise Inventory</h1>
      
      <div className="flex gap-4 mb-10 bg-gray-100 p-6 rounded-lg shadow-inner">
        <input 
          placeholder="Item Name (e.g. Blue Sherwani)" 
          className="border p-3 rounded flex-1"
          value={name} onChange={(e) => setName(e.target.value)}
        />
        <input 
          placeholder="Rent Price" 
          type="number"
          className="border p-3 rounded w-32"
          value={price} onChange={(e) => setPrice(e.target.value)}
        />
        <button onClick={addItem} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.length === 0 ? <p className="text-gray-400">Abhi koi saaman nahi hai bhai...</p> : 
          items.map((item) => (
            <div key={item.id} className="border-2 border-blue-50 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
              <h2 className="text-xl font-bold">{item.name}</h2>
              <p className="text-gray-500 font-semibold">Rent: ₹{item.rent_price}/day</p>
              <div className="mt-3 inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                {item.status}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}