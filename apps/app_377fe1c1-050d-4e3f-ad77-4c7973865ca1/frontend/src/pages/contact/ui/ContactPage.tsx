import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ContactUsFormWidget } from '@/widgets/contact-us-form';

export const ContactPage = React.memo(() => {
  return (
    <>
      <Helmet>
        <title>Contact Us | Contact Us App</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Get in Touch</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
        
        <ContactUsFormWidget />
      </div>
    </>
  );
});