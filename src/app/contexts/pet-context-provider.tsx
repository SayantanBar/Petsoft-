"use client";
import { Pet } from "@/lib/types";
import { createContext, useState } from "react";
type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};
type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  handleChangeSelectedPetId: (id: string) => void;
  selectedPet: Pet | undefined;
  lengthOfPets: number;
  handleCheckoutPets: (id: string) => void;
  handleNewPet: (newPet: Omit<Pet, "id">) => void;
};
export const PetContext = createContext<TPetContext | null>(null);

const PetContextProvider = ({ data, children }: PetContextProviderProps) => {
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const lengthOfPets = pets.length;

  //event handler
  const handleCheckoutPets = (id: string) => {
    setPets((prev) => prev.filter((pet) => pet.id != id));
    setSelectedPetId(null);
  };

  const handleNewPet = (newPet: Omit<Pet, "id">) => {
    setPets((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        ...newPet,
      },
    ]);
  };

  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };
  return (
    <PetContext.Provider
      value={{
        pets,
        handleCheckoutPets,
        selectedPetId,
        handleChangeSelectedPetId,
        selectedPet,
        handleNewPet,
        lengthOfPets,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export default PetContextProvider;
