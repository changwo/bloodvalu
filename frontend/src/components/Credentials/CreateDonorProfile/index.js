import React, {useState} from "react";
import styled from "styled-components";
import rem from "polished/lib/helpers/rem";
import {MiddleTitle, SmallTitle} from "../../../style/GlobalTitles";
import {BigInput, Select, SmallInput} from "../../../style/GlobalInputs";
import {DarkBlueButton, WhiteButton} from "../../../style/GlobalButtons";
import {PageContainer} from "../../../style/GlobalWrappers";
import {connect, useDispatch} from "react-redux";
import {useHistory} from "react-router";
import {updateProfileAction} from "../../../store/actions/userActions";
import CountrySelect from "../../CountrySelect";

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 350px;
  width: fit-content;
  height: 100%;
   justify-content: space-evenly;
`;

const InputPairContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: ${rem("352px")};
`;

const TitleContainer = styled(InputPairContainer)`
  justify-content: flex-start;
  // margin-top: ${rem("48px")};
`;

const MiddleTitle500 = styled(MiddleTitle)`
  font-weight: 500;
`;

const ButtonContainer = styled(InputPairContainer)`
  justify-content: flex-start;
  align-items: center;
  margin: 0;
  //background-color: rosybrown;
`;

const InputTitle = styled(SmallTitle)`
  margin-bottom: ${rem("8px")};
  font-weight: 500;
`;

const FullWidthInputContainer = styled.div`
  width: 100%;
`;

const AddressInput = styled(BigInput)`
  width: 95%;
`;
// const HouseNumberInput = styled(BigInput)`
//   width: ${rem("64px")};
// `;

const ImgInput = styled.input`
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
`;

const ChooseFileButton = styled.label`
  background: #121232;
  border-radius: 4px;
  border: 1px solid #121232;
  outline: none;
  width: 96%;
  height: ${rem("32px")};
  cursor: pointer;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  letter-spacing: 0.5px;
  color: #ffffff;
  display: flex;
  align-items: center;
  align-self: flex-start;
  justify-content: center;
`;

const InputDiv = styled.div`
  display: flex;
  width: 50%;
  flex-direction: column;
`

const WhiteButtonWithMargin = styled(WhiteButton)`
  margin-right: ${rem("16px")};
`;

const CreateDonorProfile = (props) => {
    const {push} = useHistory();
    const dispatch = useDispatch();
    const [donorInfo, setDonorInfo] = useState({
        first_name: "",
        last_name: "",
        zip_code: "",
        phone: "",
        country: "",
        street: "",
        avatar: null,
        birthday: "",
        blood_group: "",
        gender: "",
    });



    const onChangeHandler = (event, property) => {
        const value = event.currentTarget.value;
        setDonorInfo({...donorInfo, [property]: value});

    };

    const avatarSelectHandler = (e) => {
        if (e.target.files[0]) {
            setDonorInfo({...donorInfo, avatar: e.target.files[0]});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append("first_name", donorInfo.first_name);
        form.append("last_name", donorInfo.last_name);
        form.append("zip_code", donorInfo.zip_code);
        form.append("street", donorInfo.street);
        form.append("country", donorInfo.country);
        form.append("birthday", donorInfo.birthday);
        form.append("gender", donorInfo.gender);
        form.append("blood_group", donorInfo.blood_group);
        form.append("phone", donorInfo.phone);
        if (donorInfo.avatar) {
            form.append("avatar", donorInfo.avatar);
        }
        const response = await dispatch(updateProfileAction(form));
        if (response.status < 300) {
            push(`/dashboard/donor`);
        }

    };

    return (
        <PageContainer>
            <FormWrapper name={"form"} onSubmit={handleSubmit}>
                <TitleContainer>
                    <MiddleTitle500>Create an Account</MiddleTitle500>
                </TitleContainer>

                <InputPairContainer>
                    <InputDiv>
                        <InputTitle>First Name</InputTitle>
                        <SmallInput
                            type="text"
                            placeholder="Sherlock"
                            onChange={(e) => onChangeHandler(e, "first_name")}
                            required
                        />
                    </InputDiv>

                    <InputDiv>
                        <InputTitle>Last Name</InputTitle>
                        <SmallInput
                            type="text"
                            placeholder="Holmes"
                            onChange={(e) => onChangeHandler(e, "last_name")}
                            required
                        />
                    </InputDiv>
                </InputPairContainer>

                <InputPairContainer>
                    <InputDiv>
                        <InputTitle>Gender</InputTitle>
                        <Select onChange={(e) => onChangeHandler(e, "gender")} required>
                            <option value="M">male</option>
                            <option value="F">female</option>
                            <option value="O">other</option>
                        </Select>
                    </InputDiv>

                    <InputDiv>
                        <InputTitle>Birthday</InputTitle>
                        <SmallInput
                            type="date"
                            onChange={(e) => onChangeHandler(e, "birthday")}
                            max="2002-07-22"
                            required
                        />
                    </InputDiv>
                </InputPairContainer>

                <InputPairContainer>
                    <InputDiv>
                        <InputTitle>Blood Group</InputTitle>
                        <Select onChange={(e) => onChangeHandler(e, "blood_group")} required>
                            <option value="O-">O-</option>
                            <option value="O+">O+</option>
                            <option value="A-">A-</option>
                            <option value="A+">A+</option>
                            <option value="B-">B-</option>
                            <option value="B+">B+</option>
                            <option value="AB-">AB-</option>
                            <option value="AB+">AB+</option>
                        </Select>
                    </InputDiv>

                    <InputDiv>
                        <InputTitle>Phone Number</InputTitle>
                        <SmallInput
                            type="text"
                            placeholder="044 123 45 67"
                            onChange={(e) => onChangeHandler(e, "phone")}
                            required
                        />
                    </InputDiv>
                </InputPairContainer>

                <InputPairContainer>
                    <FullWidthInputContainer>
                        <InputTitle>Address</InputTitle>
                        <AddressInput
                            type="text"
                            placeholder="Baker Street 7"
                            onChange={(e) => onChangeHandler(e, "street")}
                            required
                        />
                    </FullWidthInputContainer>
                </InputPairContainer>

                <InputPairContainer>
                    <InputDiv>
                        <InputTitle>Zip code</InputTitle>
                        <SmallInput
                            type="text"
                            placeholder="NW1 London"
                            onChange={(e) => onChangeHandler(e, "zip_code")}
                            required
                        />
                    </InputDiv>

                    <InputDiv>
                        <InputTitle>Country</InputTitle>
                        <CountrySelect
                            handleChange={(e) => onChangeHandler(e, "country")}
                            required/>
                    </InputDiv>
                </InputPairContainer>
                <ImgInput
                    onChange={avatarSelectHandler}
                    type="file"
                    name="file"
                    id="file"
                    className="inputfile"
                />
                <ChooseFileButton className="file_btn" htmlFor="file">
                    {donorInfo.avatar ? "FILE UPLOADED" : "CHOOSE YOUR PROFILE PICTURE"}
                </ChooseFileButton>

                <ButtonContainer>
                    <WhiteButtonWithMargin>Back</WhiteButtonWithMargin>
                    <DarkBlueButton>Register</DarkBlueButton>
                </ButtonContainer>
            </FormWrapper>
        </PageContainer>
    );
};

const mapStateToProps = (state) => {
    return {
        registrationReducer: state.registrationReducer,
        errorReducer: state.errorReducer,
        authReducer: state.authReducer,
    };
};

export default connect(mapStateToProps)(CreateDonorProfile);
