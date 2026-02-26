import ContentBlockEditor from "@/components/admin/ContentBlockEditor";

export const metadata = { title: "Auth Pages Editor — Nemaya Admin" };

export default function AuthPagesEditorPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Auth Pages Editor</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Edit the bilingual text content and option lists for all authentication pages.
        </p>
      </div>

      {/* Core auth flows */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Login &amp; Registration
        </h2>
        <div className="space-y-3">
          <ContentBlockEditor
            blockKey="auth.loginText"
            title="Login Page Text"
            description="Heading, subheading, field labels, button text, and links on the Login page (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="auth.registerText"
            title="Register Page Text"
            description="Heading, subheading, field labels, button text, and links on the Register page (EN/AR)."
          />
        </div>
      </section>

      {/* Password flows */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Password Reset
        </h2>
        <div className="space-y-3">
          <ContentBlockEditor
            blockKey="auth.forgotPasswordText"
            title="Forgot Password Page Text"
            description="All UI copy for the Forgot Password page (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="auth.resetPasswordText"
            title="Reset Password Page Text"
            description="All UI copy for the Reset Password page (EN/AR)."
          />
        </div>
      </section>

      {/* Verification flows */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Verification Pages
        </h2>
        <div className="space-y-3">
          <ContentBlockEditor
            blockKey="auth.verifyEmailText"
            title="Verify Email Page Text"
            description="All UI copy for the email verification page (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="auth.verifyNumberText"
            title="Verify Phone Number Page Text"
            description="All UI copy for the phone number verification page (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="auth.verifyCodeText"
            title="Verify Code Page Text"
            description="All UI copy for the OTP / verification code page (EN/AR)."
          />
        </div>
      </section>

      {/* Select options */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Form Select Options
        </h2>
        <div className="space-y-3">
          <ContentBlockEditor
            blockKey="auth.ageOptions"
            title="Age Range Options"
            description="Array of age-range options displayed in the registration form (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="auth.countryOptions"
            title="Country Options"
            description="Array of country options (name and dial code) used in the registration form (EN/AR)."
          />
          <ContentBlockEditor
            blockKey="auth.callTimeOptions"
            title="Preferred Call Time Options"
            description="Array of call-time slot options shown during registration (EN/AR)."
          />
        </div>
      </section>
    </div>
  );
}
