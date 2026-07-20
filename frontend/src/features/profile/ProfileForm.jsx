import { Save } from "lucide-react";
import SelectField from "../../components/SelectField";
import SubmitButton from "../../components/SubmitButton";

function ProfileForm({
  formData,
  handleInputChange,
  handleSubmit,
  isSubmitting,
  departments,
  designations,
  teams,
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-5">
        <SelectField
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleInputChange}
          placeholder="Select Department"
          options={departments.map((dept) => ({
            label: dept.departmentName,
            value: dept._id,
          }))}
        />

        <SelectField
          label="Designation"
          name="designation"
          value={formData.designation}
          onChange={handleInputChange}
          placeholder="Select Designation"
          options={designations.map((desig) => ({
            label: desig.designationName,
            value: desig._id,
          }))}
        />

        <SelectField
          label="Team"
          name="teamName"
          value={formData.teamName}
          onChange={handleInputChange}
          placeholder="Select Team"
          options={[
            { value: "", label: "Select Team" },
            ...teams.map((team) => ({
              label: team.teamName,
              value: team._id,
            })),
          ]}
        />
      </div>

      <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-700/50">
        <SubmitButton isSubmitting={isSubmitting}>
          <div className="flex items-center justify-center gap-2">
            <Save size={20} />
            <span>Save Changes</span>
          </div>
        </SubmitButton>
      </div>
    </form>
  );
}

export default ProfileForm;
