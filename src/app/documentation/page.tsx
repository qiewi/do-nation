"use client";

import { useState } from "react";

interface Aksi {
  id: number;
  deskripsi: string;
}

interface UserAksi {
  id: number;
  aksiId: number;
  fotoDokumentasi: File | null;
  deskripsi: string;
  verified: boolean;
}

const DummyCampaignAksi: Aksi[] = [
  { id: 1, deskripsi: "Bantu distribusi sembako"},
  { id: 2, deskripsi: "Bangun rumah sementara" },
  { id: 3, deskripsi: "Penyediaan air bersih" },
  { id: 4, deskripsi: "Perbaikan jalan desa" },
];

const DocumentationPage: React.FC = () => {
  const [currentAksiIndex, setCurrentAksiIndex] = useState(0);
  const [userAksiData, setUserAksiData] = useState<UserAksi[]>([]);
  const [imageInput, setImageInput] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");

  const currentAksi = DummyCampaignAksi[currentAksiIndex];

  // Fungsi untuk memuat data submisi jika ada
  const loadExistingData = () => {
    const existingData = userAksiData.find((aksi) => aksi.aksiId === currentAksi.id);
    if (existingData) {
      setImageInput(existingData.fotoDokumentasi);
      setTextInput(existingData.deskripsi);
    } else {
      setImageInput(null);
      setTextInput("");
    }
  };

  // Menavigasi ke aksi sebelumnya atau selanjutnya
  const handleNavigation = (direction: "next" | "prev") => {
    setCurrentAksiIndex((prev) => {
      const newIndex = direction === "next" ? prev + 1 : prev - 1;
      if (newIndex >= 0 && newIndex < DummyCampaignAksi.length) {
        return newIndex;
      }
      return prev;
    });
    setTimeout(loadExistingData, 0);
  };

  const handleSubmit = () => {
    const newSubmission: UserAksi = {
      id: Date.now(),
      aksiId: currentAksi.id,
      fotoDokumentasi: imageInput,
      deskripsi: textInput,
      verified: true,
    };

    setUserAksiData((prev) => {
      const updatedData = prev.filter((item) => item.aksiId !== currentAksi.id);
      return [...updatedData, newSubmission];
    });

    alert(`Aksi "${currentAksi.deskripsi}" berhasil disubmit!`);

    // Reset input
    setImageInput(null);
    setTextInput("");
  };

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => window.history.back()} className="text-blue-500 hover:underline">
          ← Kembali
        </button>
        <h1 className="text-2xl font-bold">{`Aksi ${currentAksi.id}`}</h1>
        <span className="text-gray-500">Unity Foundation</span>
      </div>

      {/* Navigasi Antar Aksi */}
      <div className="flex justify-center space-x-2 mb-8">
        {DummyCampaignAksi.map((aksi, index) => (
          <button
            key={aksi.id}
            onClick={() => {
              setCurrentAksiIndex(index);
              loadExistingData();
            }}
            className={`w-10 h-10 rounded-full ${
              index === currentAksiIndex ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
            }`}
          >
            {aksi.id}
          </button>
        ))}
      </div>

      {/* Detail Aksi */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-1">{`Aksi ${currentAksi.id}`}</h2>
        <p className="text-gray-500">{currentAksi.deskripsi}</p>
      </div>

      {/* Input Section */}
      <div>
        <h3 className="text-md font-semibold mb-4">Submisi Aksi</h3>
        <div className="flex items-center mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && setImageInput(e.target.files[0])}
            className="border p-2 rounded-md"
          />
          {imageInput && (
            <img
              src={URL.createObjectURL(imageInput)}
              alt="Preview"
              className="w-20 h-20 object-cover ml-4 rounded-md"
            />
          )}
        </div>
        <textarea
          rows={4}
          placeholder="Deskripsi Aksi"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="w-full border p-2 rounded-md"
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="text-center mt-8">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold transition duration-300"
        >
          Submit Aksi
        </button>
      </div>

      {/* Navigasi */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => handleNavigation("prev")}
          className={`text-blue-500 hover:underline ${currentAksiIndex === 0 && "invisible"}`}
        >
          ← Sebelumnya
        </button>
        <button
          onClick={() => handleNavigation("next")}
          className={`text-blue-500 hover:underline ${
            currentAksiIndex === DummyCampaignAksi.length - 1 && "invisible"
          }`}
        >
          Selanjutnya →
        </button>
      </div>
    </div>
  );
};

export default DocumentationPage;
