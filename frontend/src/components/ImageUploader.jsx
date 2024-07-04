import { useContext } from "react";
import { useDropzone } from "react-dropzone";
import FileContext from "./FileContext";

export default function ImageUploader() {
    const { files, setFiles } = useContext(FileContext);
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

    return (
        <div {...getRootProps()} className="flex justify-center items-center gap-10 mb-8">
            {files
                ?
                <div className="w-[20rem] h-[20rem] bg-gray-400 rounded-lg overflow-hidden">
                    <img src={files.preview} alt="preview" className="w-full h-full object-cover" />
                </div>
                :
                <label className="flex flex-col justify-center items-center w-full h-64 border-2 border-gray-500 rounded-lg cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        {
                            isDragActive
                                ? <p className="text-black font-semibold">Drop Image Here</p>
                                : <p className="mb-2 text-sm text-black"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        }
                        <p className="text-xs text-black">PNG, JPG or JPEG (MAX. 800x400px)</p>
                    </div>
                </label>
            }

            <input {...getInputProps()} type="file" id="input-file" className="hidden" accept="image/*" />
        </div>
    );
}