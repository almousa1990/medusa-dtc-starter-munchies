import {getCustomer} from "@/data/medusa/customer";
import {listRegions} from "@/data/medusa/regions";
import {Separator} from "@merchify/ui";
import {Metadata} from "next";
import {z} from "zod";
import ProfileForm from "./_parts/profile-form";
import {notFound} from "next/navigation";
import Heading from "@/components/shared/typography/heading";

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
        <Heading tag="h3" mobileSize="lg">
          الملف الشخصي
        </Heading>
        <p className="text-muted-foreground text-sm">
          تحديث معلومات حسابك الأساسية
        </p>
      </div>
      <Separator />
      <ProfileForm customer={customer} regions={regions} />
    </div>
  );
}
