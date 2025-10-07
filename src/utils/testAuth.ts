// Test utility for debugging authentication issues
import { supabase } from '@/integrations/supabase/client';

// Test profile creation
export const testProfileCreation = async (userId: string, email: string) => {
  console.log('Testing profile creation...');
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        email: email,
        full_name: 'Test User',
        role: 'Staff'
      })
      .select()
      .single();
    
    console.log('Profile creation result:', { data, error });
    return { data, error };
  } catch (error) {
    console.error('Profile creation error:', error);
    return { data: null, error };
  }
};

// Test email verification specifically
export const testEmailVerification = async () => {
  console.log('📧 Testing email verification flow...');
  
  const testEmail = `test-verification-${Date.now()}@example.com`;
  const testPassword = 'password123';
  
  try {
    // Step 1: Test signup
    console.log('1️⃣ Testing signup with email verification...');
    const signupResult = await testSignup(testEmail, testPassword);
    
    if (signupResult.error) {
      console.error('❌ Signup failed:', signupResult.error);
      return { success: false, step: 'signup', error: signupResult.error };
    }
    
    console.log('✅ Signup successful:', signupResult.data);
    
    // Check if user was created and email confirmation is required
    if (signupResult.data?.user) {
      const user = signupResult.data.user;
      console.log('📋 User details:', {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        created_at: user.created_at
      });
      
      if (user.email_confirmed_at) {
        console.log('⚠️ User is already confirmed (unexpected with email verification enabled)');
      } else {
        console.log('✅ User email is not confirmed (expected behavior)');
        console.log('📧 Confirmation email should have been sent to:', user.email);
      }
      
      // Step 2: Test that signin fails without confirmation
      console.log('2️⃣ Testing signin without email confirmation...');
      const signinResult = await testSignin(testEmail, testPassword);
      
      if (signinResult.error) {
        console.log('✅ Signin failed as expected (email not confirmed):', signinResult.error.message);
      } else {
        console.log('⚠️ Signin succeeded unexpectedly (email should not be confirmed yet)');
      }
      
      // Step 3: Test resend confirmation
      console.log('3️⃣ Testing resend confirmation email...');
      try {
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email: testEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        
        if (resendError) {
          console.error('❌ Resend confirmation failed:', resendError);
        } else {
          console.log('✅ Resend confirmation successful');
        }
      } catch (error) {
        console.error('❌ Resend confirmation error:', error);
      }
    }
    
    console.log('🎉 Email verification test completed!');
    console.log('📧 Check your email inbox for confirmation emails');
    return { success: true, signup: signupResult };
    
  } catch (error) {
    console.error('❌ Email verification test failed:', error);
    return { success: false, error };
  }
};

// Test the complete authentication flow
export const testCompleteAuthFlow = async () => {
  console.log('🧪 Testing complete authentication flow...');
  
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'password123';
  
  try {
    // Step 1: Test signup
    console.log('1️⃣ Testing signup...');
    const signupResult = await testSignup(testEmail, testPassword);
    
    if (signupResult.error) {
      console.error('❌ Signup failed:', signupResult.error);
      return { success: false, step: 'signup', error: signupResult.error };
    }
    
    console.log('✅ Signup successful:', signupResult.data);
    
    // Step 2: Test profile creation
    if (signupResult.data?.user) {
      console.log('2️⃣ Testing profile creation...');
      const profileResult = await testProfileCreation(
        signupResult.data.user.id, 
        testEmail
      );
      
      if (profileResult.error) {
        console.warn('⚠️ Profile creation failed (this might be expected):', profileResult.error);
      } else {
        console.log('✅ Profile creation successful:', profileResult.data);
      }
    }
    
    // Step 3: Test signin (this should fail if email not confirmed)
    console.log('3️⃣ Testing signin (should fail if email not confirmed)...');
    const signinResult = await testSignin(testEmail, testPassword);
    
    if (signinResult.error) {
      console.log('⚠️ Signin failed as expected (email not confirmed):', signinResult.error.message);
    } else {
      console.log('✅ Signin successful:', signinResult.data);
    }
    
    console.log('🎉 Complete auth flow test completed!');
    return { success: true, signup: signupResult, signin: signinResult };
    
  } catch (error) {
    console.error('❌ Auth flow test failed:', error);
    return { success: false, error };
  }
};

export const testSignup = async (email: string, password: string) => {
  console.log('Testing signup with:', { email, passwordLength: password.length });
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: 'Test User',
          role: 'Staff'
        }
      }
    });
    
    console.log('Test signup result:', {
      user: data?.user ? {
        id: data.user.id,
        email: data.user.email,
        email_confirmed_at: data.user.email_confirmed_at,
        created_at: data.user.created_at
      } : null,
      session: data?.session ? 'Session created' : 'No session',
      error: error ? {
        message: error.message,
        status: error.status,
        name: error.name
      } : null
    });
    
    return { data, error };
  } catch (error) {
    console.error('Test signup error:', error);
    return { data: null, error };
  }
};

export const testSignin = async (email: string, password: string) => {
  console.log('Testing signin with:', { email, passwordLength: password.length });
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    console.log('Test signin result:', {
      user: data?.user ? {
        id: data.user.id,
        email: data.user.email,
        email_confirmed_at: data.user.email_confirmed_at
      } : null,
      session: data?.session ? 'Session created' : 'No session',
      error: error ? {
        message: error.message,
        status: error.status,
        name: error.name
      } : null
    });
    
    return { data, error };
  } catch (error) {
    console.error('Test signin error:', error);
    return { data: null, error };
  }
};

// Add to window for debugging
if (typeof window !== 'undefined') {
  (window as any).testAuth = { 
    testSignup, 
    testSignin,
    testCompleteAuthFlow,
    testEmailVerification,
    testProfileCreation
  };
}
