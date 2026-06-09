import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({ meta: [{ title: "Your account — NovaCart" }] }),
  component: AccountPage,
});

type Profile = {
  display_name: string | null;
  shipping_name: string | null;
  shipping_line1: string | null;
  shipping_line2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
};

function AccountPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({
    display_name: "",
    shipping_name: "",
    shipping_line1: "",
    shipping_line2: "",
    shipping_city: "",
    shipping_state: "",
    shipping_postal_code: "",
    shipping_country: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, shipping_name, shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProfile((p) => ({ ...p, ...data }));
        setLoading(false);
      });
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update(profile).eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
  }

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
            <UserIcon className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold">Your account</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-8 rounded-2xl border bg-card p-6 shadow-card sm:p-8">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Profile</h2>
          <div className="space-y-2">
            <Label htmlFor="display_name">Display name</Label>
            <Input
              id="display_name"
              value={profile.display_name ?? ""}
              onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
              disabled={loading}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Shipping address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" value={profile.shipping_name} onChange={(v) => setProfile({ ...profile, shipping_name: v })} />
            <Field label="Country" value={profile.shipping_country} onChange={(v) => setProfile({ ...profile, shipping_country: v })} />
            <Field className="sm:col-span-2" label="Address line 1" value={profile.shipping_line1} onChange={(v) => setProfile({ ...profile, shipping_line1: v })} />
            <Field className="sm:col-span-2" label="Address line 2" value={profile.shipping_line2} onChange={(v) => setProfile({ ...profile, shipping_line2: v })} />
            <Field label="City" value={profile.shipping_city} onChange={(v) => setProfile({ ...profile, shipping_city: v })} />
            <Field label="State / Region" value={profile.shipping_state} onChange={(v) => setProfile({ ...profile, shipping_state: v })} />
            <Field label="Postal code" value={profile.shipping_postal_code} onChange={(v) => setProfile({ ...profile, shipping_postal_code: v })} />
          </div>
        </section>

        <Button type="submit" disabled={saving || loading} className="bg-gradient-primary text-primary-foreground shadow-elegant">
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string | null;
  onChange: (v: string) => void;
  className?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
