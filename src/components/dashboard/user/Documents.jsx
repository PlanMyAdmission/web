"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import Delete from "@mui/icons-material/DeleteOutlined";
import { toast } from "react-toastify";

const Documents = () => {
  const { profileData, uploadDocument, currentUser, handleDocumentDelete } = useAuth();
  const [select, setSelect] = useState("");
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDocsChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      let sizeInMB = file.size / 1048576;
      if (sizeInMB > 5) {
        toast.warning("File size should be less than 5 MB", { autoClose: 1500 });
        return;
      } else {
        setLoading(true);
        setDocument(file);
      }
    }
  };

  const handelDocumentSubmit = (e) => {
    e.preventDefault();
    const alreadyExists = profileData?.documents?.some((doc) => doc.title === select);
    if (alreadyExists) {
      toast.warning("Document already exists. Please delete the existing one first.", { autoClose: 1500 });
      return;
    }
    uploadDocument(document, select, currentUser);
    setLoading(false);
  };

  return (
    <div className="p-6 sm:p-10 my-10 rounded-md mb-20 bg-white shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Uploaded Documents</h2>

      <div className="overflow-x-auto max-w-5xl mx-auto mb-10 border border-gray-200 rounded-md">
        <table className="min-w-full text-sm text-center">
          <thead className="bg-main text-white">
            <tr>
              <th className="p-2">Document Type</th>
              <th className="p-2">File</th>
              <th className="p-2">Last Updated</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {profileData?.documents?.map((doc, index) => (
              <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="p-2">{doc.title}</td>
                <td className="p-2">
                  <a href={doc.url} target="_blank" className="text-blue-600 underline">
                    View
                  </a>
                </td>
                <td className="p-2">{doc.date}</td>
                <td className="p-2">
                  <button onClick={() => handleDocumentDelete(doc.id, "documents")}>
                    <Delete style={{ color: "red" }} className="cursor-pointer" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-gray-600 max-w-5xl mx-auto mb-4">
        <strong>Note:</strong> Please upload a clear scanned copy of your original documents. Accepted formats are PDF,
        DOC, DOCX, PNG, JPEG, JPG only. Max file size: 5MB.
      </p>

      <form onSubmit={handelDocumentSubmit} className="max-w-5xl mx-auto space-y-6 bg-gray-50 p-6 rounded-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-1">
              Document Type
            </label>
            <select
              value={select}
              onChange={(e) => setSelect(e.target.value)}
              id="document"
              name="document"
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:ring-main focus:border-main"
            >
              <option value="">Select Document Type</option>
              <option>Resume</option>
              <option>Passport</option>
              <option>Adhaar</option>
              <option>Letter Of Recommandation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
            <input
              type="file"
              onChange={handleDocsChange}
              className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-main file:text-white hover:file:bg-blue-700"
            />
          </div>
        </div>

        <div className="flex justify-start gap-4 pt-4">
          <button
            type="submit"
            className={`px-6 py-2 rounded-md text-sm border-2 ${loading
              ? "bg-main text-white border-main hover:bg-blue-700"
              : "bg-gray-200 text-gray-600 border-gray-300 cursor-not-allowed"
              }`}
            disabled={!loading}
          >
            Upload
          </button>
          <button
            type="reset"
            onClick={() => {
              setLoading(false);
              setSelect("");
              setDocument(null);
            }}
            className="px-6 py-2 text-sm border-2 border-main text-main rounded-md hover:bg-main hover:text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Documents;
