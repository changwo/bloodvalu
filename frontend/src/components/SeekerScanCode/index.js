import React, {useEffect, useRef, useState} from "react";
import {BaseMenuContainer, PageContainer} from "../../style/GlobalWrappers";
import QrReader from 'react-qr-scanner'
import styled from "styled-components";
import {useDispatch} from "react-redux";
import {validateQRCode} from "../../store/actions/QRActions";
import {MiddleButton} from "../DonorDashboard";
import {rem} from "polished";
import {Fade} from "react-reveal";
import ButtonSpinner from "../ButtonSpinner";

const SuccessText = styled.h1`
  font-size: ${rem("25px")};
  font-weight: lighter;
`
const ErrorText = styled.h1`
  color: #b33e3e;
  font-size: 40px;
`
const SubmitQRBtn = styled.input`
  background-color: #7c1515;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
`
const Button = styled(MiddleButton)`
  width: 50%;
`;

const MenuContainer = styled(BaseMenuContainer)`
`
const Wrapper = styled.div`
  background-color: white;
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: black;
  padding: ${rem("15px")};
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
`

const ContentWrapper = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const FadeWrapper = styled.div`
  display: flex;
    width: 600px;
  flex-direction: column;
  align-items: flex-start;
`
const SpinnerText = styled.p`
  color: #d33449;;
`
const SpinnerDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Content = styled.div`
    ${(props) => (props.active ? "" : "display:none")}
`

const PageContainer2 = styled(PageContainer)`
  flex-flow: column;
  justify-content: flex-start;
  padding-top: 50px;
`

const SeekerScanCode = (props) => {
    const [active, setActive] = useState("request")
    const dispatch = useDispatch()
    const [data, setData] = useState({
        delay: 100,
        scan: null,
    });
    const [QRCode, setQRCode] = useState(null)
    const [QRresponse, setQRResponse] = useState({
        isGood: null,
        message: null
    })

    useEffect(() => {
        if (QRCode) handleSubmitQR()
    }, [QRCode]);


    const handleTabs = e => {
        const activeTab = e.currentTarget.id
        setActive(activeTab)
        setData({delay: 100, scan: null})
        setQRCode(null)
        setQRResponse({isGood: null, message: null})
    }


    const handleScan = (scannedInfo) => {
        if (data.scan) setQRCode(data.scan)
        setData({...data, scan: scannedInfo})
    }
    const handleError = err => {
    }
    const previewStyle = {
        height: 240,
        width: 320,
    }
    const refs = useRef()

    const handleSubmitQR = async () => {
        if (QRCode) {
            const data = {code: QRCode}
            const response = await dispatch(validateQRCode(data, active))
            if (response.status < 300) setQRResponse({...QRresponse, message: response.data, isGood: true})
            else setQRResponse({...QRresponse, message: "INVALID CODE", isGood: false})
        }
    }


    return (
        <PageContainer2>
            <ContentWrapper>
                <MenuContainer>
                    <Button id="request" onClick={handleTabs} active={active === "request"}>
                        Scan Blood Request QR Code
                    </Button>
                    <Button id="tests" onClick={handleTabs} active={active === "tests"}>
                        Scan Test QR Code
                    </Button>
                </MenuContainer>

                <QrReader
                    ref={refs}
                    delay={data.delay}
                    style={previewStyle}
                    onError={handleError}
                    onScan={handleScan}
                />

                {QRresponse.message ? QRresponse.isGood ?
                    <Fade right>
                        <FadeWrapper>
                            <Wrapper>
                                <SuccessText>Name:</SuccessText>
                                <SuccessText>{QRresponse.message.donor}</SuccessText>
                            </Wrapper>
                            <Wrapper>
                                <SuccessText>Birthday:</SuccessText>
                                <SuccessText>{QRresponse.message.birthday}</SuccessText>
                            </Wrapper>
                            <Wrapper>
                                <SuccessText>Blood Type:</SuccessText>
                                <SuccessText>{QRresponse.message.blood_type}</SuccessText></Wrapper>
                            <Wrapper>
                                <SuccessText>Institution:</SuccessText>
                                <SuccessText>{QRresponse.message.institution}</SuccessText>
                            </Wrapper>
                            <Wrapper>
                                <SuccessText>Type of Appointment:</SuccessText>
                                <SuccessText>{QRresponse.message.type}</SuccessText>
                            </Wrapper>
                        </FadeWrapper>
                    </Fade>
                    :
                    <ErrorText>{QRresponse.message}</ErrorText> : null}


                {QRCode ? null :
                    <SpinnerDiv>
                        <SpinnerText>Scanning, please hold still...</SpinnerText>
                        <ButtonSpinner/>
                    </SpinnerDiv>
                }</ContentWrapper>

        </PageContainer2>
    )
}

export default SeekerScanCode