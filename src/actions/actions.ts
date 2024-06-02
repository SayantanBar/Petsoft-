"use server";
import prisma from "@/lib/db";
import { PetFormSchema, petIdSchema } from "@/lib/validation";
import { auth, signIn, signOut } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

//-------------- user action -------------//

export async function logIn(formData: FormData) {
  const authData = Object.fromEntries(formData.entries());
  await signIn("credentials", authData);
}

export async function signUp(formData: FormData) {
  const hashedPassword = await bcrypt.hash(
    formData.get("password") as string,
    10,
  );
  await prisma.user.create({
    data: {
      email: formData.get("email") as string,
      hashedPassword,
    },
  });

  await signIn("credentials", formData);
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

//-------------- pet action --------------//
export async function addPet(pet: unknown) {
  //authentication
  const session = await auth();
  if (!session?.user) {
    return redirect("/login");
  }

  const validatedPet = PetFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return { message: "Invalid pet data!" };
  }
  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
    revalidatePath("/app", "layout");
  } catch (error) {
    return { message: "could not add pet" };
  }
}

export async function editPet(petId: unknown, newPetData: unknown) {
  //authentication
  const session = await auth();
  if (!session?.user) {
    return redirect("/login");
  }

  //validation
  const validatedPetid = petIdSchema.safeParse(petId);
  const validatedPet = PetFormSchema.safeParse(newPetData);

  if (!validatedPetid.success || !validatedPet.success) {
    return { message: "Invalid pet " };
  }

  //authorization
  const pet = await prisma.pet.findUnique({
    where: {
      id: validatedPetid.data,
    },
  });
  if (!pet) {
    return { message: "Pet is not found" };
  }
  if (pet.userId !== session.user.id) {
    return { message: "Not authorized!" };
  }

  //data mutation
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
  //authentication check
  const session = await auth();
  if (!session?.user) {
    return redirect("/login");
  }

  const validatedPetid = petIdSchema.safeParse(petId);
  if (!validatedPetid.success) {
    return { message: "Invalid pet data!" };
  }

  // authorization
  const pet = await prisma.pet.findUnique({
    where: {
      id: validatedPetid.data,
    },
  });
  if (!pet) {
    return { message: "Pet is not found" };
  }
  if (pet.userId !== session.user.id) {
    return { message: "Not authorized!" };
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
