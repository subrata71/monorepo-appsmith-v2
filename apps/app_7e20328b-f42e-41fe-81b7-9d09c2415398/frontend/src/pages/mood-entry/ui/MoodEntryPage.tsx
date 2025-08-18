/**
 * MoodEntryPage
 *
 * Main page for mood entry functionality. Contains the complete mood entry form
 * with mood selection, note input, and submission capabilities.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { MoodEntryForm } from '@/widgets/mood-entry-form';
import { Button } from '@/shared/ui/button';
import { History } from 'lucide-react';

export const MoodEntryPage = () => {
  const handleSubmitSuccess = React.useCallback(() => {
    // Optional: Add any additional logic after successful submission
    // For now, the form will reset automatically and show toast feedback
    console.log('Mood entry submitted successfully');
  }, []);

  return (
    <>
      <Helmet>
        <title>✨ Track Your Mood | Wellness Journey 🌈</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex-1"></div>
              <Link to="/mood-history">
                <Button
                  variant="outline"
                  className="gap-2 rounded-xl border-2 border-primary/20 bg-background/80 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300"
                >
                  <History className="w-4 h-4" />
                  📊 View History
                </Button>
              </Link>
            </div>

            <div className="space-y-4 mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                🌈 Mood Tracker 🌈
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Welcome to your personal wellness space! ✨ Track your emotions,
                celebrate your feelings, and discover patterns in your daily
                mood journey.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>🔒 Completely private</span>
                <span>•</span>
                <span>💝 Just for you</span>
                <span>•</span>
                <span>🌟 Always encouraging</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-card to-muted/20 rounded-3xl shadow-2xl border-2 border-border/50 p-8 backdrop-blur-sm">
            <MoodEntryForm onSubmitSuccess={handleSubmitSuccess} />
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              💖 Remember: Every feeling is valid and every day is a new
              opportunity to shine! 💖
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
