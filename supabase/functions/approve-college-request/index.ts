import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApprovalRequest {
  requestId: string;
}

const generatePassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { requestId }: ApprovalRequest = await req.json();
    
    console.log("Approving request:", requestId);

    // Create admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get request details
    const { data: request, error: requestError } = await supabaseAdmin
      .from("college_connection_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (requestError) throw requestError;
    if (!request) throw new Error("Request not found");

    // Generate credentials
    const generatedPassword = generatePassword();
    const userEmail = request.email;

    console.log("Creating user:", userEmail);

    // Create Supabase auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userEmail,
      password: generatedPassword,
      email_confirm: true,
      user_metadata: {
        full_name: request.name,
      }
    });

    if (authError) throw authError;

    console.log("User created:", authData.user.id);

    // Create college entry
    const { data: collegeData, error: collegeError } = await supabaseAdmin
      .from("colleges")
      .insert({
        name: request.college_name,
        location: request.location,
        contact_email: request.email,
      })
      .select()
      .single();

    if (collegeError) throw collegeError;

    console.log("College created:", collegeData.id);

    // Update user profile with college_id
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ college_id: collegeData.id })
      .eq("id", authData.user.id);

    if (profileError) throw profileError;

    console.log("Profile updated");

    // Send credentials via SMTP
    const { error: emailError } = await supabaseAdmin.functions.invoke("send-credentials", {
      body: {
        to: userEmail,
        name: request.name,
        collegeName: request.college_name,
        email: userEmail,
        password: generatedPassword,
      },
    });

    if (emailError) {
      console.error("Email error:", emailError);
    }

    console.log("Email sent");

    // Update request status
    const { error: updateError } = await supabaseAdmin
      .from("college_connection_requests")
      .update({ status: "approved" })
      .eq("id", requestId);

    if (updateError) throw updateError;

    console.log("Request approved");

    return new Response(
      JSON.stringify({ 
        success: true, 
        credentials: {
          email: userEmail,
          password: generatedPassword
        }
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error approving request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
