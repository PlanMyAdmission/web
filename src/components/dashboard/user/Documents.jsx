import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import Delete from "@mui/icons-material/DeleteOutlined";
import { toast } from "react-toastify";

const Documents = () => {
  const { profileData, uploadDocument, currentUser, handelDocumentDelete } =
    useAuth();
  const [select, setSelect] = useState();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDocsChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      let sizeOfFile = e.target.files[0].size;
      let v = sizeOfFile / 1048576;
      console.log("size of file " + v + "mb");
      if (v > 5) {
        toast.warning("File size should be less then 5 Mb", {
          className: "foo-bar",
          autoClose: 1500
        });
        return;
      } else {
        setLoading(true);
        setDocument(file);
      }
    }
  };

  useEffect(() => {
    console.log(select)
  }, [select])

  const handelDocumentSubmit = () => {
    let isInArray =
      profileData?.documents?.find(function (el) {
        return el.title === select;
      }) !== undefined;
    console.log(isInArray);
    if (!isInArray) {
      console.log("uploading.....");
      uploadDocument(document, select, currentUser);
      setLoading(false);
    } else {
      toast.warning("Document already exists please delete first one", {
        className: "foo-bar",
        autoClose: 1500
      });
      return;
    }
  };

  const label_style = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className=" p-4 my-10 rounded-md mb-20 pb-32">
      <table className="divide-y divide-main  w-full mt-5 border border-solid border-gray-300 max-w-5xl mx-auto">
        <thead>
          <tr className="">
            <th className="p-1">Document Type</th>
            <th className="p-1">File Name</th>
            <th className="p-1">Last Updated</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {profileData?.documents?.map((value, index) => {
            return (
              <tr key={index}>
                <td>{value.title}</td>
                <td>
                  {
                    <a href={value.url} target="_blank">
                      view
                    </a>
                  }
                </td>
                <td>{value.date}</td>
                <td>
                  <button
                    className="font-bold"
                    onClick={() => handelDocumentDelete(value.id, "documents")}
                  // onClick={showMenu}
                  >
                    <Delete
                      style={{ color: "red" }}
                      className="cursor-pointer"
                    />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="max-w-5xl mx-auto">
        <p className="w-full sm:w-1/2 mt-5 mb-5 text-sm">
          <b>Note :</b>Please upload a clear scanned copy of your original
          documents. Accepted formats are PDF, DOC, DOCX, PNG, JPEG and JPG only.
          Max file size ~5MB
        </p>
      </div>

      <div>

        <form className="max-w-5xl mx-auto">
          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            <label for="document" className={label_style}>
              Document Type
            </label>
            <div className="flex">
              <select
                value={select}
                onChange={(e) => {
                  setSelect(e.target.value);
                  // if (e.target.value == "") {
                  //   setLoading(false)
                  // }
                }
                }
                id="document"
                name="document"
                className="mt-1 block w-1/4 rounded-sm outline-none bg-light py-1.5 px-3"
              >
                <option value="" default>
                  select Docs type
                </option>
                <option>Resume</option>
                <option>Passport</option>
                <option>Adhaar</option>
                <option>Letter Of Recommandation</option>
              </select>

              <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                {/* <input
                className="form-control px-2 py-2 mx-2"
                type="file"
                id="formFile"
                onChange={handleDocsChange}
              /> */}
                <label class="block">
                  <span class="sr-only">Choose File</span>
                  <input
                    type="file"
                    onChange={handleDocsChange}
                    className="block w-full text-sm text-gray-500 file:ml-4 file:py-2 file:px-4 file:outline-none file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-light file:text-pink-500 hover:file:bg-pink-100"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <button
              type="submit"
              className={`${loading
                ? `cursor-pointer bg-main text-white`
                : `cursor-not-allowed text-black`
                } px-8 py-1  mr-2 rounded-md  border-2 border-main `}
              onClick={handelDocumentSubmit}
              disabled={!loading}
            >
              Upload
            </button>
            <button
              type="reset"
              className="px-8 py-1 hover:bg-main mr-2 rounded-md hover:text-white border-2 border-main"
              onClick={() => setLoading(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div >
    </div >
  );
};

export default Documents;
