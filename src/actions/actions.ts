"use server";
import prisma from "@/lib/db";
import { PetEssentials } from "@/lib/types";
import { Pet } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function addPet(pet: PetEssentials) {
  try {
    await prisma.pet.create({
      data: pet,
    });
    revalidatePath("/app", "layout");
  } catch (error) {
    return { message: "could not add pet" };
  }
}

export async function editPet(petId: Pet["id"], newPetData: PetEssentials) {
  try {
    await prisma.pet.update({
      where: { id: petId },
      data: newPetData,
    });

    revalidatePath("/app", "layout");
  } catch (e) {
    return {
      message: "Can not edit the pet",
    };
  }
}

export async function deletePet(petId: Pet["id"]) {
  try {
    await prisma.pet.delete({ where: { id: petId } });

    revalidatePath("/app", "layout");
  } catch (error) {
    return {
      message: "can not checkout the pet",
    };
  }
}
