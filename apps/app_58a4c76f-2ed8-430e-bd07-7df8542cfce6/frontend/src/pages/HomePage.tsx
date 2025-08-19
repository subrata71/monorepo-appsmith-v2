import React from 'react';
import { Container, APP_CONFIG } from '@/shared';
import { HomeTitleWidget, HomeStartButtonWidget } from '@/widgets';

export const HomePage = React.memo(() => {
  return (
    <Container className="flex-1 flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <div className="max-w-2xl w-full space-y-12 text-center">
        {/* Game Title */}
        <div className="space-y-4">
          <HomeTitleWidget
            text={APP_CONFIG.APP_NAME}
            level="h1"
            align="center"
            fontWeight="bold"
            color="text-foreground"
          />
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Welcome to the ultimate tossing game experience. Test your skills
            and see how high you can score!
          </p>
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <HomeStartButtonWidget text="Start Game" size="lg" color="default" />
        </div>
      </div>
    </Container>
  );
});
