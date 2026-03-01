import { useState } from "react";
import { Save } from "lucide-react";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { Input, Select } from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";

export function AdminSettingsPage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      weeklyReport: true,
    },
    system: {
      autoAssign: true,
      aiDetection: true,
      publicReports: true,
    },
  });

  const handleSave = async () => {
    setSaving(true);
    // TODO: Connect to backend API endpoint when available
    // Example: await updateSettings(settings);
    setTimeout(() => {
      setSaving(false);
      alert("Settings saved successfully!");
    }, 500);
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 26, letterSpacing: 0.2 }}>Settings</h2>
        <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>
          Manage system settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader
          title="Account Settings"
          subtitle="Manage your admin account information"
        />
        <CardBody>
          <div className="grid grid-2" style={{ gap: 16 }}>
            <Field label="Name">
              <Input type="text" value={user?.name || ""} disabled />
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                Name cannot be changed from this interface
              </div>
            </Field>
            <Field label="Email">
              <Input type="email" value={user?.email || ""} disabled />
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                Email cannot be changed from this interface
              </div>
            </Field>
            <Field label="Role">
              <Input type="text" value={user?.role === "admin" ? "Administrator" : "User"} disabled />
            </Field>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Notification Preferences"
          subtitle="Configure how you receive notifications"
        />
        <CardBody>
          <div className="grid" style={{ gap: 16 }}>
            <div className="row-between">
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Email Notifications</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  Receive notifications via email
                </div>
              </div>
              <Select
                value={settings.notifications.email ? "enabled" : "disabled"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      email: e.target.value === "enabled",
                    },
                  })
                }
                style={{ width: 120 }}
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </Select>
            </div>

            <div className="row-between">
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Push Notifications</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  Receive browser push notifications
                </div>
              </div>
              <Select
                value={settings.notifications.push ? "enabled" : "disabled"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      push: e.target.value === "enabled",
                    },
                  })
                }
                style={{ width: 120 }}
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </Select>
            </div>

            <div className="row-between">
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Weekly Reports</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  Receive weekly summary reports
                </div>
              </div>
              <Select
                value={settings.notifications.weeklyReport ? "enabled" : "disabled"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      weeklyReport: e.target.value === "enabled",
                    },
                  })
                }
                style={{ width: 120 }}
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="System Settings"
          subtitle="Configure system-wide behavior"
        />
        <CardBody>
          <div className="grid" style={{ gap: 16 }}>
            <div className="row-between">
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Auto-Assign Departments</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  Automatically assign issues to departments based on category
                </div>
              </div>
              <Select
                value={settings.system.autoAssign ? "enabled" : "disabled"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    system: {
                      ...settings.system,
                      autoAssign: e.target.value === "enabled",
                    },
                  })
                }
                style={{ width: 120 }}
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </Select>
            </div>

            <div className="row-between">
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>AI Image Detection</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  Use AI to detect AI-generated images
                </div>
              </div>
              <Select
                value={settings.system.aiDetection ? "enabled" : "disabled"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    system: {
                      ...settings.system,
                      aiDetection: e.target.value === "enabled",
                    },
                  })
                }
                style={{ width: 120 }}
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </Select>
            </div>

            <div className="row-between">
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Public Reports</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  Allow public viewing of reported issues
                </div>
              </div>
              <Select
                value={settings.system.publicReports ? "enabled" : "disabled"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    system: {
                      ...settings.system,
                      publicReports: e.target.value === "enabled",
                    },
                  })
                }
                style={{ width: 120 }}
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="System Information"
          subtitle="Database and system status"
        />
        <CardBody>
          <div className="grid grid-2" style={{ gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Database</div>
              <div style={{ fontWeight: 600 }}>MongoDB Atlas</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>AI Service</div>
              <div style={{ fontWeight: 600 }}>Local FastAPI</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Status</div>
              <div style={{ fontWeight: 600, color: "var(--success)" }}>Operational</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Version</div>
              <div style={{ fontWeight: 600 }}>1.0.0</div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="row-between">
        <div style={{ fontSize: 13, color: "var(--muted)" }}>
          Changes will be saved to the backend when API endpoints are available
        </div>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          <Save size={16} />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
