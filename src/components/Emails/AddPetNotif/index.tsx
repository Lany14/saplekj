import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

interface AddPetNotifProps {
  ownerFirstName: string;
  ownerLastName: string;
}

export const AddPetNotif: React.FC<AddPetNotifProps> = ({ ownerFirstName }) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Text style={heading}>Added a new pet to your profile</Text>
        <Text style={paragraph}>Dear {ownerFirstName},</Text>
        <Text style={paragraph}>A new pet has been added to your profile.</Text>
        {/* <Text style={paragraph}>
          Email: {email}
          <br />
          Password: {password}
        </Text> */}
        <Text style={paragraph}>
          Please log in and change your password as soon as possible.
        </Text>
        <Button style={button} href="https://yourdomain.com/login">
          Log In
        </Button>
        <Text style={paragraph}>
          If you have any questions, please don&apos;t hesitate to contact us.
        </Text>
        <Text style={paragraph}>Best regards,</Text>
        <Text style={paragraph}>The Clinic Management Team</Text>
      </Container>
    </Body>
  </Html>
);

// Define your styles here
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
};

const button = {
  backgroundColor: "#5469d4",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "200px",
  padding: "14px 7px",
};

export default AddPetNotif;
