import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '@/shared/ui/container';
import {
  SmileyDisplay,
  SmileyControlsPanel,
  SmileyRandomizerSection,
} from '@/widgets/smiley-generator';

export const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Smiley Generator</title>
      </Helmet>

      <Container className="py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Smiley Generator
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Create and customize your perfect smiley face! Use the controls
            below or hit randomize for a surprise.
          </p>

          <div className="max-w-4xl mx-auto">
            {/* Main smiley display */}
            <div className="mb-8">
              <SmileyDisplay size={250} />
            </div>

            {/* Controls section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SmileyControlsPanel />
              <SmileyRandomizerSection />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};
