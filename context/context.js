import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";

//INTERNAL  IMPORT
import {
  handleNetworkSwitch,
  checkIfWalletIsConnected,
  connectWallet,
  VOTING_CONTRACT,
  OWNER_ADDRESS,
} from "./constants";

export const VOTING_DAPP_CONTEXT = React.createContext();

export const VOTER_DAPP_PROVIDER = ({ children }) => {
  const VOTING_DAPP = "Voting Dapp";
  const currency = "MATIC";
  const network = "Polygon";

  const [loader, setLoader] = useState(false);
  const [address, setAddress] = useState();
  const [checkVote, setCheckVote] = useState(false);

  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  const REGISTER_CANDIDATE = async (updateCandidate, image, pdf) => {
    const {
      _name,
      _nominationForm,
      _affidavit,
      _criminalAntecedents,
      _assetsAndLiabilities,
      _educationalQualifications,
      _electoralRollEntry,
      _securityDeposit,
      _partyAffiliation,
      _oathOrAffirmation,
      _photographs,
      _proofOfAge,
      _proofOfAddress,
      _panCardDetails,
      _voterIdCardDetails,
    } = updateCandidate;

    if (
      !_name ||
      !_nominationForm ||
      !_affidavit ||
      !_criminalAntecedents ||
      !_assetsAndLiabilities ||
      !_educationalQualifications ||
      !_electoralRollEntry ||
      !_securityDeposit ||
      !_partyAffiliation ||
      !_oathOrAffirmation ||
      !_photographs ||
      !_proofOfAge ||
      !_proofOfAddress ||
      !_panCardDetails ||
      !_voterIdCardDetails ||
      !image ||
      !pdf
    )
      return notifyError("Data Is Missing");
    notifySuccess("Registering Candidate, kindly wait...");
    setLoader(true);

    const CONTRACT = await VOTING_CONTRACT();

    const data = JSON.stringify({
      _name,
      _nominationForm,
      _affidavit,
      _criminalAntecedents,
      _assetsAndLiabilities,
      _educationalQualifications,
      _electoralRollEntry,
      _securityDeposit,
      _partyAffiliation,
      _oathOrAffirmation,
      _photographs,
      _proofOfAge,
      _proofOfAddress,
      _panCardDetails,
      _voterIdCardDetails,
      image,
      pdf,
    });

    try {
      const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: `12334e89c69a413613e0`,
          pinata_secret_api_key: `02779bdb49f3443d4501cf68c761b966fddbbe41f44a0905f674b8b558acb873`,
          "Content-Type": "application/json",
        },
      });

      const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log(url);

      const transaction = await CONTRACT.registerCandidate(_name, url);

      await transaction.wait();

      notifySuccess("Successfully Registered Candidate");
      setLoader(false);
      window.location.href = "/register-candidate";
    } catch (error) {
      setLoader(false);
      notifySuccess(
        "Registration failed, kindly connect to ellection commission"
      );
      console.log(error);
    }
  };

  const REGISTER_VOTER = async (updateVoter, image, pdf) => {
    const {
      _name,
      _voterAddress,
      _photograph,
      _parentOrSpouseName,
      _gender,
      _dobOrAge,
      _addressDetails,
      _epicNumber,
      _partNumberAndName,
      _assemblyConstituencyNumberAndName,
      _issuingAuthoritySignature,
      _hologramAndBarcode,
    } = updateVoter;

    if (
      !_name ||
      !_voterAddress ||
      !_photograph ||
      !_parentOrSpouseName ||
      !_gender ||
      !_dobOrAge ||
      !_addressDetails ||
      !_epicNumber ||
      !_partNumberAndName ||
      !_assemblyConstituencyNumberAndName ||
      !_issuingAuthoritySignature ||
      !_hologramAndBarcode ||
      !image ||
      !pdf
    )
      return notifyError("Data Is Missing");
    notifySuccess("Registering Voter, kindly wait...");
    setLoader(true);

    const CONTRACT = await VOTING_CONTRACT();

    const data = JSON.stringify({
      _name,
      _voterAddress,
      _photograph,
      _parentOrSpouseName,
      _gender,
      _dobOrAge,
      _addressDetails,
      _epicNumber,
      _partNumberAndName,
      _assemblyConstituencyNumberAndName,
      _issuingAuthoritySignature,
      _hologramAndBarcode,
      image,
      pdf,
    });

    try {
      const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: `12334e89c69a413613e0`,
          pinata_secret_api_key: `02779bdb49f3443d4501cf68c761b966fddbbe41f44a0905f674b8b558acb873`,
          "Content-Type": "application/json",
        },
      });
    