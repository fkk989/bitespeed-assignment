import { Contact } from "@prisma/client";
import { prismaClient } from "../db";

// updating the table which is recently created and all the tables linked to it
async function updateManyContact({
  primaryTableId,
  secondaryTable,
}: {
  primaryTableId: number;
  secondaryTable: Contact;
}) {
  await prismaClient.contact.updateMany({
    where: {
      OR: [{ id: secondaryTable.id! }, { linkedId: secondaryTable.id }],
    },
    data: {
      linkedId: primaryTableId,
      linkPrecedence: "SECONDARY",
    },
  });
}

// function to compare the creation time of email and phone table and update it
async function compareAndUpdate({
  contactWithEmail,
  contactWithPhone,
}: {
  contactWithEmail: Contact;
  contactWithPhone: Contact;
}) {
  if (contactWithEmail.createdAt < contactWithPhone.createdAt) {
    await updateManyContact({
      secondaryTable: contactWithPhone,
      primaryTableId: contactWithEmail.id,
    });
    // returning primary table
    return contactWithEmail;
  } else {
    await updateManyContact({
      secondaryTable: contactWithEmail,
      primaryTableId: contactWithPhone.id,
    });
    // returning primary table
    return contactWithPhone;
  }
}

export async function updateContact({
  contactWithEmail,
  contactWithPhone,
}: {
  contactWithEmail: Contact;
  contactWithPhone: Contact;
}) {
  // if both the contact  are primary change

  if (
    contactWithEmail?.linkPrecedence === "PRIMARY" &&
    contactWithPhone?.linkPrecedence === "PRIMARY" &&
    contactWithEmail?.id !== contactWithPhone.id
  ) {
    return compareAndUpdate({ contactWithEmail, contactWithPhone });
  }

  //   // if both the contact table  are secondary find the primary compare and update
  if (
    contactWithEmail?.linkPrecedence === "SECONDARY" &&
    contactWithPhone?.linkPrecedence === "SECONDARY" &&
    contactWithEmail?.linkedId !== contactWithPhone.linkedId
  ) {
    const primaryEmailTable = await prismaClient.contact.findUnique({
      where: { id: contactWithEmail.linkedId! },
    });
    const primaryPhoneTable = await prismaClient.contact.findUnique({
      where: { id: contactWithPhone.linkedId! },
    });

    return compareAndUpdate({
      contactWithEmail: primaryEmailTable!,
      contactWithPhone: primaryPhoneTable!,
    });
  }

  // if email  is primary find the phone primary table than compare and update
  if (
    contactWithEmail.linkPrecedence === "PRIMARY" &&
    contactWithPhone.linkPrecedence === "SECONDARY" &&
    contactWithEmail.id !== contactWithPhone.linkedId
  ) {
    const primaryPhoneTable = await prismaClient.contact.findUnique({
      where: {
        id: contactWithPhone.linkedId!,
      },
    });

    return compareAndUpdate({
      contactWithEmail: contactWithEmail,
      contactWithPhone: primaryPhoneTable!,
    });
  }

  // if phone contact table is primary find email primary table compare and update
  if (
    contactWithEmail.linkPrecedence === "SECONDARY" &&
    contactWithPhone.linkPrecedence === "PRIMARY" &&
    contactWithPhone.id !== contactWithEmail.linkedId
  ) {
    const primaryEmailTable = await prismaClient.contact.findUnique({
      where: {
        id: contactWithEmail.linkedId!,
      },
    });

    return compareAndUpdate({
      contactWithEmail: primaryEmailTable!,
      contactWithPhone: contactWithPhone!,
    });
  }
}
