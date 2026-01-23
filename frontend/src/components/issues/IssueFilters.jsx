import { Search } from "lucide-react";
import { CATEGORY, STATUS, URGENCY } from "../../domain/issues";
import { Field } from "../ui/Field";
import { Input, Select } from "../ui/Input";
import "./issueFilters.css";

export function IssueFilters({ value, onChange, showStatus = true }) {
  const set = (patch) => onChange({ ...value, ...patch });

  return (
    <div className="filters">
      <div className="filters-left">
        <div className="search">
          <Search size={16} />
          <Input
            placeholder="Search by id, description, or location…"
            value={value.q}
            onChange={(e) => set({ q: e.target.value })}
          />
        </div>
      </div>

      <div className="filters-right">
        <Field label="Urgency">
          <Select value={value.urgency} onChange={(e) => set({ urgency: e.target.value })}>
            <option value="">All</option>
            <option value={URGENCY.HIGH}>High</option>
            <option value={URGENCY.MEDIUM}>Medium</option>
            <option value={URGENCY.LOW}>Low</option>
          </Select>
        </Field>

        {showStatus ? (
          <Field label="Status">
            <Select value={value.status} onChange={(e) => set({ status: e.target.value })}>
              <option value="">All</option>
              <option value={STATUS.PENDING}>pending</option>
              <option value={STATUS.IN_PROGRESS}>in progress</option>
              <option value={STATUS.RESOLVED}>resolved</option>
            </Select>
          </Field>
        ) : null}

        <Field label="Category">
          <Select value={value.category} onChange={(e) => set({ category: e.target.value })}>
            <option value="">All</option>
            <option value={CATEGORY.GARBAGE}>garbage</option>
            <option value={CATEGORY.POTHOLE}>pothole</option>
            <option value={CATEGORY.STREETLIGHT}>street light</option>
          </Select>
        </Field>
      </div>
    </div>
  );
}

