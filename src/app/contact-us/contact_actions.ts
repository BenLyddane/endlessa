'use server';
import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';

export async function sendContactMessage(formData: FormData) {
  const supabase = createClient();
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  try {
    // Check if the user is authenticated
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      return {
        success: false,
        message: 'User not authenticated.',
      };
    }

    // Store the message in the database
    const { error: insertError } = await supabase.from('contact_messages').insert({
      email,
      message,
    });
    if (insertError) {
      throw new Error('Failed to store the contact message.');
    }

    // Send the email
    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_KEY);
    await resend.emails.send({
      from: 'info@endlessa.com',
      to: ['BenL1291@gmail.com'],
      subject: 'New Contact Message',
      html: `<p>From: ${email}</p><p>${message}</p>`,
    });

    return {
      success: true,
      message: 'Your message has been sent successfully!',
    };
  } catch (error) {
    console.error('Error in sendContactMessage:', error);
    return {
      success: false,
      message: 'An error occurred while processing your request.',
    };
  }
}