import { useContext } from "react";

export default function Result({ context, result }) {
    const { files } = useContext(context);

    return (
        <div className="flex flex-col lg:flex-row justify-center items-center gap-10">
            <div className="w-[20rem] h-[20rem] bg-gray-400 rounded-lg overflow-hidden">
                <img src={files.preview} alt="preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-grow flex-row lg:flex-col justify-center items-start gap-10">
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
    );
}