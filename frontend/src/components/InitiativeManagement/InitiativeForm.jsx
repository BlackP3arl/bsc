import { useState, useEffect } from 'react';

// Map perspective names to code prefixes
const PERSPECTIVE_CODE_PREFIX = {
  'Financial': 'F',
  'Customer': 'C',
  'Internal Process': 'I',
  'Organization': 'O',
};

export const InitiativeForm = ({ initiative, perspectives, initiatives, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    perspective_id: '',
    target_kpi: '',
    estimated_effort: '',
    priority: 'medium',
    display_order: 0,
  });
  const [errors, setErrors] = useState({});

  // Generate next code based on perspective
  const generateNextCode = (perspectiveId) => {
    if (!perspectiveId || !perspectives.length || !initiatives) return '';

    const perspective = perspectives.find((p) => p.id === perspectiveId);
    if (!perspective) return '';

    const prefix = PERSPECTIVE_CODE_PREFIX[perspective.name];
    if (!prefix) return '';

    // Find all initiatives with the same perspective
    const perspectiveInitiatives = initiatives.filter(
      (init) => init.perspective_id === perspectiveId
    );

    // Extract numbers from existing codes (e.g., F1 -> 1, C10 -> 10)
    const existingNumbers = perspectiveInitiatives
      .map((init) => {
        const match = init.code.match(new RegExp(`^${prefix}(\\d+)$`));
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((num) => num > 0);

    // Find the next available number
    const nextNumber = existingNumbers.length > 0 
      ? Math.max(...existingNumbers) + 1 
      : 1;

    return `${prefix}${nextNumber}`;
  };

  useEffect(() => {
    if (initiative) {
      // Editing mode - use existing values
      setFormData({
        code: initiative.code || '',
        name: initiative.name || '',
        description: initiative.description || '',
        perspective_id: initiative.perspective_id || '',
        target_kpi: initiative.target_kpi || '',
        estimated_effort: initiative.estimated_effort || '',
        priority: initiative.priority || 'medium',
        display_order: initiative.display_order || 0,
      });
    } else {
      // Adding mode - reset form
      setFormData({
        code: '',
        name: '',
        description: '',
        perspective_id: '',
        target_kpi: '',
        estimated_effort: '',
        priority: 'medium',
        display_order: 0,
      });
    }
  }, [initiative]);

  // Auto-generate code when perspective changes (only when adding)
  useEffect(() => {
    if (!initiative && formData.perspective_id && perspectives.length > 0 && initiatives) {
      const newCode = generateNextCode(formData.perspective_id);
      if (newCode) {
        setFormData((prev) => ({ ...prev, code: newCode }));
      }
    }
  }, [formData.perspective_id, initiative, perspectives, initiatives]);

  const validate = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    } else if (formData.code.length > 10) {
      newErrors.code = 'Code must be 10 characters or less';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 255) {
      newErrors.name = 'Name must be 255 characters or less';
    }

    if (!formData.perspective_id) {
      newErrors.perspective_id = 'Perspective is required';
    }

    if (formData.target_kpi && formData.target_kpi.length > 100) {
      newErrors.target_kpi = 'Target KPI must be 100 characters or less';
    }

    if (formData.estimated_effort && formData.estimated_effort.length > 50) {
      newErrors.estimated_effort = 'Estimated effort must be 50 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {initiative ? 'Edit Initiative' : 'Add New Initiative'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Perspective - First field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Perspective <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.perspective_id}
            onChange={(e) => handleChange('perspective_id', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.perspective_id ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={!!initiative} // Disable when editing
          >
            <option value="">Select a perspective</option>
            {perspectives.map((perspective) => (
              <option key={perspective.id} value={perspective.id}>
                {perspective.name}
              </option>
            ))}
          </select>
          {errors.perspective_id && (
            <p className="mt-1 text-sm text-red-600">{errors.perspective_id}</p>
          )}
          {!initiative && (
            <p className="mt-1 text-xs text-gray-500">
              Select a perspective to automatically generate the code
            </p>
          )}
        </div>

        {/* Code - Auto-generated when adding, editable when editing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => handleChange('code', e.target.value)}
            readOnly={!initiative} // Read-only when adding
            className={`w-full px-3 py-2 border rounded-md ${
              errors.code ? 'border-red-500' : 'border-gray-300'
            } ${
              !initiative ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder={initiative ? 'e.g., F1, C2, I3' : 'Auto-generated'}
            maxLength={10}
          />
          {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
          {!initiative && formData.code && (
            <p className="mt-1 text-xs text-gray-500">
              Code automatically generated based on selected perspective
            </p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Initiative name"
            maxLength={255}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={4}
            placeholder="Initiative description"
          />
        </div>

        {/* Target KPI */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target KPI
          </label>
          <input
            type="text"
            value={formData.target_kpi}
            onChange={(e) => handleChange('target_kpi', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.target_kpi ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Target KPI"
            maxLength={100}
          />
          {errors.target_kpi && (
            <p className="mt-1 text-sm text-red-600">{errors.target_kpi}</p>
          )}
        </div>

        {/* Estimated Effort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Effort
          </label>
          <input
            type="text"
            value={formData.estimated_effort}
            onChange={(e) => handleChange('estimated_effort', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.estimated_effort ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 2 weeks, 40 hours"
            maxLength={50}
          />
          {errors.estimated_effort && (
            <p className="mt-1 text-sm text-red-600">{errors.estimated_effort}</p>
          )}
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Display Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Order
          </label>
          <input
            type="number"
            value={formData.display_order}
            onChange={(e) => handleChange('display_order', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            min="0"
          />
          <p className="mt-1 text-xs text-gray-500">
            Lower numbers appear first in the list
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            {initiative ? 'Update' : 'Create'} Initiative
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

