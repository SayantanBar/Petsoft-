"use server";
import prisma from "@/lib/db";
import { PetFormSchema, petIdSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function addPet(pet: unknown) {
  const validatedPet = PetFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return { message: "Invalid pet data!" };
  }
  try {
    await prisma.pet.create({
      data: validatedPet.data,
    });
    revalidatePath("/app", "layout");
  } catch (error) {
    return { message: "could not add pet" };
  }
}

export async function editPet(petId: unknown, newPetData: unknown) {
  const validatedPetid = petIdSchema.safeParse(petId);
  const validatedPet = PetFormSchema.safeParse(newPetData);

  //validation
  if (!validatedPetid.success || !validatedPet.success) {
    return { message: "Invalid pet " };
  }

  try {
    await prisma.pet.update({
      where: { id: validatedPetid.data },
      data: validatedPet.data,
    });

    revalidatePath("/app", "layout");
  } catch (e) {
    return {
      message: "Can not edit the pet",
    };
  }
}

export async function deletePet(petId: unknown) {
  const validatedPetid = petIdSchema.safeParse(petId);
  if (!validatedPetid.success) {
    return { message: "Invalid pet data!" };
  }
  try {
    await prisma.pet.delete({ where: { id: validatedPetid.data } });

    revalidatePath("/app", "layout");
  } catch (error) {
    return {
      message: "can not checkout the pet",
    };
  }
}
