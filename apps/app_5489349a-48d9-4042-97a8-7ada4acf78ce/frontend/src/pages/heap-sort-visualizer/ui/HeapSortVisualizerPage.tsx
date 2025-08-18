import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrayInputSection } from '@/widgets/array-input-section';
import { ControlPanelSection } from '@/widgets/control-panel-section';
import { ArrayDisplay } from '@/entities/visualization';

export const HeapSortVisualizerPage = React.memo(() => {
  return (
    <>
      <Helmet>
        <title>Heap Sort Visualizer</title>
      </Helmet>

      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Heap Sort Visualizer</h1>
            <p className="text-muted-foreground mt-2">
              Visualize and understand the heap sort algorithm step by step
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Array Input</h2>
                <ArrayInputSection />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Controls</h2>
                <ControlPanelSection />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border">
                <ArrayDisplay />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
