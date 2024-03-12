import axios from "axios"
import { useState } from "react"
import { useDropzone } from "react-dropzone"

function App() {
  const [files, setFiles] = useState(null)
  const [result, setResult] = useState(null)


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/png": ['.png'],
      "image/jpg": ['.jpg', '.jpeg'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        console.log(acceptedFiles[0])

        setFiles(
          Object.assign(acceptedFiles[0], {
            preview: URL.createObjectURL(acceptedFiles[0])
          })
        )
      }
    }
  });


  const uploadImage = (e) => {
    e.preventDefault();

    axios.post("https://plant-disease-detection-cf3z.onrender.com/predict", { file: files }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      console.log(response.data)
      setResult(response.data)
    }).catch(error => {
      console.log(error)
      setResult(null)
    });
  }

  const RenderResult = () => {
    return (
      <>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <div className="w-[20rem] h-[20rem] bg-gray-400 rounded-lg overflow-hidden">
            <img src={files.preview} alt="preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-grow flex-row md:flex-col justify-center items-start gap-10">
            <div>
              <p className="text-lg font-semibold">Predicted Disease</p>
              <p className={`text-2xl font-bold ${result.label == 'Healthy' ? 'text-emerald-500' : 'text-red-500'}`}>
                {result.label}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold">Confidence</p>
              <p className="text-2xl font-bold text-blue-700">
                {Number(result.confidence * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center">Potato Plant Disease</h1>
        </div>
        <div className="bg-white rounded-lg p-5 w-[90%] md:w-1/2 mx-auto mt-8">
          {result
            ? <RenderResult />
            : <div {...getRootProps()} className="w-full flex justify-center items-center gap-10 mb-8">
              {
                files
                  ? <div className="w-[20rem] h-[20rem] bg-gray-400 rounded-lg overflow-hidden">
                    <img src={files.preview} alt="preview" className="w-full h-full object-cover" />
                  </div>
                  : <label className="flex flex-col justify-center items-center w-full h-64 border-2 border-gray-400 rounded-lg cursor-pointer bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                      </svg>
                      {
                        isDragActive
                          ? <p className="text-gray-700 font-semibold">Drop Image Here</p>
                          : <p className="mb-2 text-sm text-gray-700"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      }
                      <p className="text-xs text-gray-700">PNG, JPG or JPEG (MAX. 800x400px)</p>
                    </div>
                  </label>
              }

              <input {...getInputProps()} type="file" id="input-file" className="hidden" accept="image/*" />
            </div>
          }
          <div className="w-full flex justify-center items-center mt-5">
            {!result && <button className="bg-emerald-500 text-gray-950 font-semibold py-2 px-6 rounded-md" onClick={(e) => uploadImage(e)}>Upload</button>}
            {files && <button className="bg-red-500 text-gray-950 font-semibold py-2 px-6 rounded-md ml-4" onClick={() => { setFiles(null); setResult(null); }}>Reset</button>}
          </div>

        </div>
      </div>
    </div>
  )
}

export default App;
