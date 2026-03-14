import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const Upload = ({ setLoader, notifySuccess, notifyError, setPdf }) => {
  const uploadToIPFS = async (file) => {
    if (file) {
      try {
        setLoader(true);
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          maxBodyLength: "Infinity",
          headers: {
           Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3NGQwZDUxMS1lMTg2LTQ3MzctYTgzNy0yNzYzY2JhMWI5ZmMiLCJlbWFpbCI6ImhhbnNpa2F2aXRobWEyNUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYTVlMmJjNzA1NGJkMGI4MWE2NDgiLCJzY29wZWRLZXlTZWNyZXQiOiI5YjAwOWU5YjEwMzAyMTQ1MWNkODljNDc1ZDU1YjE1Y2Q4ZDIwZTgyZDdmZTJjNzYyYmMzMDgxZWE0OTg5YzM4IiwiZXhwIjoxODA1MDA0NTgwfQ.qA6pA4jyLYT4_0SVd4CdGVvyf0rU0FGhFY3OiA8ToVs`,
            "Content-Type": "multipart/form-data",
          },
        });

        const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

        setPdf(url);
        setLoader(false);
        notifySuccess("PDF Document Uploaded Successfully");
      } catch (error) {
        setLoader(false);
        notifyError("Unable to upload PDF document to Pinata");
      }
    }
  };

  const onDrop = useCallback(async (acceptedFile) => {
    await uploadToIPFS(acceptedFile[0]);
  }, []);

  const {
    getInputProps,
    getRootProps,
    isDragAccept,
    isDragActive,
    isDragReject,
  } = useDropzone({ onDrop, maxSize: 500000000000 });
  return (
    <div {...getRootProps()} class="messageBox">
      <div class="fileUploadWrapper">
        <label for="file">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 337 337"
          >
            <circle
              stroke-width="20"
              stroke="#6c6c6c"
              fill="none"
              r="158.5"
              cy="168.5"
              cx="168.5"
            ></circle>
            <path
              stroke-linecap="round"
              stroke-width="25"
              stroke="#6c6c6c"
              d="M167.759 79V259"
            ></path>
            <path
              stroke-linecap="round"
              stroke-width="25"
              stroke="#6c6c6c"
              d="M79 167.138H259"
            ></path>
          </svg>
          <span class="tooltip">Upload PDF Document</span>
        </label>
        <input {...getInputProps()} type="file" id="file" name="file" />
      </div>
    </div>
  );
};

export default Upload;
