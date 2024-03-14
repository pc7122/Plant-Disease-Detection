import axios from "axios"
import { createContext, useState } from "react"
import ImageUploader from "./components/ImageUploader"
import Result from "./components/Result";

function App() {
  const [files, setFiles] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const FileContext = createContext(null);

  const uploadImage = (e) => {
    e.preventDefault();
    setLoading(true);

    axios.post("https://plant-disease-detection-cf3z.onrender.com/predict", { file: files }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      console.log(response.data)
      setResult(response.data)
      setLoading(false)
    }).catch(error => {
      console.log(error)
      setResult(null)
      setLoading(false)
    });
  }


  return (
    <div className="h-screen flex justify-center items-center">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center">Potato Plant Disease</h1>
        </div>

        <FileContext.Provider value={{ files, setFiles }} >
          <div className="glass relative bg-white/60 rounded-lg w-[95%] md:w-3/ xl:w-1/2 p-4 mx-auto overflow-hidden">
            {loading &&
              <div className="absolute inset-0 bg-white flex flex-col justify-center items-center">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-500 border-x-transparent flex justify-center items-center animate-spin">
                  <div className="w-10 h-10 rounded-full border-4 border-sky-500 border-x-transparent animate-pulse" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mt-4 text-center">Sometimes it might take a minute to load up the server</p>
                </div>
              </div>
            }

            {result
              ? <Result context={FileContext} result={result} />
              : <ImageUploader context={FileContext} />
            }

            <div className="flex justify-center items-center mt-5 gap-5">
              {!result &&
                <button className="bg-emerald-500 text-white font-semibold py-2 px-6 rounded-md" onClick={(e) => uploadImage(e)}>Upload</button>
              }
              {files &&
                <button className="bg-red-500 text-white font-semibold py-2 px-6 rounded-md" onClick={() => { setFiles(null); setResult(null); }}>Reset</button>
              }
            </div>
          </div>
        </FileContext.Provider>

      </div>
    </div>
  )
}

export default App;
