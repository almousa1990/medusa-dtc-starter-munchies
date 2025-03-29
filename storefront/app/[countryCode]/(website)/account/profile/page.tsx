import {getCustomer} from "@/data/medusa/customer";
import {listRegions} from "@/data/medusa/regions";
import {Separator} from "@merchify/ui";
import {Metadata} from "next";
import {z} from "zod";
import ProfileForm from "./_parts/profile-form";
import {notFound} from "next/navigation";

const profileFormSchema = z.object({
  first_name: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  last_name: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  email: z.string().max(160).min(4),
  phone: z.string().max(160).min(4),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your Medusa Store profile.",
};

export default async function ProfilePage() {
  const customer = await getCustomer();
  const regions = await listRegions();
  if (!customer) {
    notFound();
  }
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">الملف الشخصي</h3>
        <p className="text-sm text-muted-foreground">
          تحديث معلومات حسابك الأساسية
        </p>
      </div>
      <Separator />
      <ProfileForm customer={customer} regions={regions} />
    </div>
  );
}
