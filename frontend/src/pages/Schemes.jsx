// import React, { useState, useEffect } from 'react'
// import API from '../api'

// export default function Schemes(){
//   const [schemes, setSchemes] = useState([])

//   useEffect(()=>{ fetchSchemes() }, [])

//   async function fetchSchemes(){
//     try {
//       const resp = await API.get('/utils/schemes')
//         console.log('Schemes fetched:', resp.data)
//       setSchemes(resp.data.schemes || [])
//     } catch(err){
//       console.error(err)
//       alert('Failed to fetch schemes')
//     }
//   }

//   return (
//     <div className="bg-white p-6 rounded shadow">
//       <h2 className="text-xl font-semibold">Government Schemes</h2>
//       <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//   {schemes.map(s => (
//     <a
//       key={s.id}
//       href={s.link}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="p-4 border rounded-lg hover:shadow-lg transition hover:bg-gray-50"
//     >
//       <h3 className="font-bold text-lg">{s.title}</h3>
//       <p className="text-sm text-gray-600 mt-1">{s.description}</p>
//       <p className="text-xs text-gray-500 mt-2">Regions: {s.states?.join(', ')}</p>
//       <p className="text-blue-600 text-sm mt-2 underline">Visit Site</p>
//     </a>
//   ))}

//   {schemes.length === 0 && (
//     <div className="text-gray-500 col-span-full">
//       No schemes available (mock data shown by backend).
//     </div>
//   )}
// </div>

//     </div>
//   )
// }



import React, { useState, useEffect } from 'react'
import API from '../api'
import { Loader2, ExternalLink } from 'lucide-react'

export default function Schemes() {
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchemes()
  }, [])

  async function fetchSchemes() {
    try {
      const resp = await API.get('/utils/schemes')
      console.log('Schemes fetched:', resp.data)
      setSchemes(resp.data.schemes || [])
    } catch (err) {
      console.error(err)
      alert('Failed to fetch schemes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-md border border-green-100">
      <h2 className="text-2xl font-bold text-green-800 flex items-center gap-2">
        🌾 Government Schemes
      </h2>
      <p className="text-gray-600 mt-2 text-sm">
        Explore the latest government initiatives and subsidies available for farmers.
      </p>

      {loading ? (
        <div className="flex justify-center items-center py-12 text-green-700">
          <Loader2 className="animate-spin mr-2" size={22} />
          Fetching schemes...
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.length > 0 ? (
            schemes.map((s) => (
              <a
                key={s.id}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-green-200 transition-all duration-300"
              >
                <h3 className="font-semibold text-lg text-green-800 group-hover:text-green-700">
                  {s.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                  {s.description || 'No description available.'}
                </p>
                <p className="text-xs text-gray-500 mt-3">
                  <span className="font-medium text-gray-700">Regions:</span>{' '}
                  {s.states?.length ? s.states.join(', ') : 'All India'}
                </p>
                <div className="flex items-center gap-1 text-green-600 text-sm mt-4 font-medium group-hover:underline">
                  Visit Site <ExternalLink size={16} />
                </div>
              </a>
            ))
          ) : (
            <div className="text-gray-500 col-span-full text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
              No schemes available (mock data shown by backend).
            </div>
          )}
        </div>
      )}
    </div>
  )
}
