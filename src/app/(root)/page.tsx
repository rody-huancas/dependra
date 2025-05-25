"use client"

import { useState } from "react";
/* Components */
import DiagramModal from "@/components/DiagramModal";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import RepositoryInput from "@/components/RepositoryInput";
/* Store */
import useStore from "@/store/useStore";

const HomePage = () => {
  const error             = useStore(state => state.error);
  const isLoading         = useStore(state => state.isLoading);
  const isOpenModal       = useStore(state => state.isOpenModal);
  const visualizationData = useStore(state => state.visualizationData);

  return (
    <div className="py-2">
      <RepositoryInput loadRepository={isLoading} />
              
      {error && <ErrorMessage message={error} />}
        
      {isLoading && <LoadingSpinner />}

      {!isLoading && visualizationData && isOpenModal && (
        <DiagramModal data={visualizationData} />
      )}
    </div>
  );
};

export default HomePage;
