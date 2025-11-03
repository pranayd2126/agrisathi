//original 1
// import React, { useEffect, useState } from 'react'
// import API from '../api'

// export default function Marketplace(){
//   const [items, setItems] = useState([])
//   const [loading, setLoading] = useState(false)

//   useEffect(()=>{ fetchItems() }, [])

//   async function fetchItems(){
//     setLoading(true)
//     try {
//       const resp = await API.get('/marketplace/list')
//       setItems(resp.data)
//     } catch(err){
//       console.error(err)
//     } finally { setLoading(false) }
//   }

//   return (
//     <div className="bg-white p-6 rounded shadow">
//       <h2 className="text-xl font-semibold">Marketplace</h2>
//       <p className="text-sm text-gray-600 mt-1">Browse farmer listings</p>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//         {loading && <div>Loading...</div>}
//         {!loading && items.length === 0 && <div>No listings yet.</div>}
//         {items.map(item => (
//           <div key={item._id} className="border rounded p-3 bg-gray-50">
//             {item.image && <img src={item.image} alt="" className="w-full h-40 object-cover rounded" />}
//             <h3 className="font-bold mt-2">{item.crop}</h3>
//             <p>Qty: {item.qty}</p>
//             <p>Price: ₹{item.price}</p>
//             <div className="mt-2">
//               <button className="px-3 py-1 bg-blue-600 text-white rounded">Buy</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }


import React, { useEffect, useState } from 'react'

// You no longer need to import API if you're using hardcoded data
// import API from '../api' 

// --- Hardcoded Data ---
const dummyItems = [
  {
    _id: 'l001',
    crop: 'Organic Wheat Grain',
    qty: '500 kg',
    price: 35000,
    // Using a more stable image link for demonstration
    image:  "../images/wheet.jpg"
  },
  {
    _id: 'l002',
    crop: 'Fresh Tomatoes',
    qty: '150 kg',
    price: 9000,
    image: "../images/tomatoes.webp"
  },
  {
    _id: 'l003',
    crop: 'Basmati Rice (New Crop)',
    qty: '1000 kg',
    price: 65000,
    image: "../images/rice.jpeg"
  },
  {
    _id: 'l004',
    crop: 'Potatoes (A-Grade)',
    qty: '250 kg',
    price: 4500,
    image: "../images/potatos.jpeg"
  },
  {
    _id: 'l005',
    crop: 'Fresh Bananas (G9)',
    qty: '200 dozen',
    price: 8000,
    image: "../images/banana.jpeg"
  },
  {
    _id: 'l006',
    crop: 'Green Chillies',
    qty: '75 kg',
    price: 5250,
    image: "../images/chillis.jpeg"
  },
  {
    _id: 'l007',
    crop: 'Pure Cotton Bales',
    qty: '10 Bales',
    price: 120000,
    image: "../images/cotton.jpg"
  }
];
// ------------------------------

// Function to handle the redirect to Google Shopping
const handleBuyClick = (cropName) => {
    // URL encodes the crop name to make it safe for a URL query
    const encodedQuery = encodeURIComponent(`${cropName} for sale`);
    
    // Creates the Google search URL and opens it in a new tab
    window.open(`https://www.google.com/search?q=${encodedQuery}&tbm=shop`, '_blank');
};


export default function Marketplace(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchItems() }, [])

  async function fetchItems(){
    setLoading(true)
    
    // Simulate an API delay of 1 second
    await new Promise(resolve => setTimeout(resolve, 1000)) 
    
    try {
      // Using hardcoded data
      setItems(dummyItems) 

    } catch(err){
      console.error(err)
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <div className="bg-white p-10 rounded shadow">
      <h2 className="text-xl font-semibold">Marketplace</h2>
      <p className="text-sm text-gray-600 mt-1">Browse farmer listings</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {loading && <div className="col-span-full text-center py-8 text-blue-600 font-medium">Loading listings...</div>}
        
        {!loading && items.length === 0 && <div className="col-span-full text-center py-8 text-gray-500">No listings yet.</div>}
        
        {!loading && items.map(item => (
          <div key={item._id} className="border rounded p-3 bg-gray-50 flex flex-col">
            
            {/* 🎯 Image is now wrapped in a button-like element for the click functionality */}
            <button 
              onClick={() => handleBuyClick(item.crop)} 
              className="w-full h-40 mb-2 overflow-hidden rounded cursor-pointer hover:opacity-90 transition-opacity"
            >
              {item.image && <img src={item.image} alt={`Image of ${item.crop}`} className="w-full h-full object-cover" />}
            </button>
            
            <h3 className="font-bold mt-2 text-lg text-green-700">{item.crop}</h3>
            <p className="text-sm text-gray-700">Quantity: <span className="font-semibold">{item.qty}</span></p>
            <p className="text-sm text-gray-700">Price: <span className="font-semibold text-red-600">₹{item.price.toLocaleString('en-IN')}</span></p>
            
            <div className="mt-4 pt-2 border-t">
              {/* 🎯 Buy button now calls the redirect function */}
              <button 
                onClick={() => handleBuyClick(item.crop)} 
                className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-150 ease-in-out font-medium"
              >
                Find & Buy on Google
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}