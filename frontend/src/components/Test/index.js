import React from "react";
import styled from "styled-components";
import {
    ChooseRoleButton, CompleteButton,
    DarkBlueButton, SmallGreenButton, WhiteButton
} from "../../style/GlobalButtons";
import {BigInput, SmallInput} from "../../style/GlobalInputs";
import {BigTitle, MiddleTitle, SmallTitle} from "../../style/GlobalTitles";
import {PageContainer} from "../../style/GlobalWrappers";
import GenericDonorTestCard from "../GenericDonorTestCard";
import GenericSeekerTestCard from "../GenericSeekerTestCard";
import DonorProfileCardWide from "../GenericDonorProfileWide";
import DonorProfileSelected from "../GenericDonorSelected";
import GenericSeekerRequestBar from "../GenericSeekerRequestBar";
import AreYouSureModal from "../AreYouSure";
import SeekerProfileCard from "../GenericSeekerProfileCard";
import ButtonSpinner from "../ButtonSpinner";

const TestWrapper = styled(PageContainer)`
    height: 100%;
    display: flex;
`


function Template(props) {
  return (
      <div>
          <br></br>
          <ButtonSpinner/>
          <CompleteButton>Complete</CompleteButton>
          <SeekerProfileCard/>
          <SmallTitle>RedTitle</SmallTitle>
          <BigTitle>First Page Title</BigTitle>
          <CompleteButton>Complete request</CompleteButton>
          <SmallGreenButton>Redeem</SmallGreenButton>
          <WhiteButton>Back</WhiteButton>
        <br></br>
       <DarkBlueButton>Confirm</DarkBlueButton>
          <p>.</p>
          <BigInput type="text" placeholder="Street"/>
          <SmallInput type="text" placeholder="Country"/>
          <br></br>
          <ChooseRoleButton>Becoming a donor</ChooseRoleButton>
          <MiddleTitle>Your registration is now complete!</MiddleTitle>
      </div>

  );
}

export default Template;
