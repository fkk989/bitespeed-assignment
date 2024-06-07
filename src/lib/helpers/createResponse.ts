import { Contact } from "@prisma/client";
import { prismaClient } from "../db";

interface ResObjProp {
  primaryContatctId?: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}

interface CreateResponseProp extends Contact {
  primaryTableId: number;
}

export async function createResponse({
  primaryTableId,
}: Partial<CreateResponseProp>) {
  //
  //res obj
  const resObj: Partial<ResObjProp> = {
    primaryContatctId: 0,
    emails: [],
    phoneNumbers: [],
    secondaryContactIds: [],
  };

  const contacts = await prismaClient.contact.findMany({
    where: {
      OR: [
        { id: primaryTableId },
        {
          linkedId: primaryTableId,
        },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  contacts.forEach(({ id, linkPrecedence, email, phoneNumber }) => {
    // for primatry table
    if (linkPrecedence === "PRIMARY") {
      resObj.primaryContatctId = id;
      email && resObj.emails?.push(email!);
      phoneNumber && resObj.phoneNumbers?.push(phoneNumber!);
    } else {
      // for secondary table
      resObj.secondaryContactIds?.push(id);
      // not pushing same email
      if (!resObj.emails?.includes(email!) && email) {
        resObj.emails?.push(email!);
      }
      // not pushing same number
      if (!resObj.phoneNumbers?.includes(phoneNumber!) && phoneNumber) {
        resObj.phoneNumbers?.push(phoneNumber!);
      }
    }
  });

  return resObj;
}
