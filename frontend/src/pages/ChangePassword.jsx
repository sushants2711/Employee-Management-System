import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, LockKeyhole, ShieldCheck } from "lucide-react";
import AuthCard from "../components/AuthCard";
import SubmitButton from "../components/SubmitButton";
import InputField from "../components/InputField";
import { changePassword } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { showSuccess, showError } from "../toastMessage/toastDeliver";
import {
  validateChangePasswordField,
  validateChangePasswordForm,
} from "../validators/userAuthValidators";

function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };

      const error = validateChangePasswordField(name, value, newFormData);
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));

      // Also validate confirm password if new password changes
      if (name === "newPassword" && newFormData.confirmPassword) {
        const confirmError = validateChangePasswordField(
          "confirmPassword",
          newFormData.confirmPassword,
          newFormData
        );
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: confirmError,
        }));
      }

      return newFormData;
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (
      !formData.oldPassword &&
      !formData.newPassword &&
      !formData.confirmPassword
    ) {
      showSuccess("No changes detected");
      return;
    }

    const { isValid, errors: formErrors } =
      validateChangePasswordForm(formData);

    if (!isValid) {
      setErrors(formErrors);
      showError("Please fix the errors in the form before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      showSuccess(response.message || "Password updated successfully!");

      // Update context and localStorage so they are no longer trapped
      updateUser({
        isChangedPasswordCount: (user?.isChangedPasswordCount || 0) + 1,
      });

      // Clear form
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Redirect to home
      navigate("/home");
    } catch (error) {
      showError(error.message || "Failed to update password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      icon={ShieldCheck}
      title="Change Password"
      subtitle="Securely update your account password."
    >
      <form onSubmit={handleChangePassword} className="space-y-5">
        <InputField
          label="Old Password"
          icon={Lock}
          type="password"
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleInputChange}
          disabled={isSubmitting}
          error={errors.oldPassword}
          placeholder="••••••••"
        />

        <InputField
          label="New Password"
          icon={LockKeyhole}
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleInputChange}
          disabled={isSubmitting}
          error={errors.newPassword}
          placeholder="••••••••"
        />

        <InputField
          label="Confirm New Password"
          icon={LockKeyhole}
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          disabled={isSubmitting}
          error={errors.confirmPassword}
          placeholder="••••••••"
        />

        <SubmitButton isSubmitting={isSubmitting}>Update Password</SubmitButton>
      </form>
    </AuthCard>
  );
}

export default ChangePassword;
