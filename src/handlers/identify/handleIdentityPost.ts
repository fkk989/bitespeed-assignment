import { prismaClient } from "@/lib/db";
import { createContact, createResponse, validateInput } from "@/lib/helpers";
import { updateContact } from "@/lib/helpers/updateContact";
import { Request, Response } from "express";

export async function handleIdentityPost(req: Request, res: Response) {
  try {
    const isValidated = validateInput(req, res);
    //    if not validated just return
    if (!isValidated) return;

    const { email, phoneNumber } = isValidated;

    // fetching prismaClient
    const contactsWithEmail = await prismaClient.contact.findMany({
      where: { OR: [{ email }] },
      orderBy: { createdAt: "asc" },
    });

    const contactsWithPhone = await prismaClient.contact.findMany({
      where: { phoneNumber },
      orderBy: { createdAt: "asc" },
    });

    // initializing a primary table id to use it while creating response
    let primaryTableId;

    // setting primaryTableId
    if (email) {
      contactsWithEmail[0]?.linkPrecedence === "PRIMARY"
        ? (primaryTableId = contactsWithEmail[0]?.id)
        : (primaryTableId = contactsWithEmail[0]?.linkedId);
    }

    if (phoneNumber) {
      contactsWithPhone[0]?.linkPrecedence === "PRIMARY"
        ? (primaryTableId = contactsWithPhone[0]?.id)
        : (primaryTableId = contactsWithPhone[0]?.linkedId);
    }

    // if there is no record
    if (contactsWithEmail?.length === 0 && contactsWithPhone?.length === 0) {
      const { id } = await createContact({
        email: email,
        phoneNumber: phoneNumber,
        linkPrecedence: "PRIMARY",
      });

      primaryTableId = id!;
    }

    // contact with email but not phone
    if (
      phoneNumber &&
      contactsWithEmail?.length !== 0 &&
      contactsWithPhone?.length === 0
    ) {
      // if the primary table does not have number so we will just update the number
      const isNumberPresent = contactsWithEmail[0].phoneNumber ? true : false;

      //   if table is secondary than we will the link the new table to the linkedId of this table
      //   if table is primary than we will the link the new table to the id of this table
      const isSecondary =
        contactsWithEmail[0]?.linkPrecedence === "PRIMARY" ? false : true;

      primaryTableId = isSecondary
        ? contactsWithEmail[0].linkedId!
        : contactsWithEmail[0].id;

      await createContact({
        linkedId: !isSecondary
          ? contactsWithEmail[0].id
          : contactsWithEmail[0].linkedId,

        email: contactsWithEmail[0].email,
        phoneNumber: phoneNumber,
        linkPrecedence: "SECONDARY",
        isNumberPresent,
      });
    }

    // contact with phone but not email
    if (
      email &&
      contactsWithPhone?.length !== 0 &&
      contactsWithEmail?.length === 0
    ) {
      // if the primary table does not have email so we will just update the email
      const isEmailPresent = contactsWithPhone[0].email ? true : false;

      //   if table is secondary than we will the link the new table to the linkedId of this table
      //   if table is primary than we will the link the new table to the id of this table
      const isSecondary =
        contactsWithPhone[0]?.linkPrecedence === "PRIMARY" ? false : true;
      primaryTableId = isSecondary
        ? contactsWithPhone[0].linkedId!
        : contactsWithPhone[0].id;

      await createContact({
        linkedId: !isSecondary
          ? contactsWithPhone[0].id
          : contactsWithPhone[0].linkedId,
        email: email,
        phoneNumber: contactsWithPhone[0].phoneNumber,
        linkPrecedence: "SECONDARY",
        isEmailPresent,
      });
    }

    // if both are present but point to different group of table

    if (contactsWithEmail.length !== 0 && contactsWithPhone.length !== 0) {
      let primaryTable = await updateContact({
        contactWithEmail: contactsWithEmail[0],
        contactWithPhone: contactsWithPhone[0],
      });
      if (primaryTable) {
        primaryTableId = primaryTable.id;
      }
    }

    const resObj = await createResponse({
      primaryTableId: primaryTableId!,
    });

    return res.status(200).json(resObj);
  } catch (e: any) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
}
