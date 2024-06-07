import { Contact } from "@prisma/client";
import { prismaClient } from "../db";

interface createContactProp extends Contact {
  isNumberPresent: boolean;
  isEmailPresent: boolean;
}

export async function createContact({
  email,
  phoneNumber,
  linkPrecedence,
  linkedId,
  isNumberPresent = true,
  isEmailPresent = true,
}: Partial<createContactProp>) {
  // if email
  console.log("create response ran");
  if (!isEmailPresent) {
    await prismaClient.contact.update({
      where: { id: linkedId! },
      data: {
        email: email,
      },
    });
    return { id: linkedId };
  }

  if (!isNumberPresent) {
    await prismaClient.contact.update({
      where: { id: linkedId! },
      data: {
        phoneNumber: phoneNumber,
      },
    });
    return { id: linkedId };
  }

  const contactTable = await prismaClient.contact.create({
    data: { email, phoneNumber, linkPrecedence: linkPrecedence!, linkedId },
  });

  return { id: contactTable.id };
}
