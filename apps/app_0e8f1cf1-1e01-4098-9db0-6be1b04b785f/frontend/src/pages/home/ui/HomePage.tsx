import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SmileyFace } from '@/entities/smiley';
import { Container } from '@/shared/ui/container';

export const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Smiley Generator</title>
      </Helmet>
      
      <Container className="py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Smiley Generator</h1>
          
          <div className="flex flex-col items-center space-y-8">
            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <SmileyFace
                mouth="happy"
                eyes="normal"
                color="#FFD700"
                size={200}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <SmileyFace mouth="happy" eyes="normal" color="#FFD700" size={120} />
                <p className="mt-2 text-sm text-gray-600">Happy</p>
              </div>
              
              <div className="text-center">
                <SmileyFace mouth="sad" eyes="normal" color="#87CEEB" size={120} />
                <p className="mt-2 text-sm text-gray-600">Sad</p>
              </div>
              
              <div className="text-center">
                <SmileyFace mouth="wink" eyes="wink" color="#FF69B4" size={120} />
                <p className="mt-2 text-sm text-gray-600">Wink</p>
              </div>
              
              <div className="text-center">
                <SmileyFace mouth="big_smile" eyes="big" color="#98FB98" size={120} />
                <p className="mt-2 text-sm text-gray-600">Big Smile</p>
              </div>
              
              <div className="text-center">
                <SmileyFace mouth="neutral" eyes="closed" color="#DDA0DD" size={120} />
                <p className="mt-2 text-sm text-gray-600">Sleepy</p>
              </div>
              
              <div className="text-center">
                <SmileyFace mouth="happy" eyes="dots" color="#F0E68C" size={120} />
                <p className="mt-2 text-sm text-gray-600">Cute</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};